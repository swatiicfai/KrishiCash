// src/components/RiskScoreGauge.jsx
export default function RiskScoreGauge({ score }) {
  const color =
    score >= 70 ? "#22c55e" : score >= 45 ? "#eab308" : "#ef4444";
  const label =
    score >= 70 ? "Low Risk" : score >= 45 ? "Medium Risk" : "High Risk";
  const bg =
    score >= 70
      ? "from-green-900/30 to-green-900/10 border-green-800/40"
      : score >= 45
      ? "from-yellow-900/30 to-yellow-900/10 border-yellow-800/40"
      : "from-red-900/30 to-red-900/10 border-red-800/40";

  // SVG arc gauge
  const radius = 54;
  const cx = 70;
  const cy = 70;
  const startAngle = -210;
  const endAngle = 30;
  const totalArc = endAngle - startAngle;
  const filled = (score / 100) * totalArc;

  const polarToXY = (angle, r) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (start, end) => {
    const s = polarToXY(start, radius);
    const e = polarToXY(end, radius);
    const large = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  return (
    <div className={`bg-gradient-to-br ${bg} border rounded-2xl p-5 flex flex-col items-center`}>
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">
        AI Risk Score
      </p>
      <svg width="140" height="100" viewBox="0 0 140 100">
        {/* Background arc */}
        <path
          d={describeArc(startAngle, endAngle)}
          fill="none"
          stroke="#1f2937"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d={describeArc(startAngle, startAngle + filled)}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
        />
        {/* Score text */}
        <text x="70" y="72" textAnchor="middle" fill="white" fontSize="26" fontWeight="700">
          {score}
        </text>
        <text x="70" y="86" textAnchor="middle" fill={color} fontSize="9" fontWeight="600">
          / 100
        </text>
      </svg>
      <span
        className="text-sm font-semibold mt-1"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}
