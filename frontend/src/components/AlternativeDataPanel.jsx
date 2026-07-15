// src/components/AlternativeDataPanel.jsx
import { Satellite, CloudRain, BarChart2, Thermometer } from "lucide-react";

const ndviColor = (score) => {
  if (score >= 0.65) return "text-green-400";
  if (score >= 0.45) return "text-yellow-400";
  return "text-red-400";
};

const ndviBg = (score) => {
  if (score >= 0.65) return "bg-green-900/20 border-green-800/30";
  if (score >= 0.45) return "bg-yellow-900/20 border-yellow-800/30";
  return "bg-red-900/20 border-red-800/30";
};

export default function AlternativeDataPanel({ signals }) {
  return (
    <div className="card">
      <h2 className="text-white font-semibold text-base mb-1">Alternative Data Signals</h2>
      <p className="text-gray-500 text-xs mb-5">
        Real-world environmental & market signals powering the AI model
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* NDVI */}
        <div className={`border rounded-xl p-3 ${ndviBg(signals.ndviScore)}`}>
          <div className="flex items-center gap-2 mb-1">
            <Satellite size={14} className={ndviColor(signals.ndviScore)} />
            <span className="text-gray-400 text-xs font-medium">Satellite NDVI</span>
          </div>
          <p className={`text-lg font-bold ${ndviColor(signals.ndviScore)}`}>
            {signals.ndviScore.toFixed(2)}
          </p>
          <p className="text-gray-500 text-xs mt-0.5">{signals.ndviLabel}</p>
        </div>

        {/* Rainfall Forecast */}
        <div className="bg-blue-900/10 border border-blue-800/20 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <CloudRain size={14} className="text-blue-400" />
            <span className="text-gray-400 text-xs font-medium">IMD Rainfall</span>
          </div>
          <p className="text-blue-300 text-sm font-semibold leading-tight">
            {signals.rainfallForecast}
          </p>
          <p className="text-gray-500 text-xs mt-0.5">3-month forecast</p>
        </div>

        {/* Mandi Price */}
        <div className="bg-purple-900/10 border border-purple-800/20 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 size={14} className="text-purple-400" />
            <span className="text-gray-400 text-xs font-medium">Mandi Price</span>
          </div>
          <p className="text-purple-300 text-sm font-semibold leading-tight">
            {signals.mandiPrice}
          </p>
          <p className="text-gray-500 text-xs mt-0.5">Local market rate</p>
        </div>

        {/* Soil Moisture */}
        <div className="bg-amber-900/10 border border-amber-800/20 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Thermometer size={14} className="text-amber-400" />
            <span className="text-gray-400 text-xs font-medium">Soil Moisture</span>
          </div>
          <p className="text-amber-300 text-sm font-semibold">{signals.soilMoisture}</p>
          <p className="text-gray-500 text-xs mt-0.5">Current ground condition</p>
        </div>
      </div>

      {/* Alerts */}
      {signals.alerts.length > 0 && (
        <div className="space-y-2">
          {signals.alerts.map((alert, i) => (
            <div
              key={i}
              className="bg-red-900/15 border border-red-800/30 rounded-xl px-3 py-2 text-xs text-red-300"
            >
              {alert}
            </div>
          ))}
        </div>
      )}
      {signals.alerts.length === 0 && (
        <div className="bg-green-900/10 border border-green-800/20 rounded-xl px-3 py-2 text-xs text-green-400">
          ✅ No active risk alerts for this borrower.
        </div>
      )}
    </div>
  );
}
