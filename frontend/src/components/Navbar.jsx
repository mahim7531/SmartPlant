import React from 'react';

export default function Navbar() {
  return (
    <nav className="bg-emerald-700 text-white shadow-lg py-4 px-6 flex justify-between items-center border-b border-emerald-800">
      <div className="flex items-center space-x-3">
        <span className="text-3xl">🌱</span>
        <div>
          <h1 className="text-xl font-bold tracking-wide">SmartPlant</h1>
          <p className="text-xs text-emerald-200">IoT Plant Monitoring System</p>
        </div>
      </div>
      <div className="text-xs bg-emerald-800/80 border border-emerald-600 px-3 py-1.5 rounded-full flex items-center space-x-2">
        <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
        <span className="font-semibold text-emerald-100">System Connected</span>
      </div>
    </nav>
  );
}