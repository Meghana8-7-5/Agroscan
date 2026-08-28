/*
  AgroScan / Field Notes design reminder:
  Notifications are the field desk’s quiet margin notes. Sort them by what helps
  the farmer act today, use severity sparingly, and make every item easy to dismiss.
*/
import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  CheckCheck,
  ChevronRight,
  CloudRain,
  Droplets,
  Leaf,
  MoreHorizontal,
  Sprout,
  Sun,
  Wheat,
  X,
} from "lucide-react";

type NotificationType = "Weather" | "Crop care" | "Detection" | "Plan";
type AlertTone = "high" | "medium" | "quiet";

type Notification = {
  id: number;
  type: NotificationType;
  tone: AlertTone;
  title: string;
  copy: string;
  time: string;
  unread: boolean;
  icon: typeof Bell;
};

const initialNotifications: Notification[] = [
  { id: 1, type: "Weather", tone: "medium", title: "Rain likely in 3 days", copy: "Hold the next spray until the leaves are dry. Check your field again on Thursday morning.", time: "12 min ago", unread: true, icon: CloudRain },
  { id: 2, type: "Crop care", tone: "quiet", title: "Fertilizer application is next", copy: "Your Tomato / BPT notes plan has a task due on 24 August.", time: "1 hr ago", unread: true, icon: Sprout },
  { id: 3, type: "Detection", tone: "high", title: "New leaf scan saved", copy: "Leaf blight was detected in your saved scan with 94% confidence.", time: "Today, 09:42", unread: true, icon: AlertTriangle },
  { id: 4, type: "Weather", tone: "quiet", title: "Warm morning ahead", copy: "The next field walk should be comfortable before 10:00 AM.", time: "Yesterday", unread: false, icon: Sun },
  { id: 5, type: "Plan", tone: "quiet", title: "Crop plan is 43% complete", copy: "Three field tasks are marked done. Tap a task to keep the season moving.", time: "Yesterday", unread: false, icon: Wheat },
  { id: 6, type: "Crop care", tone: "medium", title: "Irrigation check suggested", copy: "Humidity is lower around Field B today. Take a look before the afternoon heat.", time: "22 Aug 2026", unread: false, icon: Droplets },
];

const filters = ["All", "Unread", "Weather", "Crop care", "Detection"];

export default function Notifications() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [notifications, setNotifications] = useState(initialNotifications);
  const [toast, setToast] = useState("");

  const unreadCount = notifications.filter((item) => item.unread).length;
  const visibleNotifications = useMemo(() => notifications.filter((item) => activeFilter === "All" || (activeFilter === "Unread" ? item.unread : item.type === activeFilter)), [activeFilter, notifications]);

  const markRead = (id: number) => setNotifications((current) => current.map((item) => item.id === id ? { ...item, unread: false } : item));
  const markAllRead = () => { setNotifications((current) => current.map((item) => ({ ...item, unread: false }))); setToast("All field notes marked as read"); window.setTimeout(() => setToast(""), 2200); };

  return (
    <main className="workspace-page notifications-page">
      <header className="workspace-topbar">
        <Link href="/dashboard" className="workspace-back"><ArrowLeft size={17} /> <span>Back to dashboard</span></Link>
        <div className="workspace-brand"><span className="workspace-brand-mark"><Leaf size={17} /></span><span>AgroScan</span></div>
        <span className="workspace-top-context">Notifications / Field desk</span>
      </header>

      <div className="workspace-content">
        <div className="workspace-heading-row"><div><p className="dashboard-kicker dashboard-kicker-dark">Field desk / {unreadCount} unread notes</p><h1 className="workspace-title">Keep an eye on things.</h1><p className="workspace-lede">Weather shifts, crop-plan reminders, and scan notes that are worth seeing before the next field walk.</p></div><button type="button" className="workspace-heading-action" onClick={markAllRead}><CheckCheck size={16} /> Mark all as read</button></div>

        <section className="notification-highlight"><div className="notification-highlight-icon"><Bell size={23} /></div><div><p className="dashboard-kicker dashboard-kicker-dark">The note for today</p><h2>Rain likely in 3 days.</h2><p>Keep the next spray on hold and use the dry morning to check the underside of the leaves.</p></div><Link href="/weather" className="notification-highlight-link">View weather <ArrowRight size={16} /></Link></section>

        <div className="notification-toolbar"><div className="notification-filters" role="tablist" aria-label="Notification filters">{filters.map((filter) => <button type="button" role="tab" aria-selected={activeFilter === filter} className={activeFilter === filter ? "notification-filter notification-filter-active" : "notification-filter"} key={filter} onClick={() => setActiveFilter(filter)}>{filter}{filter === "Unread" && unreadCount > 0 && <span>{unreadCount}</span>}</button>)}</div><button type="button" className="quiet-icon-button" aria-label="More notification actions"><MoreHorizontal size={19} /></button></div>

        <section className="notification-list" aria-live="polite"><div className="notification-list-heading"><span>{activeFilter === "All" ? "All field notes" : activeFilter}</span><span>{visibleNotifications.length} notes</span></div>{visibleNotifications.length > 0 ? visibleNotifications.map((item) => <NotificationRow key={item.id} item={item} onRead={() => markRead(item.id)} />) : <div className="notification-empty"><span><Check size={20} /></span><h2>Nothing needs your attention here.</h2><p>Try another filter or take a quiet field walk.</p></div>}</section>

        <section className="notification-preferences"><div><p className="dashboard-kicker dashboard-kicker-dark">A calmer field desk</p><h2>Choose what reaches you.</h2><p>Notification preferences will connect to your account when the backend is added.</p></div><button type="button" className="notification-preferences-button">Manage preferences <ChevronRight size={15} /></button></section>
        <p className="workspace-footnote"><Leaf size={15} /> Alerts are mock data for now. Always use the product label and local agronomy guidance for treatment decisions.</p>
      </div>
      {toast && <div className="notification-toast"><Check size={15} /> {toast}<button type="button" onClick={() => setToast("")} aria-label="Dismiss message"><X size={14} /></button></div>}
    </main>
  );
}

function NotificationRow({ item, onRead }: { item: Notification; onRead: () => void }) {
  const Icon = item.icon;
  return <article className={`notification-row ${item.unread ? "notification-row-unread" : ""}`}><span className={`notification-row-icon notification-row-icon-${item.tone}`}><Icon size={18} /></span><div className="notification-row-copy"><div className="notification-row-meta"><span>{item.type}</span><span>{item.time}</span>{item.unread && <b>New</b>}</div><h2>{item.title}</h2><p>{item.copy}</p><div className="notification-row-actions">{item.type === "Weather" ? <Link href="/weather">View field weather <ArrowRight size={14} /></Link> : item.type === "Detection" ? <Link href="/pest-detection">View scan <ArrowRight size={14} /></Link> : <Link href="/my-crops">Open crop plan <ArrowRight size={14} /></Link>}{item.unread && <button type="button" onClick={onRead}>Mark as read</button>}</div></div><ChevronRight className="notification-row-chevron" size={17} /></article>;
}
