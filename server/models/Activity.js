
const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  asset: {
    type: String,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Activity', ActivitySchema);
