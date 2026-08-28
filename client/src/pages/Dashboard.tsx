import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "wouter";
import {
  Bell,
  ChevronRight,
  CloudSun,
  Droplets,
  Leaf,
  LoaderCircle,
  MapPin,
  Menu,
  ScanLine,
  Sprout,
  Store,
  UserRound,
  Wind,
  Wheat,
  X,
  BookOpen,
  Layers,
  Sparkles,
  Globe,
  HelpCircle,
  GripVertical,
  MoveUp,
  MoveDown,
  RotateCcw,
  Eye,
  Settings,
  Mic,
  ArrowRight,
  Check
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocationContext } from "@/contexts/LocationContext";
import { useUiEditContext } from "@/contexts/UiEditContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { dashboardApi, weatherApi, cropsApi, type DashboardSummary, type DashboardWeather, type CropRegistration } from "@/lib/api";
import EditableFrame from "@/components/EditableFrame";
import AdminTicketsNoticeBoard from "@/components/AdminTicketsNoticeBoard";

// Lazy-load dnd-kit grid — only loaded when admin edit mode is active
const DndDashboardGrid = lazy(() => import("@/components/DndDashboardGrid"));

const fieldImage = "/images/agroscan-hero-landing.jpg";

function BrandMark() {
  return (
    <EditableFrame id="brand_mark_frame" className="h-9 w-9 rounded-2xl bg-[#e5eddc] p-1.5 shadow-sm">
      <Leaf size={22} className="text-[#2f6b45]" />
    </EditableFrame>
  );
}

interface TileDefinition {
  id: string;
  defaultTitleKey: string;
  defaultDescKey: string;
  href: string;
  icon: any;
  tone: string;
}

const MASTER_TILES: Record<string, TileDefinition> = {
  tool_scan: { id: "tool_scan", defaultTitleKey: "tool_scan_title", defaultDescKey: "tool_scan_desc", href: "/detection", icon: ScanLine, tone: "green" },
  tool_stores: { id: "tool_stores", defaultTitleKey: "tool_stores_title", defaultDescKey: "tool_stores_desc", href: "/stores", icon: Store, tone: "oat" },
  tool_weather: { id: "tool_weather", defaultTitleKey: "tool_weather_title", defaultDescKey: "tool_weather_desc", href: "/weather", icon: CloudSun, tone: "sky" },
  tool_soil: { id: "tool_soil", defaultTitleKey: "tool_soil_title", defaultDescKey: "tool_soil_desc", href: "/soil-recommendation", icon: Layers, tone: "clay" },
  tool_kb: { id: "tool_kb", defaultTitleKey: "tool_kb_title", defaultDescKey: "tool_kb_desc", href: "/knowledge-base", icon: BookOpen, tone: "blue" },
  tool_plan: { id: "tool_plan", defaultTitleKey: "tool_plan_title", defaultDescKey: "tool_plan_desc", href: "/my-crops", icon: Wheat, tone: "green" },
  tool_reg: { id: "tool_reg", defaultTitleKey: "tool_reg_title", defaultDescKey: "tool_reg_desc", href: "/crop-registration", icon: Sprout, tone: "clay" },
  tool_notif: { id: "tool_notif", defaultTitleKey: "tool_notif_title", defaultDescKey: "tool_notif_desc", href: "/notifications", icon: Bell, tone: "oat" },
  tool_help: { id: "tool_help", defaultTitleKey: "tool_help_title", defaultDescKey: "tool_help_desc", href: "/help-desk", icon: HelpCircle, tone: "blue" },
};

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { location, setShowLocationModal } = useLocationContext();
  const { language, setLanguage, languages, t } = useLanguage();
  const {
    isAdminAuthenticated,
    isEditMode,
    setIsEditMode,
    isPreviewAsFarmer,
    setIsPreviewAsFarmer,
    gridOrder,
    setGridOrder,
    getCustomization,
    resetToDefaultLayout,
    setShowProfileSettingsModal,
  } = useUiEditContext();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [weather, setWeather] = useState<DashboardWeather | null>(null);
  const [registeredCrops, setRegisteredCrops] = useState<CropRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardApi.summary(), weatherApi.dashboard()])
      .then(([summaryData, weatherData]) => {
        setSummary(summaryData);
        setWeather(weatherData);
      })
      .finally(() => setLoading(false));
  }, []);

  // Load registered crops for dynamic suggestion chips
  useEffect(() => {
    cropsApi.list()
      .then((crops) => {
        if (Array.isArray(crops)) setRegisteredCrops(crops);
      })
      .catch(() => {});
  }, []);

  const userName = summary?.userName || user?.fullName?.split(" ")[0] || "Farmer";
  const showNotificationDot = (summary?.unreadNotifications || 0) > 0;
  const isUserAdmin = isAdminAuthenticated || user?.role === "admin";
  const showEditControls = isUserAdmin && isEditMode && !isPreviewAsFarmer;

  // Move tile in grid order array (fallback for non-dnd mode)
  const moveTile = (index: number, direction: "up" | "down") => {
    const nextOrder = [...gridOrder];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= nextOrder.length) return;
    const temp = nextOrder[index];
    nextOrder[index] = nextOrder[targetIdx];
    nextOrder[targetIdx] = temp;
    setGridOrder(nextOrder);
  };

  // Generate dynamic crop suggestion chips for the greeting banner
  const dynamicChips = registeredCrops.length > 0
    ? registeredCrops.slice(0, 3).flatMap((c) => [
        `How to control pests in ${c.cropName}?`,
        `Best fertilizer for ${c.cropName}?`,
      ]).slice(0, 4)
    : [
        "How to control Leaf Blast in Paddy?",
        "Best fertilizer for Maize crop?",
        "When to irrigate Tomato crop?",
        "How to prevent Pink Bollworm in Cotton?"
      ];

  const navItems = [
    { label: t("dashboard"), href: "/dashboard", icon: Leaf },
    { label: t("register_crop"), href: "/crop-registration", icon: Sprout },
    { label: t("my_crops"), href: "/my-crops", icon: Wheat },
    { label: t("scan_leaf"), href: "/detection", icon: ScanLine },
    { label: t("weather"), href: "/weather", icon: CloudSun },
    { label: t("notifications"), href: "/notifications", icon: Bell },
    { label: t("knowledge_base"), href: "/knowledge-base", icon: BookOpen },
    { label: t("stores_near_me"), href: "/stores", icon: Store },
    { label: t("soil_recommender"), href: "/soil-recommendation", icon: Layers },
    { label: t("help_desk"), href: "/help-desk", icon: HelpCircle },
  ];

  // Render individual dashboard tool card
  const renderTile = (tileId: string, index: number) => {
    const def = MASTER_TILES[tileId] || {
      id: tileId,
      defaultTitleKey: "dashboard",
      defaultDescKey: "dashboard",
      href: "/dashboard",
      icon: Leaf,
      tone: "green"
    };

    const Icon = def.icon;
    const custom = getCustomization(tileId);

    // Apply custom text if saved, else fallback to i18n translated string
    const titleText = custom?.title || t(def.defaultTitleKey as any) || def.id;
    const descText = custom?.subtitle || t(def.defaultDescKey as any) || "";
    const badgeText = custom?.badgeText || null;

    return (
      <div className="relative group/card h-full">
        {/* Quick Up/Down Controls for Admin */}
        {showEditControls && (
          <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-black/70 rounded-lg p-1 text-white opacity-0 group-hover/card:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); moveTile(index, "up"); }}
              disabled={index === 0}
              className="p-1 hover:bg-white/20 rounded disabled:opacity-30 cursor-pointer"
              title="Move left/up"
            >
              <MoveUp size={12} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); moveTile(index, "down"); }}
              disabled={index === gridOrder.length - 1}
              className="p-1 hover:bg-white/20 rounded disabled:opacity-30 cursor-pointer"
              title="Move right/down"
            >
              <MoveDown size={12} />
            </button>
            <span className="text-[10px] px-1 font-mono text-emerald-400">#{index + 1}</span>
          </div>
        )}

        <Link
          href={showEditControls ? "#" : def.href}
          onClick={(e) => {
            if (showEditControls) {
              e.preventDefault();
            }
          }}
          className="block no-underline h-full"
        >
          <div className="h-full">
            <EditableFrame
              id={tileId}
              className="h-full transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
            >
              <div className={`tool-card-modern tool-card-${def.tone} p-6 flex flex-col justify-between h-full min-h-[170px]`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="tool-icon-wrap flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                      <Icon size={24} className="text-[#2f6b45]" />
                    </span>
                    {badgeText ? (
                      <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
                        {badgeText}
                      </span>
                    ) : (
                      <span className="tool-arrow text-[#2f6b45]/60 hover:text-[#2f6b45]">
                        <ChevronRight size={18} />
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#163322]">{titleText}</h3>
                  <p className="text-xs text-[#52705d] mt-1 leading-relaxed">{descText}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#e2e9dc] flex items-center justify-between text-xs font-bold text-[#2f6b45]">
                  <span>{t("open")}</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </EditableFrame>
          </div>
        </Link>
      </div>
    );
  };

  if (authLoading || loading) {
    return (
      <main className="dashboard-shell">
        <div className="dashboard-content" style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
          <LoaderCircle size={32} className="animate-spin text-[#2f6b45]" />
        </div>
      </main>
    );
  }

  const heroCustom = getCustomization("dashboard_hero_panel");
  const heroBgImage = heroCustom?.customImageUrl || fieldImage;
  const overlayDarkness = heroCustom?.overlayDarkness !== undefined ? heroCustom.overlayDarkness : 0.65;

  return (
    <main className="dashboard-shell">
      {/* Sidebar Navigation */}
      <aside className={`dashboard-sidebar ${menuOpen ? "dashboard-sidebar-open" : ""}`}>
        <div className="dashboard-sidebar-inner">
          <div className="dashboard-brand-row">
            <Link href="/" className="brand-lockup flex items-center gap-2" aria-label="AgroScan home">
              <BrandMark />
              <span className="brand-name font-display text-xl font-bold text-[#193625]">{t("app_name")}</span>
            </Link>
            <button type="button" className="dashboard-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X size={18} />
            </button>
          </div>
          <p className="dashboard-side-label">{t("farm_control_desk" as any) || "Farm Control Desk"}</p>
          <nav className="dashboard-side-nav" aria-label="Dashboard navigation">
            {navItems.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href} className={href === "/dashboard" ? "dashboard-side-link dashboard-side-link-active" : "dashboard-side-link"}>
                <Icon size={17} />{label}
              </Link>
            ))}
          </nav>

          <div className="dashboard-side-summary">
            <div>
              <span>{t("my_crops")}</span>
              <strong>{summary?.activeCrops ?? 0}</strong>
            </div>
            <div>
              <span>{t("notifications")}</span>
              <strong>{summary?.unreadNotifications ?? 0}</strong>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="dashboard-main">
        {/* Top bar */}
        <header className="dashboard-topbar">
          <button type="button" className="dashboard-menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation">
            <Menu size={21} />
          </button>
          <div className="dashboard-breadcrumb">
            <span>AgroScan</span><ChevronRight size={14} /><strong>{t("dashboard")}</strong>
          </div>

          <div className="dashboard-top-actions">
            {/* Admin Edit Controls Bar */}
            {isUserAdmin && (
              <div className="flex items-center gap-2 mr-2">
                <button
                  type="button"
                  onClick={() => setIsPreviewAsFarmer(!isPreviewAsFarmer)}
                  className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                    isPreviewAsFarmer
                      ? "bg-emerald-600 text-white shadow"
                      : "bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300"
                  }`}
                  title="Toggle farmer preview mode"
                >
                  <Eye size={13} /> {isPreviewAsFarmer ? t("preview_as_farmer") : t("preview_as_farmer")}
                </button>
                <button
                  type="button"
                  onClick={resetToDefaultLayout}
                  className="flex items-center gap-1 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 text-xs font-bold cursor-pointer"
                  title="Revert to baseline layout"
                >
                  <RotateCcw size={12} /> {t("reset_layout")}
                </button>
              </div>
            )}

            <Link href="/notifications" className="dashboard-icon-button" aria-label="Notifications">
              <Bell size={19} />{showNotificationDot && <span className="dashboard-notification-dot" />}
            </Link>
            <button
              type="button"
              onClick={() => setShowProfileSettingsModal(true)}
              className="dashboard-profile cursor-pointer hover:opacity-85 transition-opacity bg-transparent border-0 text-left p-0"
              title="Profile & Settings"
              aria-label="Profile and settings"
            >
              <span className="dashboard-avatar"><UserRound size={16} /></span>
              <span className="dashboard-profile-name">{userName}</span>
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Hero Banner with Independent Editable Elements */}
          <EditableFrame
            id="dashboard_hero_panel"
            isHeroPanel
            className={`dashboard-hero rounded-3xl shadow-xl mb-6 p-6 sm:p-8 ${showEditControls ? "overflow-visible" : "overflow-hidden"}`}
            style={{
              backgroundImage: `linear-gradient(92deg, rgba(28,61,38,${overlayDarkness + 0.15}) 0%, rgba(28,61,38,${overlayDarkness}) 46%, rgba(28,61,38,${overlayDarkness * 0.4}) 100%), url(${heroBgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Left Copy: Separated and Independently Editable Elements */}
              <div className="dashboard-hero-copy space-y-3 max-w-xl">
                {/* Element 1: Eyebrow Label with Dynamic Date */}
                <EditableFrame id="dashboard_hero_eyebrow" isTextOnly>
                  <p className="dashboard-kicker text-xs font-extrabold uppercase tracking-widest text-emerald-300">
                    {getCustomization("dashboard_hero_eyebrow")?.title ||
                      `AGROSCAN FIELD NOTES · ${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }).toUpperCase()}`}
                  </p>
                </EditableFrame>

                {/* Element 2: Main Dynamic Greeting Heading */}
                <EditableFrame id="dashboard_hero_heading" isTextOnly>
                  <h1 id="dashboard-greeting" className="font-display text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                    {getCustomization("dashboard_hero_heading")?.title || `Hello, ${userName}`}
                  </h1>
                </EditableFrame>

                {/* Element 3: Distinct Voice Assistant Hint Line / Quote */}
                <EditableFrame id="dashboard_hero_voice_hint" isTextOnly>
                  <div className="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 text-xs sm:text-sm font-semibold text-emerald-100 backdrop-blur-md border border-white/20 shadow-sm">
                    <Mic size={15} className="text-amber-400 shrink-0" />
                    <span>
                      {getCustomization("dashboard_hero_voice_hint")?.title ||
                        `Tap the leaf button and say: "Tree, open disease scanner"`}
                    </span>
                  </div>
                </EditableFrame>

                {/* Element 4: Supporting Subtext Line */}
                <EditableFrame id="dashboard_hero_subtext" isTextOnly>
                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed pt-1">
                    {getCustomization("dashboard_hero_subtext")?.subtitle ||
                      "Tree Leaf Voice Assistant is ready. Tap the leaf button to speak!"}
                  </p>
                </EditableFrame>
              </div>

              {/* Right Side: GPS Live Weather & Spray Card (Separately Editable) */}
              <div className="shrink-0">
                <EditableFrame id="dashboard_hero_weather_card">
                  <div className="weather-widget bg-white/95 text-[#193625] rounded-3xl p-5 shadow-2xl backdrop-blur border border-white/40 max-w-xs">
                    <div className="weather-widget-top flex items-center justify-between text-xs font-bold text-[#2f6b45] pb-2 border-b border-[#e1ebd5]">
                      <span>{t("gps_live")} {t("weather")} ({location.villageCity})</span>
                      <CloudSun size={20} className="text-amber-500" />
                    </div>
                    <div className="weather-temperature font-display text-4xl font-extrabold text-[#173624] my-2">
                      {weather?.temperature ?? 28}°<small className="text-lg">C</small>
                    </div>
                    <strong className="text-xs font-bold text-[#355741] block">{weather?.condition ?? "Partly cloudy"}</strong>
                    <div className="weather-metrics text-xs text-[#52705d] flex items-center gap-3 my-2">
                      <span className="flex items-center gap-1"><Droplets size={13} className="text-blue-500" /> {weather?.humidity ?? 67}%</span>
                      <span className="flex items-center gap-1"><Wind size={13} className="text-teal-600" /> {weather?.wind ?? 12} km/h</span>
                    </div>
                    <Link href="/weather" className="weather-link text-xs font-bold text-[#2f6b45] flex items-center gap-1 hover:underline pt-2 border-t border-[#e1ebd5] no-underline">
                      Actionable Spray Forecast <ChevronRight size={14} />
                    </Link>
                  </div>
                </EditableFrame>
              </div>
            </div>
          </EditableFrame>

          {/* Admin Reported Problems & Support Notice Board */}
          {isUserAdmin && (
            <section className="mb-8">
              <AdminTicketsNoticeBoard />
            </section>
          )}

          {/* Reorderable & Resizable Tools Grid */}
          <section className="dashboard-section">
            <div className="dashboard-section-heading">
              <div>
                <p className="dashboard-kicker dashboard-kicker-dark">{t("voice_kicker")}</p>
                <h2>{t("tap_leaf_to_speak")}</h2>
              </div>
              <span className="dashboard-section-meta">
                {showEditControls ? t("edit_mode") + " — Drag to Reorder" : `${gridOrder.length} Core Modules`}
              </span>
            </div>

            {/* DnD Grid for Admin Edit Mode, Static Grid for Farmers */}
            {showEditControls ? (
              <Suspense fallback={
                <div className="flex items-center justify-center py-12">
                  <LoaderCircle size={24} className="animate-spin text-amber-500" />
                  <span className="ml-2 text-xs font-bold text-amber-600">Loading Edit Tools...</span>
                </div>
              }>
                <DndDashboardGrid
                  gridOrder={gridOrder}
                  onReorder={setGridOrder}
                  renderTile={renderTile}
                />
              </Suspense>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {gridOrder.map((tileId, index) => {
                  const custom = getCustomization(tileId);
                  const colSpan = custom?.colSpan || 1;
                  const colClass =
                    colSpan === 3
                      ? "lg:col-span-3 md:col-span-2"
                      : colSpan === 2
                      ? "lg:col-span-2 md:col-span-2"
                      : "col-span-1";

                  return (
                    <div key={tileId} className={colClass}>
                      {renderTile(tileId, index)}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <div className="dashboard-footnote mt-8">
            <button type="button" onClick={() => setShowLocationModal(true)} className="inline-flex items-center gap-1 hover:underline cursor-pointer">
              <MapPin size={14} /> {t("farm_location")}: {location.villageCity}, {location.district} ({location.isGps ? t("gps_live") : "Manual"})
            </button>
            <span><CloudSun size={14} /> {t("tool_weather_desc")}</span>
            <button type="button" onClick={() => setShowProfileSettingsModal(true)} className="inline-flex items-center gap-1 hover:underline cursor-pointer text-[#4e6d5a]">
              <Settings size={14} /> {t("profile_settings") || "Settings"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
