import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SensorCard from '../components/SensorCard';
import ControlPanel from '../components/ControlPanel';
import { getLatestSensorData, getSensorHistory } from '../services/api';

export default function Dashboard() {
  const [latestData, setLatestData] = useState({
    soilMoisture: 0,
    temperature: 0,
    humidity: 0,
    pumpStatus: false,
  });

  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    const latest = await getLatestSensorData();
    if (latest) setLatestData(latest);

    const hist = await getSensorHistory();
    if (hist) setHistory(hist);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 mt-8">
        {/* Sensor Live Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SensorCard
            title="Soil Moisture"
            value={latestData.soilMoisture}
            unit="%"
            icon="🌱"
            color="border-emerald-200 hover:border-emerald-500"
          />
          <SensorCard
            title="Temperature"
            value={latestData.temperature}
            unit="°C"
            icon="🌡️"
            color="border-amber-200 hover:border-amber-500"
          />
          <SensorCard
            title="Humidity"
            value={latestData.humidity}
            unit="%"
            icon="💧"
            color="border-sky-200 hover:border-sky-500"
          />
          <SensorCard
            title="Pump Status"
            value={latestData.pumpStatus ? 'ACTIVE' : 'OFF'}
            unit=""
            icon="🚿"
            color={latestData.pumpStatus ? 'border-red-300 hover:border-red-500' : 'border-slate-200'}
          />
        </div>

        {/* Interactive Controls */}
        <ControlPanel />

        {/* Live Logs Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">📊 Recent Sensor History</h3>
            <span className="text-xs text-slate-400">Live Updating...</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Soil Moisture</th>
                  <th className="py-3 px-4">Temperature</th>
                  <th className="py-3 px-4">Humidity</th>
                  <th className="py-3 px-4">Pump Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100 text-slate-700">
                {history.length > 0 ? (
                  history.slice(-7).reverse().map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 text-slate-500">{new Date(item.createdAt).toLocaleTimeString()}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600">{item.soilMoisture}%</td>
                      <td className="py-3 px-4">{item.temperature}°C</td>
                      <td className="py-3 px-4">{item.humidity}%</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.pumpStatus 
                            ? 'bg-red-50 text-red-600 border border-red-200' 
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {item.pumpStatus ? 'ON' : 'OFF'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-slate-400">No sensor data logged yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}