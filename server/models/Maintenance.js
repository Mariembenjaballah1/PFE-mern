
const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['preventive', 'corrective', 'predictive'],
    default: 'preventive'
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'overdue'],
    default: 'scheduled'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  estimatedHours: {
    type: Number,
    required: true
  },
  completedDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Maintenance', MaintenanceSchema);
