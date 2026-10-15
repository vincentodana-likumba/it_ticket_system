"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  ShieldCheck, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  ExternalLink, 
  RefreshCw, 
  Building,
  Lock,
  User,
  LogOut,
  KeyRound
} from "lucide-react";
import { DEPARTMENTS, PRIORITIES, STATUSES, ASSIGNEES } from "@/lib/constants";

export default function AdminBoard() {
  const router = useRouter();

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [usernameInput, setUsernameInput] = useState("Maxim Agri");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("adminAuth");
      if (auth === "true") {
        setIsAuthenticated(true);
      }
      setAuthChecking(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTickets();
    }
  }, [isAuthenticated]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (
      (usernameInput.trim().toLowerCase() === "maxim agri" || usernameInput.trim().toLowerCase() === "maxim agri limited") &&
      passwordInput === "Samakgro!25*"
    ) {
      localStorage.setItem("adminAuth", "true");
      localStorage.setItem("adminUser", "Maxim Agri");
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid Admin Username or Password. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminUser");
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tickets?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (error) {
      console.error("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
      }
    } catch (error) {
      console.error("Failed to update status");
    }
  };

  const handleAssigneeChange = async (ticketId, newAssignee) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: newAssignee || null })
      });
      if (res.ok) {
        setTickets(tickets.map(t => t.id === ticketId ? { ...t, assignedTo: newAssignee || null } : t));
      }
    } catch (error) {
      console.error("Failed to update assignee");
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (statusFilter !== "All" && ticket.status !== statusFilter) return false;
    if (priorityFilter !== "All" && ticket.priority !== priorityFilter) return false;
    if (departmentFilter !== "All" && ticket.department !== departmentFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        ticket.title.toLowerCase().includes(q) ||
        ticket.id.toLowerCase().includes(q) ||
        ticket.requester.toLowerCase().includes(q) ||
        (ticket.department && ticket.department.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const unassignedCount = tickets.filter(t => !t.assignedTo && t.status !== "Resolved").length;
  const criticalCount = tickets.filter(t => t.priority === "Critical" && t.status !== "Resolved").length;
  const openCount = tickets.filter(t => t.status === "Open").length;

  if (authChecking) {
    return <div className="p-12 text-center text-slate-400">Loading authentication status...</div>;
  }

  // Render Login Form if Not Authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[rgba(38,30,76,0.8)] backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-gradient-to-tr from-[#73BF45] to-[#5DA533] rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-[#73BF45]/20 text-white">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Dashboard Login</h1>
            <p className="text-slate-300 text-xs">Enter administrator credentials to access the IT Command Board</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <User size={14} className="text-[#68D725]" />
                <span>User Name</span>
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
                placeholder="Enter User Name (Maxim Agri)"
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-[#73BF45] placeholder:text-slate-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <KeyRound size={14} className="text-[#68D725]" />
                <span>Password</span>
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                placeholder="Enter Password"
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-[#73BF45] placeholder:text-slate-500 font-medium"
              />
            </div>

            {authError && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-semibold">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#73BF45] to-[#5DA533] hover:brightness-110 text-white font-bold text-sm rounded-xl shadow-lg shadow-[#73BF45]/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Lock size={16} />
              <span>Authenticate & Access Board</span>
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-slate-400 border-t border-white/10">
            Maxim Agri — IT Operations Portal
          </div>
        </div>
      </div>
    );
  }

  // Render Admin Board if Authenticated
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#73BF45]/15 border border-[#73BF45]/30 text-[#68D725] text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck size={14} />
            <span>Administrator: Maxim Agri</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Operations Dashboard</h1>
          <p className="text-slate-300 text-sm mt-0.5">Triage, dispatch specialists, and resolve organization service requests</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchTickets}
            className="inline-flex items-center space-x-2 bg-black/60 hover:bg-black/80 border border-white/10 text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#68D725]" : ""} />
            <span>Refresh Data</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center space-x-2 bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/30 text-rose-300 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Logout Admin</span>
          </button>
        </div>
      </div>

      {/* Admin KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-300 uppercase">Unassigned Requests</div>
            <div className="text-3xl font-extrabold text-amber-400 mt-1">{unassignedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <UserCheck size={20} />
          </div>
        </div>

        <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-300 uppercase">Critical Blockers</div>
            <div className="text-3xl font-extrabold text-rose-400 mt-1">{criticalCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center border border-rose-500/20">
            <AlertTriangle size={20} />
          </div>
        </div>

        <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-300 uppercase">Total Open Queue</div>
            <div className="text-3xl font-extrabold text-[#68D725] mt-1">{openCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#73BF45]/15 text-[#68D725] flex items-center justify-center border border-[#73BF45]/20">
            <Clock size={20} />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Filter by ID, title, requester..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-[#73BF45] placeholder:text-slate-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-slate-200 text-xs font-semibold focus:outline-none focus:border-[#73BF45]"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept} className="bg-[#1F1F1F]">{dept}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-slate-200 text-xs font-semibold focus:outline-none focus:border-[#73BF45]"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-slate-200 text-xs font-semibold focus:outline-none focus:border-[#73BF45]"
            >
              <option value="All">All Priorities</option>
              {PRIORITIES.map((pri) => (
                <option key={pri} value={pri} className="bg-[#1F1F1F]">{pri}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Admin Operations Table */}
      <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <RefreshCw size={24} className="animate-spin text-[#68D725] mx-auto mb-2" />
            Loading admin ticket dispatch...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-200">
              <thead className="bg-black/50 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Ticket</th>
                  <th className="px-6 py-4">Requester & Dept</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Assigned Specialist</th>
                  <th className="px-6 py-4">Status Action</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                      No support requests matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-white/5 transition-colors">
                      {/* Ticket Title & ID */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-[#68D725] bg-[#73BF45]/15 px-2 py-0.5 rounded border border-[#73BF45]/30">
                            #{ticket.id.substring(0, 8)}
                          </span>
                          <span className="text-[11px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                            {ticket.category}
                          </span>
                        </div>
                        <div className="font-bold text-white text-sm mt-1">
                          {ticket.title}
                        </div>
                      </td>

                      {/* Requester & Dept */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-100">{ticket.requester}</div>
                        <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                          <Building size={11} className="text-slate-400" />
                          <span>{ticket.department}</span>
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="px-6 py-4">
                        <span className={`font-extrabold ${
                          ticket.priority === 'Critical' ? 'text-rose-400' :
                          ticket.priority === 'High' ? 'text-orange-400' :
                          ticket.priority === 'Medium' ? 'text-amber-400' :
                          'text-slate-400'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>

                      {/* Assigned Technician Dropdown */}
                      <td className="px-6 py-4">
                        <select
                          value={ticket.assignedTo || ""}
                          onChange={(e) => handleAssigneeChange(ticket.id, e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs font-semibold focus:outline-none focus:border-[#73BF45] cursor-pointer"
                        >
                          <option value="" className="bg-[#1F1F1F]">-- Unassigned --</option>
                          {ASSIGNEES.map((tech) => (
                            <option key={tech} value={tech} className="bg-[#1F1F1F]">{tech}</option>
                          ))}
                        </select>
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-6 py-4">
                        <select 
                          value={ticket.status}
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border-none cursor-pointer focus:outline-none ${
                            ticket.status === 'Open' ? 'bg-[#73BF45]/20 text-[#68D725]' :
                            ticket.status === 'In Progress' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-[#68D725]/20 text-[#68D725]'
                          }`}
                        >
                          <option value="Open" className="bg-[#1F1F1F] text-[#68D725]">Open</option>
                          <option value="In Progress" className="bg-[#1F1F1F] text-amber-400">In Progress</option>
                          <option value="Resolved" className="bg-[#1F1F1F] text-[#68D725]">Resolved</option>
                        </select>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/tickets/${ticket.id}`}
                          className="inline-flex items-center space-x-1 p-2 text-slate-400 hover:text-[#68D725] hover:bg-white/10 rounded-lg transition-colors"
                          title="Open full ticket details"
                        >
                          <ExternalLink size={16} />
                        </Link>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
