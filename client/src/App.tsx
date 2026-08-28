import { useState } from "react";
import { Link, Route, Switch } from "wouter";
import {
  ArrowLeft,
  Leaf,
  Settings,
  MapPin,
  ShieldAlert,
  LogOut,
  X,
  Eye,
  Save,
  Users,
  Globe,
  UserRound
} from "lucide-react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LocationProvider, useLocationContext } from "./contexts/LocationContext";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import {
  UiEditProvider,
  useUiEditContext
} from "./contexts/UiEditContext";
import Home from "./pages/Home";
import RoleSelection from "./pages/RoleSelection";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CropRegistration from "./pages/CropRegistration";
import MyCropPlan from "./pages/MyCropPlan";
import PestDetection from "./pages/PestDetection";
import WeatherAnalysis from "./pages/WeatherAnalysis";
import Notifications from "./pages/Notifications";
import KnowledgeBase from "./pages/KnowledgeBase";
import StoreLocator from "./pages/StoreLocator";
import SoilRecommendation from "./pages/SoilRecommendation";
import HelpDesk from "./pages/HelpDesk";
import TreeVoiceAssistant from "./components/TreeVoiceAssistant";
import ProfileSettingsModal from "./components/ProfileSettingsModal";
import AdminExitModal from "./components/AdminExitModal";
import EditableFrame from "./components/EditableFrame";

function GlobalTopBar() {
  const { user, isAuthenticated } = useAuth();
  const {
    isAdminAuthenticated,
    adminEmail,
    logoutAdmin,
    isEditMode,
    setIsEditMode,
    requestExitEditMode,
    isPreviewAsFarmer,
    setIsPreviewAsFarmer,
    resetToDefaultLayout,
    saveAllChanges,
    hasUnsavedChanges,
    setShowProfileSettingsModal,
  } = useUiEditContext();
  const { t, currentLangObj } = useLanguage();

  const { location, setShowLocationModal } = useLocationContext();

  const isUserAdmin = isAdminAuthenticated || user?.role === "admin";

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between bg-[#193322] px-4 py-2 text-xs text-white shadow">
      {/* Farm Location Status */}
      <div className="flex items-center gap-2 font-medium">
        <MapPin size={14} className="text-emerald-400" />
        <span>
          <EditableFrame id="global_farm_location_label" isTextOnly className="inline">
            Farm Location:
          </EditableFrame>{" "}
          <strong className="text-white">{location.villageCity}, {location.district}</strong>
          {location.isGps && (
            <EditableFrame id="global_gps_live_badge" isTextOnly className="inline ml-1.5">
              <span className="rounded bg-emerald-700 px-1.5 py-0.5 text-[10px] font-bold text-white">
                GPS Live
              </span>
            </EditableFrame>
          )}
        </span>
        <button
          type="button"
          onClick={() => setShowLocationModal(true)}
          className="ml-1 rounded-lg bg-white/10 px-2 py-0.5 font-bold hover:bg-white/20 text-emerald-200 cursor-pointer"
        >
          Change
        </button>
      </div>

      {/* Top Bar Controls (Admin and Farmer / Settings Profile Trigger) */}
      <div className="flex items-center gap-2">
        {isUserAdmin ? (
          <>
            <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
              <ShieldAlert size={13} /> Admin ({user?.fullName || adminEmail?.split("@")[0] || "Admin"})
            </span>

            {/* Preview As Farmer Toggle */}
            <button
              type="button"
              onClick={() => setIsPreviewAsFarmer(!isPreviewAsFarmer)}
              className={`flex items-center gap-1 rounded-xl px-2.5 py-1 font-bold transition-all cursor-pointer ${
                isPreviewAsFarmer
                  ? "bg-emerald-500 text-white shadow"
                  : "bg-white/10 text-emerald-200 hover:bg-white/20"
              }`}
              title="Toggle farmer preview mode"
            >
              <Eye size={13} /> {isPreviewAsFarmer ? "Farmer View (Active)" : "Preview as Farmer"}
            </button>

            {/* Site-Wide Edit UI Toggle */}
            <button
              type="button"
              onClick={() => {
                if (isEditMode) {
                  requestExitEditMode();
                } else {
                  setIsEditMode(true);
                  setIsPreviewAsFarmer(false);
                }
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1 font-bold transition-all cursor-pointer ${
                isEditMode
                  ? "bg-amber-400 text-gray-950 shadow-md ring-2 ring-amber-300 animate-pulse"
                  : "bg-emerald-700 text-white hover:bg-emerald-600"
              }`}
            >
              <Settings size={14} />
              <span>{isEditMode ? "Exit Edit Mode" : "Edit UI (Site-Wide)"}</span>
            </button>

            {/* Save All Changes Button when in Edit Mode */}
            {isEditMode && hasUnsavedChanges && (
              <button
                type="button"
                onClick={saveAllChanges}
                className="flex items-center gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 font-bold text-[11px] shadow animate-bounce cursor-pointer"
                title="Save all changes to database"
              >
                <Save size={12} /> Save Edits
              </button>
            )}

            {isEditMode && (
              <button
                type="button"
                onClick={resetToDefaultLayout}
                className="flex items-center gap-1 rounded-xl bg-white/10 hover:bg-white/20 text-white px-2 py-1 font-bold text-[10px] cursor-pointer"
                title="Reset all element styles to default"
              >
                Reset All
              </button>
            )}

            <button
              type="button"
              onClick={requestExitEditMode}
              className="flex items-center gap-1 rounded-xl bg-rose-900/80 hover:bg-rose-800 text-white px-2.5 py-1 font-bold border border-rose-700/50 cursor-pointer"
              title="Exit Admin Edit Mode"
            >
              <LogOut size={13} /> Exit
            </button>

            {/* Profile & Settings Menu Trigger for Admin */}
            <button
              type="button"
              onClick={() => setShowProfileSettingsModal(true)}
              className="flex items-center gap-1 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 px-2 py-1 font-bold cursor-pointer"
              title="Profile & Settings"
            >
              <UserRound size={13} />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <span className="text-[11px] font-bold text-emerald-200 hidden sm:flex items-center gap-1">
                <UserRound size={13} className="text-emerald-400" /> {user?.fullName || "Farmer"}
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowProfileSettingsModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 px-2.5 py-1 font-bold transition-all cursor-pointer"
              title="Profile, Language & Logout Settings"
            >
              <Globe size={13} className="text-emerald-400" />
              <span>{currentLangObj?.nativeName || "Language"}</span>
              <Settings size={12} className="text-white/70" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ComingSoon({ title }: { title: string }) {
  return (
    <main className="min-h-screen bg-[#f7f8f4] px-6 py-12 text-[#1c3827] sm:px-10">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center">
        <Link href="/dashboard" className="mb-10 inline-flex w-fit items-center gap-2 text-sm font-bold text-[#2f6b45] no-underline hover:underline">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-[#e5eddc] text-[#2f6b45]">
          <Leaf size={25} />
        </div>
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f6b45]">AgroScan / Roadmap</p>
        <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-[#214433] sm:text-7xl">{title}</h1>
        <p className="mt-6 max-w-lg text-base leading-7 text-[#4f6d5a]">
          This feature is accessible via voice command. Tap the Leaf Assistant button and say "open {title.toLowerCase()}".
        </p>
      </div>
    </main>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <GlobalTopBar />
      <div className="grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/get-started" component={RoleSelection} />
          <Route path="/role-select" component={RoleSelection} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/crop-registration" component={CropRegistration} />
          <Route path="/my-crops" component={MyCropPlan} />
          <Route path="/pest-detection" component={PestDetection} />
          <Route path="/detection" component={PestDetection} />
          <Route path="/weather" component={WeatherAnalysis} />
          <Route path="/notifications" component={Notifications} />
          <Route path="/knowledge-base" component={KnowledgeBase} />
          <Route path="/disease-library" component={KnowledgeBase} />
          <Route path="/pest-guide" component={KnowledgeBase} />
          <Route path="/stores" component={StoreLocator} />
          <Route path="/market-store" component={StoreLocator} />
          <Route path="/soil-recommendation" component={SoilRecommendation} />
          <Route path="/help-desk" component={HelpDesk} />
          <Route path="/support" component={HelpDesk} />
          <Route path="/ai-voice-assistant"><ComingSoon title="AI Voice Assistant" /></Route>
          <Route path="/about"><ComingSoon title="About AgroScan" /></Route>
          <Route path="/services"><ComingSoon title="Services" /></Route>
          <Route path="/contact"><ComingSoon title="Contact" /></Route>
          <Route><ComingSoon title="Page Not Found" /></Route>
        </Switch>
      </div>

      {/* Global Leaf Voice Assistant */}
      <TreeVoiceAssistant />

      {/* Profile, Language & Logout Modal */}
      <ProfileSettingsModal />

      {/* Admin Exit Confirmation Modal */}
      <AdminExitModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <UiEditProvider>
          <LanguageProvider>
            <AppContent />
          </LanguageProvider>
        </UiEditProvider>
      </LocationProvider>
    </AuthProvider>
  );
}
