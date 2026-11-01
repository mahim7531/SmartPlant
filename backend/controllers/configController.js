const SystemConfig = require('../models/SystemConfig');

// সিস্টেম কনফিগারেশন গেট করা
exports.getConfig = async (req, res) => {
  try {
    let config = await SystemConfig.findOne();
    if (!config) {
      config = await SystemConfig.create({});
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ফ্রন্টএন্ড থেকে কনফিগারেশন আপডেট করা
exports.updateConfig = async (req, res) => {
  try {
    const { moistureThreshold, manualPumpControl, isAutoMode } = req.body;

    let config = await SystemConfig.findOne();
    if (!config) {
      config = new SystemConfig();
    }

    if (moistureThreshold !== undefined) config.moistureThreshold = moistureThreshold;
    if (manualPumpControl !== undefined) config.manualPumpControl = manualPumpControl;
    if (isAutoMode !== undefined) config.isAutoMode = isAutoMode;

    await config.save();
    res.json({ message: 'Settings updated successfully', config });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};