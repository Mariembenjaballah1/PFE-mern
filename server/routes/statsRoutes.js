
const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');
const Project = require('../models/Project');
const Maintenance = require('../models/Maintenance');

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const assetsCount = await Asset.countDocuments();
    
    // Count ALL projects regardless of status - with detailed logging
    console.log('=== PROJECT COUNT DEBUG ===');
    const allProjects = await Project.find({});
    console.log('All projects found:', allProjects.length);
    console.log('Project details:', allProjects.map(p => ({
      id: p._id,
      name: p.name,
      status: p.status
    })));
    
    const projectsCount = await Project.countDocuments();
    console.log('Project count from countDocuments():', projectsCount);
    console.log('=== END PROJECT COUNT DEBUG ===');
    
    // Count only pending maintenance (scheduled + in-progress)
    const pendingMaintenanceCount = await Maintenance.countDocuments({ 
      status: { $in: ['scheduled', 'in-progress'] } 
    });
    
    // Count issues (corrective maintenance that is not completed)
    const issuesCount = await Maintenance.countDocuments({ 
      type: 'corrective',
      status: { $ne: 'completed' }
    });
    
    console.log('Dashboard stats counts:', { 
      assetsCount, 
      projectsCount, 
      pendingMaintenanceCount, 
      issuesCount 
    });
    
    const stats = {
      assets: {
        count: assetsCount,
        percentage: 12.5,
        isIncrease: true,
        detail: "vs last month"
      },
      projects: {
        count: projectsCount,
        percentage: 15.2,
        isIncrease: true,
        detail: "vs last month"
      },
      maintenance: {
        count: pendingMaintenanceCount,
        percentage: 8.3,
        isIncrease: false,
        detail: "vs last month"
      },
      issues: {
        count: issuesCount,
        percentage: 25.0,
        isIncrease: false,
        detail: "vs last month"
      }
    };
    
    console.log('Sending dashboard stats:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
});

// Get stats trends
router.get('/trends', async (req, res) => {
  try {
    const assetsCount = await Asset.countDocuments();
    
    // Count ALL projects regardless of status - with detailed logging
    console.log('=== TRENDS PROJECT COUNT DEBUG ===');
    const allProjects = await Project.find({});
    console.log('All projects found:', allProjects.length);
    console.log('Project details:', allProjects.map(p => ({
      id: p._id,
      name: p.name,
      status: p.status
    })));
    
    const projectsCount = await Project.countDocuments();
    console.log('Project count from countDocuments():', projectsCount);
    console.log('=== END TRENDS PROJECT COUNT DEBUG ===');
    
    // Count only pending maintenance (scheduled + in-progress)
    const pendingMaintenanceCount = await Maintenance.countDocuments({ 
      status: { $in: ['scheduled', 'in-progress'] } 
    });
    
    // Count issues (corrective maintenance that is not completed)
    const issuesCount = await Maintenance.countDocuments({ 
      type: 'corrective',
      status: { $ne: 'completed' }
    });
    
    console.log('Trends stats counts:', { 
      assetsCount, 
      projectsCount, 
      pendingMaintenanceCount, 
      issuesCount 
    });
    
    const stats = {
      assets: {
        count: assetsCount,
        percentage: 12.5,
        isIncrease: true,
        detail: "vs last month"
      },
      projects: {
        count: projectsCount,
        percentage: 15.2,
        isIncrease: true,
        detail: "vs last month"
      },
      maintenance: {
        count: pendingMaintenanceCount,
        percentage: 8.3,
        isIncrease: false,
        detail: "vs last month"
      },
      issues: {
        count: issuesCount,
        percentage: 25.0,
        isIncrease: false,
        detail: "vs last month"
      }
    };
    
    console.log('Sending trends stats:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats trends:', error);
    res.status(500).json({ message: 'Error fetching stats trends', error: error.message });
  }
});

module.exports = router;
