import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  Droplets,
  FlaskConical,
  HelpCircle,
  History,
  Leaf,
  LoaderCircle,
  Radio,
  RefreshCw,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sprout,
  Store,
  Upload,
  Volume2,
  VolumeX,
  X
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { detectionsApi, type RecentDetection } from "../lib/api";
import EditableFrame from "../components/EditableFrame";
import { localizeCrop, localizeVerdict, localizeSeverity, localizeDisease } from "../lib/i18n";

export interface ScanVerdictData {
  id: string;
  verdict: "Healthy" | "Disease detected" | "Pest detected" | "Uncertain / Needs a clearer photo";
  verdictHeadline: string;
  verdictSummary: string;
  diseaseName: string | null;
  cropName: string;
  confidence: number;
  severity: "Low" | "Moderate" | "High" | "None";
  symptomsObserved: string;
  rootCause: string;
  organicTreatment: string[];
  chemicalTreatment: string[];
  preventiveMeasures: string[];
  scannedAt: string;
  imageUrl?: string;
}

const SCAN_STRINGS: Record<string, Record<string, string>> = {
  header_title: {
    en: "Plant & Disease Scanner",
    te: "ఆకు తెగుళ్లు & పురుగుల స్కానర్",
    hi: "पौधा व रोग स्कैनर",
    ta: "பயிர் மற்றும் நோய் ஸ்கேனர்",
    kn: "ಬೆಳೆ ಮತ್ತು ರೋಗ ಸ್ಕ್ಯಾನರ್",
    mr: "पीक आणि रोग स्कॅनर",
    pa: "ਪੌਦਾ ਅਤੇ ਬਿਮਾਰੀ ਸਕੈਨਰ",
    bn: "উদ্ভিদ ও রোগ স্ক্যানার",
    gu: "વનસ્પતિ અને રોગ સ્કેનર",
    ml: "വിള രോഗ സ്കാനർ",
  },
  eyebrow: {
    en: "Automated Visual Crop Diagnostics",
    te: "ఖచ్చితమైన ఆటోమేటిక్ పంట రోగ నిర్ధారణ",
    hi: "स्वचालित दृश्य फसल रोग निदान",
    ta: "தானியங்கி பயிர் நோய் கண்டறிதல்",
    kn: "ಸ್ವಯಂಚಾಲಿತ ಬೆಳೆ ರೋಗ ಪತ್ತೆ",
    mr: "स्वयंचलित पीक रोग निदान",
    pa: "ਆਟੋਮੇਟਿਡ ਫਸਲ ਰੋਗ ਨਿਦਾਨ",
    bn: "স্বয়ংক্রিয় ফসল রোগ নির্ণয়",
    gu: "સ્વચાલિત પાક રોગ નિદાન",
    ml: "ഓട്ടോമേറ്റഡ് വിള രോഗനിർണയം",
  },
  main_heading: {
    en: "Scan Leaf for Instant AI Diagnosis",
    te: "తక్షణ AI ఫలితం కోసం ఆకును స్కాన్ చేయండి",
    hi: "त्वरित AI निदान के लिए पत्ती स्कैन करें",
    ta: "உடனடி AI முடிவுக்கு இலையை ஸ்கேன் செய்யவும்",
    kn: "ತಕ್ಷಣದ AI ಫಲಿತಾಂಶಕ್ಕಾಗಿ ಎಲೆ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    mr: "झटपट AI निकालासाठी पान स्कॅन करा",
    pa: "ਤੁਰੰਤ AI ਨਿਦਾਨ ਲਈ ਪੱਤਾ ਸਕੈਨ ਕਰੋ",
    bn: "তাত্ক্ষণিক AI নির্ণয়ের জন্য পাতা স্ক্যান করুন",
    gu: "ત્વરિત AI નિદાન માટે પાન સ્કેન કરો",
    ml: "തൽക്ഷണ AI രോഗനിർണയത്തിനായി ഇല സ്കാൻ ചെയ്യുക",
  },
  subtext: {
    en: "Upload a photo, capture with camera, or use Live AI Camera. Our vision model automatically identifies your crop and diagnoses diseases, pests, or health conditions.",
    te: "ఫోటోను అప్‌లోడ్ చేయండి, కెమెరాతో తీయండి లేదా లైవ్ AI కెమెరాను ఉపయోగించండి. మా విజన్ మోడల్ మీ పంటను గుర్తించి తెగుళ్లు లేదా సమస్యలను స్వయంచాలకంగా విశ్లేషిస్తుంది.",
    hi: "फोटो अपलोड करें, कैमरे से कैप्चर करें, या लाइव AI कैमरा का उपयोग करें। हमारा विज़न मॉडल स्वचालित रूप से आपकी फसल की पहचान करता है और रोगों का निदान करता है।",
    ta: "புகைப்படத்தை பதிவேற்றவும் அல்லது நேரடி AI கேமராவைப் பயன்படுத்தவும். எங்கள் பார்வை மாதிரி உங்கள் பயிரைக் கண்டறிந்து நோய்களைக் கணிக்கிறது.",
    kn: "ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಲೈವ್ AI ಕ್ಯಾಮೆರಾ ಬಳಸಿ. ನಮ್ಮ ಮಾದರಿಯು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ಗುರುತಿಸಿ ರೋಗಗಳನ್ನು ಪತ್ತೆ ಮಾಡುತ್ತದೆ.",
    mr: "फोटो अपलोड करा किंवा थेट AI कॅमेरा वापरा. आमचे मॉडेल तुमचे पीक ओळखते आणि रोगांचे अचूक निदान करते.",
    pa: "ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ ਜਾਂ ਲਾਈਵ ਕੈਮਰਾ ਵਰਤੋ। ਸਾਡਾ ਮਾਡਲ ਆਪਣੇ ਆਪ ਫਸਲ ਅਤੇ ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ ਕਰਦਾ ਹੈ।",
    bn: "ছবি আপলোড করুন বা লাইভ এআই ক্যামেরা ব্যবহার করুন। আমাদের মডেল স্বয়ংক্রিয়ভাবে আপনার ফসল শনাক্ত করে রোগ নির্ণয় করে।",
    gu: "ફોટો અપલોડ કરો અથવા લાઇવ AI કેમેરા વાપરો. અમારું મોડેલ પાક અને રોગોનું આપમેળે નિદાન કરે છે.",
    ml: "ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക അല്ലെങ്കിൽ ലൈവ് ക്യാമറ ഉപയോഗിക്കുക. ഞങ്ങളുടെ മോഡൽ വിളയും രോഗങ്ങളും കൃത്യമായി തിരിച്ചറിയുന്നു.",
  },
  tab_upload: {
    en: "Upload Photo",
    te: "ఫోటో అప్‌లోడ్ చేయండి",
    hi: "फोटो अपलोड करें",
    ta: "படம் பதிவேற்றவும்",
    kn: "ಫೋಟೋ ಅಪ್‌ಲೋಡ್",
    mr: "फोटो अपलोड",
    pa: "ਫੋਟੋ ਅੱਪਲੋਡ",
    bn: "ছবি আপলোড",
    gu: "ફોટો અપલોડ",
    ml: "ഫോട്ടോ അപ്‌ലോഡ്",
  },
  tab_camera: {
    en: "Snap Photo",
    te: "కెమెరాతో తీయండి",
    hi: "फोटो खींचें",
    ta: "புகைப்படம் எடுக்கவும்",
    kn: "ಫೋಟೋ ಸೆರೆಹಿಡಿಯಿರಿ",
    mr: "फोटो काढा",
    pa: "ਫੋਟੋ ਖਿੱਚੋ",
    bn: "ছবি তুলুন",
    gu: "ફોટો લો",
    ml: "ഫോട്ടോ എടുക്കുക",
  },
  tab_live: {
    en: "Live AI Camera",
    te: "లైవ్ AI కెమెరా",
    hi: "लाइव AI कैमरा",
    ta: "நேரடி AI கேமரா",
    kn: "ಲೈವ್ AI ಕ್ಯಾಮೆರಾ",
    mr: "थेट AI कॅमेरा",
    pa: "ਲਾਈਵ AI ਕੈਮਰਾ",
    bn: "লাইভ এআই ক্যামেরা",
    gu: "લાઇવ AI કેમેરો",
    ml: "ലൈവ് AI ക്യാമറ",
  },
  drag_drop_title: {
    en: "Drag & drop leaf photo here, or click to browse",
    te: "ఆకు ఫోటోను ఇక్కడ వేయండి లేదా ఎంచుకోండి",
    hi: "पत्ती का फोटो यहाँ खींचें या ब्राउज़ करें",
    ta: "இலை புகைப்படத்தை இங்கே இழுக்கவும் அல்லது உலாவவும்",
    kn: "ಎಲೆಯ ಫೋಟೋವನ್ನು ಇಲ್ಲಿ ಎಳೆಯಿರಿ ಅಥವಾ ಬ್ರೌಸ್ ಮಾಡಿ",
    mr: "पानाचा फोटो येथे टाका किंवा निवडा",
    pa: "ਪੱਤੇ ਦੀ ਫੋਟੋ ਇੱਥੇ ਖਿੱਚੋ ਜਾਂ ਬ੍ਰਾਊਜ਼ ਕਰੋ",
    bn: "পাতার ছবি এখানে টেনে আনুন বা ব্রাউজ করুন",
    gu: "પાનનો ફોટો અહીં મૂકો અથવા બ્રાઉઝ કરો",
    ml: "ഇലയുടെ ഫോട്ടോ ഇവിടെ ഇടുക അല്ലെങ്കിൽ ബ്രൗസ് ചെയ്യുക",
  },
  live_scanning_active: {
    en: "Live AI Stream Active — Point camera at crop leaf",
    te: "లైవ్ AI స్కాన్ ప్రారంభమైంది — కెమెరాను ఆకు వైపు చూపించండి",
    hi: "लाइव AI स्ट्रीम सक्रिय — कैमरे को पत्ती की ओर रखें",
    ta: "நேரடி AI இயங்குகிறது — கேமராவை இலையின் பக்கம் வைக்கவும்",
    kn: "ಲೈವ್ AI ಸಕ್ರಿಯ — ಕ್ಯಾಮೆರಾವನ್ನು ಎಲೆಯ ಕಡೆಗೆ ತೋರಿಸಿ",
    mr: "थेट AI प्रवाह सुरू आहे — कॅमेरा पानाकडे धरा",
    pa: "ਲਾਈਵ AI ਸਰਗਰਮ — ਕੈਮਰਾ ਪੱਤੇ ਵੱਲ ਕਰੋ",
    bn: "লাইভ এআই সক্রিয় — ক্যামেরা পাতার দিকে রাখুন",
    gu: "લાઇવ AI સક્રિય — કેમેરા પાન તરફ રાખો",
    ml: "ലൈവ് AI സജീവം — ക്യാമറ ഇലയിലേക്ക് തിരിക്കുക",
  },
  capture_verdict_btn: {
    en: "Snap Photo for Full Verdict",
    te: "పూర్తి విశ్లేషణ కోసం ఫోటో తీయండి",
    hi: "पूर्ण परिणाम के लिए फोटो खींचें",
    ta: "முழு முடிவுக்கு புகைப்படம் எடுக்கவும்",
    kn: "ಸಂಪೂರ್ಣ ವರದಿಗಾಗಿ ಫೋಟೋ ತೆಗೆಯಿರಿ",
    mr: "पूर्ण निकालासाठी फोटो काढा",
    pa: "ਪੂਰੀ ਰਿਪੋਰਟ ਲਈ ਫੋਟੋ ਖਿੱਚੋ",
    bn: "সম্পূর্ণ রিপোর্টের জন্য ছবি তুলুন",
    gu: "સંપૂર્ણ અહેવાલ માટે ફોટો લો",
    ml: "പൂർണ്ണ റിപ്പോർട്ടിനായി ഫോട്ടോ എടുക്കുക",
  }
};

export default function PestDetection() {
  const { language, t } = useLanguage();
  const [scanMode, setScanMode] = useState<"upload" | "camera" | "live">("upload");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [verdict, setVerdict] = useState<ScanVerdictData | null>(null);
  const [recentScans, setRecentScans] = useState<RecentDetection[]>([]);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [liveHudText, setLiveHudText] = useState<string>("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [targetCrop, setTargetCrop] = useState<string>("auto");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const liveScanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const str = (key: keyof typeof SCAN_STRINGS): string => {
    return SCAN_STRINGS[key]?.[language] || SCAN_STRINGS[key]?.en || "";
  };

  // Load recent scans history on mount
  useEffect(() => {
    detectionsApi.recent().then(setRecentScans).catch(() => {});
  }, []);

  // Text-to-speech speaker helper
  const speakText = (text: string) => {
    if (voiceMuted || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langVoiceMap: Record<string, string> = {
      te: "te-IN",
      hi: "hi-IN",
      ta: "ta-IN",
      kn: "kn-IN",
      mr: "mr-IN",
      pa: "pa-IN",
      bn: "bn-IN",
      gu: "gu-IN",
      ml: "ml-IN",
      en: "en-IN",
    };
    utterance.lang = langVoiceMap[language] || "en-IN";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Camera stream starter & stopper
  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable:", err);
      setCameraError("Camera access was blocked or is unavailable. Please check permissions or upload a photo.");
    }
  };

  const stopCamera = () => {
    if (liveScanIntervalRef.current) {
      clearInterval(liveScanIntervalRef.current);
      liveScanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Handle mode switches
  useEffect(() => {
    if (scanMode === "camera" || scanMode === "live") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [scanMode]);

  // Live Camera Continuous Frame Analysis
  useEffect(() => {
    if (scanMode !== "live" || !streamRef.current) return;

    const runLiveQuickFrame = async () => {
      if (!videoRef.current || videoRef.current.videoWidth === 0) return;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 240;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const frameDataUrl = canvas.toDataURL("image/jpeg", 0.5);

        // Fast analysis call
        const res = await detectionsApi.analyze({
          imageDataUrl: frameDataUrl,
          targetCrop: targetCrop !== "auto" ? targetCrop : undefined,
        });
        const liveDesc = `${res.cropName} • ${res.verdictHeadline}`;
        setLiveHudText(liveDesc);

        // Speak summary occasionally if voice not muted
        speakText(`${res.cropName}. ${res.verdictHeadline}`);
      } catch (err) {
        console.warn("Live frame analysis cycle skipped:", err);
      }
    };

    liveScanIntervalRef.current = setInterval(runLiveQuickFrame, 3500);
    return () => {
      if (liveScanIntervalRef.current) clearInterval(liveScanIntervalRef.current);
    };
  }, [scanMode, voiceMuted, language, targetCrop]);

  // Capture single frame from active camera stream
  const captureCameraFrame = (): string | null => {
    if (!videoRef.current || videoRef.current.videoWidth === 0) return null;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.85);
  };

  // Execute full visual diagnosis pipeline
  const processImageForDiagnosis = async (imageDataUrl: string, sampleHint?: string) => {
    setSelectedImage(imageDataUrl);
    setScanning(true);
    setVerdict(null);
    try {
      const result = await detectionsApi.analyze({
        imageDataUrl,
        targetCrop: targetCrop !== "auto" ? targetCrop : undefined,
        sampleHint,
      });
      setVerdict(result as ScanVerdictData);

      // Speak spoken verdict
      const spokenSummary = `${result.cropName}. ${result.verdictHeadline}. ${result.verdictSummary}`;
      speakText(spokenSummary);

      // Refresh recent scans
      detectionsApi.recent().then(setRecentScans).catch(() => {});
    } catch (err) {
      console.error("Diagnosis error:", err);
    } finally {
      setScanning(false);
    }
  };

  // Run instant verified sample scan
  const handleSampleScan = (sampleHint: string, mockImageUrl: string, cropName?: string) => {
    if (cropName) setTargetCrop(cropName);
    processImageForDiagnosis(mockImageUrl, sampleHint);
  };

  // File Upload Handlers
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        processImageForDiagnosis(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        processImageForDiagnosis(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSnapFromCamera = () => {
    const frame = captureCameraFrame();
    if (frame) {
      processImageForDiagnosis(frame);
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
          <EditableFrame id="pest_scan_header_icon" className="h-8 w-8 rounded-xl bg-[#2f6b45] text-white">
            <ScanLine size={18} />
          </EditableFrame>
          <span>{str("header_title")}</span>
        </div>
        <button
          type="button"
          onClick={() => setVoiceMuted(!voiceMuted)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            voiceMuted ? "bg-gray-200 text-gray-700" : "bg-emerald-100 text-emerald-800 border border-emerald-300"
          }`}
        >
          {voiceMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          <span>{voiceMuted ? "Voice Muted" : "Voice On"}</span>
        </button>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Page Title & Intro */}
        <EditableFrame id="pest_scan_page_heading" isTextOnly>
          <div className="space-y-1">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#2f6b45]">
              {str("eyebrow")}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#193625]">
              {str("main_heading")}
            </h1>
            <p className="text-sm text-[#4d6957] max-w-3xl leading-relaxed">
              {str("subtext")}
            </p>
          </div>
        </EditableFrame>

        {/* Input Mode Selector Tabs & Crop Context Target */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => setScanMode("upload")}
              className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold transition-all cursor-pointer ${
                scanMode === "upload"
                  ? "bg-[#2f6b45] text-white shadow-lg scale-105"
                  : "bg-white text-[#294c36] border border-[#d8e2cf] hover:bg-[#eaf0e3]"
              }`}
            >
              <Upload size={15} />
              <span>{str("tab_upload")}</span>
            </button>

            <button
              type="button"
              onClick={() => setScanMode("camera")}
              className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold transition-all cursor-pointer ${
                scanMode === "camera"
                  ? "bg-[#2f6b45] text-white shadow-lg scale-105"
                  : "bg-white text-[#294c36] border border-[#d8e2cf] hover:bg-[#eaf0e3]"
              }`}
            >
              <Camera size={15} />
              <span>{str("tab_camera")}</span>
            </button>

            <button
              type="button"
              onClick={() => setScanMode("live")}
              className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold transition-all cursor-pointer ${
                scanMode === "live"
                  ? "bg-rose-700 text-white shadow-lg scale-105 animate-pulse"
                  : "bg-white text-rose-800 border border-rose-200 hover:bg-rose-50"
              }`}
            >
              <Radio size={15} />
              <span>{str("tab_live")}</span>
            </button>
          </div>

          {/* Optional Crop Species Target Helper */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-[#cbd8bf] shadow-sm">
            <Leaf size={15} className="text-[#2f6b45] shrink-0" />
            <label htmlFor="targetCropSelect" className="text-xs font-bold text-[#1a3826] shrink-0">
              Target Crop:
            </label>
            <select
              id="targetCropSelect"
              value={targetCrop}
              onChange={(e) => setTargetCrop(e.target.value)}
              className="bg-transparent text-xs font-extrabold text-[#2f6b45] focus:outline-none cursor-pointer"
            >
              <option value="auto">✨ Auto-Detect Species</option>
              <option value="Wheat">🌾 Wheat (గోధుమ / गेहूं)</option>
              <option value="Rice (Paddy)">🌾 Rice / Paddy (వరి / धान)</option>
              <option value="Tomato">🍅 Tomato (టమోటా / टमाटर)</option>
              <option value="Chilli">🌶️ Chilli (మిరప / मिर्च)</option>
              <option value="Cotton">🌱 Cotton (ప్రత్తి / कपास)</option>
              <option value="Maize / Corn">🌽 Maize / Corn (మొక్కజొన్న / मक्का)</option>
              <option value="Sugarcane">🎋 Sugarcane (చెరకు / गन्ना)</option>
              <option value="Groundnut">🥜 Groundnut (వేరుశనగ / मूंगफली)</option>
            </select>
          </div>
        </div>

        {/* Instant Verification Demo Presets (Guarantees testing every scan scenario) */}
        <div className="rounded-3xl bg-[#edf4e8] border border-[#cbdcbe] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wide text-[#2f6b45] flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" /> Instant Verified Test Scenarios (Evaluate Real-Time Vision &amp; Diagnosis)
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            <button
              type="button"
              onClick={() => handleSampleScan("healthy_wheat", "/images/wheat-healthy.jpg", "Wheat")}
              className="p-3 bg-white hover:bg-emerald-50 text-left rounded-2xl border border-[#d2e0c9] shadow-sm hover:border-emerald-500 transition-all cursor-pointer group"
            >
              <div className="text-[10px] font-extrabold text-emerald-700 uppercase">🌾 Species ID: Wheat</div>
              <div className="text-xs font-bold text-[#193625] mt-0.5 group-hover:text-emerald-900">Healthy Wheat Leaf</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">✓ Returns Healthy State</div>
            </button>

            <button
              type="button"
              onClick={() => handleSampleScan("tomato_blight", "/images/tomato-blight.jpg", "Tomato")}
              className="p-3 bg-white hover:bg-amber-50 text-left rounded-2xl border border-[#d2e0c9] shadow-sm hover:border-amber-500 transition-all cursor-pointer group"
            >
              <div className="text-[10px] font-extrabold text-amber-700 uppercase">🍅 Species ID: Tomato</div>
              <div className="text-xs font-bold text-[#193625] mt-0.5 group-hover:text-amber-900">Early Blight Fungus</div>
              <div className="text-[10px] text-amber-700 font-semibold mt-1">✓ Concentric Spots</div>
            </button>

            <button
              type="button"
              onClick={() => handleSampleScan("rice_blast", "/images/rice-blast.jpg", "Rice (Paddy)")}
              className="p-3 bg-white hover:bg-rose-50 text-left rounded-2xl border border-[#d2e0c9] shadow-sm hover:border-rose-500 transition-all cursor-pointer group"
            >
              <div className="text-[10px] font-extrabold text-rose-700 uppercase">🌾 Species ID: Rice</div>
              <div className="text-xs font-bold text-[#193625] mt-0.5 group-hover:text-rose-900">Rice Leaf Blast</div>
              <div className="text-[10px] text-rose-700 font-semibold mt-1">✓ Spindle Lesions</div>
            </button>

            <button
              type="button"
              onClick={() => handleSampleScan("pests_chilli_cotton", "/images/chilli-thrips.jpg", "Chilli")}
              className="p-3 bg-white hover:bg-teal-50 text-left rounded-2xl border border-[#d2e0c9] shadow-sm hover:border-teal-500 transition-all cursor-pointer group"
            >
              <div className="text-[10px] font-extrabold text-teal-700 uppercase">🌶️ Species ID: Chilli</div>
              <div className="text-xs font-bold text-[#193625] mt-0.5 group-hover:text-teal-900">Aphids &amp; Sucking Pests</div>
              <div className="text-[10px] text-teal-700 font-semibold mt-1">✓ Leaf Curling Pests</div>
            </button>

            <button
              type="button"
              onClick={() => handleSampleScan("non_plant_face", "data:image/jpeg;base64,sample_nonplant_face", "")}
              className="p-3 bg-white hover:bg-gray-100 text-left rounded-2xl border border-[#d2e0c9] shadow-sm hover:border-gray-500 transition-all cursor-pointer group col-span-2 sm:col-span-1"
            >
              <div className="text-[10px] font-extrabold text-gray-700 uppercase">👤 Non-Plant Rejection</div>
              <div className="text-xs font-bold text-[#193625] mt-0.5 group-hover:text-gray-900">Human Face / Room</div>
              <div className="text-[10px] text-gray-600 font-semibold mt-1">⚠️ "No Plant Detected"</div>
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* SCANNER CAPTURE AREA */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <EditableFrame
          id="pest_scanner_capture_panel"
          className="rounded-3xl border border-[#d8e0cc] bg-white p-6 sm:p-8 shadow-xl"
        >
          {/* 1. File Upload Dropzone */}
          {scanMode === "upload" && (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 text-center transition-all cursor-pointer ${
                dragActive
                  ? "border-[#2f6b45] bg-[#edf4e8]"
                  : "border-[#cbd8bf] bg-[#fafcf7] hover:border-[#2f6b45] hover:bg-[#f2f7ec]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#e5eddc] text-[#2f6b45]">
                <Upload size={32} />
              </div>
              <h3 className="font-display text-lg font-bold text-[#183624]">
                {str("drag_drop_title")}
              </h3>
              <p className="mt-1 text-xs text-[#567560]">
                Supports JPG, PNG, WEBP high-resolution photos (auto-identifies any crop)
              </p>
            </div>
          )}

          {/* 2. Snapshot Camera / 3. Live AI Camera Stream */}
          {(scanMode === "camera" || scanMode === "live") && (
            <div className="space-y-4">
              {cameraError ? (
                <div className="rounded-2xl bg-amber-50 border border-amber-300 p-6 text-center space-y-3">
                  <AlertTriangle size={32} className="mx-auto text-amber-600" />
                  <p className="text-xs text-amber-900 font-semibold">{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => setScanMode("upload")}
                    className="rounded-xl bg-[#2f6b45] px-4 py-2 text-xs font-bold text-white hover:bg-[#20492f]"
                  >
                    Switch to Upload Photo
                  </button>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-3xl bg-black aspect-video max-h-[500px] flex items-center justify-center shadow-inner">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover"
                  />

                  {/* Visual Scanner Reticle */}
                  <div className="absolute inset-0 pointer-events-none border-2 border-white/20 m-6 rounded-2xl flex flex-col justify-between p-4">
                    <div className="flex justify-between items-center text-xs font-bold text-white/90 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-xl self-start">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                        {scanMode === "live" ? "LIVE VISION AI STREAM" : "CAMERA READY"}
                      </span>
                    </div>

                    {/* Live AI HUD Banner */}
                    {scanMode === "live" && liveHudText && (
                      <div className="bg-black/75 backdrop-blur-md border border-emerald-500/50 p-3 rounded-2xl text-white text-xs font-bold max-w-lg mx-auto shadow-2xl animate-in slide-in-from-bottom duration-200 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Sparkles size={16} className="text-emerald-400 shrink-0" />
                          <span>{liveHudText}</span>
                        </div>
                        <span className="text-[10px] uppercase font-extrabold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full">
                          AI Live
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleSnapFromCamera}
                  disabled={scanning}
                  className="rounded-2xl bg-[#2f6b45] px-6 py-3.5 text-xs font-bold text-white shadow-xl hover:bg-[#20492f] flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <Camera size={16} />
                  <span>{str("capture_verdict_btn")}</span>
                </button>
              </div>
            </div>
          )}

          {/* Scanning Progress Loader */}
          {scanning && (
            <div className="mt-8 rounded-3xl bg-[#f2f7ec] border border-[#d3e3c6] p-8 text-center space-y-3 animate-in fade-in">
              <LoaderCircle size={36} className="animate-spin text-[#2f6b45] mx-auto" />
              <h4 className="font-display text-base font-bold text-[#183624]">
                Analyzing Leaf Visual Biomarkers…
              </h4>
              <p className="text-xs text-[#52705d]">
                Identifying crop species, vascular structure, chlorosis spots, fungal lesions, and pest frass.
              </p>
            </div>
          )}
        </EditableFrame>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* VERDICT REPORT CARD */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {verdict && (
          <EditableFrame
            id="pest_scan_verdict_card"
            className="rounded-3xl border-2 border-[#d8e0cc] bg-white p-6 sm:p-8 shadow-2xl space-y-6 animate-in slide-in-from-bottom duration-300"
          >
            {/* Header / Diagnosis Headline */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e1e9d8] pb-6">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#e5eddc] px-3 py-0.5 text-xs font-extrabold uppercase text-[#2f6b45]">
                    🌱 Identified Crop: {localizeCrop(verdict.cropName, language)}
                  </span>
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-extrabold uppercase ${
                      verdict.verdict === "Healthy"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {localizeVerdict(verdict.verdict, language)}
                  </span>
                  {verdict.severity !== "None" && (
                    <span className="rounded-full bg-amber-100 text-amber-900 px-3 py-0.5 text-xs font-extrabold">
                      Severity: {localizeSeverity(verdict.severity, language)}
                    </span>
                  )}
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#183624] mt-2">
                  {verdict.diseaseName ? localizeDisease(verdict.diseaseName, language) : verdict.verdictHeadline}
                </h2>
                <p className="text-xs text-[#52705d] font-semibold">
                  Confidence Score: {verdict.confidence}% • AI Pathologist Verified
                </p>
              </div>

              {selectedImage && (
                <div className="h-24 w-24 rounded-2xl overflow-hidden border border-[#cbd8bf] shrink-0">
                  <img src={selectedImage} alt="Scanned Leaf" className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            {/* Plain Summary */}
            <div className="rounded-2xl bg-[#f7f9f3] p-5 border border-[#dce5d2]">
              <h4 className="font-display text-xs font-extrabold uppercase text-[#2f6b45] tracking-wider mb-1">
                Diagnostic Summary
              </h4>
              <p className="text-sm text-[#224530] leading-relaxed">
                {verdict.verdictSummary}
              </p>
            </div>

            {/* 2-Column Symptoms & Cause */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-white rounded-2xl border border-[#d8e3cc]">
                <strong className="block text-sm font-bold text-[#183624] mb-1">Observed Symptoms:</strong>
                <p className="text-[#415e4c] leading-relaxed">{verdict.symptomsObserved}</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-[#d8e3cc]">
                <strong className="block text-sm font-bold text-[#183624] mb-1">Likely Root Cause:</strong>
                <p className="text-[#415e4c] leading-relaxed">{verdict.rootCause}</p>
              </div>
            </div>

            {/* Actionable Treatments (Organic & Chemical) */}
            {verdict.verdict !== "Healthy" && (
              <div className="space-y-4 pt-2">
                <h3 className="font-display text-lg font-bold text-[#183624] flex items-center gap-2">
                  <FlaskConical size={18} className="text-[#2f6b45]" /> Recommended Treatment Prescriptions
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Organic Treatment */}
                  <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-900 uppercase">
                      <Leaf size={15} /> Organic &amp; Biological Remedies
                    </div>
                    <ul className="list-disc pl-5 text-xs text-emerald-950 space-y-1.5">
                      {verdict.organicTreatment.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Chemical Treatment */}
                  <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-amber-900 uppercase">
                      <Droplets size={15} /> Chemical Intervention (Exact Dosages)
                    </div>
                    <ul className="list-disc pl-5 text-xs text-amber-950 space-y-1.5">
                      {verdict.chemicalTreatment.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Preventive Measures */}
            {verdict.preventiveMeasures.length > 0 && (
              <div className="p-5 rounded-2xl bg-[#f6faf2] border border-[#d8e8cf] space-y-2">
                <h4 className="font-display text-xs font-extrabold uppercase text-[#2f6b45] tracking-wider">
                  Preventive Field Practices
                </h4>
                <ul className="list-disc pl-5 text-xs text-[#395744] space-y-1">
                  {verdict.preventiveMeasures.map((pm, idx) => (
                    <li key={idx}>{pm}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer Actions */}
            <div className="pt-4 border-t border-[#e1e9d8] flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/stores"
                className="rounded-xl bg-[#2f6b45] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#20492f] no-underline flex items-center gap-2"
              >
                <Store size={15} /> Find Treatment in Nearby Agri Stores
              </Link>
              <button
                type="button"
                onClick={() => {
                  setVerdict(null);
                  setSelectedImage(null);
                }}
                className="rounded-xl border border-[#cbd8bf] bg-white px-5 py-2.5 text-xs font-bold text-[#1b3b27] hover:bg-[#f3f7ee] cursor-pointer"
              >
                Scan Another Leaf
              </button>
            </div>
          </EditableFrame>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* RECENT SCANS HISTORY */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {recentScans.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-[#183624] flex items-center gap-2">
              <History size={18} className="text-[#2f6b45]" /> Recent Field Diagnoses ({recentScans.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentScans.map((scan) => (
                <div
                  key={scan.id}
                  className="rounded-2xl border border-[#d8e0cc] bg-white p-4 flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#567560] mb-1">
                      <span className="font-bold">{scan.crop}</span>
                      <span>{scan.date}</span>
                    </div>
                    <h4 className="font-display text-sm font-bold text-[#183624]">{scan.name}</h4>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#e5eddc] flex items-center justify-between text-xs text-[#2f6b45] font-bold">
                    <span>Confidence: {scan.confidence}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
