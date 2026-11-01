import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// লেটেস্ট সেন্সর রিডিং
export const getLatestSensorData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sensor-data/latest`);
    return response.data;
  } catch (error) {
    console.error('Error fetching latest sensor data:', error);
    return null;
  }
};

// হিস্টোরিকাল ডাটা (টেবিল ও চার্টের জন্য)
export const getSensorHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sensor-data/history`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sensor history:', error);
    return [];
  }
};

// সিস্টেম কনফিগারেশন গেট করা
export const getSystemConfig = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/config`);
    return response.data;
  } catch (error) {
    console.error('Error fetching system config:', error);
    return null;
  }
};

// সিস্টেম কনফিগারেশন আপডেট করা
export const updateSystemConfig = async (configData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/config/update`, configData);
    return response.data;
  } catch (error) {
    console.error('Error updating system config:', error);
    return null;
  }
};