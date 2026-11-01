const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  soilMoisture: {
    type: Number,
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  pumpStatus: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SensorData', sensorDataSchema);