const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Maintenance = require('../models/Maintenance');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  console.log('=== MAINTENANCE ROUTE PROTECTION ===');
  console.log('Headers:', req.headers);
  console.log('Authorization header:', req.headers.authorization);

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Extracted token:', token ? token.substring(0, 20) + '...' : 'none');
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      console.log('Maintenance Routes - User authenticated:', req.user);
      next();
    } catch (error) {
      console.error('JWT verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('No token provided for maintenance route');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Get all maintenance tasks
router.get('/', protect, async (req, res) => {
  try {
    console.log('=== GET ALL MAINTENANCE TASKS ===');
    const tasks = await Maintenance.find()
      .populate('asset', 'name category status')
      .populate('assignedTo', 'name email');
    
    console.log(`Found ${tasks.length} maintenance tasks`);
    res.json(tasks);
  } catch (err) {
    console.error('Error in GET /maintenance:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get maintenance task by ID - FIXED VERSION
router.get('/:id', protect, async (req, res) => {
  try {
    console.log('=== GET MAINTENANCE TASK BY ID - FIXED VERSION ===');
    console.log('Raw request params:', req.params);
    console.log('Requested ID:', req.params.id);
    console.log('Request URL:', req.url);
    console.log('Request path:', req.path);
    console.log('User making request:', req.user?.name, req.user?.email);
    
    const requestedId = req.params.id;
    
    // Validate ObjectId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(requestedId)) {
      console.error('ERROR: Invalid ObjectId format:', requestedId);
      return res.status(400).json({ 
        message: 'Invalid task ID format',
        receivedId: requestedId
      });
    }
    
    console.log('Querying database for task ID:', requestedId);
    const task = await Maintenance.findById(requestedId)
      .populate('asset', 'name category status')
      .populate('assignedTo', 'name email');
    
    console.log('Database query completed. Result:', task ? 'Task found' : 'Task not found');
    
    if (!task) {
      console.log(`Maintenance task with ID ${requestedId} not found in database`);
      return res.status(404).json({ 
        message: 'Maintenance task not found',
        requestedId: requestedId
      });
    }
    
    console.log('Successfully returning maintenance task:', {
      id: task._id,
      description: task.description,
      status: task.status
    });
    
    res.json(task);
  } catch (err) {
    console.error('Error in GET /maintenance/:id:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      message: 'Internal server error while fetching maintenance task',
      error: err.message 
    });
  }
});

// Create new maintenance task
router.post('/', protect, async (req, res) => {
  try {
    console.log('CREATE MAINTENANCE - User attempting to create task:', {
      userId: req.user?._id,
      userName: req.user?.name,
      userRole: req.user?.role,
      userDepartment: req.user?.department
    });
    
    console.log('CREATE MAINTENANCE - Role check:', {
      isAdmin: req.user.role === 'ADMIN',
      isTechnician: req.user.role === 'TECHNICIAN',
      actualRole: req.user.role,
      roleType: typeof req.user.role
    });
    
    // Only admins and technicians can create tasks
    if (req.user.role !== 'ADMIN' && req.user.role !== 'TECHNICIAN') {
      console.log('CREATE MAINTENANCE - PERMISSION DENIED:', {
        userRole: req.user.role,
        expectedRoles: ['ADMIN', 'TECHNICIAN'],
        permissionCheck: 'FAILED'
      });
      return res.status(403).json({ message: 'Not authorized to create maintenance tasks' });
    }
    
    console.log('CREATE MAINTENANCE - Permission granted, creating task with data:', req.body);
    
    const task = new Maintenance({
      asset: req.body.asset,
      description: req.body.description,
      type: req.body.type,
      status: req.body.status,
      priority: req.body.priority,
      assignedTo: req.body.assignedTo,
      scheduledDate: req.body.scheduledDate,
      estimatedHours: req.body.estimatedHours,
      notes: req.body.notes
    });
    
    const newTask = await task.save();
    console.log('CREATE MAINTENANCE - Task created successfully:', newTask._id);
    
    const populatedTask = await Maintenance.findById(newTask._id)
      .populate('asset', 'name category status')
      .populate('assignedTo', 'name email');
    
    res.status(201).json(populatedTask);
  } catch (err) {
    console.error('CREATE MAINTENANCE - Error creating task:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update maintenance task
router.patch('/:id', protect, async (req, res) => {
  try {
    console.log('UPDATE MAINTENANCE - User attempting to update task:', {
      userId: req.user?._id,
      userName: req.user?.name,
      userRole: req.user?.role
    });
    
    // Only admins and technicians can update tasks
    if (req.user.role !== 'ADMIN' && req.user.role !== 'TECHNICIAN') {
      console.log('UPDATE MAINTENANCE - PERMISSION DENIED for role:', req.user.role);
      return res.status(403).json({ message: 'Not authorized to update maintenance tasks' });
    }
    
    const task = await Maintenance.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Maintenance task not found' });
    }
    
    // Update fields
    Object.keys(req.body).forEach(key => {
      task[key] = req.body[key];
    });
    
    const updatedTask = await task.save();
    
    const populatedTask = await Maintenance.findById(updatedTask._id)
      .populate('asset', 'name category status')
      .populate('assignedTo', 'name email');
    
    res.json(populatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete maintenance task
router.delete('/:id', protect, async (req, res) => {
  try {
    console.log('DELETE MAINTENANCE - User attempting to delete task:', {
      userId: req.user?._id,
      userName: req.user?.name,
      userRole: req.user?.role
    });
    
    // Only admins can delete tasks
    if (req.user.role !== 'ADMIN') {
      console.log('DELETE MAINTENANCE - PERMISSION DENIED for role:', req.user.role);
      return res.status(403).json({ message: 'Not authorized to delete maintenance tasks' });
    }
    
    const task = await Maintenance.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Maintenance task not found' });
    }
    
    await task.deleteOne();
    
    res.json({ message: 'Maintenance task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
