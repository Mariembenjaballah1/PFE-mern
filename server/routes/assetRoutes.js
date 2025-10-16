const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');
const auth = require('../middleware/auth');

// Create a new asset
router.post('/', auth, async (req, res) => {
  try {
    console.log('=== ASSET CREATION API ENDPOINT ===');
    console.log('Received asset data:', JSON.stringify(req.body, null, 2));
    console.log('Request body vmInfo:', req.body.vmInfo);
    console.log('Request body specs:', req.body.specs);
    console.log('Request body additionalData:', req.body.additionalData);
    
    // Ensure vmInfo, specs and additionalData are always present as objects
    const assetData = {
      ...req.body,
      vmInfo: req.body.vmInfo || {},
      specs: req.body.specs || {},
      additionalData: req.body.additionalData || {}
    };
    
    console.log('=== ASSET DATA BEING SAVED ===');
    console.log('Final asset data vmInfo:', assetData.vmInfo);
    console.log('Final asset data specs:', assetData.specs);
    console.log('Final asset data additionalData:', assetData.additionalData);
    console.log('Final asset data vmInfo keys:', Object.keys(assetData.vmInfo));
    console.log('Final asset data specs keys:', Object.keys(assetData.specs));
    console.log('Final asset data additionalData keys:', Object.keys(assetData.additionalData));
    
    const asset = new Asset(assetData);
    
    console.log('=== BEFORE SAVE - ASSET INSTANCE ===');
    console.log('Asset instance vmInfo:', asset.vmInfo);
    console.log('Asset instance specs:', asset.specs);
    console.log('Asset instance additionalData:', asset.additionalData);
    
    const savedAsset = await asset.save();
    
    console.log('=== AFTER SAVE - SAVED ASSET ===');
    console.log('Saved asset vmInfo:', savedAsset.vmInfo);
    console.log('Saved asset specs:', savedAsset.specs);
    console.log('Saved asset additionalData:', savedAsset.additionalData);
    console.log('Full saved asset:', JSON.stringify(savedAsset, null, 2));
    
    res.status(201).json(savedAsset);
  } catch (error) {
    console.error('Error creating asset:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all assets
router.get('/', auth, async (req, res) => {
  try {
    const assets = await Asset.find().populate('project', 'name');
    res.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get asset by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id).populate('project', 'name');
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    console.log('=== FETCHING ASSET BY ID ===');
    console.log('Asset ID:', req.params.id);
    console.log('Asset specs:', asset.specs);
    console.log('Asset additionalData:', asset.additionalData);
    console.log('Asset specs keys:', asset.specs ? Object.keys(asset.specs) : 'UNDEFINED');
    console.log('Asset additionalData keys:', asset.additionalData ? Object.keys(asset.additionalData) : 'UNDEFINED');
    
    res.json(asset);
  } catch (error) {
    console.error('Error fetching asset:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update asset
router.put('/:id', auth, async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('project', 'name');
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    res.json(asset);
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete asset
router.delete('/:id', auth, async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete all assets in Servers category
router.delete('/category/servers', auth, async (req, res) => {
  try {
    const result = await Asset.deleteMany({ category: 'Servers' });
    res.json({ 
      message: `Successfully deleted ${result.deletedCount} server assets`,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error deleting server assets:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update all assets for a project when manager changes
router.put('/project/:projectId/manager-update', auth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { newManager, projectName } = req.body;
    
    console.log('=== UPDATING ASSETS FOR PROJECT MANAGER CHANGE ===');
    console.log('Project ID:', projectId);
    console.log('New Manager:', newManager);
    console.log('Project Name:', projectName);
    
    // Find all assets assigned to this project
    const assets = await Asset.find({ project: projectId }).populate('project', 'name');
    
    console.log('Found assets to update:', assets.length);
    
    // Update each asset - this will trigger any necessary recalculations
    const updatePromises = assets.map(async (asset) => {
      // The asset doesn't need to store the manager name directly
      // The manager info will be fetched from the project when needed
      asset.lastUpdate = new Date();
      return await asset.save();
    });
    
    const updatedAssets = await Promise.all(updatePromises);
    
    console.log('Updated assets count:', updatedAssets.length);
    
    // Emit an event to notify frontend components
    // In a real application, you might use WebSockets or Server-Sent Events
    
    res.json({
      message: `Updated ${updatedAssets.length} assets for project manager change`,
      updatedCount: updatedAssets.length,
      assets: updatedAssets
    });
  } catch (error) {
    console.error('Error updating assets for project manager change:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get assets by project ID
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const assets = await Asset.find({ project: projectId }).populate('project', 'name');
    res.json(assets);
  } catch (error) {
    console.error('Error fetching assets by project:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
