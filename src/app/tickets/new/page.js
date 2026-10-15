"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, AlertCircle } from "lucide-react";
import { DEPARTMENTS, CATEGORIES, PRIORITIES, IMPACTS } from "@/lib/constants";

export default function NewTicketPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    requester: "Vincent Odana",
    contactEmail: "vincent.odana@maximagri.com",
    department: DEPARTMENTS[0],
    category: "Software Issue",
    priority: "Medium",
    impact: "Individual",
    description: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        // After creating the ticket, redirect to the dashboard with a full page reload to fetch the latest tickets
        window.location.href = '/';
      } else {
        const errorData = await res.json();
        setErrorMsg(errorData.error || "Failed to create ticket");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected connection error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/tickets" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-300 hover:text-white transition-colors mb-4">
          <ArrowLeft size={16} />
          <span>Back to Tickets</span>
        </Link>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Support Request</h1>
        <p className="text-slate-300 text-sm mt-1">Submit a new IT ticket to Maxim Helpdesk for triage and resolution.</p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center space-x-2">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[rgba(38,30,76,0.6)] backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-xl space-y-6">
        
        {/* Requester & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Requester Name</label>
            <input 
              type="text" 
              name="requester"
              value={formData.requester}
              onChange={handleChange}
              placeholder="e.g. Vincent Odana"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-[#73BF45]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Contact Email</label>
            <input 
              type="email" 
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="e.g. vincent.odana@maximagri.com"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-[#73BF45]"
            />
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">Ticket Subject / Title</label>
          <input 
            type="text" 
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-[#73BF45]"
            placeholder="E.g., Cannot access SAP SD transaction VA01 or Printer paper jam 2nd floor"
          />
        </div>

        {/* Department & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Department</label>
            <select name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-[#73BF45]">
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept} className="bg-[#1F1F1F]">{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-[#73BF45]">
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#1F1F1F]">{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Priority & Impact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Priority Level</label>
            <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-[#73BF45]">
              <option value="Low" className="bg-[#1F1F1F]">Low - Minimal workflow impact</option>
              <option value="Medium" className="bg-[#1F1F1F]">Medium - Affects daily tasks</option>
              <option value="High" className="bg-[#1F1F1F]">High - Blocks core work completely</option>
              <option value="Critical" className="bg-[#1F1F1F]">Critical - Major business disruption / SAP outage</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Scope of Impact</label>
            <select name="impact" value={formData.impact} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-[#73BF45]">
              {IMPACTS.map((imp) => (
                <option key={imp} value={imp} className="bg-[#1F1F1F]">{imp}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">Detailed Problem Description</label>
          <textarea 
            rows="5"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-4 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-[#73BF45] resize-none leading-relaxed"
            placeholder="Please detail the issue, steps to reproduce, or exact error code (e.g. SAP-403, Windows OST corrupt)..."
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex justify-end space-x-4 border-t border-white/10">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#73BF45] to-[#5DA533] hover:brightness-110 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg shadow-[#73BF45]/25"
          >
            <Send size={14} />
            <span>{isSubmitting ? "Submitting Request..." : "Submit Ticket"}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
