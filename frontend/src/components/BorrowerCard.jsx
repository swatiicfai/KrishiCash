// src/components/BorrowerCard.jsx

const riskStyles = {
  Low: "badge-risk-low",
  Medium: "badge-risk-medium",
  High: "badge-risk-high",
};

export default function BorrowerCard({ borrower, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
        selected
          ? "bg-green-900/20 border-green-700/50 shadow-lg shadow-green-900/20"
          : "bg-[#0d1520] border-[#1f2937] hover:border-gray-600"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-white font-semibold text-sm">{borrower.name}</p>
          <p className="text-gray-500 text-xs mt-0.5">{borrower.location}</p>
          <p className="text-gray-600 text-xs mt-0.5">{borrower.id}</p>
        </div>
        <span className={riskStyles[borrower.riskLevel]}>{borrower.riskLevel} Risk</span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          🌾 {borrower.crop} · {borrower.landArea}
        </span>
        <span className="text-xs text-green-400 font-bold">Score: {borrower.riskScore}</span>
      </div>
      <div className="mt-2">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Loan</span>
          <span>₹{borrower.loanAmount.toLocaleString()}</span>
        </div>
        <div className="h-1.5 bg-[#1f2937] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              borrower.riskScore >= 70
                ? "bg-green-500"
                : borrower.riskScore >= 45
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${borrower.riskScore}%` }}
          />
        </div>
      </div>
    </button>
  );
}
