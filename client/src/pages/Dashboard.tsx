/*
  AgroScan / Field Notes design reminder:
  The dashboard is a calm field control room: soft oat canvas, deep ink hierarchy,
  green reserved for healthy action, and every feature opens a real route.
*/
import { useState } from "react";
import { Link } from "wouter";
import {
  Bell,
  Bug,
  ChevronRight,
  CircleHelp,
  CloudRain,
  CloudSun,
  Droplets,
  Leaf,
  Languages,
  MapPin,
  Menu,
  Mic2,
  MoreHorizontal,
  ScanLine,
  Settings2,
  ShieldCheck,
  Sprout,
  Store,
  UserRound,
  Wind,
  Wheat,
  X,
} from "lucide-react";

const fieldImage = "/manus-storage/agroscan-dashboard-field_50abf0ae.jpg";

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><Leaf size={22} /></span>;
}

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Sprout },
  { label: "My crops", href: "/my-crops", icon: Wheat },
  { label: "Notifications", href: "/notifications", icon: Bell },
];

const features = [
  { title: "Crop registration", description: "Add a field and start a crop plan.", href: "/crop-registration", icon: Sprout, tone: "green" },
  { title: "Pest detection", description: "Scan a leaf for early signs.", href: "/pest-detection", icon: Bug, tone: "clay" },
  { title: "Weather analysis", description: "Know what the next days bring.", href: "/weather", icon: CloudSun, tone: "sky" },
  { title: "Market store", description: "Compare useful farm supplies.", href: "/market-store", icon: Store, tone: "oat" },
  { title: "Help desk", description: "Ask a clear question anytime.", href: "/help-desk", icon: CircleHelp, tone: "blue" },
  { title: "My crops", description: "Keep every field in view.", href: "/my-crops", icon: Wheat, tone: "green" },
  { title: "Notifications", description: "See alerts before they matter.", href: "/notifications", icon: Bell, tone: "clay" },
  { title: "AI voice assistant", description: "Talk through a field question.", href: "/ai-voice-assistant", icon: Mic2, tone: "blue" },
  { title: "Language", description: "Choose the language you read best.", href: "/language", icon: Languages, tone: "oat" },
  { title: "More tools", description: "Explore what is coming next.", href: "/more", icon: MoreHorizontal, tone: "green" },
];

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="dashboard-shell">
      <aside className={`dashboard-sidebar ${menuOpen ? "dashboard-sidebar-open" : ""}`}>
        <div className="dashboard-sidebar-inner">
          <div className="dashboard-brand-row">
            <Link href="/" className="brand-lockup" aria-label="AgroScan home"><BrandMark /><span className="brand-name">AgroScan</span></Link>
            <button type="button" className="dashboard-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={18} /></button>
          </div>
          <p className="dashboard-side-label">Your field desk</p>
          <nav className="dashboard-side-nav" aria-label="Dashboard navigation">
            {navItems.map(({ label, href, icon: Icon }) => <Link key={href} href={href} className={href === "/dashboard" ? "dashboard-side-link dashboard-side-link-active" : "dashboard-side-link"}><Icon size={17} />{label}</Link>)}
          </nav>
          <div className="dashboard-side-note"><Leaf size={17} /><p>One clear action today can protect a full row tomorrow.</p></div>
          <div className="dashboard-sidebar-bottom"><Link href="/settings" className="dashboard-side-link"><Settings2 size={17} />Settings</Link><Link href="/" className="dashboard-side-link"><ChevronRight size={17} />Leave dashboard</Link></div>
        </div>
      </aside>
      {menuOpen && <button type="button" className="dashboard-scrim" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <button type="button" className="dashboard-menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={21} /></button>
          <div className="dashboard-breadcrumb"><span>AgroScan</span><ChevronRight size={14} /><strong>Dashboard</strong></div>
          <div className="dashboard-top-actions">
            <label className="sr-only" htmlFor="dashboard-language">Choose language</label>
            <select id="dashboard-language" className="dashboard-language" defaultValue="English"><option>English</option><option>हिन्दी</option><option>తెలుగు</option></select>
            <Link href="/notifications" className="dashboard-icon-button" aria-label="Notifications"><Bell size={19} /><span className="dashboard-notification-dot" /></Link>
            <button type="button" className="dashboard-profile" aria-label="Open farmer profile"><span className="dashboard-avatar"><UserRound size={16} /></span><span className="dashboard-profile-name">Ramesh</span></button>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="dashboard-hero" style={{ backgroundImage: `linear-gradient(92deg, rgba(28,61,38,.87) 0%, rgba(28,61,38,.58) 46%, rgba(28,61,38,.08) 100%), url(${fieldImage})` }} aria-labelledby="dashboard-greeting">
            <div className="dashboard-hero-copy"><p className="dashboard-kicker">Tuesday, 28 August · Field note 06</p><h1 id="dashboard-greeting">Hello, Farmer.<br /><em>What needs your eye today?</em></h1><p>Keep your crops moving with one clear next step at a time.</p></div>
            <div className="weather-widget"><div className="weather-widget-top"><span>Live weather</span><CloudSun size={20} /></div><div className="weather-temperature">28°<small>C</small></div><strong>Partly cloudy</strong><div className="weather-metrics"><span><Droplets size={13} /> 67% humidity</span><span><Wind size={13} /> 12 km/h wind</span></div><Link href="/weather" className="weather-link">View field forecast <ChevronRight size={14} /></Link></div>
          </section>

          <section className="dashboard-section" aria-labelledby="tools-title">
            <div className="dashboard-section-heading"><div><p className="dashboard-kicker dashboard-kicker-dark">Your field desk</p><h2 id="tools-title">Choose what to do next.</h2></div><span className="dashboard-section-meta">10 tools / 01 clear start</span></div>
            <div className="feature-card-grid">
              {features.map(({ title, description, href, icon: Icon, tone }, index) => (
                <Link key={href} href={href} className={`feature-card feature-card-${tone}`}>
                  <div className="feature-card-top"><span className="feature-card-number">0{index + 1}</span><span className="feature-card-icon"><Icon size={21} /></span></div>
                  <div><h3>{title}</h3><p>{description}</p></div><span className="feature-card-arrow"><ChevronRight size={16} /></span>
                </Link>
              ))}
            </div>
          </section>

          <section className="dashboard-assistant" aria-label="AI Bot Assistant">
            <div className="assistant-mark"><ScanLine size={20} /></div><div className="assistant-copy"><p className="dashboard-kicker dashboard-kicker-dark">AI Bot Assistant</p><h2>How can I help you today?</h2><p>Ask about a leaf, a crop task, or the weather.</p></div><Link href="/ai-voice-assistant" className="assistant-button"><Mic2 size={17} /> Tap to speak</Link>
          </section>

          <div className="dashboard-footnote"><span><MapPin size={14} /> My farm / Village A</span><span><CloudRain size={14} /> Rain likely in 3 days</span><span><ShieldCheck size={14} /> Advice is a starting point; check the label before treatment.</span></div>
        </div>
      </section>
    </main>
  );
}
