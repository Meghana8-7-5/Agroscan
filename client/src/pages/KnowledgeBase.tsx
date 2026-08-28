import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  BookOpen,
  Search,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  ShieldAlert,
  Layers,
  Leaf,
  Bug,
  Droplets,
  Calendar,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { CROPS_DATABASE, UNIVERSAL_PROTOCOLS, CropData, CropDisease } from "../data/cropsDatabase";
import { useLanguage } from "../contexts/LanguageContext";
import { localizeCrop, localizeCategory, localizeDisease } from "../lib/i18n";

const KB_STRINGS: Record<string, Record<string, string>> = {
  eyebrow: {
    en: "Master Agricultural Database",
    te: "సమగ్ర వ్యవసాయ సమాచార నిధి",
    hi: "प्रमुख कृषि ज्ञानकोश",
    ta: "முதன்மை வேளாண் தரவுத்தளம்",
    kn: "ಮುಖ್ಯ ಕೃಷಿ ಮಾಹಿತಿ ಭಂಡಾರ",
    mr: "मुख्य कृषी ज्ञानकोश",
    pa: "ਮੁੱਖ ਖੇਤੀਬਾੜੀ ਡਾਟਾਬੇਸ",
    bn: "প্রধান কৃষি ডাটাবেস",
    gu: "મુખ્ય કૃષિ ડેટાબેઝ",
    ml: "പ്രധാന കാർഷിക ഡാറ്റാബേസ്",
  },
  main_heading: {
    en: "Crop & Disease Library",
    te: "పంటలు & తెగుళ్ల సమగ్ర సమాచార వేదిక",
    hi: "फसल और रोग पुस्तकालय",
    ta: "பயிர் மற்றும் நோய் நூலகம்",
    kn: "ಬೆಳೆ ಮತ್ತು ರೋಗ ಮಾಹಿತಿ ಭಂಡಾರ",
    mr: "पीक आणि रोग माहिती केंद्र",
    pa: "ਫਸਲ ਅਤੇ ਬਿਮਾਰੀ ਲਾਇਬ੍ਰੇਰੀ",
    bn: "ফসল ও রোগ লাইব্রেরি",
    gu: "પાક અને રોગ પુસ્તકાલય",
    ml: "വിള & രോഗ വിവരശേഖരം",
  },
  main_subtext: {
    en: "Complete agronomic knowledge base for 37 field crops, fruit trees, vegetables, flowers, and plantation crops.",
    te: "37 రకాల పొలంపంటలు, కూరగాయలు, పూల తోటలు మరియు వాణిజ్య పంటల సమగ్ర సాగు పద్ధతులు, తెగుళ్ల నివారణ సూచనలు.",
    hi: "37 मुख्य फसलों, सब्जियों, फलों और नकदी फसलों के लिए संपूर्ण कृषि संबंधी ज्ञान व उपचार दिशानिर्देश।",
    ta: "37 களப்பயிர்கள், காய்கறிகள் மற்றும் தோட்டக்கலை பயிர்களுக்கான முழுமையான வேளாண் தகவல்.",
    kn: "37 ಪ್ರಮುಖ ಬೆಳೆಗಳು, ತರಕಾರಿಗಳು ಮತ್ತು ಹಣ್ಣಿನ ಬೆಳೆಗಳ ಸಮಗ್ರ ಬೇಸಾಯ ಮತ್ತು ರೋಗ ನಿಯಂತ್ರಣ ಮಾಹಿತಿ.",
    mr: "37 प्रमुख पिके, भाजीपाला आणि फळबागांसाठी संपूर्ण कृषी माहिती व उपाय.",
    pa: "37 ਫਸਲਾਂ, ਸਬਜ਼ੀਆਂ ਅਤੇ ਬਾਗਬਾਨੀ ਲਈ ਪੂਰੀ ਖੇਤੀਬಾੜੀ ਜਾਣਕਾਰੀ।",
    bn: "৩৭টি ফসল, শাকসবজি এবং ফলের জন্য সম্পূর্ণ কৃষি তথ্য।",
    gu: "37 મુખ્ય પાકો, શાકભાજી અને ફળો માટે સંપૂર્ણ કૃષિ માહિતી.",
    ml: "37 പ്രധാന വിളകൾ, പച്ചക്കറികൾ എന്നിവയെക്കുറിച്ചുള്ള സമഗ്ര വിവരങ്ങൾ.",
  },
  tab_crops: {
    en: "37 Crop Directory",
    te: "37 పంటల డైరెక్టరీ",
    hi: "37 फसलों की सूची",
    ta: "37 பயிர் பட்டியல்",
    kn: "37 ಬೆಳೆಗಳ ಪಟ್ಟಿ",
    mr: "37 पिकांची यादी",
    pa: "37 ਫਸਲਾਂ ਦੀ ਸੂਚੀ",
    bn: "৩৭টি ফসলের তালিকা",
    gu: "37 પાકની યાદી",
    ml: "37 വിളകളുടെ പട്ടിക",
  },
  tab_wales: {
    en: "Universal Protocols (WALES)",
    te: "సార్వత్రిక నిబంధనలు (WALES ట్యాంక్ మిక్సింగ్)",
    hi: "सार्वभौमिक नियम (WALES टैंक मिश्रण)",
    ta: "மருந்து கலக்கும் முறை (WALES)",
    kn: "ಔಷಧ ಮಿಶ್ರಣ ನಿಯಮಗಳು (WALES)",
    mr: "औषध मिश्रण नियम (WALES)",
    pa: "ਸਪਰੇਅ ਮਿਸ਼ਰਣ ਨਿਯਮ (WALES)",
    bn: "ওষুধ মিশ্রণ নিয়ম (WALES)",
    gu: "દવા મિશ્રણ નિયમો (WALES)",
    ml: "മരുന്ന് മിശ്രിത നിയമങ്ങൾ (WALES)",
  },
  search_placeholder: {
    en: "Search crop or disease (e.g. Rice, Blast, Late Blight)...",
    te: "పంట లేదా తెగులు పేరు వెతకండి (ఉదా. వరి, ఆకుమచ్చ, బ్లైట్)...",
    hi: "फसल या रोग खोजें (उदा. धान, झुलसा, ब्लास्ट)...",
    ta: "பயிர் அல்லது நோயைத் தேடுங்கள்...",
    kn: "ಬೆಳೆ ಅಥವಾ ರೋಗ ಹುಡುಕಿ...",
    mr: "पीक किंवा रोग शोधा...",
    pa: "ਫਸਲ ਜਾਂ ਬਿਮਾਰੀ ਖੋਜੋ...",
    bn: "ফসল বা রোগ অনুসন্ধান করুন...",
    gu: "પાક અથવા રોગ શોધો...",
    ml: "വിളയോ രോഗമോ തിരയുക...",
  },
  symptoms: { en: "Symptoms", te: "లక్షణాలు", hi: "लक्षण", ta: "அறிகுறிகள்", kn: "ಲಕ್ಷಣಗಳು", mr: "लक्षणे", pa: "ਲੱਛਣ", bn: "লক্ষণ", gu: "લક્ષણો", ml: "ലക്ഷണങ്ങൾ" },
  root_cause: { en: "Root Cause", te: "మూల కారణం", hi: "मूल कारण", ta: "மூலக் காரணம்", kn: "ಮೂಲ ಕಾರಣ", mr: "मूळ कारण", pa: "ਮੂਲ ਕਾਰਨ", bn: "মূল কারণ", gu: "મૂળ કારણ", ml: "കാരണം" },
  curative_title: {
    en: "Curative Treatment & Recommended Dosage",
    te: "నివారణ చికిత్స & సిఫార్సు చేసిన మోతాదు",
    hi: "उपचारात्मक उपचार और अनुशंसित खुराक",
    ta: "சிகிச்சை மற்றும் பரிந்துரைக்கப்பட்ட அளவு",
    kn: "ಚಿಕಿತ್ಸೆ ಮತ್ತು ಶಿಫಾರಸು ಮಾಡಿದ ಪ್ರಮಾಣ",
    mr: "उपाय आणि शिफारस केलेले प्रमाण",
    pa: "ਇਲਾਜ ਅਤੇ ਸਿਫਾਰਸ਼ ਕੀਤੀ ਖੁਰਾਕ",
    bn: "চিকিৎসা ও প্রস্তাবিত ডোজ",
    gu: "ઉપચાર અને ભલામણ કરેલ માત્રા",
    ml: "ചികിത്സ & ശുപാർശ ചെയ്ത അളവ്",
  },
  cultural_prevention: {
    en: "Cultural Prevention",
    te: "యాజమాన్య పద్ధతులు",
    hi: "सस्यीय रोकथाम",
    ta: "தடுப்பு முறைகள்",
    kn: "ಮುಂಜಾಗ್ರತಾ ಕ್ರಮಗಳು",
    mr: "प्रतिबंधात्मक उपाय",
    pa: "ਰੋਕਥਾਮ ਦੇ ਉਪਾਅ",
    bn: "প্রতিরোধমূলক ব্যবস্থা",
    gu: "નિવારક પગલાં",
    ml: "പ്രതിരോധ മാർഗ്ഗങ്ങൾ",
  },
  organic_alternative: {
    en: "Organic Alternative",
    te: "సేంద్రీయ ప్రత్యామ్నాయం",
    hi: "जैविक विकल्प",
    ta: "இயற்கை வழிமுறை",
    kn: "ಸಾವಯವ ಪರ್ಯಾಯ",
    mr: "सेंद्रिय पर्याय",
    pa: "ਜੈਵਿਕ ਵਿਕਲਪ",
    bn: "জৈব বিকল্প",
    gu: "જૈવિક વિકલ્પ",
    ml: "ജൈവ ബദൽ",
  },
  growth_timeline: {
    en: "Stage-by-Stage Growth Timeline",
    te: "దశల వారీ పంట ఎదుగుదల షెడ్యూల్",
    hi: "चरण-दर-चरण फसल वृद्धि समयरेखा",
    ta: "படிப்படியான பயிர் வளர்ச்சி அட்டவணை",
    kn: "ಹಂತ ಹಂತದ ಬೆಳೆ ಬೆಳವಣಿಗೆ ವೇಳಾಪಟ್ಟಿ",
    mr: "टप्प्याटप्प्याने पीक वाढीचे वेळापत्रक",
    pa: "ਪੜਾਅ-ਵਾਰ ਫਸਲ ਵਿਕਾਸ ਸਮਾਂ-ਸਾਰਣੀ",
    bn: "পর্যায়ভিত্তিক ফসল বৃদ্ধির সময়রেখা",
    gu: "તબક્કાવાર પાક વૃદ્ધિ સમયરેખા",
    ml: "ഘട്ടം ഘട്ടമായുള്ള വിള വളർച്ചാ വിവരങ്ങൾ",
  },
  wales_title: {
    en: "WALES Tank-Mixing Sequence",
    te: "WALES ట్యాంక్ మిక్సింగ్ నిబంధనలు",
    hi: "WALES टैंक मिश्रण क्रम",
    ta: "WALES மருந்து கலக்கும் வரிசை",
    kn: "WALES ಟ್ಯಾಂಕ್ ಮಿಶ್ರಣ ಕ್ರಮ",
    mr: "WALES औषध मिश्रण क्रम",
    pa: "WALES ਟੈਂਕ ਮਿਸ਼ਰਣ ਕ੍ਰਮ",
    bn: "WALES ট্যাংক মিশ্রণ ক্রম",
    gu: "WALES ટેન્ક મિશ્રણ ક્રમ",
    ml: "WALES ടാങ്ക് മിക്സിംഗ് രീതി",
  },
  wales_sub: {
    en: "Mandatory chemical mixing order to prevent tank curdling and nozzle clogging.",
    te: "స్ప్రేయర్ నాజిళ్లు పూడుకుపోకుండా మరియు రసాయన ద్రావణం విరిగిపోకుండా ఖచ్చితంగా పాటించవలసిన క్రమం.",
    hi: "स्प्रेयर नोजल जाम होने और दवा फटने से बचाने के लिए अनिवार्य रासायनिक मिश्रण क्रम।",
    ta: "மருந்து திரிந்து போகாமல் இருக்கவும் நாசில் அடைப்பதைத் தவிர்க்கவும் கட்டாய கலவை வரிசை.",
    kn: "ಔಷಧ ಹಾಳಾಗುವುದನ್ನು ಮತ್ತು ನಳಿಕೆ ಕಟ್ಟಿಕೊಳ್ಳುವುದನ್ನು ತಡೆಯಲು ಕಡ್ಡಾಯ ಮಿಶ್ರಣ ಕ್ರಮ.",
    mr: "औषध खराब होणे व नोझल तुंबणे टाळण्यासाठी अनिवार्य मिश्रण क्रम.",
    pa: "ਸਪਰੇਅ ਖਰਾਬ ਹੋਣ ਤੋਂ ਬਚਾਉਣ ਲਈ ਜ਼ਰੂਰੀ ਮਿਸ਼ਰਣ ਕ੍ਰਮ।",
    bn: "ওষুধ নষ্ট হওয়া রোধ করতে বাধ্যতামূলক মিশ্রণ ক্রম।",
    gu: "દવા બગડતી અટકાવવા માટે ફરજિયાત મિશ્રણ ક્રમ.",
    ml: "മരുന്ന് കേടാകാതിരിക്കാനുള്ള ശരിയായ മിശ്രിത ക്രമം.",
  }
};

export default function KnowledgeBase() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"crops" | "protocols">("crops");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCrop, setSelectedCrop] = useState<CropData | null>(CROPS_DATABASE[0]);

  const str = (key: keyof typeof KB_STRINGS): string => {
    return KB_STRINGS[key]?.[language] || KB_STRINGS[key]?.en || "";
  };

  const categories = [
    "All",
    "Cereals & Coarse Cereals",
    "Pulses & Oilseeds",
    "Commercial Crops",
    "Vegetables",
    "Flowers & Plantation Crops",
    "Fruit Crops (Horticulture)"
  ];

  const filteredCrops = CROPS_DATABASE.filter((crop) => {
    const matchesCategory = selectedCategory === "All" || crop.category === selectedCategory;
    const matchesSearch =
      crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.diseases.some((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="workspace-page min-h-screen bg-[#f7f8f4] text-[#1c3827]">
      {/* Top Header */}
      <header className="workspace-topbar sticky top-0 z-40 bg-[#f7f8f4]/90 backdrop-blur border-b border-[#e1e6d7] px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="workspace-back inline-flex items-center gap-2 text-sm font-bold text-[#2f6b45] no-underline hover:underline">
          <ArrowLeft size={17} /> <span>{t("back_to_dashboard")}</span>
        </Link>
        <div className="flex items-center gap-2 font-display text-lg font-bold text-[#20402e]">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2f6b45] text-white"><BookOpen size={18} /></span>
          <span>{t("knowledge_base")}</span>
        </div>
        <span className="hidden sm:inline-block text-xs font-extrabold uppercase tracking-wider text-[#456b52] bg-[#e5eddc] px-3 py-1 rounded-full">
          37 Crops &amp; Universal Protocols
        </span>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Title & Navigation Tabs */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#2f6b45]">{str("eyebrow")}</p>
            <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold text-[#193625]">{str("main_heading")}</h1>
            <p className="mt-2 text-sm text-[#4d6957] leading-relaxed">
              {str("main_subtext")}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-[#e3ebd9] p-1.5 border border-[#d2dec4]">
            <button
              type="button"
              onClick={() => setActiveTab("crops")}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "crops"
                  ? "bg-[#2f6b45] text-white shadow-md"
                  : "text-[#2e523b] hover:bg-[#d8e3cc]"
              }`}
            >
              <Leaf size={16} /> {str("tab_crops")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("protocols")}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "protocols"
                  ? "bg-[#2f6b45] text-white shadow-md"
                  : "text-[#2e523b] hover:bg-[#d8e3cc]"
              }`}
            >
              <FlaskConical size={16} /> {str("tab_wales")}
            </button>
          </div>
        </div>

        {activeTab === "crops" ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column — Filter & Crop List */}
            <div className="lg:col-span-4 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-3.5 text-[#5e7867]" />
                <input
                  type="text"
                  placeholder={str("search_placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-[#d5ded0] bg-white pl-10 pr-4 py-3 text-sm font-medium text-[#1c3827] placeholder:text-[#8aa091] focus:border-[#2f6b45] focus:outline-none focus:ring-2 focus:ring-[#2f6b45]/20 shadow-sm"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-[#2f6b45] text-white"
                        : "bg-white text-[#385944] border border-[#d8e0ce] hover:bg-[#eaf0e3]"
                    }`}
                  >
                    {cat === "All" ? (language === "te" ? "అన్నీ" : language === "hi" ? "सभी" : "All") : localizeCategory(cat, language)}
                  </button>
                ))}
              </div>

              {/* Crops Count */}
              <p className="text-xs font-bold text-[#577360] uppercase tracking-wider">
                {filteredCrops.length} / 37 {str("tab_crops")}
              </p>

              {/* Crop Items */}
              <div className="max-h-[600px] overflow-y-auto space-y-2.5 pr-1">
                {filteredCrops.map((crop) => (
                  <button
                    key={crop.id}
                    type="button"
                    onClick={() => setSelectedCrop(crop)}
                    className={`w-full text-left rounded-2xl border p-4 transition-all cursor-pointer ${
                      selectedCrop?.id === crop.id
                        ? "border-[#2f6b45] bg-[#eef4e8] shadow-md ring-2 ring-[#2f6b45]/20"
                        : "border-[#d8e0cc] bg-white hover:bg-[#f3f7ee] hover:border-[#b8c9a9]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-base font-bold text-[#1a3826]">{localizeCrop(crop.name, language)}</h3>
                      <span className="rounded-full bg-[#dbe6cf] px-2.5 py-0.5 text-[11px] font-bold text-[#2a5439]">
                        {crop.durationDays} Days
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#52705d] font-semibold">{localizeCategory(crop.category, language)} · {crop.season}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-[#2f6b45] font-bold">
                      <Bug size={13} /> {crop.diseases.length} {language === "te" ? "ముఖ్య తెగుళ్లు" : language === "hi" ? "प्रमुख रोग व कीट" : "Major Diseases"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column — Detailed Selected Crop Knowledge */}
            <div className="lg:col-span-8">
              {selectedCrop ? (
                <div className="space-y-6 rounded-3xl border border-[#d8e0cc] bg-white p-6 shadow-xl sm:p-8">
                  {/* Crop Header */}
                  <div className="border-b border-[#e1e8d7] pb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#2f6b45] bg-[#e5eddc] px-3 py-1 rounded-full">
                        {localizeCategory(selectedCrop.category, language)}
                      </span>
                      <h2 className="mt-2 font-display text-3xl font-bold text-[#163322]">{localizeCrop(selectedCrop.name, language)}</h2>
                      <p className="mt-1 text-sm text-[#4b6957]">
                        Season: <span className="font-bold text-[#1e3b2a]">{selectedCrop.season}</span> · Duration: <span className="font-bold text-[#1e3b2a]">{selectedCrop.durationDays} Days</span>
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#f2f6ec] p-4 text-xs space-y-1.5 border border-[#dbe4d1]">
                      <div><span className="text-[#597563]">Expected Yield:</span> <strong className="text-[#1c3928]">{selectedCrop.expectedYieldPerAcre}</strong></div>
                      <div><span className="text-[#597563]">Water Need:</span> <strong className="text-[#1c3928]">{selectedCrop.waterRequirements}</strong></div>
                    </div>
                  </div>

                  {/* Suitable Soils */}
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#2f6b45] mb-2 flex items-center gap-1.5">
                      <Layers size={15} /> Suitable Soil Types
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCrop.suitableSoilTypes.map((soil) => (
                        <span key={soil} className="rounded-xl border border-[#c4d6b6] bg-[#f0f6ea] px-3 py-1 text-xs font-bold text-[#244b33]">
                          {soil}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Extra Notes if Tobacco or special advisory */}
                  {selectedCrop.extraNotes && (
                    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs font-semibold text-amber-900 flex items-start gap-2.5">
                      <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>{selectedCrop.extraNotes}</div>
                    </div>
                  )}

                  {/* Diseases & Pests Knowledge */}
                  <div>
                    <h3 className="font-display text-xl font-bold text-[#183624] mb-4 flex items-center gap-2">
                      <Bug size={20} className="text-[#2f6b45]" /> Key Diseases, Pests &amp; Treatments
                    </h3>

                    <div className="space-y-6">
                      {selectedCrop.diseases.map((d, idx) => (
                        <div key={idx} className="rounded-2xl border border-[#dbe3cf] bg-[#fafcf7] p-5 shadow-sm space-y-4">
                          <div className="flex items-center justify-between border-b border-[#e3ebda] pb-3">
                            <h4 className="font-display text-lg font-bold text-[#1b3b28] flex items-center gap-2">
                              {localizeDisease(d.name, language)}
                            </h4>
                            <span className="rounded-full bg-rose-100 text-rose-800 text-xs font-extrabold px-3 py-0.5 uppercase">
                              {d.category}
                            </span>
                          </div>

                          {/* Symptoms & Cause */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="rounded-xl bg-white p-3 border border-[#e4ecdc]">
                              <span className="font-extrabold text-[#2f6b45] uppercase tracking-wider block mb-1">{str("symptoms")}</span>
                              <p className="text-[#244231] leading-relaxed">{d.symptoms}</p>
                            </div>
                            <div className="rounded-xl bg-white p-3 border border-[#e4ecdc]">
                              <span className="font-extrabold text-[#2f6b45] uppercase tracking-wider block mb-1">{str("root_cause")}</span>
                              <p className="text-[#244231] leading-relaxed">{d.cause}</p>
                            </div>
                          </div>

                          {/* Curative Chemical Treatment */}
                          <div className="rounded-xl bg-[#edf5e7] p-4 border border-[#cadbbd]">
                            <span className="text-xs font-extrabold text-[#1f452e] uppercase tracking-wider block mb-2">
                              {str("curative_title")}
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="text-[#51705d]">Product:</span> <strong className="text-[#193825]">{d.curativeTreatment.product}</strong>
                              </div>
                              <div>
                                <span className="text-[#51705d]">Dosage per Acre:</span> <strong className="text-[#193825]">{d.curativeTreatment.dosagePerAcre}</strong>
                              </div>
                              <div className="sm:col-span-2">
                                <span className="text-[#51705d]">Application Method:</span> <span className="text-[#193825] font-semibold">{d.curativeTreatment.applicationMethod}</span>
                              </div>
                              <div className="sm:col-span-2 flex items-center gap-2 flex-wrap">
                                <span className="text-[#51705d] font-bold">Brand Examples:</span>
                                {d.curativeTreatment.brandExamples.map((b) => (
                                  <span key={b} className="rounded-lg bg-[#2f6b45] text-white px-2.5 py-0.5 font-bold text-[11px]">
                                    {b}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Prevention & Organic Options */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-1.5">
                              <span className="font-extrabold text-[#2f6b45] uppercase tracking-wider block">{str("cultural_prevention")}</span>
                              {d.prevention.map((p, i) => (
                                <div key={i} className="flex items-start gap-1.5 text-[#244432]">
                                  <CheckCircle2 size={13} className="text-[#2f6b45] shrink-0 mt-0.5" />
                                  <span>{p}</span>
                                </div>
                              ))}
                            </div>

                            <div className="space-y-1.5">
                              <span className="font-extrabold text-emerald-700 uppercase tracking-wider block">{str("organic_alternative")}</span>
                              <p className="rounded-xl bg-emerald-50 p-2.5 border border-emerald-200 text-emerald-950 font-medium">
                                {d.organicAlternative}
                              </p>
                              <p className="text-[11px] font-bold text-[#567362] mt-1">
                                High-risk Stage: <span className="text-[#1a3826]">{d.highestRiskStage}</span>
                              </p>
                            </div>
                          </div>

                          {/* Link to store */}
                          <div className="pt-2 flex justify-end">
                            <Link href="/stores" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2f6b45] hover:underline">
                              Locate Nearby Stores Stocking {d.curativeTreatment.brandExamples[0]} <ExternalLink size={13} />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Growth Plan Summary */}
                  <div className="pt-4 border-t border-[#e2e9d8]">
                    <h3 className="font-display text-xl font-bold text-[#183624] mb-4 flex items-center gap-2">
                      <Calendar size={20} className="text-[#2f6b45]" /> {str("growth_timeline")}
                    </h3>
                    <div className="space-y-3">
                      {selectedCrop.growthPlan.map((stage, i) => (
                        <div key={i} className="rounded-xl border border-[#e2e9d8] bg-white p-4 text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-sm text-[#1b3a28]">{stage.stageName}</h4>
                            <span className="rounded-lg bg-[#e2edd8] px-2.5 py-1 font-bold text-[#2f6b45]">{stage.dayRange}</span>
                          </div>
                          <ul className="list-disc pl-4 text-[#355441] space-y-1">
                            {stage.activities.map((act, j) => (
                              <li key={j}>{act}</li>
                            ))}
                          </ul>
                          {stage.pestRiskWindow && (
                            <p className="text-rose-700 font-bold bg-rose-50 p-2 rounded-lg border border-rose-200 flex items-center gap-1.5">
                              <AlertTriangle size={13} /> Pest Risk: {stage.pestRiskWindow}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-[#ccd6c3] bg-white p-8 text-center text-[#557361]">
                  Select a crop from the left directory to view full diseases, dosages, and stage growth plans.
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Universal Operational Protocols Tab */
          <div className="space-y-8 max-w-5xl mx-auto">
            {/* WALES Sequence */}
            <div className="rounded-3xl border border-[#d8e0cc] bg-white p-6 shadow-xl sm:p-8">
              <div className="flex items-center gap-3 border-b border-[#e1e8d7] pb-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2f6b45] text-white font-bold font-display text-xl">
                  W
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#183624]">{str("wales_title")}</h2>
                  <p className="text-xs font-semibold text-[#51705d]">{str("wales_sub")}</p>
                </div>
              </div>

              <div className="space-y-4">
                {UNIVERSAL_PROTOCOLS.walesSequence.map((item) => (
                  <div key={item.step} className="flex items-start gap-4 rounded-2xl border border-[#e1e8d7] bg-[#f8faf5] p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2f6b45] font-display text-lg font-bold text-white">
                      {item.letter}
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-[#1b3b28]">Step {item.step}: {item.title}</h3>
                      <p className="mt-1 text-xs text-[#395946] leading-relaxed font-medium">{item.instruction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
