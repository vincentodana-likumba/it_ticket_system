"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  MessageSquare, 
  Send, 
  UserCheck, 
  Clock, 
  Building, 
  Mail, 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  Globe, 
  Trash2 
} from "lucide-react";
import { ASSIGNEES } from "@/lib/constants";

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params?.id;
  const router = useRouter();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("Vincent Odana");
  const [isInternal, setIsInternal] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [editingResolution, setEditingResolution] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`);
      if (res.ok) {
        const data = await res.json();
        setTicket(data);
        setResolutionNotes(data.resolutionNotes || "");
      } else {
        console.error("Ticket not found");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setTicket(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: newPriority })
      });
      if (res.ok) {
        const updated = await res.json();
        setTicket(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssigneeChange = async (newAssignee) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: newAssignee || null })
      });
      if (res.ok) {
        const updated = await res.json();
        setTicket(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveResolution = async () => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          resolutionNotes, 
          status: "Resolved" 
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setTicket(updated);
        setEditingResolution(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: authorName || "IT Technician",
          authorRole: isInternal ? "IT Support" : "User",
          content: newComment,
          isInternal
        })
      });

      if (res.ok) {
        setNewComment("");
        fetchTicket();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!confirm("Are you sure you want to delete this ticket? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/tickets");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading ticket details...</div>;
  }

  if (!ticket) {
    return (
      <div className="p-12 text-center space-y-4 max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-white">Ticket Not Found</h2>
        <p className="text-slate-400 text-sm">The requested ticket ID does not exist or has been removed.</p>
        <Link href="/tickets" className="inline-block bg-[#73BF45] hover:bg-[#5DA533] text-white font-bold px-4 py-2 rounded-xl text-sm">
          Return to Tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <Link href="/tickets" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-300 hover:text-white transition-colors">
          <ArrowLeft size={16} />
          <span>Back to Ticket List</span>
        </Link>

        <button 
          onClick={handleDeleteTicket}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 transition-colors"
        >
          <Trash2 size={14} />
          <span>Delete Ticket</span>
        </button>
      </div>

      {/* Main Grid: Left Ticket Details & Comments, Right Sidebar Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Card Header */}
          <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-[#68D725] bg-[#73BF45]/15 px-2.5 py-1 rounded-md border border-[#73BF45]/30">
                  #{ticket.id.substring(0, 8)}
                </span>
                <span className="text-xs font-semibold text-slate-300 bg-white/10 px-3 py-1 rounded-full">
                  {ticket.category}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Created {new Date(ticket.createdAt).toLocaleString()}
              </div>
            </div>

            <h1 className="text-2xl font-extrabold text-white tracking-tight leading-snug">
              {ticket.title}
            </h1>

            <div className="bg-black/50 p-5 rounded-xl border border-white/10 text-slate-200 text-sm whitespace-pre-line leading-relaxed">
              {ticket.description}
            </div>
          </div>

          {/* Resolution Notes Section */}
          <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[#68D725]">
                <CheckCircle2 size={18} />
                <h3 className="font-bold text-white text-base">Resolution Summary</h3>
              </div>
              {!editingResolution && (
                <button
                  onClick={() => setEditingResolution(true)}
                  className="text-xs font-bold text-[#68D725] hover:underline"
                >
                  {ticket.resolutionNotes ? "Edit Resolution" : "+ Add Resolution"}
                </button>
              )}
            </div>

            {editingResolution ? (
              <div className="space-y-3">
                <textarea
                  rows="4"
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Describe how this issue was diagnosed and resolved..."
                  className="w-full p-3 bg-black/60 rounded-xl border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-[#73BF45]"
                ></textarea>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setEditingResolution(false)}
                    className="px-4 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveResolution}
                    className="px-4 py-1.5 bg-gradient-to-r from-[#73BF45] to-[#5DA533] hover:brightness-110 text-white text-xs font-bold rounded-lg"
                  >
                    Save & Mark Resolved
                  </button>
                </div>
              </div>
            ) : ticket.resolutionNotes ? (
              <div className="p-4 bg-[#68D725]/10 border border-[#68D725]/20 rounded-xl text-[#68D725] text-xs leading-relaxed">
                {ticket.resolutionNotes}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">
                No resolution notes added yet.
              </div>
            )}
          </div>

          {/* Discussion & Activity Thread */}
          <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2 text-slate-200 font-bold">
                <MessageSquare size={18} className="text-[#68D725]" />
                <h2>Activity & Comments Thread</h2>
              </div>
              <span className="text-xs font-semibold text-slate-300">
                {ticket.comments ? ticket.comments.length : 0} Entries
              </span>
            </div>

            {/* Comment List */}
            <div className="space-y-4">
              {(!ticket.comments || ticket.comments.length === 0) ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No comments yet. Start the conversation below.
                </div>
              ) : (
                ticket.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      comment.isInternal
                        ? "bg-amber-500/15 border-amber-500/30 text-amber-200"
                        : comment.authorRole === "IT Support"
                        ? "bg-[#73BF45]/15 border-[#73BF45]/30 text-slate-200"
                        : "bg-black/50 border-white/10 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-[10px] ${
                          comment.isInternal ? "bg-amber-500 text-black" :
                          comment.authorRole === "IT Support" ? "bg-[#73BF45] text-white" : "bg-white/10 text-slate-300"
                        }`}>
                          {comment.author.substring(0, 1).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-100">{comment.author}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-black/40 text-slate-300">
                          {comment.authorRole}
                        </span>
                        {comment.isInternal && (
                          <span className="inline-flex items-center space-x-1 text-[10px] bg-amber-400 text-black font-extrabold px-2 py-0.5 rounded">
                            <Lock size={10} />
                            <span>Internal Note</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="whitespace-pre-line leading-relaxed pt-1">
                      {comment.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="pt-4 border-t border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Your Name / Handle"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="px-3 py-1.5 bg-black/60 border border-white/10 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-[#73BF45]"
                  />
                </div>

                <div className="flex items-center space-x-2 bg-black/60 px-3 py-1.5 rounded-lg border border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsInternal(!isInternal)}
                    className={`text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                      isInternal ? "text-amber-400" : "text-slate-300"
                    }`}
                  >
                    {isInternal ? <Lock size={13} /> : <Globe size={13} />}
                    <span>{isInternal ? "Internal IT Staff Note" : "Public Reply"}</span>
                  </button>
                </div>
              </div>

              <textarea
                rows="3"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                placeholder={isInternal ? "Type private internal notes for IT technicians..." : "Type response to user..."}
                className={`w-full p-3.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                  isInternal 
                    ? "bg-amber-950/20 border-amber-500/30 text-amber-200 placeholder:text-amber-500/50" 
                    : "bg-black/60 border-white/10 text-slate-200 placeholder:text-slate-500"
                }`}
              ></textarea>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingComment}
                  className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${
                    isInternal
                      ? "bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20"
                      : "bg-gradient-to-r from-[#73BF45] to-[#5DA533] hover:brightness-110 text-white shadow-[#73BF45]/25"
                  }`}
                >
                  <Send size={14} />
                  <span>{submittingComment ? "Posting..." : isInternal ? "Post Internal Note" : "Post Reply"}</span>
                </button>
              </div>
            </form>

          </div>
        </div>

        {/* Right Sidebar Controls & Metadata (1 Col) */}
        <div className="space-y-6">
          
          {/* Status & Assignment Box */}
          <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
              Ticket Control
            </h3>

            {/* Status Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Current Status</label>
              <select
                value={ticket.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer focus:outline-none ${
                  ticket.status === 'Open' ? 'bg-[#73BF45]/20 text-[#68D725] border border-[#73BF45]/40' :
                  ticket.status === 'In Progress' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                  'bg-[#68D725]/20 text-[#68D725] border border-[#68D725]/40'
                }`}
              >
                <option value="Open" className="bg-[#1F1F1F] text-[#68D725]">Open</option>
                <option value="In Progress" className="bg-[#1F1F1F] text-amber-400">In Progress</option>
                <option value="Resolved" className="bg-[#1F1F1F] text-[#68D725]">Resolved</option>
              </select>
            </div>

            {/* Priority Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Priority Level</label>
              <select
                value={ticket.priority}
                onChange={(e) => handlePriorityChange(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs font-semibold focus:outline-none focus:border-[#73BF45] cursor-pointer"
              >
                <option value="Critical" className="bg-[#1F1F1F]">Critical - Urgent</option>
                <option value="High" className="bg-[#1F1F1F]">High Priority</option>
                <option value="Medium" className="bg-[#1F1F1F]">Medium Priority</option>
                <option value="Low" className="bg-[#1F1F1F]">Low Priority</option>
              </select>
            </div>

            {/* Assigned Specialist */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Assigned IT Technician</label>
              <select
                value={ticket.assignedTo || ""}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs font-semibold focus:outline-none focus:border-[#73BF45] cursor-pointer"
              >
                <option value="" className="bg-[#1F1F1F]">-- Unassigned --</option>
                {ASSIGNEES.map((tech) => (
                  <option key={tech} value={tech} className="bg-[#1F1F1F]">{tech}</option>
                ))}
              </select>
            </div>
          </div>

          {/* User & Department Info Card */}
          <div className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
              Requester Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#73BF45]/20 text-[#68D725] border border-[#73BF45]/30 flex items-center justify-center font-bold">
                  {ticket.requester.substring(0,1).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-slate-100">{ticket.requester}</div>
                  <div className="text-slate-400 text-[11px]">{ticket.contactEmail}</div>
                </div>
              </div>

              <div className="pt-2 space-y-2 border-t border-white/10 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Department:</span>
                  <span className="font-semibold text-slate-200">{ticket.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Scope of Impact:</span>
                  <span className="font-semibold text-slate-200">{ticket.impact || "Individual"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Updated:</span>
                  <span className="font-semibold text-slate-300">{new Date(ticket.updatedAt).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
