const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema({
  moistureThreshold: {
    type: Number,
    default: 30, // ৩০% এর নিচে নামলে পাম্প অন হবে
  },
  manualPumpControl: {
    type: Boolean,
    default: false,
  },
  isAutoMode: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('SystemConfig', systemConfigSchema);