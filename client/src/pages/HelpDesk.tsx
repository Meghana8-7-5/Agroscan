import { useState, useEffect, useRef } from "react";
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
  ChevronRight
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
  eyebrow: { en: "24/7 Farmer Advisory & Escalations", te: "24/7 రైతు సలహా & సహాయ కేంద్రం", hi: "24/7 किसान सलाह व सहायता केंद्र", ta: "24/7 விவசாய ஆலோசனை மையம்", kn: "24/7 ರೈತ ಸಲಹಾ ಕೇಂದ್ರ", mr: "24/7 शेतकरी सल्ला केंद्र", pa: "24/7 ਕਿਸਾਨ ਸਲਾਹ ਕੇਂਦਰ", bn: "২৪/৭ কৃষক পরামর্শ কেন্দ্র", gu: "24/7 ખેડૂત સલાહ કેન્દ્ર", ml: "24/7 കർഷക സഹായ കേന്ദ്രം" },
  title: { en: "How can we assist your farm today?", te: "ఈ రోజు మీ పొలానికి ఏ విధంగా సహాయపడగలం?", hi: "आज हम आपके खेत की क्या सहायता कर सकते हैं?", ta: "இன்று உங்கள் பண்ணைக்கு நாங்கள் எவ்வாறு உதவலாம்?", kn: "ಇಂದು ನಿಮ್ಮ ಕೃಷಿಗೆ ನಾವು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?", mr: "आज आम्ही तुमच्या शेतीला कशी मदत करू शकतो?", pa: "ਅੱਜ ਅਸੀਂ ਤੁਹਾਡੇ ਖੇਤ ਦੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹਾਂ?", bn: "আজ আপনার খামারে আমরা কীভাবে সাহায্য করতে পারি?", gu: "આજે અમે તમારા ખેતરને કેવી રીતે મદદ કરી શકીએ?", ml: "ഇന്ന് നിങ്ങളുടെ കൃഷിക്ക് എന്ത് സഹായമാണ് വേണ്ടത്?" },
  tab_ai: { en: "Instant AI Advisor", te: "తక్షణ AI సలహాదారు", hi: "त्वरित AI सलाहकार", ta: "உடனடி AI ஆலோசகர்", kn: "ತಕ್ಷಣದ AI ಸಲಹೆಗಾರ", mr: "झटपट AI सल्लागार", pa: "ਤੁਰੰਤ AI ਸਲਾਹਕਾਰ", bn: "তাৎক্ষণিক AI পরামর্শক", gu: "ત્વરિત AI સલાહકાર", ml: "തൽക്ഷണ AI ഉപദേശകൻ" },
  tab_report: { en: "Report Problem to Admin", te: "సమస్యను నివేదించండి", hi: "समस्या दर्ज करें", ta: "சிக்கலைப் புகாரளிக்கவும்", kn: "ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ", mr: "समस्या नोंदवा", pa: "ਸਮੱਸਿਆ ਦਰਜ ਕਰੋ", bn: "সমস্যা রিপোর্ট করুন", gu: "સમસ્યા નોંધાવો", ml: "പ്രശ്നം റിപ്പോർട്ട് ചെയ്യുക" },
  tab_gov: { en: "Govt Agronomist (Gram Sachivalayam)", te: "ప్రభుత్వ వ్యవసాయ అధికారి (రైతు భరోసా కేంద్రం)", hi: "सरकारी कृषि अधिकारी (ग्राम सचिवालय)", ta: "அரசு வேளாண் அதிகாரி", kn: "ಸರ್ಕಾರಿ ಕೃಷಿ ಅಧಿಕಾರಿ (ಗ್ರಾಮ ಸಚಿವಾಲಯ)", mr: "सरकारी कृषी अधिकारी", pa: "ਸਰਕਾਰੀ ਖੇਤੀਬਾੜੀ ਅਧਿਕਾਰੀ", bn: "সরকারি কৃষি কর্মকর্তা", gu: "સરકારી કૃષિ અધિકારી", ml: "സർക്കാർ കൃഷി ഓഫീസർ" },
  tab_tickets: { en: "My Support Tickets", te: "నా సమస్యల రికార్డులు", hi: "मेरी सहायता टिकट", ta: "எனது புகார்கள்", kn: "ನನ್ನ ದೂರುಗಳು", mr: "माझ्या तक्रारी", pa: "ਮੇਰੀਆਂ ਟਿਕਟਾਂ", bn: "আমার অভিযোগ", gu: "મારી ફરિયાદ", ml: "എന്റെ ടിക്കറ്റുകൾ" },
  ask_placeholder: { en: "Ask any farming or crop care question in your language...", te: "మీ పంట లేదా పురుగుల నివారణ గురించి ఏదైనా అడగండి...", hi: "अपनी फसल या कीट नियंत्रण के बारे में कोई भी प्रश्न पूछें...", ta: "உங்கள் பயிர் குறித்த கேள்விகளைக் கேளுங்கள்...", kn: "ನಿಮ್ಮ ಬೆಳೆ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ...", mr: "तुमच्या पिकाबद्दल कोणताही प्रश्न विचारा...", pa: "ਆਪਣੀ ਫਸਲ ਬਾਰੇ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛੋ...", bn: "ফসল সংক্রান্ত প্রশ্ন জিজ্ঞাসা করুন...", gu: "પાક અંગે કોઈ પ્રશ્ન પૂછો...", ml: "കൃഷി സംബന്ധമായ ചോദ്യങ്ങൾ ചോദിക്കുക..." },
  send: { en: "Send", te: "పంపండి", hi: "भेजें", ta: "அனுப்பு", kn: "ಕಳುಹಿಸಿ", mr: "पाठवा", pa: "ਭੇਜੋ", bn: "পাঠান", gu: "મોકલો", ml: "അയക്കുക" },
  escalate_btn: { en: "Escalate to Admin", te: "అడ్మిన్‌కు నివేదించండి", hi: "एडमिन को भेजें", ta: "நிர்வாகிக்கு அனுப்பு", kn: "ನಿರ್ವಾಹಕರಿಗೆ ಕಳುಹಿಸಿ", mr: "प्रशासकाकडे पाठवा", pa: "ਐਡਮਿਨ ਨੂੰ ਭੇਜੋ", bn: "অ্যাডমিনকে জানান", gu: "એડમિનને મોકલો", ml: "അഡ്മിന് കൈമാറുക" },
  submit_ticket: { en: "Submit Problem Report", te: "సమస్యను సమర్పించండి", hi: "समस्या रिपोर्ट जमा करें", ta: "புகாரை சமர்ப்பிக்கவும்", kn: "ದೂರು ಸಲ್ಲಿಸಿ", mr: "तक्रार नोंदवा", pa: "ਰਿਪੋਰਟ ਦਰਜ ਕਰੋ", bn: "রিপোর্ট জমা দিন", gu: "ફરિયાદ સબમિટ કરો", ml: "പരാതി സമർപ്പിക്കുക" }
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

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg_welcome",
      sender: "ai",
      text: t("auto_greeting", { name: user?.fullName.split(" ")[0] || "Farmer" }) ||
        "Hello! I am your AgroScan Farming Assistant. How can I help you today? You can ask about crop care, pest management, or report an issue.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState("");
  const [sendingAi, setSendingAi] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Problem Ticket form state
  const [ticketCategory, setTicketCategory] = useState<SupportTicket["category"]>("crop_disease");
  const [ticketCrop, setTicketCrop] = useState<string>("");
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketDesc, setTicketDesc] = useState("");
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState<SupportTicket | null>(null);

  // Government Agronomist form state
  const [govCrop, setGovCrop] = useState("");
  const [govProblem, setGovProblem] = useState("");
  const [submittingGov, setSubmittingGov] = useState(false);
  const [govReferralReceipt, setGovReferralReceipt] = useState<any | null>(null);

  // Tickets list
  const [myTickets, setMyTickets] = useState<SupportTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  useEffect(() => {
    cropsApi.list().then((res) => {
      if (Array.isArray(res)) {
        setRegisteredCrops(res);
        if (res.length > 0) {
          setTicketCrop(res[0].cropName);
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

  // Handle AI Chat Submit
  const handleSendAiMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuestion.trim() || sendingAi) return;

    const userText = inputQuestion.trim();
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: "farmer",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputQuestion("");
    setSendingAi(true);

    try {
      const res = await aiAssistantApi.chat({
        message: userText,
        language,
        farmerName: user?.fullName || "Farmer",
        registeredCrops: registeredCrops.map((c) => c.cropName),
        location: `${location.villageCity}, ${location.district}`,
      });

      const isComplaint =
        /damaged|ruined|wrong|failed|bug|error|complaint|emergency|help me please|loss|loss of crop/i.test(userText);

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: "ai",
        text: res.reply || "I am here to assist you with any crop or platform queries.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        canEscalate: isComplaint,
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: "ai",
          text: "I am having trouble answering right now. Please submit a support ticket or contact our extension agronomist below.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          canEscalate: true,
        },
      ]);
    } finally {
      setSendingAi(false);
    }
  };

  // Handle Ticket Form Submit
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketDesc.trim()) return;

    setSubmittingTicket(true);
    try {
      const res = await supportApi.createTicket({
        title: ticketTitle.trim() || (ticketCrop ? `Issue in ${ticketCrop}` : "Farmer Problem Report"),
        description: ticketDesc.trim(),
        cropName: ticketCrop || undefined,
        category: ticketCategory,
        location: `${location.villageCity}, ${location.district}`,
      });

      setTicketSuccess(res.ticket);
      setTicketTitle("");
      setTicketDesc("");
      loadMyTickets();
    } catch (err) {
      console.error("Ticket submission error:", err);
    } finally {
      setSubmittingTicket(false);
    }
  };

  // Handle Government Agronomist Referral Submit
  const handleGovReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!govProblem.trim()) return;

    setSubmittingGov(true);
    try {
      const res = await supportApi.createAgronomistReferral({
        cropName: govCrop || undefined,
        problemDescription: govProblem.trim(),
        villageCity: location.villageCity,
        district: location.district,
        state: location.state || "Andhra Pradesh",
      });

      setGovReferralReceipt(res.referralDetails);
      setGovProblem("");
      loadMyTickets();
    } catch (err) {
      console.error("Government referral error:", err);
    } finally {
      setSubmittingGov(false);
    }
  };

  return (
    <main className="workspace-page min-h-screen bg-[#f7f8f4] text-[#1c3827] pb-16">
      {/* Top Header */}
      <header className="workspace-topbar sticky top-0 z-40 bg-[#f7f8f4]/95 backdrop-blur border-b border-[#e1e6d7] px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="workspace-back inline-flex items-center gap-2 text-sm font-bold text-[#2f6b45] no-underline hover:underline">
          <ArrowLeft size={17} /> <span>{t("back_to_dashboard")}</span>
        </Link>
        <div className="flex items-center gap-2 font-display text-lg font-bold text-[#20402e]">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2f6b45] text-white">
            <HelpCircle size={18} />
          </span>
          <span>{t("help_desk")}</span>
        </div>
        <span className="hidden sm:inline-block text-xs font-extrabold uppercase tracking-wider text-[#456b52] bg-[#e5eddc] px-3 py-1 rounded-full">
          AI &amp; Govt Extension Support
        </span>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Title */}
        <div className="mb-6 text-center sm:text-left">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#2f6b45]">
            {str("eyebrow")}
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold text-[#193625]">
            {str("title")}
          </h1>
          <p className="mt-2 text-sm text-[#4d6957]">
            {location.villageCity}, {location.district}
          </p>
        </div>

        {/* 4 Navigation Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-[#d8e2cf] pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("ai_chat")}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "ai_chat"
                ? "bg-[#2f6b45] text-white shadow-md"
                : "bg-white text-[#294c36] border border-[#d8e2cf] hover:bg-[#eaf0e3]"
            }`}
          >
            <Bot size={15} /> {str("tab_ai")}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("report_problem");
              setTicketSuccess(null);
            }}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "report_problem"
                ? "bg-rose-700 text-white shadow-md"
                : "bg-white text-[#294c36] border border-[#d8e2cf] hover:bg-[#eaf0e3]"
            }`}
          >
            <AlertTriangle size={15} /> {str("tab_report")}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("gov_agronomist");
              setGovReferralReceipt(null);
            }}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "gov_agronomist"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-white text-[#294c36] border border-[#d8e2cf] hover:bg-[#eaf0e3]"
            }`}
          >
            <Building2 size={15} /> {str("tab_gov")}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("my_tickets")}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "my_tickets"
                ? "bg-[#20402e] text-white shadow-md"
                : "bg-white text-[#294c36] border border-[#d8e2cf] hover:bg-[#eaf0e3]"
            }`}
          >
            <FileText size={15} /> {str("tab_tickets")}
            {myTickets.length > 0 && (
              <span className="rounded-full bg-emerald-200 text-emerald-900 px-2 py-0.5 text-[10px] font-extrabold">
                {myTickets.length}
              </span>
            )}
          </button>
        </div>

        {/* ── TAB 1: AI Instant Advisory Chat ────────────────────────────── */}
        {activeTab === "ai_chat" && (
          <div className="rounded-3xl border border-[#d8e0cc] bg-white shadow-xl overflow-hidden flex flex-col h-[560px]">
            <div className="bg-[#2f6b45] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                  <Bot size={20} className="text-emerald-200" />
                </span>
                <div>
                  <h3 className="font-display font-bold text-sm">AgroScan AI Agronomist Desk</h3>
                  <p className="text-[11px] text-emerald-100">{location.villageCity}, {location.district}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("report_problem");
                  setTicketTitle(chatMessages[chatMessages.length - 1]?.text || "");
                }}
                className="text-[11px] font-bold bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-xl border border-white/20 text-white flex items-center gap-1 cursor-pointer"
              >
                <AlertTriangle size={12} className="text-amber-300" /> {str("escalate_btn")}
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#fbfcf9]">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "farmer" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                      msg.sender === "farmer"
                        ? "bg-[#2f6b45] text-white rounded-br-none"
                        : "bg-white border border-[#d8e0cc] text-[#193625] rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className={`block text-[10px] mt-1.5 ${msg.sender === "farmer" ? "text-emerald-100 text-right" : "text-[#718b7c]"}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.canEscalate && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("report_problem");
                        setTicketTitle(msg.text.slice(0, 50));
                      }}
                      className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl hover:bg-rose-100 cursor-pointer"
                    >
                      <AlertTriangle size={12} /> {str("escalate_btn")}
                    </button>
                  )}
                </div>
              ))}

              {sendingAi && (
                <div className="flex items-center gap-2 text-xs text-[#2f6b45] font-bold bg-white p-3 rounded-2xl border border-[#d8e0cc] w-fit shadow-sm">
                  <LoaderCircle size={15} className="animate-spin" />
                  <span>AgroScan AI is analyzing your crop query...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendAiMessage} className="p-3 bg-white border-t border-[#e2ebd9] flex gap-2">
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder={str("ask_placeholder")}
                className="flex-1 rounded-2xl border border-[#ccd8bf] bg-[#f8faf5] px-4 py-3 text-xs text-[#193825] focus:outline-none focus:ring-2 focus:ring-[#2f6b45]/30 font-medium"
              />
              <button
                type="submit"
                disabled={sendingAi || !inputQuestion.trim()}
                className="rounded-2xl bg-[#2f6b45] text-white px-5 py-3 text-xs font-bold shadow-md hover:bg-[#20492f] disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Send size={14} /> {str("send")}
              </button>
            </form>
          </div>
        )}

        {/* ── TAB 2: Report Problem Ticket to Admin ───────────────────────── */}
        {activeTab === "report_problem" && (
          <div className="rounded-3xl border border-[#d8e0cc] bg-white p-6 sm:p-8 shadow-xl">
            {ticketSuccess ? (
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={24} className="text-emerald-700" />
                  <h3 className="font-display text-xl font-bold text-emerald-950">Problem Ticket Created Successfully</h3>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Your ticket <strong>#{ticketSuccess.id}</strong> has been assigned to the AgroScan Admin team. You will see admin responses in your "My Support Tickets" tab.
                </p>
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("my_tickets")}
                    className="rounded-xl bg-[#2f6b45] px-4 py-2 text-xs font-bold text-white hover:bg-[#20492f] cursor-pointer"
                  >
                    View My Tickets
                  </button>
                  <button
                    type="button"
                    onClick={() => setTicketSuccess(null)}
                    className="rounded-xl border border-emerald-300 bg-white px-4 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-100 cursor-pointer"
                  >
                    Submit Another Ticket
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <h3 className="font-display text-xl font-bold text-[#183624] flex items-center gap-2">
                  <AlertTriangle size={20} className="text-rose-600" /> Report Crop or App Issue to Admin
                </h3>
                <p className="text-xs text-[#52705d]">
                  Our agricultural specialist will review your crop conditions, diagnostic photos, or system feedback.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#193625] mb-1">Issue Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value as any)}
                      className="w-full rounded-xl border border-[#cbd9c3] bg-[#f8faf5] px-3 py-2 text-xs font-semibold text-[#1a3826]"
                    >
                      <option value="crop_disease">Crop Disease &amp; Pest Escalation</option>
                      <option value="app_bug">App Bug / Feature Issue</option>
                      <option value="fertilizer_advice">Fertilizer &amp; Spray Query</option>
                      <option value="account">Account &amp; Location Setting</option>
                      <option value="other">Other Inquiries</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#193625] mb-1">Affected Crop (Optional)</label>
                    <select
                      value={ticketCrop}
                      onChange={(e) => setTicketCrop(e.target.value)}
                      className="w-full rounded-xl border border-[#cbd9c3] bg-[#f8faf5] px-3 py-2 text-xs font-semibold text-[#1a3826]"
                    >
                      <option value="">Select Crop (Optional)</option>
                      {registeredCrops.map((c) => (
                        <option key={c.id} value={c.cropName}>
                          {localizeCrop(c.cropName, language)} ({c.fieldName})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#193625] mb-1">Problem Subject / Title</label>
                  <input
                    type="text"
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value)}
                    placeholder="e.g. Yellowing leaf tips spreading rapidly after heavy rain"
                    className="w-full rounded-xl border border-[#cbd9c3] bg-[#f8faf5] px-3 py-2 text-xs text-[#1a3826]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#193625] mb-1">Detailed Description *</label>
                  <textarea
                    rows={4}
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    placeholder="Describe symptoms, chemical sprays already applied, and current field conditions..."
                    required
                    className="w-full rounded-xl border border-[#cbd9c3] bg-[#f8faf5] px-3 py-2 text-xs text-[#1a3826] focus:ring-2 focus:ring-[#2f6b45]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingTicket || !ticketDesc.trim()}
                  className="w-full sm:w-auto rounded-2xl bg-rose-700 hover:bg-rose-800 text-white px-6 py-3 text-xs font-bold shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {submittingTicket ? <LoaderCircle size={15} className="animate-spin" /> : <AlertTriangle size={15} />}
                  <span>{str("submit_ticket")}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── TAB 3: Government Agronomist Referral (Gram Sachivalayam) ────── */}
        {activeTab === "gov_agronomist" && (
          <div className="rounded-3xl border border-[#d8e0cc] bg-white p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                Government Department of Agriculture
              </span>
              <h3 className="font-display text-2xl font-bold text-[#183624] mt-2 flex items-center gap-2">
                <Building2 size={24} className="text-amber-600" /> Gram Sachivalayam &amp; Extension Agronomist Connect
              </h3>
              <p className="text-xs text-[#52705d] mt-1">
                Official village-level agricultural officer linkage for {location.villageCity}, {location.district} ({location.state}).
              </p>
            </div>

            {govReferralReceipt ? (
              <div className="rounded-3xl border-2 border-amber-400 bg-amber-50/70 p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900">
                      Official Referral Generated
                    </span>
                    <h4 className="font-display text-2xl font-extrabold text-[#173624] mt-1.5">
                      Ref #{govReferralReceipt.referenceNumber}
                    </h4>
                  </div>
                  <span className="h-10 w-10 flex items-center justify-center rounded-2xl bg-amber-500 text-gray-950">
                    <CheckCircle2 size={24} />
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#1c3827]">
                  <div className="p-3 bg-white rounded-2xl border border-amber-200">
                    <strong className="block text-amber-950">Government Office:</strong>
                    <span>{govReferralReceipt.department}</span>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-amber-200">
                    <strong className="block text-amber-950">Assigned Officer Role:</strong>
                    <span>{govReferralReceipt.assignedOfficerRole}</span>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-amber-200">
                    <strong className="block text-amber-950">Kisan Toll-Free Helpline:</strong>
                    <a href="tel:155251" className="text-[#2f6b45] font-bold hover:underline">
                      {govReferralReceipt.kisanTollFree}
                    </a>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-amber-200">
                    <strong className="block text-amber-950">Official Portal:</strong>
                    <a
                      href={govReferralReceipt.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2f6b45] font-bold hover:underline flex items-center gap-1"
                    >
                      {govReferralReceipt.portalUrl} <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("my_tickets")}
                    className="rounded-xl bg-[#2f6b45] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#20492f] cursor-pointer"
                  >
                    View in Ticket History
                  </button>
                  <button
                    type="button"
                    onClick={() => setGovReferralReceipt(null)}
                    className="rounded-xl border border-[#ccd8bf] bg-white px-5 py-2.5 text-xs font-bold text-[#244832] hover:bg-[#edf5e6] cursor-pointer"
                  >
                    Submit Another Referral
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGovReferral} className="space-y-4">
                <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200 text-xs text-amber-950">
                  <p className="font-bold flex items-center gap-1.5 mb-1">
                    <Building2 size={15} className="text-amber-700" />
                    Connecting to Gram Sachivalayam Rythu Bharosa Kendra ({location.villageCity}, {location.district})
                  </p>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    This channel generates an official agricultural extension referral for field inspection, soil health verification, or subsidized inputs from local government officers.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#193625] mb-1">Crop / Farm Concern</label>
                  <select
                    value={govCrop}
                    onChange={(e) => setGovCrop(e.target.value)}
                    className="w-full rounded-xl border border-[#cbd9c3] bg-[#f8faf5] px-3 py-2 text-xs font-semibold text-[#1a3826]"
                  >
                    {registeredCrops.map((c) => (
                      <option key={c.id} value={c.cropName}>
                        {localizeCrop(c.cropName, language)} ({c.fieldName})
                      </option>
                    ))}
                    <option value="Rice (Paddy)">Rice (Paddy)</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Maize">Maize</option>
                    <option value="Cotton">Cotton</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#193625] mb-1">Problem / Scheme Request</label>
                  <textarea
                    rows={4}
                    value={govProblem}
                    onChange={(e) => setGovProblem(e.target.value)}
                    placeholder="Specify the problem for the Village Agriculture Assistant (VAA) or scheme details requested..."
                    required
                    className="w-full rounded-xl border border-[#cbd9c3] bg-[#f8faf5] px-3 py-2 text-xs text-[#1a3826] focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingGov || !govProblem.trim()}
                  className="w-full sm:w-auto rounded-2xl bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 text-xs font-bold shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {submittingGov ? <LoaderCircle size={15} className="animate-spin" /> : <Building2 size={15} />}
                  <span>Generate Government Referral</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── TAB 4: My Support Tickets History ──────────────────────────── */}
        {activeTab === "my_tickets" && (
          <div className="rounded-3xl border border-[#d8e0cc] bg-white p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#e5edd8] pb-3">
              <div>
                <h3 className="font-display text-xl font-bold text-[#183624]">My Support Tickets &amp; Referrals</h3>
                <p className="text-xs text-[#52705d]">Track status and responses from Admin and Govt extension officers</p>
              </div>
              <button
                type="button"
                onClick={loadMyTickets}
                className="flex items-center gap-1 rounded-xl bg-gray-100 hover:bg-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 cursor-pointer"
              >
                <RefreshCw size={13} className={loadingTickets ? "animate-spin" : ""} /> Refresh
              </button>
            </div>

            {loadingTickets ? (
              <div className="py-12 flex justify-center items-center gap-2 text-xs font-bold text-[#2f6b45]">
                <LoaderCircle size={20} className="animate-spin" /> Loading your ticket records...
              </div>
            ) : myTickets.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#52705d]">
                <FileText size={32} className="mx-auto mb-2 text-[#9bb09e]" />
                <p className="font-bold text-[#183624]">No support tickets logged yet.</p>
                <p className="mt-1">You can ask questions to AI or report problems anytime above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="rounded-2xl border border-[#d8e2cf] bg-[#fafcf7] p-4 space-y-2 hover:border-[#2f6b45]/40 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                          ticket.status === "Resolved"
                            ? "bg-emerald-100 text-emerald-800"
                            : ticket.status === "In Progress"
                            ? "bg-sky-100 text-sky-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {localizeStatus(ticket.status, language)}
                        </span>
                        <span className="rounded-md bg-[#e5eddc] px-2 py-0.5 text-[10px] font-bold text-[#2f6b45]">
                          {localizeCategory(ticket.category, language)}
                        </span>
                        {ticket.cropName && (
                          <span className="text-xs font-bold text-[#1c3827]">
                            Crop: {localizeCrop(ticket.cropName, language)}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#607d6b] flex items-center gap-1">
                        <Clock size={12} /> {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="font-display text-sm font-bold text-[#193825]">{ticket.title}</h4>
                    <p className="text-xs text-[#415e4c] leading-relaxed">{ticket.description}</p>

                    {ticket.resolutionNotes && (
                      <div className="mt-2 rounded-xl bg-emerald-50/80 p-3 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                        <strong className="block text-emerald-900 font-bold">Admin Response / Agronomist Advice:</strong>
                        <p>{ticket.resolutionNotes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
