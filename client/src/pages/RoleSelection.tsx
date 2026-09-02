import { Link, useLocation } from "wouter";
import {
  User,
  ShieldCheck,
  ArrowRight,
  Leaf,
  ArrowLeft,
  Lock
} from "lucide-react";

export default function RoleSelection() {
  const [, setLocation] = useLocation();

  const handleSelectFarmer = () => {
    setLocation("/login?role=farmer");
  };

  const handleSelectAdmin = () => {
    setLocation("/login?role=admin");
  };

  return (
    <main className="min-h-screen bg-[#f7f8f4] px-4 py-8 sm:px-6 lg:px-8 text-[#1c3827] flex flex-col justify-between">
      {/* Top Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-2">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#2f6b45] hover:underline no-underline">
          <ArrowLeft size={16} /> Back to home
        </Link>
        <div className="flex items-center gap-2 font-display text-lg font-bold text-[#193625]">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2f6b45] text-white">
            <Leaf size={18} />
          </span>
          <span>AgroScan</span>
        </div>
      </header>

      {/* Main Choice Box */}
      <div className="max-w-4xl mx-auto w-full my-auto py-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#2f6b45]">
            AgroScan / Choose Account Role
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#173624]">
            How will you use AgroScan?
          </h1>
          <p className="text-sm text-[#4e6b58]">
            Select your account role. Both roles access the full farm advisory features and AI leaf assistant.
          </p>
        </div>

        {/* 2 Equal Choice Cards with Visual Image Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Choice 1: Continue as Farmer */}
          <button
            type="button"
            onClick={handleSelectFarmer}
            className="group relative flex flex-col justify-between rounded-3xl border-2 border-[#ccd8bf] bg-white text-left shadow-lg hover:border-[#2f6b45] hover:shadow-2xl hover:bg-[#f6faf1] transition-all duration-200 cursor-pointer overflow-hidden"
          >
            {/* Top Visual Image Banner */}
            <div className="relative h-36 w-full overflow-hidden">
              <img
                src="/images/farmer-login-visual.jpg"
                alt="Farmer in field"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#163322]/90 via-[#163322]/40 to-transparent flex items-end justify-between p-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2f6b45] text-white shadow-md border border-white/20">
                  <User size={22} />
                </span>
                <span className="rounded-full bg-emerald-500/90 backdrop-blur text-white px-3 py-1 text-xs font-extrabold uppercase tracking-wide shadow-sm border border-emerald-300/30">
                  Farmer Account
                </span>
              </div>
            </div>

            <div className="p-6 space-y-2 grow flex flex-col justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#163322]">
                  Continue as Farmer
                </h2>
                <p className="mt-2 text-xs text-[#4d6b58] leading-relaxed">
                  Register or log in to access personalized crop plans, preventive disease scanning, weather alerts, nearby stores, and AI voice assistant.
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#e2e8d7] pt-4 text-sm font-bold text-[#2f6b45] group-hover:translate-x-1 transition-transform">
                <span>Register / Farmer Login</span>
                <ArrowRight size={17} />
              </div>
            </div>
          </button>

          {/* Choice 2: Continue as Admin (Login Only) */}
          <button
            type="button"
            onClick={handleSelectAdmin}
            className="group relative flex flex-col justify-between rounded-3xl border-2 border-amber-300 bg-white text-left shadow-lg hover:border-amber-500 hover:shadow-2xl hover:bg-amber-50/50 transition-all duration-200 cursor-pointer overflow-hidden"
          >
            {/* Top Visual Image Banner */}
            <div className="relative h-36 w-full overflow-hidden">
              <img
                src="/images/admin-agri-desk.jpg"
                alt="Agronomy operations center"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1a]/90 via-[#1b1c1a]/40 to-transparent flex items-end justify-between p-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-gray-950 shadow-md border border-white/20">
                  <ShieldCheck size={22} />
                </span>
                <span className="rounded-full bg-amber-500/90 backdrop-blur text-gray-950 px-3 py-1 text-xs font-extrabold uppercase tracking-wide shadow-sm flex items-center gap-1 border border-amber-200/50">
                  <Lock size={12} /> Admin Login
                </span>
              </div>
            </div>

            <div className="p-6 space-y-2 grow flex flex-col justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#163322]">
                  Continue as Admin
                </h2>
                <p className="mt-2 text-xs text-[#4d6b58] leading-relaxed">
                  Log in with your pre-provisioned administrator credentials to unlock site-wide Edit Mode (drag tiles, change colors, edit text &amp; photos).
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-amber-200 pt-4 text-sm font-bold text-amber-800 group-hover:translate-x-1 transition-transform">
                <span>Admin Log In</span>
                <ArrowRight size={17} />
              </div>
            </div>
          </button>
        </div>

        {/* Note */}
        <div className="mt-8 text-center text-xs font-semibold text-[#5a7864]">
          Admin accounts are pre-provisioned in the backend. Farmer accounts can self-register anytime.
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center text-[11px] text-[#6b8573] py-4 border-t border-[#e2e7d8]">
        AgroScan — AI Farming Assistant &amp; Agronomic Control Desk © 2026
      </footer>
    </main>
  );
}
