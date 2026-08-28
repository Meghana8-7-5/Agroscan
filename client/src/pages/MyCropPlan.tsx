/*
  AgroScan / Field Notes design reminder:
  My Crop Plan should read like an annotated season card: concrete tasks,
  visible progress, calm status colors, and an assistant that stays optional.
*/
import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Droplets,
  Leaf,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Sprout,
  Tractor,
  Wheat,
  X,
} from "lucide-react";

const leafImage = "/manus-storage/agroscan-leaf-stock_de49ea7d.jpg";

const tabs = ["Plan overview", "Timeline", "Irrigation", "Fertilizer", "Pest control", "Harvest"];
const initialTasks = [
  { label: "Land preparation", date: "12 Aug", status: "done" },
  { label: "Seeding", date: "14 Aug", status: "done" },
  { label: "Irrigation", date: "18 Aug", status: "done" },
  { label: "Fertilizer application", date: "24 Aug", status: "upcoming" },
  { label: "Pest control", date: "28 Aug", status: "upcoming" },
  { label: "Weed management", date: "02 Sep", status: "upcoming" },
  { label: "Harvest", date: "15 Nov", status: "upcoming" },
];

const otherCrops = [
  { name: "Maize", place: "Field B", area: "1.8 acres", color: "#e7d9b9" },
  { name: "Chilli", place: "Field C", area: "0.9 acres", color: "#e6cfc4" },
];

function CropMark({ color }: { color?: string }) {
  return <span className="crop-mark" style={{ background: color || "#dfead8" }}><Wheat size={19} /></span>;
}

export default function MyCropPlan() {
  const [activeTab, setActiveTab] = useState("Plan overview");
  const [tasks, setTasks] = useState(initialTasks);
  const [assistantOpen, setAssistantOpen] = useState(true);
  const completed = useMemo(() => tasks.filter((task) => task.status === "done").length, [tasks]);
  const progress = Math.round((completed / tasks.length) * 100);

  const toggleTask = (index: number) => setTasks((current) => current.map((task, taskIndex) => taskIndex === index ? { ...task, status: task.status === "done" ? "upcoming" : "done" } : task));

  return (
    <main className="workspace-page crop-plan-page">
      <header className="workspace-topbar">
        <Link href="/dashboard" className="workspace-back"><ArrowLeft size={17} /> <span>Back to dashboard</span></Link>
        <div className="workspace-brand"><span className="workspace-brand-mark"><Leaf size={17} /></span><span>AgroScan</span></div>
        <span className="workspace-top-context">My crops / Field desk</span>
      </header>

      <div className="workspace-content">
        <div className="workspace-heading-row"><div><p className="dashboard-kicker dashboard-kicker-dark">My crop plan / Village A</p><h1 className="workspace-title">Keep the season moving.</h1><p className="workspace-lede">A clear view of what’s growing, what’s next, and where a little attention can help.</p></div><button type="button" className="workspace-heading-action" onClick={() => setAssistantOpen((open) => !open)}>{assistantOpen ? <X size={17} /> : <MessageCircle size={17} />} <span>{assistantOpen ? "Close assistant" : "Ask AgroScan"}</span></button></div>

        <section className="current-crop-card" aria-labelledby="current-crop-title">
          <div className="current-crop-image"><img src={leafImage} alt="Close-up of a healthy crop leaf" /><span>Current crop</span></div>
          <div className="current-crop-copy"><div className="current-crop-label"><span className="status-dot" /> Growing now</div><h2 id="current-crop-title">Tomato / BPT notes</h2><div className="crop-meta-row"><span><Wheat size={14} /> 2.5 acres</span><span><CalendarDays size={14} /> Started 14 Aug 2026</span></div><p>Field A · Guntur, Andhra Pradesh</p><Link href="/crop-registration" className="text-link">View crop details <ArrowUpRightIcon /></Link></div>
          <Link href="/crop-registration" className="current-crop-action"><Plus size={17} /> Register new crop</Link>
        </section>

        <section className="other-crops-section" aria-labelledby="other-crops-title"><div className="subsection-heading"><div><p className="dashboard-kicker dashboard-kicker-dark">Two other field notes</p><h2 id="other-crops-title">Other registered crops</h2></div><button type="button" className="quiet-icon-button" aria-label="More crop actions"><MoreHorizontal size={19} /></button></div><div className="other-crops-row">{otherCrops.map((crop) => <Link href="/crop-registration" className="other-crop-card" key={crop.name}><CropMark color={crop.color} /><div><strong>{crop.name}</strong><span>{crop.place} · {crop.area}</span></div><ChevronRight size={16} /></Link>)}<Link href="/crop-registration" className="other-crop-add"><Plus size={18} /><span>Add a field note</span></Link></div></section>

        <div className={`crop-plan-layout ${assistantOpen ? "crop-plan-layout-assistant" : ""}`}>
          <section className="plan-card" aria-labelledby="plan-title">
            <div className="plan-card-heading"><div><p className="dashboard-kicker dashboard-kicker-dark">Crop plan &amp; checklist</p><h2 id="plan-title">What’s next in the field?</h2></div><div className="plan-progress"><span className="plan-progress-ring" style={{ background: `conic-gradient(#2f6b45 ${progress * 3.6}deg, #dfead8 0deg)` }}><span>{progress}%</span></span><span>{completed} of {tasks.length} tasks done</span></div></div>
            <div className="plan-tabs" role="tablist" aria-label="Crop plan sections">{tabs.map((tab) => <button type="button" role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? "plan-tab plan-tab-active" : "plan-tab"} key={tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div>
            <div className="plan-tab-note"><CircleHelp size={14} /> {activeTab === "Plan overview" ? "Your next task is ready below." : `${activeTab} notes will be connected to your field timeline soon.`}</div>
            <div className="task-list">{tasks.map((task, index) => <button type="button" className={`task-row ${task.status === "done" ? "task-row-done" : ""}`} key={task.label} onClick={() => toggleTask(index)}><span className="task-status">{task.status === "done" ? <Check size={14} /> : <span />}</span><span className="task-label"><strong>{task.label}</strong><small>{task.status === "done" ? "Completed" : "Upcoming"}</small></span><span className="task-date">{task.date}</span><ChevronRight size={15} /></button>)}</div>
            <button type="button" className="plan-full-button">View full plan <ArrowRight size={16} /></button>
          </section>

          {assistantOpen && <aside className="crop-assistant-panel"><div className="assistant-panel-top"><span className="assistant-panel-icon"><MessageCircle size={18} /></span><button type="button" className="quiet-icon-button" onClick={() => setAssistantOpen(false)} aria-label="Close assistant"><X size={17} /></button></div><p className="dashboard-kicker dashboard-kicker-dark">AI Bot Assistant</p><h2>Ask about this crop.</h2><p className="assistant-panel-copy">Start with a short question. I’ll keep the answer practical.</p><div className="assistant-question-list"><button type="button">How do I control leaf blight in paddy? <ChevronRight size={14} /></button><button type="button">Best fertilizer for maize? <ChevronRight size={14} /></button><button type="button">When should I irrigate? <ChevronRight size={14} /></button></div><Link href="/ai-voice-assistant" className="assistant-panel-link">Ask a different question <ArrowRight size={15} /></Link></aside>}
        </div>

        <div className="workspace-footnote"><Sprout size={15} /> Tap a task to mark it complete. This plan is a simple field guide, not a replacement for the product label or local expert advice.</div>
      </div>
    </main>
  );
}

function ArrowUpRightIcon() {
  return <ArrowRight size={14} className="inline-rotate-arrow" />;
}
