const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

router.post('/', sensorController.postSensorData);
router.get('/latest', sensorController.getLatestSensorData);
router.get('/history', sensorController.getSensorHistory);

module.exports = router;