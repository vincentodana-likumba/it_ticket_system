"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  PlusCircle, 
  Ticket, 
  MessageSquare, 
  RefreshCw, 
  Building2, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  ChevronRight, 
  Filter 
} from "lucide-react";
import { DEPARTMENTS, CATEGORIES, PRIORITIES, STATUSES, ASSIGNEES } from "@/lib/constants";

export default function HomePage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter, categoryFilter, departmentFilter]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (statusFilter !== "All") params.append("status", statusFilter);
      if (priorityFilter !== "All") params.append("priority", priorityFilter);
      if (categoryFilter !== "All") params.append("category", categoryFilter);
      if (departmentFilter !== "All") params.append("department", departmentFilter);

      const res = await fetch(`/api/tickets?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTickets();
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
      console.error("Failed to update status", error);
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
      console.error("Failed to update assignee", error);
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      t.requester.toLowerCase().includes(q) ||
      (t.department && t.department.toLowerCase().includes(q)) ||
      (t.assignedTo && t.assignedTo.toLowerCase().includes(q))
    );
  });

  const totalTickets = tickets.length;
  const openCount = tickets.filter(t => t.status === "Open").length;
  const inProgressCount = tickets.filter(t => t.status === "In Progress").length;
  const resolvedCount = tickets.filter(t => t.status === "Resolved").length;
  const criticalCount = tickets.filter(t => t.priority === "Critical" && t.status !== "Resolved").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Maxim Agri IT Service Desk
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Centralized IT Support & Operations Ticket Management Platform
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchTickets}
            className="px-4 py-2.5 bg-black/40 hover:bg-black/60 border border-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-2"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#68D725]" : ""} />
            <span>Refresh</span>
          </button>
          <Link
            href="/tickets/new"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#73BF45] to-[#5DA533] hover:brightness-110 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-[#73BF45]/25 transition-all text-sm"
          >
            <PlusCircle size={18} />
            <span>Create New Ticket</span>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Tickets</span>
            <Ticket size={18} className="text-[#68D725]" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">{totalTickets}</span>
            <span className="text-slate-400 text-xs block mt-0.5">All registered issues</span>
          </div>
        </div>

        <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start text-[#68D725]">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Open</span>
            <AlertCircle size={18} />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-[#68D725]">{openCount}</span>
            <span className="text-slate-400 text-xs block mt-0.5">Pending triage</span>
          </div>
        </div>

        <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">In Progress</span>
            <Clock size={18} />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-amber-400">{inProgressCount}</span>
            <span className="text-slate-400 text-xs block mt-0.5">Active tech resolution</span>
          </div>
        </div>

        <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start text-[#68D725]">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Resolved</span>
            <CheckCircle2 size={18} />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-[#68D725]">{resolvedCount}</span>
            <span className="text-slate-400 text-xs block mt-0.5">Successfully closed</span>
          </div>
        </div>

        <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-5 rounded-2xl border border-rose-500/30 shadow-lg flex flex-col justify-between bg-rose-500/5">
          <div className="flex justify-between items-start text-rose-400">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300">Critical Priority</span>
            <ShieldAlert size={18} />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-rose-400">{criticalCount}</span>
            <span className="text-rose-300/80 text-xs block mt-0.5">Requires urgent action</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search tickets by ID, title, requester, department, or assigned tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-[#73BF45] placeholder:text-slate-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-[#73BF45] to-[#5DA533] text-white text-sm font-bold rounded-xl transition-all hover:brightness-110 flex items-center justify-center space-x-2"
          >
            <span>Search</span>
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-400 font-semibold mr-2">
            <Filter size={14} className="text-[#68D725]" />
            <span>Filters:</span>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-slate-400">Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 text-slate-200 font-medium focus:outline-none focus:border-[#73BF45]"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept} className="bg-[#1F1F1F]">{dept}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 text-slate-200 font-medium focus:outline-none focus:border-[#73BF45]"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-slate-400">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 text-slate-200 font-medium focus:outline-none focus:border-[#73BF45]"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-slate-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 text-slate-200 font-medium focus:outline-none focus:border-[#73BF45]"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#1F1F1F]">{cat}</option>
              ))}
            </select>
          </div>

          {(statusFilter !== "All" || priorityFilter !== "All" || categoryFilter !== "All" || departmentFilter !== "All" || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter("All");
                setPriorityFilter("All");
                setCategoryFilter("All");
                setDepartmentFilter("All");
                setSearchQuery("");
              }}
              className="text-xs text-[#68D725] hover:underline font-semibold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Ticket Directory Table */}
      <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-black/30">
          <div className="flex items-center space-x-2">
            <Ticket size={18} className="text-[#68D725]" />
            <h2 className="font-bold text-white text-base">Active Support Ticket Desk</h2>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-white/5 px-3 py-1 rounded-full">
            Showing {filteredTickets.length} of {tickets.length} Tickets
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <RefreshCw size={24} className="animate-spin text-[#68D725] mx-auto mb-2" />
            Loading IT tickets...
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Ticket size={36} className="text-slate-500 mx-auto" />
            <p className="text-slate-300 font-medium text-sm">No tickets found matching your filter criteria.</p>
            <button
              onClick={() => {
                setStatusFilter("All");
                setPriorityFilter("All");
                setCategoryFilter("All");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-[#73BF45]/20 text-[#68D725] rounded-xl text-xs font-bold border border-[#73BF45]/40 hover:bg-[#73BF45]/30"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-200">
              <thead className="bg-black/50 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-white/10">
                <tr>
                  <th className="px-5 py-3.5">Ticket ID</th>
                  <th className="px-5 py-3.5">Subject & Category</th>
                  <th className="px-5 py-3.5">Requester</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Assigned Tech</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-white/5 transition-colors">
                    {/* Ticket ID */}
                    <td className="px-5 py-4 font-mono">
                      <Link 
                        href={`/tickets/${t.id}`}
                        className="text-[#68D725] font-bold bg-[#73BF45]/10 hover:bg-[#73BF45]/20 px-2.5 py-1 rounded border border-[#73BF45]/30 inline-block transition-colors"
                      >
                        #{t.id.substring(0, 8)}
                      </Link>
                    </td>

                    {/* Subject & Category */}
                    <td className="px-5 py-4 max-w-xs">
                      <Link href={`/tickets/${t.id}`} className="font-bold text-white hover:text-[#68D725] text-sm block leading-tight truncate">
                        {t.title}
                      </Link>
                      <span className="text-[11px] text-slate-400 block mt-1">
                        {t.category}
                      </span>
                    </td>

                    {/* Requester */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-100">{t.requester}</div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                        <Building2 size={11} className="text-slate-400" />
                        <span>{t.department || "General IT"}</span>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        t.priority === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                        t.priority === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                        t.priority === 'Medium' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
                        'bg-slate-500/20 text-slate-300 border border-slate-500/40'
                      }`}>
                        <span>{t.priority}</span>
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-5 py-4">
                      <select
                        value={t.status}
                        onChange={(e) => handleStatusChange(t.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer focus:outline-none transition-colors ${
                          t.status === 'Open' ? 'bg-[#73BF45]/20 text-[#68D725] border border-[#73BF45]/40' :
                          t.status === 'In Progress' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                          'bg-[#68D725]/20 text-[#68D725] border border-[#68D725]/40'
                        }`}
                      >
                        <option value="Open" className="bg-[#1F1F1F] text-[#68D725]">Open</option>
                        <option value="In Progress" className="bg-[#1F1F1F] text-amber-400">In Progress</option>
                        <option value="Resolved" className="bg-[#1F1F1F] text-[#68D725]">Resolved</option>
                      </select>
                    </td>

                    {/* Assigned Tech */}
                    <td className="px-5 py-4">
                      <select
                        value={t.assignedTo || ""}
                        onChange={(e) => handleAssigneeChange(t.id, e.target.value)}
                        className="bg-black/60 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-[#73BF45]"
                      >
                        <option value="" className="bg-[#1F1F1F]">-- Unassigned --</option>
                        {ASSIGNEES.map((tech) => (
                          <option key={tech} value={tech} className="bg-[#1F1F1F]">{tech}</option>
                        ))}
                      </select>
                    </td>

                    {/* Action Link */}
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/tickets/${t.id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold transition-colors"
                      >
                        <span>View</span>
                        <ChevronRight size={14} />
                      </Link>
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
