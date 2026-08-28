/*
  AgroScan / Field Notes design reminder:
  Weather is a practical field note, not a data wall. Lead with the current farm,
  make each metric readable, and keep “what this means” close to the numbers.
*/
import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  CloudRain,
  CloudSun,
  Droplets,
  Leaf,
  MapPin,
  MoreHorizontal,
  Sun,
  Umbrella,
  Wind,
} from "lucide-react";

const locations = [
  { name: "My Farm", field: "Village A", temp: "28°", condition: "Partly cloudy", humidity: "67%", wind: "12 km/h", rainfall: "34%", icon: CloudSun, tone: "green", note: "Good window for a morning field walk." },
  { name: "Field B", field: "Village A", temp: "29°", condition: "Sunny", humidity: "58%", wind: "10 km/h", rainfall: "18%", icon: Sun, tone: "oat", note: "Keep a little extra water ready today." },
  { name: "Field C", field: "Village A", temp: "27°", condition: "Light rain", humidity: "74%", wind: "14 km/h", rainfall: "62%", icon: CloudRain, tone: "sky", note: "Hold off on spraying until leaves are dry." },
];

const outlook = [
  { day: "Today", icon: CloudSun, temp: "28° / 21°", label: "Partly cloudy" },
  { day: "Wed", icon: CloudRain, temp: "26° / 20°", label: "Light rain" },
  { day: "Thu", icon: Sun, temp: "29° / 21°", label: "Sunny" },
  { day: "Fri", icon: CloudSun, temp: "30° / 22°", label: "Clear morning" },
];

export default function WeatherAnalysis() {
  const [activeLocation, setActiveLocation] = useState(0);
  const location = locations[activeLocation];
  const WeatherIcon = location.icon;

  return (
    <main className="workspace-page weather-page">
      <header className="workspace-topbar">
        <Link href="/dashboard" className="workspace-back"><ArrowLeft size={17} /> <span>Back to dashboard</span></Link>
        <div className="workspace-brand"><span className="workspace-brand-mark"><Leaf size={17} /></span><span>AgroScan</span></div>
        <span className="workspace-top-context">Weather analysis / Field desk</span>
      </header>

      <div className="workspace-content">
        <div className="workspace-heading-row"><div><p className="dashboard-kicker dashboard-kicker-dark">Weather analysis / Tuesday, 28 August</p><h1 className="workspace-title">Plan around the sky.</h1><p className="workspace-lede">A simple weather view for each registered field, so the next crop task arrives at the right time.</p></div><button type="button" className="workspace-heading-action"><MapPin size={16} /> View all locations</button></div>

        <section className="weather-feature-card" aria-labelledby="weather-feature-title"><div className="weather-feature-copy"><p className="dashboard-kicker dashboard-kicker-dark">Selected field / {location.name}</p><h2 id="weather-feature-title">{location.condition} and {location.temp}.</h2><p>{location.note}</p><span className="weather-location"><MapPin size={14} /> {location.field}, Guntur · Updated 10 minutes ago</span></div><div className="weather-feature-icon"><WeatherIcon size={44} /></div><div className="weather-feature-metrics"><div><Droplets size={16} /><span><strong>{location.humidity}</strong>Humidity</span></div><div><Wind size={16} /><span><strong>{location.wind}</strong>Wind</span></div><div><Umbrella size={16} /><span><strong>{location.rainfall}</strong>Rain chance</span></div></div></section>

        <section className="weather-locations-section" aria-labelledby="locations-title"><div className="subsection-heading"><div><p className="dashboard-kicker dashboard-kicker-dark">Registered field notes</p><h2 id="locations-title">My farm / Fields</h2></div><button type="button" className="quiet-icon-button" aria-label="More weather actions"><MoreHorizontal size={19} /></button></div><div className="weather-location-grid">{locations.map((item, index) => { const Icon = item.icon; return <button type="button" key={item.name} className={`weather-location-card weather-location-card-${item.tone} ${activeLocation === index ? "weather-location-card-active" : ""}`} onClick={() => setActiveLocation(index)}><div className="weather-location-top"><span>{item.field}</span><span className="weather-location-card-icon"><Icon size={20} /></span></div><strong>{item.name}</strong><p>{item.condition}</p><div className="weather-location-stats"><span><b>{item.temp}</b>Temp</span><span><b>{item.rainfall}</b>Rain</span></div><span className="weather-card-action">View field details <ChevronRight size={14} /></span></button> })}</div></section>

        <section className="weather-outlook-card" aria-labelledby="outlook-title"><div className="weather-outlook-heading"><div><p className="dashboard-kicker dashboard-kicker-dark">Short forecast</p><h2 id="outlook-title">The next few days.</h2></div><span className="weather-outlook-note"><CalendarDays size={14} /> Useful for crop tasks</span></div><div className="weather-outlook-row">{outlook.map(({ day, icon: Icon, temp, label }) => <div className="weather-outlook-day" key={day}><span>{day}</span><Icon size={20} /><strong>{temp}</strong><small>{label}</small></div>)}</div><Link href="/notifications" className="weather-alert-link">See weather alerts <ArrowRight size={15} /></Link></section>

        <p className="workspace-footnote"><CloudSun size={15} /> Weather is mock data for now. A live weather connection can be added with the backend integration.</p>
      </div>
    </main>
  );
}
