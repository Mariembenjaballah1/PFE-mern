
const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['operational', 'maintenance', 'repair', 'retired'],
    default: 'operational'
  },
  location: {
    type: String,
    required: true
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  },
  assignedTo: {
    type: String,
    default: 'Unassigned'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  projectName: {
    type: String,
    default: null
  },
  // Resource allocations
  resources: {
    cpu: {
      type: Number,
      default: 0
    },
    ram: {
      type: Number,
      default: 0
    },
    disk: {
      type: Number,
      default: 0
    }
  },
  // VM Information from CSV - commonly used fields
  vmInfo: {
    vm: String,                    // VM name
    dnsName: String,               // DNS Name
    powerstate: String,            // Powerstate
    datacenter: String,            // Datacenter
    host: String,                  // Host
    os: String,                    // OS
    ipAddress: String,             // IP Address
    migre: String,                 // Migré
    cpus: String,                  // CPUs
    memorySize: String,            // Memory Size
    provisionedMB: String,         // Provisioned MB
    prod: String,                  // Prod
    pca: String,                   // Pca
    infra: String,                 // Infra
    integration: String,           // Integration
    app: String,                   // App
    db: String,                    // DB
    antivirus: String,             // Antivirus
    folder: String,                // Folder
    projet: String                 // projet
  },
  // Enhanced server specifications for VM environments - using Mixed type to allow flexible storage
  specs: {
    type: mongoose.Schema.Types.Mixed,
    default: function() { 
      return {}; 
    }
  },
  // Comprehensive additional data storage for CSV fields - using Mixed type to allow flexible storage
  additionalData: {
    type: mongoose.Schema.Types.Mixed,
    default: function() { 
      return {}; 
    }
  }
}, {
  timestamps: true,
  minimize: false, // This is important! Prevents Mongoose from removing empty objects
  toJSON: { 
    transform: function(doc, ret) {
      // Ensure specs and additionalData are always objects, never undefined
      if (!ret.specs) ret.specs = {};
      if (!ret.additionalData) ret.additionalData = {};
      if (!ret.vmInfo) ret.vmInfo = {};
      return ret;
    }
  },
  toObject: { 
    transform: function(doc, ret) {
      // Ensure specs and additionalData are always objects, never undefined
      if (!ret.specs) ret.specs = {};
      if (!ret.additionalData) ret.additionalData = {};
      if (!ret.vmInfo) ret.vmInfo = {};
      return ret;
    }
  }
});

// Index for better query performance
AssetSchema.index({ category: 1, status: 1 });
AssetSchema.index({ project: 1 });
AssetSchema.index({ 'additionalData.datacenter': 1 });
AssetSchema.index({ 'additionalData.vm_host': 1 });
AssetSchema.index({ 'vmInfo.datacenter': 1 });
AssetSchema.index({ 'vmInfo.vm': 1 });

// Pre-save middleware to ensure specs and additionalData are always objects
AssetSchema.pre('save', function(next) {
  console.log('=== ASSET MODEL PRE-SAVE MIDDLEWARE ===');
  console.log('Asset name:', this.name);
  console.log('VMInfo before save:', this.vmInfo);
  console.log('Specs before save:', this.specs);
  console.log('AdditionalData before save:', this.additionalData);
  
  if (!this.vmInfo) {
    console.log('=== FIXING: vmInfo was null/undefined, setting to empty object ===');
    this.vmInfo = {};
  }
  if (!this.specs) {
    console.log('=== FIXING: specs was null/undefined, setting to empty object ===');
    this.specs = {};
  }
  if (!this.additionalData) {
    console.log('=== FIXING: additionalData was null/undefined, setting to empty object ===');
    this.additionalData = {};
  }
  
  console.log('=== FINAL STATE BEFORE SAVE ===');
  console.log('Final vmInfo:', this.vmInfo);
  console.log('Final specs:', this.specs);
  console.log('Final additionalData:', this.additionalData);
  
  next();
});

module.exports = mongoose.model('Asset', AssetSchema);
