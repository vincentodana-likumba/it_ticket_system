import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Maxim Service Desk | Enterprise IT Support",
  description: "IT Service Desk & Operations Management Platform for Maxim Agri",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-slate-900 text-slate-100`}
    >
      <body className="min-h-full flex bg-slate-950 text-slate-100 font-sans">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 overflow-y-auto bg-slate-950 min-h-screen text-slate-100">
          {children}
        </main>
      </body>
    </html>
  );
}
