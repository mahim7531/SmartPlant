import React, { useState, useEffect } from 'react';
import { getSystemConfig, updateSystemConfig } from '../services/api';

export default function ControlPanel() {
  const [config, setConfig] = useState({
    moistureThreshold: 30,
    manualPumpControl: false,
    isAutoMode: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    const data = await getSystemConfig();
    if (data) setConfig(data);
  };

  const handleToggleAutoMode = async () => {
    setLoading(true);
    const updated = { ...config, isAutoMode: !config.isAutoMode };
    setConfig(updated);
    await updateSystemConfig(updated);
    setLoading(false);
  };

  const handleTogglePump = async () => {
    if (config.isAutoMode) return;
    setLoading(true);
    const updated = { ...config, manualPumpControl: !config.manualPumpControl };
    setConfig(updated);
    await updateSystemConfig(updated);
    setLoading(false);
  };

  const handleThresholdChange = (e) => {
    setConfig({ ...config, moistureThreshold: Number(e.target.value) });
  };

  const saveThreshold = async () => {
    setLoading(true);
    await updateSystemConfig({ moistureThreshold: config.moistureThreshold });
    setLoading(false);
    alert('Moisture threshold saved successfully!');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-6">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        ⚙️ Control Panel & Configuration
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mode Selector */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operation Mode</span>
            <p className="text-sm text-slate-600 mt-1">Select automatic or manual irrigation control</p>
          </div>
          <button
            onClick={handleToggleAutoMode}
            disabled={loading}
            className={`mt-4 py-2.5 px-4 rounded-xl font-semibold text-white transition active:scale-95 ${
              config.isAutoMode 
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 shadow-lg' 
                : 'bg-purple-600 hover:bg-purple-700 shadow-purple-200 shadow-lg'
            }`}
          >
            {config.isAutoMode ? '🤖 Mode: Automatic' : '🕹️ Mode: Manual'}
          </button>
        </div>

        {/* Pump Switch */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Water Pump Switch</span>
            <p className="text-sm text-slate-600 mt-1">Manual trigger (Only in Manual Mode)</p>
          </div>
          <button
            onClick={handleTogglePump}
            disabled={config.isAutoMode || loading}
            className={`mt-4 py-2.5 px-4 rounded-xl font-semibold text-white transition active:scale-95 ${
              config.isAutoMode
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : config.manualPumpControl
                ? 'bg-red-500 hover:bg-red-600 shadow-red-200 shadow-lg'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 shadow-lg'
            }`}
          >
            {config.manualPumpControl ? '🛑 Stop Pump' : '💧 Start Pump'}
          </button>
        </div>

        {/* Threshold Adjustment */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Auto Water Threshold</span>
            <p className="text-sm text-slate-600 mt-1">
              Trigger watering when soil moisture &lt; <strong className="text-emerald-600 font-bold">{config.moistureThreshold}%</strong>
            </p>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <input
              type="range"
              min="10"
              max="80"
              value={config.moistureThreshold}
              onChange={handleThresholdChange}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <button
              onClick={saveThreshold}
              disabled={loading}
              className="bg-emerald-600 text-white font-medium px-4 py-2 rounded-xl text-sm hover:bg-emerald-700 transition active:scale-95 shadow-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}