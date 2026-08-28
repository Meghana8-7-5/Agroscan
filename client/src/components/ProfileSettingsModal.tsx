import {
  X,
  Globe,
  Check,
  LogOut,
  UserRound,
  ShieldAlert,
  Mail,
  Phone
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useUiEditContext } from "../contexts/UiEditContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function ProfileSettingsModal() {
  const { user } = useAuth();
  const {
    isAdminAuthenticated,
    adminEmail,
    showProfileSettingsModal,
    setShowProfileSettingsModal,
    requestLogout,
  } = useUiEditContext();
  const { language, setLanguage, languages, t } = useLanguage();

  if (!showProfileSettingsModal) return null;

  const isUserAdmin = isAdminAuthenticated || user?.role === "admin";
  const displayName = user?.fullName || (adminEmail ? adminEmail.split("@")[0] : null) || (isUserAdmin ? "Admin" : "Farmer");
  const userEmail = user?.email || adminEmail || "";
  const userMobile = user?.phoneNumber || "";

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl border border-[#d8e0cc] bg-white p-6 sm:p-7 shadow-2xl space-y-5 text-[#183624]">
        {/* Header with User Info */}
        <div className="flex items-start justify-between border-b border-[#e5edd8] pb-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ${
              isUserAdmin ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-[#e5eddc] text-[#2f6b45] border border-[#c5d8ba]"
            }`}>
              {isUserAdmin ? <ShieldAlert size={26} /> : <UserRound size={26} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-[#183624]">{displayName}</h3>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                  isUserAdmin
                    ? "bg-amber-500 text-gray-950 shadow-sm"
                    : "bg-[#2f6b45] text-white"
                }`}>
                  {isUserAdmin ? (t("role_admin") || "Admin") : (t("role_farmer") || "Farmer")}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#52705d] mt-1">
                {userEmail && (
                  <span className="flex items-center gap-1">
                    <Mail size={12} className="opacity-70" /> {userEmail}
                  </span>
                )}
                {userMobile && (
                  <span className="flex items-center gap-1">
                    <Phone size={12} className="opacity-70" /> {userMobile}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowProfileSettingsModal(false)}
            className="rounded-xl p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X size={20} />
          </button>
        </div>

        {/* Language Selection Section */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#2f6b45]">
            <Globe size={15} />
            <span>{t("language_settings")}</span>
          </div>
          <p className="text-xs text-[#52705d]">
            Select your preferred regional language for diagnostics, advice, and voice assistance.
          </p>

          <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {languages.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`flex items-center justify-between rounded-xl p-2.5 text-left text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#2f6b45] text-white shadow-sm ring-2 ring-[#2f6b45]/30"
                      : "bg-[#f8faf5] text-[#193625] border border-[#e2e9dc] hover:bg-[#ebf3e6]"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{lang.nativeName}</span>
                    <span className={`text-[10px] font-normal ${isSelected ? "text-emerald-100" : "text-[#62816e]"}`}>
                      {lang.name}
                    </span>
                  </div>
                  {isSelected && <Check size={16} className="text-emerald-200" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions: Logout & Done */}
        <div className="border-t border-[#e5edd8] pt-4 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={requestLogout}
            className="flex-1 py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            title="Log out of current account"
          >
            <LogOut size={15} />
            <span>{t("logout")}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowProfileSettingsModal(false)}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#2f6b45] hover:bg-[#20492f] text-white font-bold text-xs flex items-center justify-center transition-all shadow cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
