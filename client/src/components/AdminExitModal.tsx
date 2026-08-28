import {
  AlertTriangle,
  Save,
  LogOut,
  X,
  ShieldAlert
} from "lucide-react";
import { useUiEditContext } from "../contexts/UiEditContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function AdminExitModal() {
  const {
    showExitConfirmModal,
    hasUnsavedChanges,
    confirmExitEditMode,
    cancelExitEditMode,
    logoutAdmin,
  } = useUiEditContext();
  const { t } = useLanguage();

  if (!showExitConfirmModal) return null;

  const modalTitle = hasUnsavedChanges
    ? (t("logout_confirm_title") || "Exit / Log Out?")
    : "Exit Admin Mode?";
  const warningText = hasUnsavedChanges
    ? (t("unsaved_changes_warning") || "You have unsaved customizations (colors, text, images, or layout).")
    : "Exiting will end your admin session and return you to the AgroScan landing page.";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border-2 border-amber-400 bg-[#fafaf7] p-6 shadow-2xl space-y-4 text-xs text-[#1c3827]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-500 text-gray-950 font-bold">
              <ShieldAlert size={20} />
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-[#1a3826]">{modalTitle}</h3>
              <p className="text-[11px] text-[#52705d] font-semibold">Ends session and returns to visitor landing page</p>
            </div>
          </div>
          <button
            type="button"
            onClick={cancelExitEditMode}
            className="text-gray-400 hover:text-gray-700 rounded-full p-1 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Warning Body */}
        <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-3.5 space-y-1.5">
          <p className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
            <AlertTriangle size={15} className="text-amber-700 shrink-0" />
            {warningText}
          </p>
          <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
            {hasUnsavedChanges
              ? "Choose 'Save & Log Out' to persist your changes for all visitors, or 'Discard & Log Out' to discard uncommitted edits and return to the main landing page."
              : "All your changes are safely stored. You will return to the 'Get Started' landing page."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={cancelExitEditMode}
            className="flex-1 py-2.5 rounded-xl border border-[#c4d6b6] bg-white text-[#244b33] font-bold hover:bg-[#eef5e7] transition-colors cursor-pointer"
          >
            {t("cancel") || "Cancel"}
          </button>

          {hasUnsavedChanges ? (
            <button
              type="button"
              onClick={() => confirmExitEditMode(false)}
              className="flex-1 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 font-bold transition-colors cursor-pointer"
            >
              {t("discard_and_logout") || "Discard & Exit"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => confirmExitEditMode(false)}
              className="flex-1 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold transition-colors cursor-pointer"
            >
              Exit to Home
            </button>
          )}

          <button
            type="button"
            onClick={() => confirmExitEditMode(true)}
            className="flex-1 py-2.5 rounded-xl bg-[#2f6b45] hover:bg-[#20492f] text-white font-extrabold shadow flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save size={13} />
            <span>{hasUnsavedChanges ? (t("save_and_logout") || "Save & Log Out") : "Save & Exit"}</span>
          </button>
        </div>

        {/* Complete logout option */}
        <div className="border-t border-gray-200 pt-3 text-center">
          <button
            type="button"
            onClick={logoutAdmin}
            className="text-[11px] font-bold text-rose-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <LogOut size={12} /> {t("logout") || "Log out"} &amp; Return to Landing Page
          </button>
        </div>
      </div>
    </div>
  );
}
