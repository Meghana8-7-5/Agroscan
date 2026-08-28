import { useLocation } from "wouter";
import {
  X,
  User,
  ShieldCheck,
  ArrowRight,
  Sprout,
  Sparkles,
  Lock
} from "lucide-react";
import { useUiEditContext } from "../contexts/UiEditContext";

export default function RoleSelectModal() {
  const [, setLocation] = useLocation();
  const {
    showRoleSelectModal,
    setShowRoleSelectModal,
    setShowAdminAuthModal
  } = useUiEditContext();

  if (!showRoleSelectModal) return null;

  const handleSelectFarmer = () => {
    setShowRoleSelectModal(false);
    setLocation("/register");
  };

  const handleSelectAdmin = () => {
    setShowRoleSelectModal(false);
    setShowAdminAuthModal(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl border-2 border-[#d8e0cc] bg-[#fafaf7] p-6 shadow-2xl space-y-6 text-[#1c3827]">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#e1e6d7] pb-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#e5eddc] text-[#2f6b45]">
              <Sprout size={20} />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold text-[#173624]">Welcome to AgroScan</h2>
              <p className="text-xs text-[#52705d] font-medium">Choose how you would like to continue</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowRoleSelectModal(false)}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2 Role Choice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Farmer */}
          <button
            type="button"
            onClick={handleSelectFarmer}
            className="group relative flex flex-col justify-between rounded-3xl border-2 border-[#c8d8bd] bg-white p-5 text-left shadow-md hover:border-[#2f6b45] hover:shadow-xl hover:bg-[#f6faf1] transition-all duration-200 cursor-pointer"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2f6b45] text-white shadow group-hover:scale-105 transition-transform">
                  <User size={24} />
                </span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide">
                  Public
                </span>
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#163322]">Continue as Farmer</h3>
                <p className="mt-1 text-xs text-[#4d6b58] leading-relaxed">
                  Access crop planning, leaf disease scanning, weather alerts &amp; AI voice assistant.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#e2e8d7] pt-3 text-xs font-bold text-[#2f6b45] group-hover:translate-x-1 transition-transform">
              <span>Register / Login</span>
              <ArrowRight size={15} />
            </div>
          </button>

          {/* Card 2: Admin */}
          <button
            type="button"
            onClick={handleSelectAdmin}
            className="group relative flex flex-col justify-between rounded-3xl border-2 border-amber-300 bg-white p-5 text-left shadow-md hover:border-amber-500 hover:shadow-xl hover:bg-amber-50/50 transition-all duration-200 cursor-pointer"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-gray-950 shadow group-hover:scale-105 transition-transform">
                  <ShieldCheck size={24} />
                </span>
                <span className="rounded-full bg-amber-200 text-amber-900 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1">
                  <Lock size={10} /> Protected
                </span>
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#163322]">Continue as Admin</h3>
                <p className="mt-1 text-xs text-[#4d6b58] leading-relaxed">
                  Unlock site-wide Edit Mode to customize text, colors, layouts &amp; upload hero photos.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-amber-200 pt-3 text-xs font-bold text-amber-800 group-hover:translate-x-1 transition-transform">
              <span>Admin Portal Login</span>
              <ArrowRight size={15} />
            </div>
          </button>
        </div>

        {/* Footnote */}
        <p className="text-center text-[11px] font-semibold text-[#5a7864]">
          Admin accounts are provisioned separately with authorized credentials.
        </p>
      </div>
    </div>
  );
}
