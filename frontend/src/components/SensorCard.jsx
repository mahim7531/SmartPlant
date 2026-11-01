import React from 'react';

export default function SensorCard({ title, value, unit, icon, color }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border p-6 flex items-center justify-between transition hover:shadow-md ${color}`}>
      <div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 mt-2">
          {value !== undefined && value !== null ? value : '--'} 
          <span className="text-base font-medium text-slate-400 ml-1">{unit}</span>
        </h3>
      </div>
      <div className="text-4xl p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
        {icon}
      </div>
    </div>
  );
}