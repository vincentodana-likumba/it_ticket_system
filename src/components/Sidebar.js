"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Ticket, 
  PlusCircle, 
  ShieldCheck, 
  PhoneCall,
  BarChart3
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "All Tickets", href: "/tickets", icon: Ticket },
  { name: "New Ticket", href: "/tickets/new", icon: PlusCircle },
  { name: "Admin Board", href: "/admin", icon: ShieldCheck },
  { name: "Monthly Reports", href: "/reports", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full bg-[#141419] border-r border-white/10 text-slate-200 flex flex-col fixed left-0 top-0 z-40 shadow-2xl">
      {/* Brand Header with SAMAKGRO Maxim Official Logo */}
      <div className="p-5 border-b border-white/10 flex items-center space-x-3">
        <img 
          src="/logo.jpg" 
          alt="SAMAKGRO Maxim Logo" 
          className="h-11 w-auto max-w-[120px] rounded-lg object-contain bg-white/95 p-1 border border-[#73BF45]/40 shadow-md"
        />
        <div>
          <h1 className="text-sm font-extrabold text-white tracking-wide leading-tight">MAXIM AGRI <span className="text-[#68D725] font-bold text-[10px] block tracking-widest uppercase">IT Support</span></h1>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
          Service Portal
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-[#73BF45] to-[#5DA533] text-white shadow-md shadow-[#73BF45]/25 font-semibold"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <Icon size={19} className={isActive ? "text-white" : "text-slate-400"} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* System Status & Urgent Contact Box */}
      <div className="p-4 mx-3 mb-2 rounded-2xl bg-black/40 border border-white/10 text-xs">
        <div className="flex items-center space-x-1.5 text-[#68D725] font-semibold mb-1.5">
          <span className="w-2 h-2 rounded-full bg-[#68D725] animate-pulse"></span>
          <span>Help Desk Dispatch</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-tight mb-2">
          For urgent IT support or network outages call:
        </p>
        <a 
          href="tel:0704488632" 
          className="flex items-center justify-center space-x-2 py-1.5 px-3 rounded-xl bg-[#73BF45]/20 hover:bg-[#73BF45]/30 border border-[#73BF45]/40 text-[#68D725] font-extrabold text-xs transition-colors"
        >
          <PhoneCall size={13} />
          <span>0704488632</span>
        </a>
      </div>

      {/* Developer Footer */}
      <div className="px-6 py-3 border-t border-white/10 text-center bg-black/30">
        <div className="text-[11px] text-slate-400 font-medium flex items-center justify-center space-x-1">
          <span>Developed by</span>
          <span className="text-[#68D725] font-bold">Vincent Odana</span>
        </div>
      </div>
    </aside>
  );
}
