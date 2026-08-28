import { useEffect, useMemo, useState } from "react";
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
  LoaderCircle,
  MoreHorizontal,
  Sprout,
  Sun,
  Wheat,
  X,
  ShieldAlert,
  ShieldCheck,
  FlaskConical
} from "lucide-react";
import { notificationsApi, type ApiNotification } from "@/lib/api";
import EditableFrame from "@/components/EditableFrame";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizeCategory, localizeStatus } from "@/lib/i18n";

type AlertTone = "high" | "medium" | "quiet";
type Notification = ApiNotification & { icon: typeof Bell };

const iconMap: Record<string, typeof Bell> = {
  Weather: CloudRain,
  "Crop care": Sprout,
  Detection: AlertTriangle,
  Plan: Wheat,
  "Pest alert": ShieldAlert,
  "Irrigation": Droplets,
  "Fertilizer": FlaskConical,
};

const NOTIF_STRINGS: Record<string, Record<string, string>> = {
  eyebrow: { en: "Field desk", te: "రైతు సమాచార విభాగం", hi: "खेत डेस्क", ta: "பண்ணை மேசை", kn: "ಕೃಷಿ ಮಾಹಿತಿ ಡೆಸ್ಕ್", mr: "शेत डेस्क", pa: "ਖੇਤ ਡੈਸਕ", bn: "খামার ডেস্ক", gu: "ખેતર ડેસ્ક", ml: "കൃഷി ഡെസ്ക്" },
  title: { en: "Preventive Alerts & Field Notes", te: "ముందస్తు హెచ్చరికలు & సమాచార నోట్స్", hi: "निवारक चेतावनियाँ और खेत नोट्स", ta: "முன்னெச்சரிக்கை எச்சரிக்கைகள் & பண்ணை குறிப்புகள்", kn: "ಮುನ್ನೆಚ್ಚರಿಕೆ ಸಂದೇಶಗಳು & ಜಮೀನು ಮಾಹಿತಿ", mr: "प्रतिबंधात्मक सूचना आणि शेत नोट्स", pa: "ਚੇਤਾਵਨੀਆਂ ਅਤੇ ਖੇਤ ਨੋਟਸ", bn: "সতর্কতা এবং খামার নোট", gu: "ચેતવણીઓ અને ખેતર નોંધો", ml: "മുന്നറിയിപ്പുകളും കൃഷി വിവരങ്ങളും" },
  lede: { en: "Pre-emptive pest vulnerability warnings, weather shifts, and scheduled crop-care tasks.", te: "తెగుళ్ల ముందస్తు హెచ్చరికలు, వాతావరణ మార్పులు మరియు షెడ్యూల్ చేసిన పంట పనులు.", hi: "कीट चेतावनी, मौसम में बदलाव और निर्धारित फसल देखभाल कार्य।", ta: "பூச்சி எச்சரிக்கைகள் மற்றும் திட்டமிடப்பட்ட பயிர் பராமரிப்பு பணிகள்.", kn: "ಕೀಟ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ನಿಗದಿತ ಬೆಳೆ ಆರೈಕೆ ಕೆಲಸಗಳು.", mr: "कीड सूचना आणि नियोजित पीक काळजी कार्ये.", pa: "ਕੀੜੇ ਦੀ ਚੇਤਾਵਨੀ ਅਤੇ ਫਸਲ ਸੰਭਾਲ ਕਾਰਜ।", bn: "কীটপতঙ্গ সতর্কতা এবং নির্ধারিত ফসল যত্ন।", gu: "જીવાત ચેતવણીઓ અને નિર્ધારિત પાક સંભાળ.", ml: "കീടബാധ മുന്നറിയിപ്പുകളും നിശ്ചയിച്ച വിള പരിചരണങ്ങളും." },
  mark_all: { en: "Mark all as read", te: "అన్నీ చదివినట్లు గుర్తించు", hi: "सभी को पढ़ा हुआ चिह्नित करें", ta: "அனைத்தையும் படித்ததாகக் குறிக்கவும்", kn: "ಎಲ್ಲವನ್ನೂ ಓದಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ", mr: "सर्व वाचलेले म्हणून चिन्हांकित करा", pa: "ਸਾਰੇ ਪੜ੍ਹੇ ਵਜੋਂ ਚਿੰਨ੍ਹਿਤ ਕਰੋ", bn: "সব পড়া হয়েছে চিহ্নিত করুন", gu: "બધા વંચાયેલા ચિહ્નિત કરો", ml: "എല്ലാം വായിച്ചതായി അടയാളപ്പെടുത്തുക" },
  priority_notice: { en: "Priority Field Notice", te: "ముఖ్యమైన క్షేత్ర ప్రకటన", hi: "प्राथमिकता खेत सूचना", ta: "முன்னுரிமை பண்ணை அறிவிப்பு", kn: "ಅಗತ್ಯ ಜಮೀನು ಸೂಚನೆ", mr: "प्राधान्य शेत सूचना", pa: "ਤਰਜੀਹੀ ਖੇਤ ਨੋਟਿਸ", bn: "জরুরি খামার নোটিশ", gu: "પ્રાથમિકતા ખેતર નોટિસ", ml: "പ്രധാന അറിയിപ്പ്" },
  view_details: { en: "View details", te: "వివరాలు చూడండి", hi: "विवरण देखें", ta: "விவரங்களைக் காண்க", kn: "ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ", mr: "तपशील पहा", pa: "ਵੇਰਵੇ ਦੇਖੋ", bn: "বিস্তারিত দেখুন", gu: "વિગત જુઓ", ml: "വിവരങ്ങൾ കാണുക" },
  empty_title: { en: "Nothing needs your attention right now.", te: "ప్రస్తుతం ఎలాంటి పెండింగ్ నోటీసులు లేవు.", hi: "इस समय कोई ध्यान देने योग्य सूचना नहीं है।", ta: "தற்போது உங்கள் கவனத்திற்கு எதுவும் இல்லை.", kn: "ಪ್ರಸ್ತುತ ಯಾವುದೇ ಬಾಕಿ ಸೂಚನೆಗಳಿಲ್ಲ.", mr: "सध्या कोणतीही प्रलंबित सूचना नाही.", pa: "ਇਸ ਸਮੇਂ ਕੋਈ ਨੋਟਿਸ ਨਹੀਂ ਹੈ।", bn: "এই মুহূর্তে কোনো নোটিশ নেই।", gu: "હાલમાં કોઈ સૂચના નથી.", ml: "നിലവിൽ അറിയിപ്പുകൾ ഒന്നുമില്ല." },
  empty_sub: { en: "Your crop care schedule is up to date.", te: "మీ పంట సంరక్షణ షెడ్యూల్ సక్రమంగా కొనసాగుతోంది.", hi: "आपकी फसल देखभाल अनुसूची अप-टू-डेट है।", ta: "உங்கள் பயிர் பராமரிப்பு அட்டவணை சரியாக உள்ளது.", kn: "ನಿಮ್ಮ ಬೆಳೆ ಆರೈಕೆ ವೇಳಾಪಟ್ಟಿ ಸರಿಯಾಗಿದೆ.", mr: "तुमचे पीक नियोजन अद्ययावत आहे.", pa: "ਤੁਹਾਡੀ ਫਸਲ ਸਮਾਂ-ਸਾਰਣੀ ਠੀਕ ਹੈ।", bn: "আপনার ফসল পরিচর্যা সময়সূচী আপ-টু-ডেট।", gu: "તમારી પાક સંભાળ સમયરેખા અપડેટ છે.", ml: "നിങ്ങളുടെ വിള പരിപാലന ഷെഡ്യൂൾ കൃത്യമാണ്." },
  open_action: { en: "Open action", te: "చర్య చూడండి", hi: "कार्रवाई खोलें", ta: "செயலைத் திறக்கவும்", kn: "ಕ್ರಮ ವೀಕ್ಷಿಸಿ", mr: "कृती उघडा", pa: "ਕਾਰਵਾਈ ਦੇਖੋ", bn: "পদক্ষেপ দেখুন", gu: "કાર્યવાહી ખોલો", ml: "നടപടി കാണുക" },
  mark_read: { en: "Mark as read", te: "చదివినట్లు గుర్తించు", hi: "पढ़ा हुआ चिह्नित करें", ta: "படித்ததாகக் குறிக்கவும்", kn: "ಓದಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ", mr: "वाचलेले म्हणून चिन्हांकित करा", pa: "ਪੜ੍ਹਿਆ ਵਜੋਂ ਚਿੰਨ੍ਹਿਤ ਕਰੋ", bn: "পড়া হয়েছে", gu: "વંચાયેલું ચિહ્નિત કરો", ml: "വായിച്ചതായി രേഖപ്പെടുത്തുക" },
};

const FILTER_NAMES: Record<string, Record<string, string>> = {
  All: { en: "All", te: "అన్నీ", hi: "सभी", ta: "அனைத்தும்", kn: "ಎಲ್ಲವೂ", mr: "सर्व", pa: "ਸਾਰੇ", bn: "সব", gu: "બધા", ml: "എല്ലാം" },
  Unread: { en: "Unread", te: "చదవనివి", hi: "अपठित", ta: "படிக்காதவை", kn: "ಓದದಿರುವುದು", mr: "न वाचलेले", pa: "ਅਣਪੜ੍ਹੇ", bn: "অপঠিত", gu: "ન વંચાયેલા", ml: "വായിക്കാത്തവ" },
  Weather: { en: "Weather", te: "వాతావరణం", hi: "मौसम", ta: "வானிலை", kn: "ಹವಾಮಾನ", mr: "हवामान", pa: "ਮੌਸਮ", bn: "আবহাওয়া", gu: "હવામાન", ml: "കാലാവസ്ഥ" },
  "Crop care": { en: "Crop care", te: "పంట సంరక్షణ", hi: "फसल देखभाल", ta: "பயிர் பராமரிப்பு", kn: "ಬೆಳೆ ಆರೈಕೆ", mr: "पीक काळजी", pa: "ਫਸਲ ਸੰਭਾਲ", bn: "ফসল পরিচর্যা", gu: "પાક સંભાળ", ml: "വിള പരിചരണം" },
  Detection: { en: "Detection", te: "స్కాన్ నిర్ధారణ", hi: "रोग निदान", ta: "கண்டறிதல்", kn: "ರೋಗ ಪತ್ತೆ", mr: "रोग निदान", pa: "ਨਿਦਾਨ", bn: "নির্ণয়", gu: "નિદાન", ml: "രോഗനിർണയം" },
};

const rawFilters = ["All", "Unread", "Weather", "Crop care", "Detection"];

export default function Notifications() {
  const { language, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("All");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const str = (key: keyof typeof NOTIF_STRINGS): string => {
    return NOTIF_STRINGS[key]?.[language] || NOTIF_STRINGS[key]?.en || "";
  };

  useEffect(() => {
    notificationsApi
      .list()
      .then((data) => setNotifications(data.map((item) => ({ ...item, icon: iconMap[item.type] || Bell }))))
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((item) => item.unread).length;
  const visibleNotifications = useMemo(
    () =>
      notifications.filter(
        (item) =>
          activeFilter === "All" ||
          (activeFilter === "Unread" ? item.unread : item.type === activeFilter),
      ),
    [activeFilter, notifications],
  );

  const markRead = async (id: string) => {
    await notificationsApi.markRead(id);
    setNotifications((current) => current.map((item) => (item.id === id ? { ...item, unread: false } : item)));
  };

  const markAllRead = async () => {
    await notificationsApi.markAllRead();
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })));
    setToast(language === "te" ? "అన్ని నోటీసులు చదివినట్లు గుర్తించబడ్డాయి" : "All field notes marked as read");
    window.setTimeout(() => setToast(""), 2200);
  };

  const highlight = notifications.find((item) => item.unread) || notifications[0];

  if (loading) {
    return (
      <main className="workspace-page notifications-page">
        <div className="workspace-content" style={{ display: "grid", placeItems: "center", minHeight: "50vh" }}>
          <LoaderCircle size={32} className="detection-spinner" />
        </div>
      </main>
    );
  }

  return (
    <main className="workspace-page notifications-page">
      <header className="workspace-topbar">
        <Link href="/dashboard" className="workspace-back">
          <ArrowLeft size={17} /> <span>{t("back_to_dashboard")}</span>
        </Link>
        <div className="workspace-brand">
          <EditableFrame id="notif_brand_mark" className="workspace-brand-mark">
            <Leaf size={17} />
          </EditableFrame>
          <span>AgroScan</span>
        </div>
        <span className="workspace-top-context">{t("notifications")}</span>
      </header>

      <div className="workspace-content">
        <div className="workspace-heading-row">
          <div>
            <EditableFrame id="notif_page_heading" isTextOnly>
              <p className="dashboard-kicker dashboard-kicker-dark">{str("eyebrow")} / {unreadCount} {language === "te" ? "కొత్త నోటీసులు" : "unread notes"}</p>
              <h1 className="workspace-title">{str("title")}</h1>
              <p className="workspace-lede">{str("lede")}</p>
            </EditableFrame>
          </div>
          <button type="button" className="workspace-heading-action cursor-pointer" onClick={markAllRead}>
            <CheckCheck size={16} /> {str("mark_all")}
          </button>
        </div>

        {highlight && (
          <EditableFrame id="notif_highlight_card" className="notification-highlight">
            <div className="notification-highlight-icon">
              <Bell size={23} />
            </div>
            <div>
              <p className="dashboard-kicker dashboard-kicker-dark">{str("priority_notice")}</p>
              <h2>{highlight.title}</h2>
              <p>{highlight.copy}</p>
            </div>
            <Link href={highlight.actionUrl || "/my-crops"} className="notification-highlight-link">
              {str("view_details")} <ArrowRight size={16} />
            </Link>
          </EditableFrame>
        )}

        <div className="notification-toolbar">
          <div className="notification-filters" role="tablist" aria-label="Notification filters">
            {rawFilters.map((filter) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeFilter === filter}
                className={`cursor-pointer ${activeFilter === filter ? "notification-filter notification-filter-active" : "notification-filter"}`}
                key={filter}
                onClick={() => setActiveFilter(filter)}
              >
                {FILTER_NAMES[filter]?.[language] || filter}
                {filter === "Unread" && unreadCount > 0 && <span>{unreadCount}</span>}
              </button>
            ))}
          </div>
        </div>

        <section className="notification-list" aria-live="polite">
          <div className="notification-list-heading">
            <span>{activeFilter === "All" ? (language === "te" ? "అన్ని నోటీసులు & ముందస్తు హెచ్చరికలు" : "All field notes & preventive alerts") : (FILTER_NAMES[activeFilter]?.[language] || activeFilter)}</span>
            <span>{visibleNotifications.length} {language === "te" ? "హెచ్చరికలు" : "notes"}</span>
          </div>
          {visibleNotifications.length > 0 ? (
            visibleNotifications.map((item) => (
              <NotificationRow key={item.id} item={item} onRead={() => markRead(item.id)} />
            ))
          ) : (
            <div className="notification-empty">
              <span><Check size={20} /></span>
              <h2>{str("empty_title")}</h2>
              <p>{str("empty_sub")}</p>
            </div>
          )}
        </section>

        <p className="workspace-footnote">
          <Leaf size={15} /> {language === "te" ? "హెచ్చరికలు పంట దశ మరియు స్థానిక వాతావరణం ఆధారంగా రూపొందించబడతాయి." : "Alerts are dynamically generated from crop stage biology and local weather."}
        </p>
      </div>

      {toast && (
        <div className="notification-toast">
          <Check size={15} /> {toast}
          <button type="button" onClick={() => setToast("")} aria-label="Dismiss message" className="cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}
    </main>
  );
}

function NotificationRow({ item, onRead }: { item: Notification; onRead: () => void }) {
  const { language } = useLanguage();
  const Icon = item.icon;
  return (
    <article className={`notification-row ${item.unread ? "notification-row-unread" : ""}`}>
      <span className={`notification-row-icon notification-row-icon-${item.tone as AlertTone}`}>
        <Icon size={18} />
      </span>
      <div className="notification-row-copy">
        <div className="notification-row-meta">
          <span>{localizeCategory(item.type, language)}</span>
          <span>{item.time}</span>
          {item.unread && <b>{localizeStatus("new", language)}</b>}
        </div>
        <h2>{item.title}</h2>
        <p>{item.copy}</p>
        <div className="notification-row-actions">
          {item.actionUrl ? (
            <Link href={item.actionUrl}>
              Open action <ArrowRight size={14} />
            </Link>
          ) : item.type === "Weather" ? (
            <Link href="/weather">
              View weather <ArrowRight size={14} />
            </Link>
          ) : item.type === "Detection" ? (
            <Link href="/detection">
              View scan <ArrowRight size={14} />
            </Link>
          ) : (
            <Link href="/my-crops">
              Open crop plan <ArrowRight size={14} />
            </Link>
          )}
          {item.unread && <button type="button" onClick={onRead} className="cursor-pointer">Mark as read</button>}
        </div>
      </div>
      <ChevronRight className="notification-row-chevron" size={17} />
    </article>
  );
}
