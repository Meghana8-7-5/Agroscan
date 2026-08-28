/*
  AgroScan / Field Notes design reminder:
  Lead with documentary crop imagery and an asymmetric editorial story.
  Keep copy plain, actions explicit, and the leaf-notch motif visible in every key action.
*/
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
} from "lucide-react";

const heroImage = "/manus-storage/agroscan-hero_49ce3f01.png";
const farmerImage = "/manus-storage/agroscan-farmer-stock_130c484b.jpeg";
const leafImage = "/manus-storage/agroscan-leaf-stock_de49ea7d.jpg";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Disease library", href: "/disease-library" },
  { label: "Pest guide", href: "/pest-guide" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

const features = [
  { icon: ScanLine, title: "AI detection", text: "Accurate & fast" },
  { icon: ShieldCheck, title: "Expert guidance", text: "Trusted advice" },
  { icon: Sprout, title: "Better yield", text: "Higher productivity" },
];

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><Leaf size={23} /></span>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="container site-header-inner">
          <Link href="/" className="brand-lockup" aria-label="AgroScan home">
            <BrandMark />
            <span>
              <span className="brand-name">AgroScan</span>
              <span className="brand-kicker">Smart field notes</span>
            </span>
          </Link>

          <nav className="site-nav" aria-label="Primary navigation">
            {navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </nav>

          <div className="header-actions">
            <label className="sr-only" htmlFor="language">Select language</label>
            <select id="language" className="language-select" defaultValue="English" aria-label="Select language">
              <option>English</option>
              <option>हिन्दी</option>
              <option>తెలుగు</option>
            </select>
            <Link href="/register" className="header-cta">Get started</Link>
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
          <div className="container mt-4 border-t border-[#dfe4d5] pt-3 lg:hidden">
            <nav className="grid gap-1" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-bold text-[#34543e] no-underline hover:bg-[#e5eddc]">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main>
        <section className="hero-wrap" aria-labelledby="hero-title">
          <div className="container">
            <div className="hero-grid">
              <div className="hero-copy">
                <p className="eyebrow"><Leaf size={14} strokeWidth={2.3} /> Crop care, made clearer</p>
                <h1 id="hero-title" className="hero-title text-balance">
                  <span className="hero-line">Spot the problem</span>
                  <span className="hero-line">before the field</span>
                  <em>feels it.</em>
                </h1>
                <p className="hero-description">Take a photo of an affected leaf and see the likely issue, severity, and next step — before a small sign becomes a lost row.</p>
                <div className="hero-actions">
                  <Link href="/detection" className="primary-button"><span className="cta-mark"><Leaf size={14} /></span> Scan a leaf</Link>
                  <Link href="#about" className="secondary-button">See how it helps <ArrowRight size={16} /></Link>
                </div>
              </div>

              <div className="hero-visual" aria-label="Illustration of a crop field with a sample detection result">
                <img className="hero-image" src={heroImage} alt="Sunlit rows of crops with a leaf in the foreground" />
                <span className="hero-index">01</span>
                <div className="contour-lines" aria-hidden="true" />
                <article className="hero-result-card">
                  <div className="result-topline">
                    <span className="result-label"><span className="result-dot" /> Disease detected</span>
                    <span className="result-confidence">94% confident</span>
                  </div>
                  <h2 className="result-name">Leaf blight</h2>
                  <div className="result-meta"><span>Tomato</span><span>Moderate</span></div>
                  <Link href="/detection" className="result-link">Read the treatment steps <ArrowUpRight size={14} /></Link>
                </article>
              </div>
            </div>

            <div className="feature-ribbon" aria-label="AgroScan benefits">
              {features.map(({ icon: Icon, title, text }, index) => (
                <div className="feature-badge" key={title} style={{ animation: `rise-in 650ms ${200 + index * 70}ms var(--ease-out) both` }}>
                  <span className="feature-icon"><Icon size={20} strokeWidth={1.9} /></span>
                  <div><h3>{title}</h3><p>{text}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="editorial-section" aria-labelledby="story-title">
          <div className="container">
            <div className="section-rule"><span>01 / Why AgroScan</span></div>
            <div className="split-story">
              <div className="story-copy">
                <p className="eyebrow">A small check can change a season</p>
                <h2 id="story-title" className="story-title">A better answer starts with one leaf.</h2>
                <p>AgroScan turns a quick phone photo into field-ready guidance. No app install, no complicated dashboard, and no guessing which treatment to try first.</p>
                <div className="story-list">
                  <div className="story-list-item"><span><Check size={12} /></span> Works in any browser, even on older phones</div>
                  <div className="story-list-item"><span><Check size={12} /></span> Shows organic and chemical options side by side</div>
                  <div className="story-list-item"><span><Check size={12} /></span> Helps you act while the crop can still recover</div>
                </div>
              </div>
              <div className="story-photo">
                <img src={farmerImage} alt="Farmer checking leaves in a green crop field" />
                <div className="photo-caption">A clear answer for the next walk through the field.</div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="service-strip" aria-labelledby="services-title">
          <div className="container">
            <div className="section-rule"><span id="services-title">02 / How it works</span></div>
            <div className="service-grid">
              <article className="service-card">
                <span className="service-number">01 / CAPTURE</span>
                <div><h3>Show us the leaf.</h3><p>Use your camera or upload a photo in a few clear taps.</p></div>
              </article>
              <article className="service-card" style={{ backgroundImage: `linear-gradient(120deg, rgba(229,237,220,.96), rgba(229,237,220,.72)), url(${leafImage})`, backgroundPosition: "right center", backgroundSize: "cover" }}>
                <span className="service-number">02 / UNDERSTAND</span>
                <div><h3>Read the signal.</h3><p>See the likely issue, confidence, and severity in plain language.</p></div>
              </article>
              <article className="service-card">
                <span className="service-number">03 / ACT</span>
                <div><h3>Choose the next step.</h3><p>Compare treatment options and keep your crop plan moving.</p></div>
              </article>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-3 text-sm font-bold text-[#4c6654]">
              <CloudSun size={18} className="text-[#2f6b45]" /> Weather, market prices, offline mode, and voice help are coming soon.
              <Link href="/resources" className="inline-flex items-center gap-1 text-[#2f6b45] no-underline hover:underline">Read the roadmap <ArrowUpRight size={14} /></Link>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="site-footer">
        <div className="container footer-inner">
          <div>
            <Link href="/" className="brand-lockup" aria-label="AgroScan home">
              <BrandMark />
              <span className="brand-name">AgroScan</span>
            </Link>
            <p className="footer-note mt-3">A clear next step for every crop walk.</p>
          </div>
          <div className="footer-links">
            <Link href="/register">Register to save a scan</Link>
            <Link href="/login">Log in</Link>
            <Link href="/contact">Ask for help</Link>
            <span className="inline-flex items-center gap-1 text-[#7d8f79]"><Sparkles size={13} /> No subscription</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
