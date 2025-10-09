
const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

// Get all activities
router.get('/', async (req, res) => {
  try {
    const { asset, startDate, endDate } = req.query;
    let query = {};
    
    if (asset) {
      query.asset = asset;
    }
    
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const activities = await Activity.find(query)
      .sort({ timestamp: -1 })
      .limit(50);
    
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
});

// Create new activity
router.post('/', async (req, res) => {
  try {
    const { user, action, asset } = req.body;
    
    const activity = new Activity({
      user,
      action,
      asset,
      timestamp: new Date()
    });
    
    const savedActivity = await activity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ message: 'Error creating activity', error: error.message });
  }
});

// Delete activity
router.delete('/:id', async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ message: 'Error deleting activity', error: error.message });
  }
});

module.exports = router;
