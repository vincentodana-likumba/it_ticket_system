"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  BarChart3, 
  Download, 
  Printer, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Building2, 
  Ticket, 
  TrendingUp, 
  RefreshCw,
  FileSpreadsheet,
  ShieldAlert
} from "lucide-react";

const MONTHS_LIST = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" }
];

export default function MonthlyReportPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Current date defaults
  const now = new Date();
  const defaultYear = String(now.getFullYear());
  const defaultMonth = String(now.getMonth() + 1).padStart(2, "0");

  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  // Generate years: 2 past years, current year, and 10 future years (e.g. 2024 to 2036+)
  const availableYears = useMemo(() => {
    const curY = now.getFullYear();
    const yearSet = new Set();
    for (let y = curY - 2; y <= curY + 10; y++) {
      yearSet.add(String(y));
    }
    tickets.forEach(t => {
      if (t.createdAt) {
        const y = new Date(t.createdAt).getFullYear();
        if (!isNaN(y)) yearSet.add(String(y));
      }
    });
    return Array.from(yearSet).sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
  }, [tickets]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tickets");
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (error) {
      console.error("Failed to fetch tickets for reports", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter tickets by selected year and month
  const monthlyTickets = tickets.filter(t => {
    if (selectedYear === "ALL" && selectedMonth === "ALL") return true;
    const ticketDate = new Date(t.createdAt);
    if (isNaN(ticketDate.getTime())) return false;
    const tYear = String(ticketDate.getFullYear());
    const tMonth = String(ticketDate.getMonth() + 1).padStart(2, "0");

    if (selectedYear !== "ALL" && tYear !== selectedYear) return false;
    if (selectedMonth !== "ALL" && tMonth !== selectedMonth) return false;
    return true;
  });

  // Calculate Metrics
  const totalTickets = monthlyTickets.length;
  const resolvedTickets = monthlyTickets.filter(t => t.status === "Resolved" || t.status === "Closed").length;
  const openTickets = monthlyTickets.filter(t => t.status === "Open").length;
  const inProgressTickets = monthlyTickets.filter(t => t.status === "In Progress").length;
  const criticalTickets = monthlyTickets.filter(t => t.priority === "Critical").length;

  const resolutionRate = totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 100;

  // Department Aggregation
  const deptMap = {};
  monthlyTickets.forEach(t => {
    const dept = t.department || "General IT";
    deptMap[dept] = (deptMap[dept] || 0) + 1;
  });

  // Category Aggregation
  const catMap = {};
  monthlyTickets.forEach(t => {
    const cat = t.category || "Other";
    catMap[cat] = (catMap[cat] || 0) + 1;
  });

  // Report Period Label
  const selectedPeriodLabel = useMemo(() => {
    if (selectedYear === "ALL" && selectedMonth === "ALL") {
      return "All Time (Cumulative)";
    }
    if (selectedYear !== "ALL" && selectedMonth === "ALL") {
      return `Annual Summary — Full Year ${selectedYear}`;
    }
    const mObj = MONTHS_LIST.find(m => m.value === selectedMonth);
    const mName = mObj ? mObj.label : "Selected Month";
    if (selectedYear === "ALL") {
      return `${mName} (All Years)`;
    }
    return `${mName} ${selectedYear}`;
  }, [selectedYear, selectedMonth]);

  // CSV Export Function
  const handleExportCSV = () => {
    if (monthlyTickets.length === 0) {
      alert(`No data available to export for ${selectedPeriodLabel}.`);
      return;
    }

    const headers = ["Ticket ID", "Title", "Category", "Department", "Requester", "Priority", "Status", "Assigned Tech", "Created Date"];
    const rows = monthlyTickets.map(t => [
      `"${t.id.substring(0, 8)}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      `"${t.department || 'General IT'}"`,
      `"${t.requester}"`,
      `"${t.priority}"`,
      `"${t.status}"`,
      `"${t.assignedTo || 'Unassigned'}"`,
      `"${new Date(t.createdAt).toLocaleDateString()}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const fileNameSuffix = `${selectedYear}_${selectedMonth}`.replace(/ALL/g, "All");
    link.setAttribute("download", `Maxim_IT_Report_${fileNameSuffix}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Report / Save PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto print:p-0 print:m-0">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl print:bg-white print:text-black print:border-black">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#73BF45]/15 border border-[#73BF45]/30 text-[#68D725] text-xs font-bold uppercase tracking-wider mb-2 print:border-green-600 print:text-green-700">
            <BarChart3 size={14} />
            <span>Management & Operations Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight print:text-black">
            IT Service Desk Report
          </h1>
          <p className="text-slate-300 text-sm mt-0.5 print:text-slate-600">
            Maxim Agri Limited — Operations Summary for <span className="font-bold text-[#68D725] print:text-black">{selectedPeriodLabel}</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 print:hidden">
          {/* Year Selector */}
          <div className="flex items-center space-x-1.5 bg-black/60 px-3 py-2 rounded-xl border border-white/10 text-xs font-semibold">
            <span className="text-slate-400">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#1F1F1F]">All Years</option>
              {availableYears.map(y => (
                <option key={y} value={y} className="bg-[#1F1F1F]">
                  {y} {parseInt(y, 10) > now.getFullYear() ? "(Future)" : parseInt(y, 10) === now.getFullYear() ? "(Current)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Month Selector */}
          <div className="flex items-center space-x-1.5 bg-black/60 px-3 py-2 rounded-xl border border-white/10 text-xs font-semibold">
            <Calendar size={14} className="text-[#68D725]" />
            <span className="text-slate-400">Month:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#1F1F1F]">All Months (Full Year)</option>
              {MONTHS_LIST.map(m => (
                <option key={m.value} value={m.value} className="bg-[#1F1F1F]">
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Preset Buttons */}
          <button
            onClick={() => {
              setSelectedYear(defaultYear);
              setSelectedMonth(defaultMonth);
            }}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-colors"
            title="Reset to current month"
          >
            Current Month
          </button>

          <button
            onClick={() => {
              setSelectedYear("ALL");
              setSelectedMonth("ALL");
            }}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-colors"
            title="Show all-time cumulative reports"
          >
            All Time
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 font-bold px-3.5 py-2 rounded-xl border border-emerald-500/30 text-xs transition-all shadow-md"
          >
            <FileSpreadsheet size={14} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-[#73BF45] to-[#5DA533] hover:brightness-110 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-lg shadow-[#73BF45]/25"
          >
            <Printer size={14} />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Total Tickets</span>
            <Ticket size={18} className="text-[#68D725]" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white">{totalTickets}</div>
            <div className="text-slate-400 text-xs mt-1">Volume in {selectedPeriodLabel}</div>
          </div>
        </div>

        <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex justify-between items-center text-[#68D725] text-xs font-bold uppercase tracking-wider">
            <span>Resolution Rate</span>
            <CheckCircle2 size={18} />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[#68D725]">{resolutionRate}%</div>
            <div className="text-slate-400 text-xs mt-1">{resolvedTickets} of {totalTickets} tickets resolved</div>
          </div>
        </div>

        <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex justify-between items-center text-amber-400 text-xs font-bold uppercase tracking-wider">
            <span>Pending Queue</span>
            <Clock size={18} />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-amber-400">{openTickets + inProgressTickets}</div>
            <div className="text-slate-400 text-xs mt-1">{openTickets} open, {inProgressTickets} in progress</div>
          </div>
        </div>

        <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5 shadow-lg">
          <div className="flex justify-between items-center text-rose-400 text-xs font-bold uppercase tracking-wider">
            <span>Critical Priority</span>
            <ShieldAlert size={18} />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-rose-400">{criticalTickets}</div>
            <div className="text-rose-300/80 text-xs mt-1">High-impact operational blocks</div>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Grid: Department & Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Volume Breakdown */}
        <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold border-b border-white/10 pb-3">
            <Building2 size={18} className="text-[#68D725]" />
            <h3>Departmental Support Demand</h3>
          </div>

          <div className="space-y-3">
            {Object.keys(deptMap).length === 0 ? (
              <div className="text-slate-400 text-xs py-4 text-center">No ticket data for selected period.</div>
            ) : (
              Object.entries(deptMap).map(([dept, count]) => {
                const pct = Math.round((count / totalTickets) * 100);
                return (
                  <div key={dept} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-200">
                      <span>{dept}</span>
                      <span className="text-[#68D725] font-bold">{count} tickets ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#73BF45] to-[#5DA533] rounded-full transition-all duration-500" 
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold border-b border-white/10 pb-3">
            <TrendingUp size={18} className="text-[#68D725]" />
            <h3>Issue Classification Categories</h3>
          </div>

          <div className="space-y-3">
            {Object.keys(catMap).length === 0 ? (
              <div className="text-slate-400 text-xs py-4 text-center">No ticket data for selected period.</div>
            ) : (
              Object.entries(catMap).map(([cat, count]) => {
                const pct = Math.round((count / totalTickets) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-200">
                      <span>{cat}</span>
                      <span className="text-amber-400 font-bold">{count} tickets ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500" 
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Full Monthly Ticket Audit Log Table */}
      <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-black/30">
          <div className="flex items-center space-x-2">
            <Ticket size={18} className="text-[#68D725]" />
            <h2 className="font-bold text-white text-base">Monthly Ticket Audit Trail</h2>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-white/5 px-3 py-1 rounded-full">
            {monthlyTickets.length} Total Logs
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <RefreshCw size={24} className="animate-spin text-[#68D725] mx-auto mb-2" />
            Generating report data...
          </div>
        ) : monthlyTickets.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No support tickets recorded in {selectedPeriodLabel}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-200">
              <thead className="bg-black/50 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Ticket ID</th>
                  <th className="px-6 py-4">Subject & Category</th>
                  <th className="px-6 py-4">Department & Requester</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Assigned Specialist</th>
                  <th className="px-6 py-4">Log Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {monthlyTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono">
                      <span className="text-[#68D725] font-bold bg-[#73BF45]/10 px-2.5 py-1 rounded border border-[#73BF45]/30">
                        #{t.id.substring(0, 8)}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="font-bold text-white text-sm leading-tight truncate">{t.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{t.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-100">{t.requester}</div>
                      <div className="text-[11px] text-slate-400">{t.department || "General IT"}</div>
                    </td>
                    <td className="px-6 py-4 font-bold">
                      <span className={
                        t.priority === 'Critical' ? 'text-rose-400' :
                        t.priority === 'High' ? 'text-amber-400' :
                        t.priority === 'Medium' ? 'text-blue-400' : 'text-slate-400'
                      }>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider ${
                        t.status === 'Open' ? 'bg-[#73BF45]/20 text-[#68D725]' :
                        t.status === 'In Progress' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {t.assignedTo || "-- Unassigned --"}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
