import { useState, useEffect, useRef, FormEvent } from "react";
import { Link } from "wouter";
import {
  HelpCircle,
  MessageSquare,
  AlertTriangle,
  Building2,
  Send,
  LoaderCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  PhoneCall,
  User,
  ArrowLeft,
  Sparkles,
  Bot,
  FileText,
  RefreshCw,
  Wheat,
  ShieldAlert,
  ChevronRight,
  Info,
  Layers,
  MapPin
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocationContext } from "@/contexts/LocationContext";
import { aiAssistantApi, supportApi, cropsApi, type SupportTicket, type CropRegistration } from "@/lib/api";
import EditableFrame from "@/components/EditableFrame";
import { localizeCategory, localizeStatus, localizeCrop } from "@/lib/i18n";

interface ChatMessage {
  id: string;
  sender: "farmer" | "ai";
  text: string;
  timestamp: string;
  canEscalate?: boolean;
}

const HELPDESK_STRINGS: Record<string, Record<string, string>> = {
  eyebrow: {
    en: "24/7 Farmer Advisory & Escalations",
    te: "24/7 రైతు సలహా & సహాయ కేంద్రం",
    hi: "24/7 किसान सलाह व सहायता केंद्र",
    ta: "24/7 விவசாய ஆலோசனை மையம்",
    kn: "24/7 ರೈತ ಸಲಹಾ ಕೇಂದ್ರ",
    mr: "24/7 शेतकरी सल्ला केंद्र",
    pa: "24/7 ਕਿਸਾਨ ਸਲਾਹ ਕੇਂਦਰ",
    bn: "২৪/৭ কৃষক পরামর্শ কেন্দ্র",
    gu: "24/7 ખેડૂત સલાહ કેન્દ્ર",
    ml: "24/7 കർഷക സഹായ കേന്ദ്രം",
  },
  title: {
    en: "AgroScan Help Desk & Agronomist Support",
    te: "ఆగ్రోస్కాన్ హెల్ప్ డెస్క్ & వ్యవసాయ అధికారి సహాయం",
    hi: "एग्रोस्कैन हेल्प डेस्क व कृषि विशेषज्ञ सहायता",
    ta: "அக்ரோஸ்கேன் உதவி மையம்",
    kn: "ಆಗ್ರೋಸ್ಕ್ಯಾನ್ ಸಹಾಯವಾಣಿ",
    mr: "एग्रोस्कॅन मदत केंद्र",
    pa: "ਐਗਰੋਸਕੈਨ ਹੈਲਪ ਡੈਸਕ",
    bn: "এগ্রোস্ক্যান হেল্প ডেস্ক",
    gu: "એગ્રોસ્કેન સહાયતા કેન્દ્ર",
    ml: "അഗ്രോസ്കാൻ ഹെൽപ്പ് ഡെസ്ക്",
  },
  tab_ai: {
    en: "AI Crop Advisor",
    te: "AI పంటల సలహాదారు",
    hi: "AI फसल सलाहकार",
    ta: "AI பயிர் ஆலோசகர்",
    kn: "AI ಬೆಳೆ ಸಲಹೆಗಾರ",
    mr: "AI पीक सल्लागार",
    pa: "AI ਫਸਲ ਸਲਾਹਕਾਰ",
    bn: "AI ফসল পরামর্শক",
    gu: "AI પાક સલાહકાર",
    ml: "AI വിള ഉപദേശകൻ",
  },
  tab_report: {
    en: "Report a Website / App Problem",
    te: "యాప్/వెబ్‌సైట్ సమస్యను నివేదించండి",
    hi: "वेबसाइट/ऐप समस्या दर्ज करें",
    ta: "செயலி சிக்கலைப் புகாரளிக்கவும்",
    kn: "ಆ್ಯಪ್ ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ",
    mr: "अ‍ॅप समस्या नोंदवा",
    pa: "ਐਪ ਸਮੱਸਿਆ ਦਰਜ ਕਰੋ",
    bn: "অ্যাপের সমস্যা জানান",
    gu: "એપ સમસ્યા નોંધાવો",
    ml: "ആപ്പ് പ്രശ്നം റിപ്പോർട്ട് ചെയ്യുക",
  },
  tab_gov: {
    en: "Govt Agronomist (Gram Sachivalayam / RBK)",
    te: "ప్రభుత్వ వ్యవసాయ అధికారి (రైతు భరోసా కేంద్రం)",
    hi: "सरकारी कृषि अधिकारी (ग्राम सचिवालय/RBK)",
    ta: "அரசு வேளாண் அதிகாரி (RBK)",
    kn: "ಸರ್ಕಾರಿ ಕೃಷಿ ಅಧಿಕಾರಿ (ಗ್ರಾಮ ಸಚಿವಾಲಯ)",
    mr: "सरकारी कृषी अधिकारी (RBK)",
    pa: "ਸਰਕਾਰੀ ਖੇਤੀਬਾੜੀ ਅਧਿਕਾਰੀ",
    bn: "সরকারি কৃষি কর্মকর্তা",
    gu: "સરકારી કૃષિ અધિકારી",
    ml: "സർക്കാർ കൃഷി ഓഫീസർ",
  },
  tab_tickets: {
    en: "My Support Tickets",
    te: "నా సమస్యల రికార్డులు",
    hi: "मेरी सहायता टिकट",
    ta: "எனது புகார்கள்",
    kn: "ನನ್ನ ದೂರುಗಳು",
    mr: "माझ्या तक्रारी",
    pa: "ਮੇਰੀਆਂ ਟਿਕਟਾਂ",
    bn: "আমার অভিযোগ",
    gu: "મારી ફરિયાદ",
    ml: "എന്റെ ടിക്കറ്റുകൾ",
  },
  ask_placeholder: {
    en: "Ask any farming or crop care question in your language...",
    te: "మీ పంట లేదా పురుగుల నివారణ గురించి ఏదైనా అడగండి...",
    hi: "अपनी फसल या कीट नियंत्रण के बारे में कोई भी प्रश्न पूछें...",
    ta: "உங்கள் பயிர் குறித்த கேள்விகளைக் கேளுங்கள்...",
    kn: "ನಿಮ್ಮ ಬೆಳೆ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ...",
    mr: "तुमच्या पिकाबद्दल कोणताही प्रश्न विचारा...",
    pa: "ਆਪਣੀ ਫਸਲ ਬਾਰੇ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛੋ...",
    bn: "ফসল সংক্রান্ত প্রশ্ন জিজ্ঞাসা করুন...",
    gu: "પાક અંગે કોઈ પ્રશ્ન પૂછો...",
    ml: "കൃഷി സംബന്ധമായ ചോദ്യങ്ങൾ ചോദിക്കുക...",
  },
  send: { en: "Send", te: "పంపండి", hi: "भेजें", ta: "அனுப்பு", kn: "ಕಳುಹಿಸಿ", mr: "पाठवा", pa: "ਭੇਜੋ", bn: "পাঠান", gu: "મોકલો", ml: "അയക്കുക" }
};

export default function HelpDesk() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { location } = useLocationContext();

  const [activeTab, setActiveTab] = useState<"ai_chat" | "report_problem" | "gov_agronomist" | "my_tickets">("ai_chat");
  const [registeredCrops, setRegisteredCrops] = useState<CropRegistration[]>([]);

  const str = (key: keyof typeof HELPDESK_STRINGS): string => {
    return HELPDESK_STRINGS[key]?.[language] || HELPDESK_STRINGS[key]?.en || "";
  };

  // 1. AI Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg_welcome",
      sender: "ai",
      text: t("auto_greeting", { name: user?.fullName.split(" ")[0] || "Farmer" }) ||
        "Hello! I am your AgroScan Farming Assistant. You can ask me any crop care question in whatever language you prefer (Telugu, Hindi, Tamil, Kannada, Marathi, English, etc.).",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState("");
  const [sendingAi, setSendingAi] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // 2. Problem Ticket state (for website / app issues)
  const [ticketCategory, setTicketCategory] = useState<"app_bug" | "account_issue" | "general_complaint">("app_bug");
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketDesc, setTicketDesc] = useState("");
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState<SupportTicket | null>(null);

  // 3. Government Agronomist state (Gram Sachivalayam / RBK)
  const [govCategory, setGovCategory] = useState<
    "land_id_registration" | "app_usage_explanation" | "land_record_problem" | "crop_disease"
  >("land_id_registration");
  const [govCrop, setGovCrop] = useState("");
  const [govProblem, setGovProblem] = useState("");
  const [submittingGov, setSubmittingGov] = useState(false);
  const [govReferralReceipt, setGovReferralReceipt] = useState<any | null>(null);

  // 4. Tickets list
  const [myTickets, setMyTickets] = useState<SupportTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  useEffect(() => {
    cropsApi.list().then((res) => {
      if (Array.isArray(res)) {
        setRegisteredCrops(res);
        if (res.length > 0) {
          setGovCrop(res[0].cropName);
        }
      }
    }).catch(() => {});
  }, []);

  const loadMyTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await supportApi.getTickets();
      setMyTickets(res.tickets || []);
    } catch (err) {
      console.warn("Failed to load tickets:", err);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    if (activeTab === "my_tickets") {
      loadMyTickets();
    }
  }, [activeTab]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, sendingAi]);

  // ── 1. AI Chat Submit Handler ───────────────────────────────────────────
  const handleSendAiQuestion = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuestion.trim() || sendingAi) return;

    const userText = inputQuestion.trim();
    const userMsgId = `user_${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: "farmer",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputQuestion("");
    setSendingAi(true);

    try {
      const cropList = registeredCrops.map((c) => c.cropName);
      const res = await aiAssistantApi.ask({
        message: userText,
        language,
        farmerName: user?.fullName || "Farmer",
        crops: cropList,
        location: `${location.villageCity || "Gowdapalem"}, ${location.district || "Guntur"}`,
      });

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: "ai",
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        canEscalate: true,
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI chat error:", err);
      const errorMsg: ChatMessage = {
        id: `ai_err_${Date.now()}`,
        sender: "ai",
        text: "I am currently assisting many farmers. For immediate pest management, please check the 'Scan Leaf' tool or request a Government Agronomist visit.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setSendingAi(false);
    }
  };

  // ── 2. Submit Problem Report (For App & Website Bugs) ───────────────────
  const handleSubmitTicket = async (e: FormEvent) => {
    e.preventDefault();
    if (!ticketDesc.trim()) return;

    setSubmittingTicket(true);
    try {
      const res = await supportApi.createTicket({
        title: ticketTitle.trim() || "Website / App Problem Report",
        description: ticketDesc.trim(),
        category: ticketCategory as any,
        location: `${location.villageCity || "Gowdapalem"}, ${location.district || "Guntur"}`,
      });

      setTicketSuccess(res.ticket);
      setTicketTitle("");
      setTicketDesc("");
    } catch (err) {
      console.error("Failed to submit ticket:", err);
    } finally {
      setSubmittingTicket(false);
    }
  };

  // ── 3. Submit Government Agronomist Referral (RBK) ──────────────────────
  const handleSubmitGovReferral = async (e: FormEvent) => {
    e.preventDefault();
    if (!govProblem.trim()) return;

    setSubmittingGov(true);
    try {
      const categoryTitles: Record<string, string> = {
        land_id_registration: "Land & Farmer ID Registration Request (Passbook / Aadhaar / PM-KISAN)",
        app_usage_explanation: "Website / App Usage Walkthrough Request",
        land_record_problem: "Land Registration Issue (1B Record / Survey Mismatch)",
        crop_disease: "Field Crop Disease / Soil Health Escalation",
      };

      const res = await supportApi.referToGovt({
        cropName: govCrop || "Field Crop",
        issueDescription: govProblem.trim(),
        farmerNotes: categoryTitles[govCategory] || "Government Extension Request",
        location: `${location.villageCity || "Gowdapalem"}, ${location.district || "Guntur"}`,
      });

      setGovReferralReceipt({
        ...res,
        category: categoryTitles[govCategory],
        cropName: govCrop,
        description: govProblem,
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      });
      setGovProblem("");
    } catch (err) {
      console.error("Govt referral error:", err);
    } finally {
      setSubmittingGov(false);
    }
  };

  return (
    <main className="workspace-page min-h-screen bg-[#f7f8f4] text-[#1c3827]">
      {/* Top Header */}
      <header className="workspace-topbar sticky top-0 z-40 bg-[#f7f8f4]/90 backdrop-blur border-b border-[#e1e6d7] px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="workspace-back inline-flex items-center gap-2 text-sm font-bold text-[#2f6b45] no-underline hover:underline">
          <ArrowLeft size={17} /> <span>{t("back_to_dashboard")}</span>
        </Link>
        <div className="flex items-center gap-2 font-display text-lg font-bold text-[#20402e]">
          <EditableFrame id="helpdesk_header_icon" className="h-8 w-8 rounded-xl bg-[#2f6b45] text-white">
            <HelpCircle size={18} />
          </EditableFrame>
          <span>{str("title")}</span>
        </div>
        <span className="hidden sm:inline-block text-xs font-extrabold uppercase tracking-wider text-[#456b52] bg-[#e5eddc] px-3 py-1 rounded-full">
          24/7 Farmer Help Desk
        </span>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Page Title */}
        <EditableFrame id="helpdesk_heading_panel" isTextOnly>
          <div className="space-y-1">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#2f6b45]">
              {str("eyebrow")}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#193625]">
              {str("title")}
            </h1>
            <p className="text-sm text-[#4d6957]">
              Get instant multilingual AI crop advice, report website issues to Admin, or request official Gram Sachivalayam agronomist assistance.
            </p>
          </div>
        </EditableFrame>

        {/* 4 Feature Tabs */}
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab("ai_chat")}
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "ai_chat"
                ? "bg-[#2f6b45] text-white shadow-lg scale-105"
                : "bg-white text-[#294c36] border border-[#d8e2cf] hover:bg-[#eaf0e3]"
            }`}
          >
            <Bot size={15} />
            <span>{str("tab_ai")}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("report_problem")}
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "report_problem"
                ? "bg-[#2f6b45] text-white shadow-lg scale-105"
                : "bg-white text-[#294c36] border border-[#d8e2cf] hover:bg-[#eaf0e3]"
            }`}
          >
            <AlertTriangle size={15} />
            <span>{str("tab_report")}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("gov_agronomist")}
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "gov_agronomist"
                ? "bg-[#2f6b45] text-white shadow-lg scale-105"
                : "bg-white text-[#294c36] border border-[#d8e2cf] hover:bg-[#eaf0e3]"
            }`}
          >
            <Building2 size={15} />
            <span>{str("tab_gov")}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("my_tickets")}
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "my_tickets"
                ? "bg-[#2f6b45] text-white shadow-lg scale-105"
                : "bg-white text-[#294c36] border border-[#d8e2cf] hover:bg-[#eaf0e3]"
            }`}
          >
            <FileText size={15} />
            <span>{str("tab_tickets")}</span>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: AI ADVISOR CHAT (MULTILINGUAL WITH AUTO-DETECTION) */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "ai_chat" && (
          <EditableFrame
            id="helpdesk_chat_card"
            className="rounded-3xl border border-[#d8e0cc] bg-white p-6 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#e5edd8] pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e5eddc] text-[#2f6b45]">
                  <Sparkles size={20} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-[#183624]">Leaf AI Multilingual Agronomy Chat</h3>
                  <p className="text-xs text-[#52705d]">Auto-detects your query language (Telugu, Hindi, Tamil, Kannada, Marathi, English)</p>
                </div>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="min-h-[350px] max-h-[480px] overflow-y-auto space-y-4 p-4 rounded-2xl bg-[#f9faf6] border border-[#e2ebd9]">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "farmer" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-xl rounded-2xl p-4 text-xs font-medium leading-relaxed shadow-sm ${
                      msg.sender === "farmer"
                        ? "bg-[#2f6b45] text-white rounded-br-none"
                        : "bg-white text-[#193625] border border-[#d8e0cc] rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {sendingAi && (
                <div className="flex items-center gap-2 text-xs text-[#52705d] font-bold p-2">
                  <LoaderCircle size={16} className="animate-spin text-[#2f6b45]" />
                  <span>Leaf AI is analyzing your agronomic question…</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Box */}
            <form onSubmit={handleSendAiQuestion} className="flex gap-2">
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder={str("ask_placeholder")}
                disabled={sendingAi}
                className="flex-1 rounded-2xl border border-[#cbd8bf] bg-white px-4 py-3.5 text-xs font-bold text-[#1b3b27] focus:outline-none focus:ring-2 focus:ring-[#2f6b45]/30 shadow-sm"
              />
              <button
                type="submit"
                disabled={sendingAi || !inputQuestion.trim()}
                className="rounded-2xl bg-[#2f6b45] px-6 py-3.5 text-xs font-bold text-white hover:bg-[#20492f] disabled:opacity-50 flex items-center gap-2 shadow-sm cursor-pointer transition-all"
              >
                <Send size={15} /> <span>{str("send")}</span>
              </button>
            </form>
          </EditableFrame>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: REPORT A PROBLEM (WEBSITE / APP BUG REPORTING TO ADMIN) */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "report_problem" && (
          <EditableFrame
            id="helpdesk_report_problem_card"
            className="rounded-3xl border border-[#d8e0cc] bg-white p-6 sm:p-8 shadow-xl space-y-6"
          >
            <div className="border-b border-[#e5edd8] pb-4 space-y-1">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-amber-600" />
                <h3 className="font-display text-2xl font-bold text-[#183624]">Report a Website or App Problem</h3>
              </div>
              <p className="text-xs text-[#52705d]">
                Notice a bug, scanner failure, login error, or broken feature? Submit details here. Your report goes directly to the AgroScan Admin Ticket Notice Board for review and resolution.
              </p>
            </div>

            {ticketSuccess ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-6 text-center space-y-3 animate-in zoom-in-95">
                <CheckCircle2 size={36} className="text-emerald-700 mx-auto" />
                <h4 className="font-display text-lg font-bold text-emerald-950">
                  Problem Report Submitted Successfully!
                </h4>
                <p className="text-xs text-emerald-900">
                  Ticket Reference Number: <strong>{ticketSuccess.ticketNumber}</strong>. Our engineering and admin team has been notified.
                </p>
                <button
                  type="button"
                  onClick={() => setTicketSuccess(null)}
                  className="rounded-xl bg-[#2f6b45] px-5 py-2 text-xs font-bold text-white hover:bg-[#20492f] cursor-pointer"
                >
                  Report Another Issue
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#183624]">Issue Category *</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value as any)}
                      className="w-full rounded-xl border border-[#cbd8bf] bg-white px-3.5 py-2.5 text-xs font-bold text-[#183624] focus:outline-none focus:ring-2 focus:ring-[#2f6b45]/30 cursor-pointer"
                    >
                      <option value="app_bug">App Bug / Feature Not Working</option>
                      <option value="account_issue">Account &amp; Mobile OTP Login Issue</option>
                      <option value="general_complaint">General Website Feedback</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#183624]">Brief Problem Title</label>
                    <input
                      type="text"
                      value={ticketTitle}
                      onChange={(e) => setTicketTitle(e.target.value)}
                      placeholder="e.g. Camera scan freezes on Chrome"
                      className="w-full rounded-xl border border-[#cbd8bf] bg-white px-3.5 py-2.5 text-xs font-bold text-[#183624] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#183624]">Problem Description &amp; Steps to Reproduce *</label>
                  <textarea
                    rows={4}
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    placeholder="Describe what happened, which button you clicked, and what went wrong..."
                    required
                    className="w-full rounded-xl border border-[#cbd8bf] bg-white p-3.5 text-xs font-medium text-[#183624] focus:outline-none focus:ring-2 focus:ring-[#2f6b45]/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingTicket || !ticketDesc.trim()}
                  className="rounded-2xl bg-[#2f6b45] px-7 py-3 text-xs font-bold text-white shadow-lg hover:bg-[#20492f] disabled:opacity-50 flex items-center gap-2 cursor-pointer transition-all"
                >
                  {submittingTicket ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={15} />}
                  <span>Submit Problem Report to Admin</span>
                </button>
              </form>
            )}
          </EditableFrame>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: GOVERNMENT AGRONOMIST (GRAM SACHIVALAYAM / RBK DESK) */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "gov_agronomist" && (
          <EditableFrame
            id="helpdesk_gov_agronomist_card"
            className="rounded-3xl border border-[#d8e0cc] bg-white p-6 sm:p-8 shadow-xl space-y-6"
          >
            <div className="border-b border-[#e5edd8] pb-4 space-y-1">
              <div className="flex items-center gap-2">
                <Building2 size={22} className="text-[#2f6b45]" />
                <h3 className="font-display text-2xl font-bold text-[#183624]">
                  Government Agronomist &amp; Gram Sachivalayam Desk
                </h3>
              </div>
              <p className="text-xs text-[#52705d]">
                Request an official Rythu Bharosa Kendra (RBK) agricultural extension officer visit, solve Pattadar/Farmer ID issues, or receive on-field assistance.
              </p>
            </div>

            {govReferralReceipt ? (
              <div className="rounded-3xl bg-[#f6faf2] border-2 border-emerald-300 p-6 sm:p-8 space-y-4 animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      Official Government Referral Tracking
                    </span>
                    <h4 className="font-display text-xl font-bold text-[#183624] mt-1">
                      Referral Code: {govReferralReceipt.referralNumber}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-emerald-800">{govReferralReceipt.date}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-emerald-200">
                    <strong className="block text-[#193625]">Selected Topic:</strong>
                    <span className="text-[#3a5845]">{govReferralReceipt.category}</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-200">
                    <strong className="block text-[#193625]">Farmer Location:</strong>
                    <span className="text-[#3a5845]">{location.villageCity || "Gowdapalem"}, {location.district || "Guntur"}</span>
                  </div>
                </div>

                <p className="text-xs text-emerald-950">
                  Your request has been routed to the Gram Sachivalayam Agricultural Assistant for your mandal. A representative will contact you at <strong>{user?.phoneNumber}</strong>.
                </p>

                <button
                  type="button"
                  onClick={() => setGovReferralReceipt(null)}
                  className="rounded-xl bg-[#2f6b45] px-5 py-2 text-xs font-bold text-white hover:bg-[#20492f] cursor-pointer"
                >
                  Create Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitGovReferral} className="space-y-5">
                {/* Specific Selectable Topic Categories */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#183624]">Select Assistance Topic Category *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setGovCategory("land_id_registration")}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        govCategory === "land_id_registration"
                          ? "border-[#2f6b45] bg-[#edf4e8] shadow-sm font-bold"
                          : "border-[#d8e2cf] bg-[#fafcf7] text-[#34543e] hover:bg-[#f2f7ec]"
                      }`}
                    >
                      <h5 className="text-xs font-bold text-[#183624]">1. Land &amp; Farmer ID Registration</h5>
                      <p className="text-[11px] text-[#52705d] mt-1 font-normal">Pattadar Passbook, Aadhaar seeding, PM-KISAN, Rythu Bharosa linking</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGovCategory("app_usage_explanation")}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        govCategory === "app_usage_explanation"
                          ? "border-[#2f6b45] bg-[#edf4e8] shadow-sm font-bold"
                          : "border-[#d8e2cf] bg-[#fafcf7] text-[#34543e] hover:bg-[#f2f7ec]"
                      }`}
                    >
                      <h5 className="text-xs font-bold text-[#183624]">2. App Usage Explanation Request</h5>
                      <p className="text-[11px] text-[#52705d] mt-1 font-normal">Ask a local RBK officer to explain &amp; walk through using AgroScan</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGovCategory("land_record_problem")}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        govCategory === "land_record_problem"
                          ? "border-[#2f6b45] bg-[#edf4e8] shadow-sm font-bold"
                          : "border-[#d8e2cf] bg-[#fafcf7] text-[#34543e] hover:bg-[#f2f7ec]"
                      }`}
                    >
                      <h5 className="text-xs font-bold text-[#183624]">3. Land Registration Problems</h5>
                      <p className="text-[11px] text-[#52705d] mt-1 font-normal">1B record mismatch, survey number boundary disputes, tenancy records</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGovCategory("crop_disease")}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        govCategory === "crop_disease"
                          ? "border-[#2f6b45] bg-[#edf4e8] shadow-sm font-bold"
                          : "border-[#d8e2cf] bg-[#fafcf7] text-[#34543e] hover:bg-[#f2f7ec]"
                      }`}
                    >
                      <h5 className="text-xs font-bold text-[#183624]">4. Field Crop Disease Escalation</h5>
                      <p className="text-[11px] text-[#52705d] mt-1 font-normal">In-person field inspection for severe pest outbreak or soil health</p>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#183624]">Describe Your Specific Request or Field Issue *</label>
                  <textarea
                    rows={4}
                    value={govProblem}
                    onChange={(e) => setGovProblem(e.target.value)}
                    placeholder="Provide your survey number, Aadhaar reference, or field location details..."
                    required
                    className="w-full rounded-xl border border-[#cbd8bf] bg-white p-3.5 text-xs font-medium text-[#183624] focus:outline-none focus:ring-2 focus:ring-[#2f6b45]/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingGov || !govProblem.trim()}
                  className="rounded-2xl bg-[#2f6b45] px-7 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-[#20492f] disabled:opacity-50 flex items-center gap-2 cursor-pointer transition-all"
                >
                  {submittingGov ? <LoaderCircle size={16} className="animate-spin" /> : <Building2 size={16} />}
                  <span>Submit Request to Gram Sachivalayam RBK</span>
                </button>
              </form>
            )}
          </EditableFrame>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 4: MY SUPPORT TICKETS */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "my_tickets" && (
          <EditableFrame
            id="helpdesk_my_tickets_card"
            className="rounded-3xl border border-[#d8e0cc] bg-white p-6 sm:p-8 shadow-xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-[#e5edd8] pb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-[#183624]">My Open &amp; Resolved Tickets</h3>
                <p className="text-xs text-[#52705d]">Track responses from AgroScan Admin and Gram Sachivalayam agronomists</p>
              </div>
              <button
                type="button"
                onClick={loadMyTickets}
                disabled={loadingTickets}
                className="p-2 text-[#2f6b45] hover:bg-[#eef5e7] rounded-full cursor-pointer"
              >
                <RefreshCw size={16} className={loadingTickets ? "animate-spin" : ""} />
              </button>
            </div>

            {loadingTickets ? (
              <div className="p-8 text-center space-y-2">
                <LoaderCircle size={28} className="animate-spin text-[#2f6b45] mx-auto" />
                <p className="text-xs font-bold text-[#52705d]">Loading your tickets…</p>
              </div>
            ) : myTickets.length === 0 ? (
              <div className="p-8 text-center space-y-2 bg-[#f9faf6] rounded-2xl border border-[#e5edd8]">
                <FileText size={32} className="text-[#557662] mx-auto" />
                <h4 className="font-display text-sm font-bold text-[#183624]">No support tickets created yet</h4>
                <p className="text-xs text-[#52705d]">You can report problems or request agronomist visits above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myTickets.map((tkt) => (
                  <div key={tkt.id} className="p-4 rounded-2xl border border-[#d8e0cc] bg-[#fafcf7] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#2f6b45]">{tkt.ticketNumber}</span>
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        tkt.status === "Resolved" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {tkt.status}
                      </span>
                    </div>
                    <h4 className="font-display text-sm font-bold text-[#183624]">{tkt.title}</h4>
                    <p className="text-xs text-[#4d6b58] leading-relaxed">{tkt.description}</p>
                    {tkt.resolutionNotes && (
                      <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                        <strong>Admin Response:</strong> {tkt.resolutionNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </EditableFrame>
        )}
      </div>
    </main>
  );
}
