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
  Sparkles
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
  season_timeline: { en: "Season Action Timeline", te: "సీజన్ కార్యాచరణ కాలక్రమం", hi: "मौसम कार्य समयरेखा", ta: "பருவகால செயல் காலவரிசை", kn: "ಋತುವಿನ ಕಾರ್ಯ ವೇಳಾಪಟ್ಟಿ", mr: "हंगाम कृती वेळापत्रक", pa: "ਸੀਜ਼ਨ ਕਾਰਵਾਈ ਸਮਾਂ-ਸਾਰਣੀ", bn: "মৌসুমের কর্মপরিকল্পনা", gu: "મોસમ કાર્ય સમયરેખા", ml: "സീസൺ പ്രവർത്തന ടൈംലൈൻ" },
  tasks_done: { en: "tasks completed", te: "పనులు పూర్తయ్యాయి", hi: "कार्य पूरे हुए", ta: "பணிகள் முடிந்தது", kn: "ಕೆಲಸಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ", mr: "कामे पूर्ण झाली", pa: "ਕੰਮ ਮੁਕੰਮਲ", bn: "কাজ সম্পন্ন", gu: "કાર્યો પૂર્ણ થયા", ml: "ജോലികൾ പൂർത്തിയായി" },
  why_matters: { en: "Why it matters", te: "ఎందుకు ముఖ్యం", hi: "यह क्यों महत्वपूर्ण है", ta: "ஏன் முக்கியமானது", kn: "ಏಕೆ ಮುಖ್ಯ", mr: "हे का महत्त्वाचे आहे", pa: "ਕਿਉਂ ਜ਼ਰੂਰੀ ਹੈ", bn: "কেন এটি গুরুত্বপূর্ণ", gu: "શા માટે મહત્ત્વનું છે", ml: "എന്തുകൊണ്ട് പ്രധാനം" },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function MyCropPlan() {
  const { language, t } = useLanguage();
  const currentTabs = TABS_LANG[language] || TABS_LANG.en;
  const [activeTab, setActiveTab] = useState(currentTabs[0]);
  const [crops, setCrops] = useState<CropRegistration[]>([]);
  const [tasks, setTasks] = useState<CropTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [assistantOpen, setAssistantOpen] = useState(true);

  const str = (key: keyof typeof PLAN_STRINGS): string => {
    return PLAN_STRINGS[key]?.[language] || PLAN_STRINGS[key]?.en || "";
  };

  const primaryCrop = crops[0];

  // Match crop knowledge from DB
  const matchedCropDb = CROPS_DATABASE.find(
    (c) => c.name.toLowerCase() === (primaryCrop?.cropName || "").toLowerCase()
  ) || CROPS_DATABASE[0];

  useEffect(() => {
    cropsApi
      .list()
      .then(async (data) => {
        setCrops(data);
        if (data[0]?.planId) {
          const planTasks = await cropsApi.getTasks(data[0].planId);
          setTasks(planTasks);
        }
      })
      .finally(() => setLoading(false));
  }, []);

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
      <header className="workspace-topbar">
        <Link href="/dashboard" className="workspace-back">
          <ArrowLeft size={17} /> <span>{t("back_to_dashboard")}</span>
        </Link>
        <div className="workspace-brand">
          <EditableFrame id="crop_plan_brand_mark" className="workspace-brand-mark">
            <Leaf size={17} />
          </EditableFrame>
          <span>AgroScan</span>
        </div>
        <span className="workspace-top-context">{t("my_crops")}</span>
      </header>

      <div className="workspace-content max-w-7xl mx-auto px-4 py-8">
        <div className="workspace-heading-row">
          <div>
            <EditableFrame id="crop_plan_heading" isTextOnly>
              <p className="dashboard-kicker dashboard-kicker-dark">
                {str("eyebrow")} / {primaryCrop?.fieldName || "Field 1"}
              </p>
              <h1 className="workspace-title">{str("title")}</h1>
              <p className="workspace-lede">
                Timed to your exact sowing date with proactive pest risk windows, structured nutrition rationale, and wildlife protection.
              </p>
            </EditableFrame>
          </div>
          <button
            type="button"
            className="workspace-heading-action cursor-pointer"
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
            className="current-crop-card bg-white rounded-3xl border border-[#d8e0cc] p-6 shadow-md mb-8 flex flex-col md:flex-row gap-6 items-center"
          >
            <div className="current-crop-image shrink-0 overflow-hidden rounded-2xl w-32 h-32 relative">
              <img src={leafImage} alt="Crop leaf" className="w-full h-full object-cover" />
            </div>
            <div className="current-crop-copy space-y-1 grow">
              <div className="current-crop-label flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-[#2f6b45] uppercase tracking-wider">
                  {str("active_cycle")} ({localizeCategory(primaryCrop.farmingStage, language)})
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold text-[#183624]">
                {localizeCrop(primaryCrop.cropName, language)} {primaryCrop.varietyName ? `/ ${primaryCrop.varietyName}` : ""}
              </h2>
              <div className="crop-meta-row flex items-center gap-4 text-xs font-semibold text-[#4f6d5a]">
                <span><Wheat size={14} className="inline mr-1" /> {primaryCrop.landAreaAcres} Acres</span>
                <span><CalendarDays size={14} className="inline mr-1" /> Sown: {formatDate(primaryCrop.sowingDate)}</span>
              </div>
              <p className="text-xs text-[#52705d]">{primaryCrop.fieldName} · {primaryCrop.location}</p>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <Link href="/crop-registration" className="workspace-primary-button cursor-pointer">
                <Plus size={16} /> {str("reg_new_field")}
              </Link>
            </div>
          </EditableFrame>
        ) : (
          <section className="current-crop-card bg-white rounded-3xl border border-[#d8e0cc] p-8 shadow-md mb-8">
            <h2 className="font-display text-2xl font-bold text-[#183624]">No registered crop found</h2>
            <p className="mt-1 text-sm text-[#52705d]">
              Register a crop with your sowing date to generate a personalized timeline &amp; preventive alerts.
            </p>
            <Link href="/crop-registration" className="workspace-primary-button mt-4 inline-flex items-center gap-2">
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
                <p className="dashboard-kicker dashboard-kicker-dark">Crop Progress &amp; Milestones</p>
                <h2 className="font-display text-xl font-bold text-[#183624]">{str("season_timeline")}</h2>
              </div>
              <div className="plan-progress flex items-center gap-3">
                <span className="plan-progress-ring flex h-11 w-11 items-center justify-center rounded-full font-bold text-xs text-[#2f6b45] bg-[#eef4e8] border border-[#2f6b45]">
                  {progress}%
                </span>
                <span className="text-xs font-bold text-[#4c6956]">{completed} / {tasks.length} {str("tasks_done")}</span>
              </div>
            </div>

            <div className="plan-tabs flex flex-wrap gap-2 border-b border-[#e1e8d7] pb-3" role="tablist">
              {currentTabs.map((tab, idx) => (
                <button
                  type="button"
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab || (idx === 0 && !currentTabs.includes(activeTab))}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab || (idx === 0 && !currentTabs.includes(activeTab))
                      ? "bg-[#2f6b45] text-white shadow"
                      : "bg-[#f2f6ec] text-[#294c36] hover:bg-[#e4edd8]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB: Pest Risk Windows */}
            {(activeTab === currentTabs[2] || activeTab === "Pest Risk Windows") && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-amber-50 border border-amber-300 p-4 flex items-start gap-3">
                  <ShieldAlert size={22} className="text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-sm text-amber-950">Pre-Emptive Pest &amp; Disease Warning Windows</h3>
                    <p className="text-xs text-amber-900 mt-0.5">
                      Proactive alerts scheduled based on your crop's physiological vulnerability windows before visible damage occurs.
                    </p>
                  </div>
                </div>

                {matchedCropDb.growthPlan.map((stage, idx) => (
                  <div key={idx} className="rounded-2xl border border-amber-200 bg-white p-4 text-xs space-y-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <strong className="font-bold text-[#183624] text-sm">{stage.stageName}</strong>
                      <span className="rounded-full bg-amber-100 text-amber-900 px-3 py-0.5 font-bold border border-amber-200">
                        {stage.dayRange}
                      </span>
                    </div>
                    {stage.pestRiskWindow ? (
                      <div className="rounded-xl bg-amber-50 p-3 border border-amber-200/80 space-y-1">
                        <p className="font-bold text-amber-900 flex items-center gap-1.5">
                          <AlertTriangle size={15} className="text-amber-700 shrink-0" />
                          PREVENTIVE RISK ALERT: {stage.pestRiskWindow}
                        </p>
                        <p className="text-[#4e6b58] font-medium pl-5">
                          Inspect plants in field closely this week. Apply protective bio-fungicide/neem if high humidity persists.
                        </p>
                      </div>
                    ) : (
                      <p className="text-[#52705d] font-medium">Standard growth phase. Maintain normal weekly scouting.</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TAB: Wildlife Protection */}
            {(activeTab === currentTabs[3] || activeTab === "Wildlife Protection") && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-4 flex items-start gap-3">
                  <ShieldCheck size={22} className="text-[#2f6b45] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-sm text-[#193625]">Regional Wildlife &amp; Animal Intrusion Defense</h3>
                    <p className="text-xs text-[#3a5845] mt-0.5">
                      Recommended seasonal deterrents for wild boars, nilgai, deer, and birds based on crop ripening stage.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#d8e0cc] bg-[#f8faf5] p-5 space-y-4 text-xs text-[#244230]">
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2f6b45] text-white font-bold text-xs shrink-0">1</span>
                    <div>
                      <strong className="font-bold block text-sm text-[#183624]">Solar Ultrasonic &amp; Strobe Light Deterrents</strong>
                      <p className="mt-0.5 text-[#4e6b58] leading-relaxed">
                        Install solar-powered dual-frequency repellers along perimeter boundaries to deter nocturnal wild boars and deer.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2f6b45] text-white font-bold text-xs shrink-0">2</span>
                    <div>
                      <strong className="font-bold block text-sm text-[#183624]">Perimeter Solar Pulse Fencing</strong>
                      <p className="mt-0.5 text-[#4e6b58] leading-relaxed">
                        Erect low-voltage pulsed solar wire fencing around grain/vegetable plots during ripening stage.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2f6b45] text-white font-bold text-xs shrink-0">3</span>
                    <div>
                      <strong className="font-bold block text-sm text-[#183624]">Bird Scaring Reflective Tapes</strong>
                      <p className="mt-0.5 text-[#4e6b58] leading-relaxed">
                        Tie shiny dual-color holographic reflective tape across top canopy during grain milking and pod formation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Timeline & Detailed Care Schedule (Default) */}
            {(activeTab === currentTabs[0] || activeTab === currentTabs[1] || activeTab === currentTabs[4] || activeTab === "Plan overview" || activeTab === "Timeline & Care Schedule" || activeTab === "Irrigation & Nutrients") && (
              <div className="task-list space-y-3">
                {tasks.map((task, index) => {
                  const hasNotes = Boolean(task.notes);
                  const isDone = task.status === "done";

                  return (
                    <div
                      key={task.id}
                      className={`rounded-2xl border p-4 transition-all ${
                        isDone
                          ? "bg-[#eef5e7] border-[#cadbbd] text-[#4f6d5a]"
                          : "bg-white border-[#e1e9d8] text-[#1b3a28] hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => toggleTask(index)}
                          className="flex items-start gap-3 text-left grow cursor-pointer"
                        >
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 mt-0.5 shrink-0 transition-colors ${
                              isDone
                                ? "bg-[#2f6b45] border-[#2f6b45] text-white"
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

                      {/* Agronomic WHY and HOW notes */}
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
                  href="/detection"
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
                  href="/knowledge"
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
    </main>
  );
}
