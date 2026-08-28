import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  Check,
  CloudSun,
  Leaf,
  Menu,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Sprout,
  X,
  Mic2,
  Store,
  BookOpen,
  Layers,
  Globe,
  Users
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUiEditContext } from "@/contexts/UiEditContext";
import EditableFrame from "@/components/EditableFrame";
import TreeVoiceAssistant from "@/components/TreeVoiceAssistant";

const heroImage = "/images/agroscan-hero-landing.jpg";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Scan Leaf", href: "/detection" },
  { label: "Knowledge Base", href: "/knowledge-base" },
  { label: "Store Locator", href: "/stores" },
  { label: "Soil Recommender", href: "/soil-recommendation" },
  { label: "Weather Alerts", href: "/weather" },
];

function BrandMark() {
  return (
    <EditableFrame id="home_brand_mark" className="brand-mark h-9 w-9 rounded-2xl bg-[#e5eddc] flex items-center justify-center text-[#2f6b45]">
      <Leaf size={21} />
    </EditableFrame>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { getCustomization } = useUiEditContext();

  const heroCustom = getCustomization("home_hero_section");
  const headlineCustom = getCustomization("home_hero_headline");
  const descCustom = getCustomization("home_hero_desc");

  return (
    <div className="page-shell bg-[#f7f8f4] text-[#1c3827]">
      <header className="site-header sticky top-0 z-40 bg-[#f7f8f4]/95 backdrop-blur border-b border-[#e1e6d7]">
        <div className="container site-header-inner flex items-center justify-between py-4">
          <Link href="/" className="brand-lockup flex items-center gap-2.5 no-underline" aria-label="AgroScan home">
            <BrandMark />
            <span>
              <span className="brand-name font-display text-xl font-extrabold text-[#193625]">AgroScan</span>
              <span className="brand-kicker text-[11px] font-bold uppercase tracking-wider text-[#2f6b45] block">AI Farming Assistant</span>
            </span>
          </Link>

          <nav className="site-nav hidden lg:flex items-center gap-6 text-sm font-bold text-[#2b4c38]" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-[#2f6b45]">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions flex items-center gap-3">
            {/* Get Started -> Direct link to /get-started single role-selection screen */}
            <Link
              href={isAuthenticated ? "/dashboard" : "/get-started"}
              className="rounded-xl bg-[#2f6b45] hover:bg-[#20492f] px-5 py-2.5 text-sm font-bold text-white shadow-md flex items-center gap-1.5 transition-all no-underline"
            >
              <span>{isAuthenticated ? "Open Dashboard" : "Get Started"}</span>
              <ArrowRight size={15} />
            </Link>

            <button
              type="button"
              className="inline-grid h-11 w-11 place-items-center rounded-full border border-[#d8dfca] bg-[#fffdf5] text-[#2f6b45] lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="container mt-2 border-t border-[#dfe4d5] py-3 lg:hidden">
            <nav className="grid gap-1" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-bold text-[#34543e] no-underline hover:bg-[#e5eddc]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section with EditableFrame */}
        <section className="hero-wrap py-12 lg:py-20" aria-labelledby="hero-title">
          <div className="container">
            <div className="hero-grid grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="hero-copy lg:col-span-7 space-y-6">
                <EditableFrame id="home_hero_badge" isTextOnly className="inline-block">
                  <p className="eyebrow inline-flex items-center gap-2 rounded-full bg-[#e5eddc] px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#2f6b45]">
                    <Mic2 size={14} /> Multilingual, Voice-First AI Farming Assistant
                  </p>
                </EditableFrame>

                <EditableFrame id="home_hero_headline" isTextOnly>
                  <h1 id="hero-title" className="hero-title font-display text-4xl sm:text-6xl font-extrabold leading-tight text-[#163322]">
                    {headlineCustom?.title || (
                      <>
                        No typing required.<br />
                        <span className="text-[#2f6b45]">Just ask "Tree"</span> in your language.
                      </>
                    )}
                  </h1>
                </EditableFrame>

                <EditableFrame id="home_hero_desc" isTextOnly>
                  <p className="hero-description text-base sm:text-lg leading-relaxed text-[#4b6957] max-w-xl">
                    {descCustom?.subtitle ||
                      "Scan leaves for general health & specific diseases, get proactive disaster weather warnings, locate nearby chemical stores, and follow stage-by-stage growing plans."}
                  </p>
                </EditableFrame>

                <div className="hero-actions flex flex-wrap items-center gap-4">
                  {/* Primary CTA triggers /get-started single role selection screen */}
                  <Link
                    href={isAuthenticated ? "/dashboard" : "/get-started"}
                    className="primary-button inline-flex items-center gap-2 rounded-2xl bg-[#2f6b45] px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#20492f] transition-all no-underline"
                  >
                    <Sprout size={16} /> Get Started <ArrowRight size={16} />
                  </Link>

                  <Link
                    href="/detection"
                    className="secondary-button inline-flex items-center gap-2 rounded-2xl border border-[#b8caa9] bg-white px-6 py-3.5 text-sm font-bold text-[#244531] hover:bg-[#edf4e6] no-underline"
                  >
                    <ScanLine size={16} /> Scan Leaf Instantly
                  </Link>
                </div>
              </div>

              {/* Hero Image Panel */}
              <div className="hero-visual lg:col-span-5 relative" aria-label="Illustration of crop scanning">
                <EditableFrame id="home_hero_image_frame" isHeroPanel className="rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    className="hero-image rounded-3xl shadow-2xl w-full object-cover max-h-[420px]"
                    src={heroCustom?.customImageUrl || heroImage}
                    alt="Sunlit crop field"
                  />
                </EditableFrame>

                <article className="hero-result-card absolute bottom-4 left-4 right-4 rounded-2xl border border-[#2f6b45]/30 bg-white/95 p-4 shadow-xl backdrop-blur">
                  <div className="result-topline flex items-center justify-between text-xs">
                    <span className="result-label font-bold text-[#2f6b45] flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" /> Tree AI Scan Active
                    </span>
                    <span className="result-confidence font-bold text-emerald-700">96% Confident</span>
                  </div>
                  <h2 className="result-name font-display text-lg font-bold text-[#163322] mt-1">Tomato Late Blight</h2>
                  <p className="text-xs text-[#52705d] mt-0.5">Recommended: Cymoxanil 8% + Mancozeb 64%WP (Curzate @ 600g/acre)</p>
                  <Link href="/detection" className="result-link text-xs font-bold text-[#2f6b45] inline-flex items-center gap-1 mt-2 hover:underline">
                    Read Treatment &amp; Locate Stores <ArrowUpRight size={14} />
                  </Link>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="py-12 bg-white border-y border-[#e1e6d7]">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#2f6b45]">7 Core Pillars of AgroScan</p>
              <h2 className="font-display text-3xl font-bold text-[#183624]">Everything Your Farm Needs By Voice</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <EditableFrame id="home_feature_scan" className="rounded-3xl border border-[#d8e0cc] bg-[#fafcf7] p-6 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2f6b45] text-white">
                  <ScanLine size={22} />
                </div>
                <h3 className="font-display text-xl font-bold text-[#183624]">Plant &amp; Disease Scanning</h3>
                <p className="text-xs text-[#52705d] leading-relaxed">
                  Live camera scan for general health (nutrient/water stress) &amp; specific fungal, bacterial, viral, or insect damage across 37 crops.
                </p>
                <Link href="/detection" className="inline-flex items-center gap-1 text-xs font-bold text-[#2f6b45] hover:underline pt-2">
                  Try Scanning <ArrowRight size={14} />
                </Link>
              </EditableFrame>

              <EditableFrame id="home_feature_stores" className="rounded-3xl border border-[#d8e0cc] bg-[#fafcf7] p-6 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2f6b45] text-white">
                  <Store size={22} />
                </div>
                <h3 className="font-display text-xl font-bold text-[#183624]">Nearby Store Locator</h3>
                <p className="text-xs text-[#52705d] leading-relaxed">
                  Locates nearby agri-input dealers stocking recommended chemicals (Mancozeb, Coragen, Confidor) with stock status, distance, and direction options.
                </p>
                <Link href="/stores" className="inline-flex items-center gap-1 text-xs font-bold text-[#2f6b45] hover:underline pt-2">
                  Locate Dealers <ArrowRight size={14} />
                </Link>
              </EditableFrame>

              <EditableFrame id="home_feature_weather" className="rounded-3xl border border-[#d8e0cc] bg-[#fafcf7] p-6 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2f6b45] text-white">
                  <CloudSun size={22} />
                </div>
                <h3 className="font-display text-xl font-bold text-[#183624]">Weather &amp; Disaster Prevention</h3>
                <p className="text-xs text-[#52705d] leading-relaxed">
                  GPS farm-level weather alerts for heavy rain, flood risk, frost, and hailstorms tied directly to actionable spraying advice.
                </p>
                <Link href="/weather" className="inline-flex items-center gap-1 text-xs font-bold text-[#2f6b45] hover:underline pt-2">
                  Check Farm Forecast <ArrowRight size={14} />
                </Link>
              </EditableFrame>

              <EditableFrame id="home_feature_soil" className="rounded-3xl border border-[#d8e0cc] bg-[#fafcf7] p-6 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2f6b45] text-white">
                  <Layers size={22} />
                </div>
                <h3 className="font-display text-xl font-bold text-[#183624]">Soil-Type Crop Recommender</h3>
                <p className="text-xs text-[#52705d] leading-relaxed">
                  Evaluates 9 soil types (Sandy, Clayey, Black Cotton, Red, Alluvial) to recommend optimal crops, water needs, and yield expectations.
                </p>
                <Link href="/soil-recommendation" className="inline-flex items-center gap-1 text-xs font-bold text-[#2f6b45] hover:underline pt-2">
                  View Soil Recommendations <ArrowRight size={14} />
                </Link>
              </EditableFrame>

              <EditableFrame id="home_feature_kb" className="rounded-3xl border border-[#d8e0cc] bg-[#fafcf7] p-6 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2f6b45] text-white">
                  <BookOpen size={22} />
                </div>
                <h3 className="font-display text-xl font-bold text-[#183624]">Complete 37-Crop Knowledge Base</h3>
                <p className="text-xs text-[#52705d] leading-relaxed">
                  Deep agronomic database for all cereals, pulses, vegetables, fruits, flowers, and tobacco, plus WALES tank-mixing protocols.
                </p>
                <Link href="/knowledge-base" className="inline-flex items-center gap-1 text-xs font-bold text-[#2f6b45] hover:underline pt-2">
                  Open Master Library <ArrowRight size={14} />
                </Link>
              </EditableFrame>

              <EditableFrame id="home_feature_voice" className="rounded-3xl border border-[#d8e0cc] bg-[#fafcf7] p-6 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2f6b45] text-white">
                  <Globe size={22} />
                </div>
                <h3 className="font-display text-xl font-bold text-[#183624]">10 Spoken Languages</h3>
                <p className="text-xs text-[#52705d] leading-relaxed">
                  Full speech recognition and speech synthesis in English, Telugu, Hindi, Tamil, Kannada, Marathi, Punjabi, Bengali, Gujarati, and Malayalam.
                </p>
                <Link
                  href="/get-started"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#2f6b45] hover:underline pt-2"
                >
                  Try Voice Assistant <ArrowRight size={14} />
                </Link>
              </EditableFrame>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer bg-[#173322] py-10 text-white">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <Leaf size={18} className="text-emerald-400" />
            <span>AgroScan — AI Farming Assistant © 2026</span>
          </div>
          <div className="flex gap-6">
            <Link href={isAuthenticated ? "/dashboard" : "/get-started"} className="hover:text-emerald-300">
              Get Started
            </Link>
            <Link href="/detection" className="hover:text-emerald-300">Scan Leaf</Link>
            <Link href="/knowledge-base" className="hover:text-emerald-300">Knowledge Base</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
