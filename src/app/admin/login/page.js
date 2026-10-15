"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, User, KeyRound, Lock } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("Maxim Agri");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('adminAuth') === 'true') {
      router.replace('/admin');
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      (username.trim().toLowerCase() === "maxim agri" || username.trim().toLowerCase() === "maxim agri limited") &&
      password === 'Samakgro!25*'
    ) {
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminUser', 'Maxim Agri');
      router.replace('/admin');
    } else {
      setError('Invalid Admin Username or Password. Please try again.');
    }
  };

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

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
              <User size={14} className="text-[#68D725]" />
              <span>User Name</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter Password"
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-[#73BF45] placeholder:text-slate-500 font-medium"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-semibold">
              {error}
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
