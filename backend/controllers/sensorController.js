const SensorData = require('../models/SensorData');
const SystemConfig = require('../models/SystemConfig');

// ESP32 থেকে ডাটা ডাটাবেজে সেভ করা
exports.postSensorData = async (req, res) => {
  try {
    const { soilMoisture, temperature, humidity, pumpStatus } = req.body;

    const newData = new SensorData({
      soilMoisture,
      temperature,
      humidity,
      pumpStatus,
    });

    await newData.save();

    let config = await SystemConfig.findOne();
    if (!config) {
      config = await SystemConfig.create({});
    }

    res.status(201).json({
      message: 'Data logged successfully',
      config: {
        moistureThreshold: config.moistureThreshold,
        manualPumpControl: config.manualPumpControl,
        isAutoMode: config.isAutoMode,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// সর্বশেষ সেন্সর রিডিং পাওয়া
exports.getLatestSensorData = async (req, res) => {
  try {
    const latestData = await SensorData.findOne().sort({ createdAt: -1 });
    res.json(latestData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// চার্টের জন্য হিস্টোরিকাল ডাটা পাওয়া
exports.getSensorHistory = async (req, res) => {
  try {
    const history = await SensorData.find().sort({ createdAt: -1 }).limit(20);
    res.json(history.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};