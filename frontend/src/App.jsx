// src/App.jsx
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import BorrowerCard from "./components/BorrowerCard";
import RiskScoreGauge from "./components/RiskScoreGauge";
import CashflowChart from "./components/CashflowChart";
import AlternativeDataPanel from "./components/AlternativeDataPanel";
import { borrowerProfiles, cashflowData, alternativeDataSignals } from "./data/mockData";
import { Bell, Search, MapPin, IndianRupee, TrendingUp, Users, ShieldAlert, Cpu } from "lucide-react";

const statCards = [
  { label: "Total Portfolio", value: "₹4.2 Cr", sub: "Active rural loans", icon: IndianRupee, color: "text-green-400", bg: "bg-green-900/20 border-green-800/30" },
  { label: "Borrowers Assessed", value: "1,284", sub: "+38 this week", icon: Users, color: "text-blue-400", bg: "bg-blue-900/20 border-blue-800/30" },
  { label: "High Risk Alerts", value: "23", sub: "Require attention", icon: ShieldAlert, color: "text-red-400", bg: "bg-red-900/20 border-red-800/30" },
  { label: "NPA Prevented", value: "₹18.7L", sub: "This quarter", icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-900/20 border-purple-800/30" },
];

export default function App() {
  const [selectedId, setSelectedId] = useState(borrowerProfiles[0].id);

  const borrower = borrowerProfiles.find((b) => b.id === selectedId);
  const signals = alternativeDataSignals[selectedId];
  const chartData = cashflowData[selectedId];

  return (
    <div className="flex min-h-screen bg-[#0a0f1e]">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-[#1f2937] flex items-center justify-between px-6 bg-[#0a0f1e]/80 backdrop-blur-sm sticky top-0 z-10">
          <div>
            <h2 className="text-white font-semibold text-sm">Loan Officer Dashboard</h2>
            <p className="text-gray-500 text-xs">NABARD · Elimination Round · GFF 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#111827] border border-[#1f2937] rounded-xl px-3 py-2">
              <Search size={14} className="text-gray-500" />
              <input
                className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none w-44"
                placeholder="Search borrowers..."
              />
            </div>
            <button className="relative p-2 rounded-xl bg-[#111827] border border-[#1f2937] hover:border-gray-600 transition-colors">
              <Bell size={16} className="text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white text-xs font-bold">
              LO
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-4">
            {statCards.map(({ label, value, sub, icon: Icon, color, bg }) => (
              <div key={label} className={`stat-card border ${bg}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-xs font-medium">{label}</p>
                    <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{sub}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${bg}`}>
                    <Icon size={18} className={color} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Body */}
          <div className="grid grid-cols-12 gap-4">

            {/* Left: Borrower List */}
            <div className="col-span-3 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-sm">Borrowers</h3>
                <span className="text-xs text-gray-500">{borrowerProfiles.length} profiles</span>
              </div>
              {borrowerProfiles.map((b) => (
                <BorrowerCard
                  key={b.id}
                  borrower={b}
                  selected={b.id === selectedId}
                  onClick={() => setSelectedId(b.id)}
                />
              ))}

              {/* AI Model badge */}
              <div className="mt-2 bg-[#0d1520] border border-[#1f2937] rounded-xl p-3 flex items-center gap-2">
                <Cpu size={14} className="text-green-500 shrink-0" />
                <p className="text-gray-500 text-xs">
                  Powered by <span className="text-green-400 font-semibold">XGBoost + PyTorch</span> on satellite & mandi data
                </p>
              </div>
            </div>

            {/* Right: Detail Panel */}
            <div className="col-span-9 flex flex-col gap-4">
              {/* Borrower header */}
              <div className="card flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white font-bold text-sm">
                      {borrower.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base">{borrower.name}</h3>
                      <p className="text-gray-500 text-xs flex items-center gap-1">
                        <MapPin size={11} /> {borrower.location} · {borrower.id}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">Crop</p>
                    <p className="text-white font-semibold">{borrower.crop}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">Loan Purpose</p>
                    <p className="text-white font-semibold text-xs max-w-40">{borrower.loanPurpose}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">Loan Amount</p>
                    <p className="text-white font-semibold">₹{borrower.loanAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">Cash Flow</p>
                    <p className={`font-semibold ${
                      borrower.cashflowTrend === "Stable" ? "text-green-400"
                      : borrower.cashflowTrend === "Volatile" ? "text-yellow-400"
                      : "text-red-400"
                    }`}>{borrower.cashflowTrend}</p>
                  </div>
                  <button className="btn-primary text-sm">
                    Approve Loan
                  </button>
                </div>
              </div>

              {/* Charts + Gauge row */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-8">
                  <CashflowChart data={chartData} />
                </div>
                <div className="col-span-4 flex flex-col gap-4">
                  <RiskScoreGauge score={borrower.riskScore} />
                  <div className="card flex-1">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Risk Breakdown</p>
                    {[
                      { label: "Climate Risk", val: signals.climateRisk },
                      { label: "Market Risk", val: signals.marketRisk },
                      { label: "Repayment History", val: borrower.repaymentHistory },
                    ].map(({ label, val }) => {
                      const color =
                        val === "Low" || val === "Good" ? "text-green-400"
                        : val === "Medium" || val === "Moderate" ? "text-yellow-400"
                        : "text-red-400";
                      return (
                        <div key={label} className="flex justify-between items-center py-2 border-b border-[#1f2937] last:border-0">
                          <span className="text-gray-400 text-xs">{label}</span>
                          <span className={`text-xs font-semibold ${color}`}>{val}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Alternative Data Panel */}
              <AlternativeDataPanel signals={signals} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
