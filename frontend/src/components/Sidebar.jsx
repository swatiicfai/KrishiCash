// src/components/Sidebar.jsx
import { LayoutDashboard, Users, TrendingUp, AlertTriangle, Settings, Leaf } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Borrowers" },
  { icon: TrendingUp, label: "Predictions" },
  { icon: AlertTriangle, label: "Risk Alerts" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[#0d1520] border-r border-[#1f2937] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#1f2937]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-green-900/40">
            <Leaf size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">KrishiCash</h1>
            <p className="text-green-500 text-xs mt-0.5">by NABARD AI</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              active
                ? "bg-green-900/30 text-green-400 border border-green-800/40"
                : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
            }`}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>

      {/* Bottom info */}
      <div className="p-4 border-t border-[#1f2937]">
        <div className="bg-green-900/20 border border-green-800/30 rounded-xl p-3">
          <p className="text-green-400 text-xs font-semibold">NABARD Hackathon</p>
          <p className="text-gray-500 text-xs mt-1">GFF 2026 · AI for Rural Finance</p>
        </div>
      </div>
    </aside>
  );
}
