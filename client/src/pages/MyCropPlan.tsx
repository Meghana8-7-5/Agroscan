import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  Droplets,
  Leaf,
  LoaderCircle,
  MessageCircle,
  Plus,
  Sprout,
  Wheat,
  X,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  FlaskConical,
  Bug,
  Info,
  Clock,
  Sparkles,
  Edit3,
  Layers,
  MapPin,
  CheckCircle2
} from "lucide-react";
import { cropsApi, type CropRegistration, type CropTask } from "@/lib/api";
import { CROPS_DATABASE } from "../data/cropsDatabase";
import EditableFrame from "@/components/EditableFrame";
import { useUiEditContext } from "@/contexts/UiEditContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizeCrop, localizeCategory, localizeStatus } from "@/lib/i18n";

const leafImage = "/manus-storage/agroscan-leaf-stock_de49ea7d.jpg";

const TABS_LANG: Record<string, string[]> = {
  en: ["Plan overview", "Timeline & Care Schedule", "Pest Risk Windows", "Wildlife Protection", "Irrigation & Nutrients"],
  te: ["ప్రణాళిక అవలోకనం", "కాలక్రమం & సంరక్షణ షెడ్యూల్", "తెగుళ్ల ముప్పు సమయాలు", "వన్యప్రాణుల రక్షణ", "నీరు & పోషకాలు"],
  hi: ["योजना अवलोकन", "समयरेखा व देखभाल अनुसूची", "कीट जोखिम विंडो", "वन्यजीव सुरक्षा", "सिंचाई व पोषण"],
  ta: ["திட்ட மேலோட்டம்", "காலவரிசை & பராமரிப்பு", "பூச்சி ஆபத்து காலங்கள்", "வனவிலங்கு பாதுகாப்பு", "நீர்ப்பாசனம் & ஊட்டச்சத்து"],
  kn: ["ಯೋಜನೆ ಅವಲೋಕನ", "ವೇಳಾಪಟ್ಟಿ & ಆರೈಕೆ", "ಕೀಟ ಅಪಾಯದ ಅವಧಿ", "ವನ್ಯಜೀವಿ ರಕ್ಷಣೆ", "ನೀರಾವರಿ & ಪೋಷಕಾಂಶಗಳು"],
  mr: ["नियोजन विहंगावलोकन", "वेळापत्रक आणि काळजी", "कीड धोका कालावधी", "वन्यजीव संरक्षण", "सिंचन आणि पोषण"],
  pa: ["ਯੋਜਨਾ ਸੰਖੇਪ", "ਸਮਾਂ-ਸਾਰਣੀ ਤੇ ਸੰਭਾਲ", "ਕੀੜੇ ਦਾ ਖਤਰਾ", "ਜੰਗਲੀ ਜੀਵ ਸੁਰੱਖਿਆ", "ਸਿੰਚਾਈ ਤੇ ਪੋਸ਼ਣ"],
  bn: ["পরিকল্পনা সারসংক্ষেপ", "সময়সূচী ও যত্ন", "কীটপতঙ্গ ঝুঁকি", "বন্যপ্রাণী সুরক্ষা", "সেচ ও পুষ্টি"],
  gu: ["યોજના ઝાંખી", "સમયરેખા અને સંભાળ", "જીવાત જોખમ સમયગાળો", "વન્યજીવ સંરક્ષણ", "પિયત અને પોષણ"],
  ml: ["പ്ലാൻ അവലോകനം", "ടൈംലൈൻ & പരിചരണം", "കീടബാധ മുന്നറിയിപ്പുകൾ", "വന്യജീവി സംരക്ഷണം", "നനയ്ക്കൽ & വളപ്രയോഗം"],
};

const PLAN_STRINGS: Record<string, Record<string, string>> = {
  eyebrow: { en: "Personalized Crop Schedule", te: "వ్యక్తిగతీకరించిన పంట షెడ్యూల్", hi: "व्यक्तिगत फसल अनुसूची", ta: "தனிப்பயனாக்கப்பட்ட பயிர் அட்டவணை", kn: "ವೈಯಕ್ತಿಕ ಬೆಳೆ ವೇಳಾಪಟ್ಟಿ", mr: "वैयक्तिक पीक वेळापत्रक", pa: "ਨਿੱਜੀ ਫਸਲ ਸਮਾਂ-ਸਾਰਣੀ", bn: "ব্যক্তিগত ফসল সময়সূচী", gu: "વ્યક્તિગત પાક સમયરેખા", ml: "വ്യക്തിഗത വിള ഷെഡ്യൂൾ" },
  title: { en: "Stage-by-Stage Growing Plan & Preventive Care", te: "దశల వారీ పంట ఎదుగుదల ప్రణాళిక & ముందస్తు సంరక్షణ", hi: "चरण-दर-चरण फसल वृद्धि योजना व निवारक देखभाल", ta: "படிப்படியான பயிர் வளர்ச்சித் திட்டம் & தடுப்புப் பராமரிப்பு", kn: "ಹಂತ ಹಂತದ ಬೆಳೆ ಬೆಳವಣಿಗೆ ಯೋಜನೆ & ಮುನ್ನೆಚ್ಚರಿಕೆ", mr: "टप्प्याटप्प्याने पीक वाढ योजना व काळजी", pa: "ਪੜਾਅ-ਵਾਰ ਫਸਲ ਵਿਕਾਸ ਯੋਜਨਾ ਤੇ ਸੰਭਾਲ", bn: "পর্যায়ভিত্তিক ফসল বৃদ্ধি পরিকল্পনা ও যত্ন", gu: "તબક્કાવાર પાક વૃદ્ધિ યોજના અને સંભાળ", ml: "ഘട്ടം ഘട്ടമായുള്ള വിള വളർച്ചാ പ്ലാൻ" },
  active_cycle: { en: "Active Growth Cycle", te: "ప్రస్తుత సాగు దశ", hi: "सक्रिय वृद्धि चक्र", ta: "செயலில் உள்ள வளர்ச்சி நிலை", kn: "ಪ್ರಸ್ತುತ ಬೆಳವಣಿಗೆ ಹಂತ", mr: "सक्रिय वाढ चक्र", pa: "ਸਰਗਰਮ ਵਿਕਾਸ ਚੱਕਰ", bn: "সক্রিয় বৃদ্ধি চক্র", gu: "સક્રિય વૃદ્ધિ ચક્ર", ml: "സജീവ വളർച്ചാ ഘട്ടം" },
  reg_new_field: { en: "Register New Field", te: "కొత్త పొలం నమోదు", hi: "नया खेत दर्ज करें", ta: "புதிய வயல் பதிவு", kn: "ಹೊಸ ಜಮೀನು ನೋಂದಾಯಿಸಿ", mr: "नवीन शेत नोंदवा", pa: "ਨਵਾਂ ਖੇਤ ਦਰਜ ਕਰੋ", bn: "নতুন খামার নিবন্ধন", gu: "નવું ખેતર નોંધો", ml: "പുതിയ കൃഷിസ്ഥലം ചേർക്കുക" },
  season_timeline: { en: "Season Action Timeline", te: "సీజన్ కార్యాచరణ కాలక్రమం", hi: "मौसम कार्य समयरेखा", ta: "பருவகால செயல் காலவரிசை", kn: "ಋತುವಿನ ಕಾರ್ಯ ವೇಳಾಪಟ್ಟಿ", mr: "हंगाम कृती वेळापत्रक", pa: "ਸੀਜ਼ਨ ਕਾਰਵਾਈ ਸਮਾਂ-ਸਾਰਣੀ", bn: "মৌসুমের কর্মপরিকল্পना", gu: "મોસમ કાર્ય સમયરેખા", ml: "സീസൺ പ്രവർത്തന ടൈംലൈൻ" },
  tasks_done: { en: "tasks completed", te: "పనులు పూర్తయ్యాయి", hi: "कार्य पूरे हुए", ta: "பணிகள் முடிந்தது", kn: "ಕೆಲಸಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ", mr: "कामे पूर्ण झाली", pa: "ਕੰਮ ਮੁਕੰਮਲ", bn: "কাজ সম্পন্ন", gu: "કાર્યો પૂર્ણ થયા", ml: "ജോലികൾ പൂർത്തിയായി" },
  why_matters: { en: "Why it matters", te: "ఎందుకు ముఖ్యం", hi: "यह क्यों महत्वपूर्ण है", ta: "ஏன் முக்கியமானது", kn: "ಏಕೆ ಮುಖ್ಯ", mr: "हे का महत्त्वाचे आहे", pa: "ਕਿਉਂ ਜ਼ਰੂਰੀ ਹੈ", bn: "কেন এটি গুরুত্বপূর্ণ", gu: "શા માટે મહત્ત્વનું છે", ml: "എന്തുകൊണ്ട് ಪ್ರധാനം" },
};

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "Recently Sown";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Recently Sown";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "Recently Sown";
  }
}

export default function MyCropPlan() {
  const { language, t } = useLanguage();
  const currentTabs = TABS_LANG[language] || TABS_LANG.en;
  const [activeTab, setActiveTab] = useState(currentTabs[0]);
  const [crops, setCrops] = useState<CropRegistration[]>([]);
  const [tasks, setTasks] = useState<CropTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [assistantOpen, setAssistantOpen] = useState(true);

  // Edit Crop Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editStartDate, setEditStartDate] = useState("");
  const [editLandArea, setEditLandArea] = useState("");
  const [editLandUnit, setEditLandUnit] = useState("acres");
  const [editLocation, setEditLocation] = useState("");
  const [editVariety, setEditVariety] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const str = (key: keyof typeof PLAN_STRINGS): string => {
    return PLAN_STRINGS[key]?.[language] || PLAN_STRINGS[key]?.en || "";
  };

  const primaryCrop = crops[0];

  const matchedCropDb = CROPS_DATABASE.find(
    (c) => c.name.toLowerCase() === (primaryCrop?.cropName || "").toLowerCase()
  ) || CROPS_DATABASE[0];

  const loadData = async () => {
    try {
      const data = await cropsApi.list();
      setCrops(data);
      if (data[0]?.planId) {
        const planTasks = await cropsApi.getTasks(data[0].planId);
        if (planTasks && planTasks.length > 0) {
          setTasks(planTasks);
        } else {
          // Fallback structured care schedule if tasks are empty
          setTasks([
            { id: "task-1", label: "Basal Fertilizer Application (NPK + Zinc)", date: "Day 1-5", status: "done", category: "Nutrients", priority: "high", notes: "Apply recommended basal dosage for robust root establishment." },
            { id: "task-2", label: "Pre-Emergence Weed Protection", date: "Day 5-8", status: "done", category: "Weed Control", priority: "medium", notes: "Spray herbicide within 72 hours of sowing in moist soil." },
            { id: "task-3", label: "First Vegetative Stage Irrigation & N Top-Dress", date: "Day 20-25", status: "upcoming", category: "Irrigation", priority: "high", notes: "Critical vegetative growth phase; avoid moisture stress." },
            { id: "task-4", label: "Stem Borer & Fall Armyworm Pheromone Traps", date: "Day 30-35", status: "upcoming", category: "Pest Protection", priority: "urgent", notes: "Deploy 5 pheromone traps/acre to detect infestation below ETL." },
            { id: "task-5", label: "Flowering & Grain Filling Nutrient Booster", date: "Day 50-60", status: "upcoming", category: "Nutrients", priority: "urgent", notes: "Foliar spray of 13-0-45 (1%) for enhanced grain filling." },
          ]);
        }
      }
    } catch (e) {
      console.warn("MyCropPlan loadData error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openEditModal = () => {
    if (!primaryCrop) return;
    setEditStartDate(primaryCrop.sowingDate?.split("T")[0] || "");
    setEditLandArea(String(primaryCrop.landAreaAcres || 2.5));
    setEditLandUnit("acres");
    setEditLocation(primaryCrop.location || "Gowdapalem");
    setEditVariety(primaryCrop.varietyName || "");
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!primaryCrop) return;
    setSavingEdit(true);
    try {
      await cropsApi.updateCrop(primaryCrop.id, {
        sowingDate: editStartDate,
        landArea: Number(editLandArea),
        landUnit: editLandUnit,
        location: editLocation,
        variety: editVariety,
      });
      setEditModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Failed to update crop:", err);
    } finally {
      setSavingEdit(false);
    }
  };

  const completed = useMemo(() => tasks.filter((task) => task.status === "done").length, [tasks]);
  const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  const toggleTask = async (index: number) => {
    const task = tasks[index];
    const nextStatus = task.status === "done" ? "pending" : "completed";
    await cropsApi.updateTask(task.id, nextStatus);
    setTasks((current) =>
      current.map((item, taskIndex) =>
        taskIndex === index ? { ...item, status: nextStatus === "completed" ? "done" : "upcoming" } : item,
      ),
    );
  };

  if (loading) {
    return (
      <main className="workspace-page crop-plan-page">
        <div className="workspace-content" style={{ display: "grid", placeItems: "center", minHeight: "50vh" }}>
          <LoaderCircle size={32} className="animate-spin text-[#2f6b45]" />
        </div>
      </main>
    );
  }

  return (
    <main className="workspace-page crop-plan-page min-h-screen bg-[#f7f8f4] text-[#1c3827]">
      <header className="workspace-topbar sticky top-[38px] z-30 bg-[#f7f8f4]/95 backdrop-blur border-b border-[#e1e6d7] px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="workspace-back inline-flex items-center gap-2 text-sm font-bold text-[#2f6b45] no-underline hover:underline">
          <ArrowLeft size={17} /> <span>{t("back_to_dashboard")}</span>
        </Link>
        <div className="workspace-brand flex items-center gap-2 font-display text-lg font-bold text-[#20402e]">
          <EditableFrame id="crop_plan_brand_mark" className="workspace-brand-mark h-8 w-8 rounded-xl bg-[#2f6b45] text-white">
            <Leaf size={17} />
          </EditableFrame>
          <span>AgroScan</span>
        </div>
        <span className="workspace-top-context hidden sm:inline-block text-xs font-extrabold uppercase tracking-wider text-[#456b52] bg-[#e5eddc] px-3 py-1 rounded-full">{t("my_crops")}</span>
      </header>

      <div className="workspace-content max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="workspace-heading-row flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <EditableFrame id="crop_plan_heading" isTextOnly>
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#2f6b45]">
                {str("eyebrow")} / {primaryCrop?.fieldName || "Field 1"}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#193625]">{str("title")}</h1>
              <p className="text-sm text-[#4d6957] max-w-2xl mt-1">
                Timed to your exact sowing date with proactive pest risk windows, structured nutrition rationale, and wildlife protection.
              </p>
            </EditableFrame>
          </div>
          <button
            type="button"
            className="workspace-heading-action cursor-pointer flex items-center gap-2 bg-white border border-[#cbd8bf] px-4 py-2.5 rounded-2xl text-xs font-bold text-[#2f6b45] shadow-sm hover:bg-[#edf4e6]"
            onClick={() => setAssistantOpen((open) => !open)}
          >
            {assistantOpen ? <X size={17} /> : <MessageCircle size={17} />}
            <span>{assistantOpen ? "Close Assistant" : "Ask Leaf AI"}</span>
          </button>
        </div>

        {/* Primary Crop Card */}
        {primaryCrop ? (
          <EditableFrame
            id="crop_plan_summary_card"
            className="current-crop-card bg-white rounded-3xl border border-[#d8e0cc] p-6 shadow-md flex flex-col md:flex-row gap-6 items-center"
          >
            <div className="current-crop-image shrink-0 overflow-hidden rounded-2xl w-32 h-32 relative">
              <img src={leafImage} alt="Crop leaf" className="w-full h-full object-cover" />
            </div>
            <div className="current-crop-copy space-y-1 grow">
              <div className="current-crop-label flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-[#2f6b45] uppercase tracking-wider">
                  {str("active_cycle")} ({localizeCategory(primaryCrop.farmingStage || "Active Growth", language)})
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold text-[#183624]">
                {localizeCrop(primaryCrop.cropName || "Crop", language)} {primaryCrop.varietyName ? `/ ${primaryCrop.varietyName}` : ""}
              </h2>
              <div className="crop-meta-row flex flex-wrap items-center gap-4 text-xs font-semibold text-[#4f6d5a]">
                <span><Wheat size={14} className="inline mr-1 text-[#2f6b45]" /> {primaryCrop.landAreaAcres ?? 2.5} Acres</span>
                <span><CalendarDays size={14} className="inline mr-1 text-[#2f6b45]" /> Sown: {formatDate(primaryCrop.sowingDate)}</span>
                <span><MapPin size={14} className="inline mr-1 text-[#2f6b45]" /> {primaryCrop.location || "Gowdapalem, Guntur"}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                type="button"
                onClick={openEditModal}
                className="rounded-2xl border border-[#cbd8bf] bg-white px-4 py-2.5 text-xs font-bold text-[#2f6b45] hover:bg-[#edf4e6] flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Edit3 size={15} /> Edit Details &amp; Date
              </button>
              <Link href="/crop-registration" className="rounded-2xl bg-[#2f6b45] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#20492f] flex items-center justify-center gap-1.5 shadow-sm no-underline">
                <Plus size={15} /> {str("reg_new_field")}
              </Link>
            </div>
          </EditableFrame>
        ) : (
          <section className="current-crop-card bg-white rounded-3xl border border-[#d8e0cc] p-8 shadow-md">
            <h2 className="font-display text-2xl font-bold text-[#183624]">No registered crop found</h2>
            <p className="mt-1 text-sm text-[#52705d]">
              Register a crop with your sowing date to generate a personalized timeline &amp; preventive alerts.
            </p>
            <Link href="/crop-registration" className="rounded-2xl bg-[#2f6b45] px-6 py-3 text-xs font-bold text-white hover:bg-[#20492f] mt-4 inline-flex items-center gap-2 no-underline">
              {t("register_crop")} <ArrowRight size={17} />
            </Link>
          </section>
        )}

        {/* Tab & Checklist Layout */}
        <div className={`crop-plan-layout ${assistantOpen ? "crop-plan-layout-assistant" : ""}`}>
          <EditableFrame
            id="crop_plan_main_panel"
            className="plan-card bg-white rounded-3xl border border-[#d8e0cc] p-6 shadow-xl space-y-6"
          >
            <div className="plan-card-heading flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#e1e8d7] pb-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#2f6b45]">Crop Progress &amp; Milestones</p>
                <h2 className="font-display text-xl font-bold text-[#183624]">{str("season_timeline")}</h2>
              </div>
              <div className="plan-progress flex items-center gap-3">
                <span className="plan-progress-ring flex h-11 w-11 items-center justify-center rounded-full font-bold text-xs text-[#2f6b45] bg-[#eef4e8] border border-[#2f6b45]">
                  {progress}%
                </span>
                <span className="text-xs font-bold text-[#4c6956]">{completed} / {tasks.length} {str("tasks_done")}</span>
              </div>
            </div>

            {/* Task Checklist Items */}
            {tasks.length === 0 ? (
              <p className="text-xs text-[#52705d] py-6 text-center">No upcoming tasks found. Register a field to begin tracking.</p>
            ) : (
              <div className="space-y-3">
                {tasks.map((task, index) => {
                  const isDone = task.status === "done";
                  const hasNotes = Boolean(task.notes);
                  return (
                    <div
                      key={task.id || index}
                      className={`plan-item p-4 rounded-2xl border transition-all ${
                        isDone ? "bg-[#f4f7ee] border-[#d8e5cc] opacity-75" : "bg-white border-[#d8e0cc] shadow-sm hover:border-[#2f6b45]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() => toggleTask(index)}
                          className="flex items-center gap-3 text-left cursor-pointer grow"
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-white transition-colors ${
                              isDone
                                ? "border-[#2f6b45] bg-[#2f6b45]"
                                : "border-[#b0c4a0] bg-white hover:border-[#2f6b45]"
                            }`}
                          >
                            {isDone && <Check size={14} />}
                          </span>
                          <div>
                            <strong className={`font-bold text-sm block ${isDone ? "line-through text-gray-500" : "text-[#183624]"}`}>
                              {task.label}
                            </strong>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="rounded-md bg-[#e5eddc] px-2 py-0.5 text-[10px] font-bold text-[#2f6b45] uppercase">
                                {localizeCategory(task.category, language)}
                              </span>
                              <span className="text-xs text-[#52705d] font-medium flex items-center gap-1">
                                <Clock size={12} /> {task.date}
                              </span>
                            </div>
                          </div>
                        </button>

                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isDone ? "bg-emerald-200 text-emerald-900" : "bg-amber-100 text-amber-900"
                        }`}>
                          {localizeStatus(isDone ? "done" : "upcoming", language)}
                        </span>
                      </div>

                      {hasNotes && (
                        <div className="mt-3 pt-3 border-t border-[#e2ebd9] text-xs space-y-1 bg-[#f8faf5] p-2.5 rounded-xl">
                          <p className="text-[#2b4c38] font-medium">
                            <strong className="text-[#193625] font-bold">{str("why_matters")}:</strong>{" "}
                            {task.notes?.split("|")[0]}
                          </p>
                          {task.notes?.includes("Action:") && (
                            <p className="text-[#2f6b45] font-bold">
                              {task.notes.split("|")[1]}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </EditableFrame>

          {/* Side Assistant */}
          {assistantOpen && (
            <aside className="crop-assistant-panel bg-white rounded-3xl border border-[#d8e0cc] p-6 shadow-xl space-y-4">
              <div className="assistant-panel-top flex items-center justify-between border-b border-[#e1e8d7] pb-3">
                <span className="font-display text-sm font-bold text-[#183624] flex items-center gap-2">
                  <MessageCircle size={16} className="text-[#2f6b45]" /> Leaf AI Crop Advisor
                </span>
                <button
                  type="button"
                  onClick={() => setAssistantOpen(false)}
                  aria-label="Close assistant"
                  className="rounded-full p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  <X size={17} />
                </button>
              </div>

              <p className="text-xs font-bold text-[#4d6b58]">
                Ask questions about your {primaryCrop?.cropName ? localizeCrop(primaryCrop.cropName, language) : "crop"} growth plan:
              </p>

              <div className="assistant-question-list space-y-2">
                <Link
                  href="/pest-detection"
                  className="w-full flex items-center justify-between rounded-xl border border-[#e1e9d8] bg-[#f8faf5] p-3 text-xs font-bold text-[#1b3a28] hover:bg-[#eef5e7] no-underline"
                >
                  <span>{t("scan_leaf")}</span>
                  <ChevronRight size={14} />
                </Link>
                <Link
                  href="/stores"
                  className="w-full flex items-center justify-between rounded-xl border border-[#e1e9d8] bg-[#f8faf5] p-3 text-xs font-bold text-[#1b3a28] hover:bg-[#eef5e7] no-underline"
                >
                  <span>{t("stores_near_me")}</span>
                  <ChevronRight size={14} />
                </Link>
                <Link
                  href="/knowledge-base"
                  className="w-full flex items-center justify-between rounded-xl border border-[#e1e9d8] bg-[#f8faf5] p-3 text-xs font-bold text-[#1b3a28] hover:bg-[#eef5e7] no-underline"
                >
                  <span>{t("knowledge_base")}</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Edit Crop Details Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#d8e0cc] p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#e5edd8] pb-3">
              <h3 className="font-display text-xl font-bold text-[#183624]">Edit Crop Sowing Date &amp; Details</h3>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-[#183624]">Date Crop Started / Sown *</label>
                <input
                  type="date"
                  value={editStartDate}
                  onChange={(e) => setEditStartDate(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#cbd8bf] bg-white px-3.5 py-2.5 font-bold text-[#183624] focus:outline-none focus:ring-2 focus:ring-[#2f6b45]/30 cursor-pointer"
                />
                <p className="text-[11px] text-[#52705d]">Updating this will automatically recalculate upcoming care task dates.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-[#183624]">Land Size *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editLandArea}
                    onChange={(e) => setEditLandArea(e.target.value)}
                    className="w-full rounded-xl border border-[#cbd8bf] bg-white px-3.5 py-2.5 font-bold text-[#183624] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-[#183624]">Unit</label>
                  <select
                    value={editLandUnit}
                    onChange={(e) => setEditLandUnit(e.target.value)}
                    className="w-full rounded-xl border border-[#cbd8bf] bg-white px-3.5 py-2.5 font-bold text-[#183624] focus:outline-none cursor-pointer"
                  >
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                    <option value="guntas">Guntas</option>
                    <option value="cents">Cents</option>
                    <option value="bigha">Bigha</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-[#183624]">Village / Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full rounded-xl border border-[#cbd8bf] bg-white px-3.5 py-2.5 font-bold text-[#183624] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-[#183624]">Crop Variety / Cultivar</label>
                <input
                  type="text"
                  value={editVariety}
                  onChange={(e) => setEditVariety(e.target.value)}
                  placeholder="e.g. BPT-5204"
                  className="w-full rounded-xl border border-[#cbd8bf] bg-white px-3.5 py-2.5 font-bold text-[#183624] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#e5edd8] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="rounded-xl border border-[#cbd8bf] px-4 py-2 text-xs font-bold text-[#1c3827] hover:bg-[#f3f7ee] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={savingEdit || !editStartDate}
                className="rounded-xl bg-[#2f6b45] px-5 py-2 text-xs font-bold text-white hover:bg-[#20492f] disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                {savingEdit ? <LoaderCircle size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                <span>Save &amp; Recalculate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
