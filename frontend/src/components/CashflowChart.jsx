// src/components/CashflowChart.jsx
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from "recharts";

const formatINR = (v) => v ? `₹${(v / 1000).toFixed(0)}K` : "";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1520] border border-[#1f2937] rounded-xl p-3 text-xs shadow-2xl">
      <p className="text-gray-400 font-semibold mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="text-white font-medium">{p.value ? `₹${p.value.toLocaleString()}` : "—"}</span>
        </div>
      ))}
    </div>
  );
};

export default function CashflowChart({ data }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-semibold text-base">Cash Flow Forecast</h2>
          <p className="text-gray-500 text-xs mt-0.5">6-month AI prediction with confidence interval</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-gray-400">
            <span className="w-3 h-0.5 bg-blue-400 inline-block rounded"></span>Actual
          </span>
          <span className="flex items-center gap-1.5 text-gray-400">
            <span className="w-3 h-0.5 bg-green-400 inline-block rounded border-dashed border-b border-green-400"></span>Predicted
          </span>
          <span className="flex items-center gap-1.5 text-gray-400">
            <span className="w-3 h-3 bg-green-900/40 border border-green-700/40 inline-block rounded"></span>Confidence Band
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={{ stroke: "#1f2937" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatINR}
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x="Feb '26" stroke="#374151" strokeDasharray="4 4" label={{ value: "Forecast Start", fill: "#6b7280", fontSize: 10 }} />
          {/* Confidence Band */}
          <Area
            dataKey="upper"
            fill="#22c55e"
            fillOpacity={0.08}
            stroke="transparent"
            name="Upper Bound"
            legendType="none"
          />
          <Area
            dataKey="lower"
            fill="#0a0f1e"
            fillOpacity={1}
            stroke="transparent"
            name="Lower Bound"
            legendType="none"
          />
          {/* Actual */}
          <Line
            dataKey="actual"
            stroke="#60a5fa"
            strokeWidth={2.5}
            dot={{ fill: "#60a5fa", r: 3 }}
            activeDot={{ r: 5 }}
            name="Actual Cash Flow"
            connectNulls={false}
          />
          {/* Predicted */}
          <Line
            dataKey="predicted"
            stroke="#22c55e"
            strokeWidth={2.5}
            strokeDasharray="6 3"
            dot={{ fill: "#22c55e", r: 3 }}
            activeDot={{ r: 5 }}
            name="Predicted Cash Flow"
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
