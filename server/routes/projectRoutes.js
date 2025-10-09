
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Asset = require('../models/Asset');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get a specific project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get assets associated with a project
router.get('/:id/assets', async (req, res) => {
  try {
    console.log('Fetching assets for project ID:', req.params.id);
    
    // Check if this is a mock project ID (format like P001, P002, etc.)
    const isMockProject = /^P\d+$/.test(req.params.id);
    
    if (isMockProject) {
      console.log('Mock project detected, returning empty array for project:', req.params.id);
      // For mock projects, return empty array since they can't have real asset assignments
      res.json([]);
      return;
    }
    
    // For real projects, find assets by MongoDB ObjectId or project name
    const project = await Project.findById(req.params.id);
    if (!project) {
      console.log('Project not found:', req.params.id);
      res.json([]);
      return;
    }
    
    const assets = await Asset.find({
      $or: [
        { project: req.params.id },
        { projectName: project.name }
      ]
    });
    
    console.log('Found assets for project:', assets.length, assets.map(a => ({ 
      id: a._id, 
      name: a.name, 
      resources: a.resources 
    })));
    
    res.json(assets);
  } catch (err) {
    console.error('Error fetching project assets:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new project
router.post('/', async (req, res) => {
  console.log('Creating new project with data:', req.body);
  
  try {
    const project = new Project({
      name: req.body.name,
      description: req.body.description || '',
      status: req.body.status || 'active',
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      manager: req.body.manager,
      department: req.body.department || '',
      priority: req.body.priority || 'medium',
      tags: req.body.tags || []
    });

    const newProject = await project.save();
    console.log('Project created successfully:', newProject);
    res.status(201).json(newProject);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a project
router.patch('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Update fields if they exist in request
    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== '__v') {
        project[key] = req.body[key];
      }
    });
    
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Remove project from all associated assets
    await Asset.updateMany(
      { project: project._id },
      { $set: { project: null, projectName: null } }
    );
    
    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
