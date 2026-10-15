"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  PlusCircle, 
  Ticket, 
  MessageSquare, 
  ChevronRight, 
  RefreshCw, 
  Building2, 
  User, 
  Clock 
} from "lucide-react";
import { DEPARTMENTS, CATEGORIES, PRIORITIES, STATUSES } from "@/lib/constants";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  useEffect(() => {
    fetchTickets();
  }, [selectedStatus, selectedCategory, selectedPriority, selectedDepartment]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (selectedStatus !== "All") params.append("status", selectedStatus);
      if (selectedCategory !== "All") params.append("category", selectedCategory);
      if (selectedPriority !== "All") params.append("priority", selectedPriority);
      if (selectedDepartment !== "All") params.append("department", selectedDepartment);

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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">IT Ticket Directory</h1>
          <p className="text-slate-300 text-sm mt-1">Browse, filter, and track all submitted service desk requests</p>
        </div>
        <Link
          href="/tickets/new"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#73BF45] to-[#5DA533] hover:brightness-110 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-[#73BF45]/25 transition-all text-sm"
        >
          <PlusCircle size={18} />
          <span>New Ticket</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search tickets by ID, title, requester, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-[#73BF45] placeholder:text-slate-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-[#73BF45] to-[#5DA533] text-white text-sm font-bold rounded-xl transition-all hover:brightness-110 flex items-center justify-center space-x-2"
          >
            <Search size={16} />
            <span>Search</span>
          </button>
        </form>

        {/* Filter Badges & Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10">
          {/* Status Tabs */}
          <div className="flex items-center space-x-1 bg-black/60 p-1 rounded-xl border border-white/10">
            {["All", "Open", "In Progress", "Resolved"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedStatus === st
                    ? "bg-[#73BF45] text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs font-semibold focus:outline-none focus:border-[#73BF45]"
            >
              <option value="All" className="bg-[#1F1F1F]">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept} className="bg-[#1F1F1F]">{dept}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs font-semibold focus:outline-none focus:border-[#73BF45]"
            >
              <option value="All" className="bg-[#1F1F1F]">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#1F1F1F]">{cat}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs font-semibold focus:outline-none focus:border-[#73BF45]"
            >
              <option value="All" className="bg-[#1F1F1F]">All Priorities</option>
              {PRIORITIES.map((pri) => (
                <option key={pri} value={pri} className="bg-[#1F1F1F]">{pri}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedStatus("All");
                setSelectedCategory("All");
                setSelectedPriority("All");
                setSelectedDepartment("All");
              }}
              className="p-1.5 rounded-xl bg-black/60 text-slate-400 hover:text-white border border-white/10 transition-colors"
              title="Reset filters"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md rounded-2xl border border-white/10 shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Fetching ticket database...</div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Ticket className="mx-auto text-slate-500" size={40} />
            <div className="text-slate-200 font-semibold text-base">No tickets match your filters</div>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              Try adjusting your search terms or resetting status and category dropdown filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredTickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/tickets/${ticket.id}`}
                className="p-5 hover:bg-white/5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group block"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-[#68D725] bg-[#73BF45]/15 px-2 py-0.5 rounded font-bold border border-[#73BF45]/30">
                      #{ticket.id.substring(0, 8)}
                    </span>
                    <span className="text-xs font-semibold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-md">
                      {ticket.category}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-[#68D725] transition-colors">
                      {ticket.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-1 max-w-3xl">
                    {ticket.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    <div className="flex items-center space-x-1">
                      <User size={13} className="text-slate-400" />
                      <span className="text-slate-200 font-semibold">{ticket.requester}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Building2 size={13} className="text-slate-400" />
                      <span>{ticket.department}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={13} className="text-slate-400" />
                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                    {ticket._count?.comments > 0 && (
                      <div className="flex items-center space-x-1 text-[#68D725]">
                        <MessageSquare size={13} />
                        <span>{ticket._count.comments} {ticket._count.comments === 1 ? 'comment' : 'comments'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end space-x-4 border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
                  <div className="flex flex-col items-start md:items-end space-y-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      ticket.status === 'Open' ? 'bg-[#73BF45]/15 text-[#68D725] border-[#73BF45]/30' :
                      ticket.status === 'In Progress' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                      'bg-[#68D725]/15 text-[#68D725] border-[#68D725]/30'
                    }`}>
                      {ticket.status}
                    </span>
                    <span className={`text-[11px] font-extrabold ${
                      ticket.priority === 'Critical' ? 'text-rose-400' :
                      ticket.priority === 'High' ? 'text-orange-400' :
                      ticket.priority === 'Medium' ? 'text-amber-400' :
                      'text-slate-400'
                    }`}>
                      {ticket.priority} Priority
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-slate-500 group-hover:text-[#68D725] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
