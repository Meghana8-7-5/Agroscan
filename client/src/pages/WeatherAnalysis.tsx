import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  CloudSun,
  CloudRain,
  Thermometer,
  Wind,
  Droplets,
  AlertTriangle,
  ShieldAlert,
  Calendar,
  Compass,
  LocateFixed
} from "lucide-react";
import { CROPS_DATABASE } from "../data/cropsDatabase";
import { useLocationContext } from "../contexts/LocationContext";
import { useLanguage } from "../contexts/LanguageContext";
import { localizeCrop } from "../lib/i18n";
import EditableFrame from "../components/EditableFrame";

const WEATHER_STRINGS: Record<string, Record<string, string>> = {
  header_title: {
    en: "Weather & Disaster Prevention",
    te: "వాతావరణం & విపత్తు నివారణ",
    hi: "मौसम और आपदा प्रबंधन",
    ta: "வானிலை மற்றும் பேரிடர் தடுப்பு",
    kn: "ಹವಾಮಾನ ಮತ್ತು ವಿಪತ್ತು ತಡೆಗಟ್ಟುವಿಕೆ",
    mr: "हवामान आणि आपत्ती निवारण",
    pa: "ਮੌਸਮ ਅਤੇ ਆਫ਼ਤ ਪ੍ਰਬੰਧਨ",
    bn: "আবহাওয়া এবং দুর্যোগ প্রতিরোধ",
    gu: "હવામાન અને આપત્તિ નિવારણ",
    ml: "കാലാവസ്ഥയും ദുരന്ത നിവാരണവും",
  },
  eyebrow: {
    en: "Proactive Disaster Warnings",
    te: "ముందస్తు విపత్తు & వాతావరణ హెచ్చరికలు",
    hi: "सक्रिय आपदा व मौसम चेतावनियाँ",
    ta: "முன்னெச்சரிக்கை பேரிடர் எச்சரிக்கைகள்",
    kn: "ಮುನ್ನೆಚ್ಚರಿಕೆ ವಿಪತ್ತು ಎಚ್ಚರಿಕೆಗಳು",
    mr: "सक्रिय आपत्ती सूचना",
    pa: "ਅਗਾਊਂ ਆਫ਼ਤ ਚੇਤਾਵਨੀਆਂ",
    bn: "আগাম দুর্যোগ সতর্কতা",
    gu: "સક્રિય આપત્તિ ચેતવણીઓ",
    ml: "മുൻകൂർ ദുരന്ത മുന്നറിയിപ്പുകൾ",
  },
  main_heading: {
    en: "Farm Location Weather & Disaster Risk",
    te: "పొలం వాతావరణం & విపత్తు ముప్పు విశ్లేషణ",
    hi: "खेत स्थान का मौसम और आपदा जोखिम",
    ta: "பண்ணை வானிலை மற்றும் பேரிடர் ஆபத்து",
    kn: "ಕೃಷಿ ಭೂಮಿಯ ಹವಾಮಾನ ಮತ್ತು ಅಪಾಯದ ವಿಶ್ಲೇಷಣೆ",
    mr: "शेताचे हवामान आणि आपत्ती धोका",
    pa: "ਖੇਤ ਦਾ ਮੌਸਮ ਅਤੇ ਆਫ਼ਤ ਜੋਖਮ",
    bn: "খামারের আবহাওয়া ও দুর্যোগ ঝুঁকি",
    gu: "ખેતરનું હવામાન અને આપત્તિ જોખમ",
    ml: "കൃഷിയിട കാലാവസ്ഥയും അപകടസാധ്യതയും",
  },
  telemetry_label: {
    en: "Active Farm Telemetry Location",
    te: "ప్రస్తుత పొలం ఉపగ్రహ స్థానం",
    hi: "सक्रिय खेत स्थान",
    ta: "செயலில் உள்ள பண்ணை இருப்பிடம்",
    kn: "ಪ್ರಸ್ತುತ ಜಮೀನಿನ ಸ್ಥಳ",
    mr: "सक्रिय शेताचे स्थान",
    pa: "ਮੌਜੂਦਾ ਖੇਤ ਦਾ ਸਥਾਨ",
    bn: "সক্রিয় খামারের অবস্থান",
    gu: "સક્રિય ખેતરનું સ્થાન",
    ml: "നിലവിലെ കൃഷിയിട സ്ഥലം",
  },
  proactive_warnings_title: {
    en: "Proactive Disaster & Spray Warnings for",
    te: "ముందస్తు విపత్తు & స్ప్రే సమయ సూచనలు —",
    hi: "सक्रिय आपदा और छिड़काव चेतावनियाँ —",
    ta: "முன்னெச்சரிக்கை தெளிப்பு மற்றும் பேரிடர் எச்சரிக்கைகள் —",
    kn: "ಸಿಂಪಡಣೆ ಮತ್ತು ವಿಪತ್ತು ಎಚ್ಚರಿಕೆಗಳು —",
    mr: "फवारणी आणि आपत्ती सूचना —",
    pa: "ਸਪਰੇਅ ਅਤੇ ਆਫ਼ਤ ਚੇਤਾਵਨੀਆਂ —",
    bn: "স্প্রে এবং দুর্যোগ সতর্কতা —",
    gu: "છંટકાવ અને આપત્તિ ચેતવણીઓ —",
    ml: "സ്പ്രേയിംഗ് & ദുരന്ത മുന്നറിയിപ്പുകൾ —",
  },
  rain_alert_title: {
    en: "Heavy Rain Forecast in 48 Hours",
    te: "రాబోయే 48 గంటల్లో భారీ వర్ష సూచన",
    hi: "अगले 48 घंटों में भारी बारिश का अनुमान",
    ta: "அடுத்த 48 மணி நேரத்தில் கனமழை வாய்ப்பு",
    kn: "ಮುಂದಿನ 48 ಗಂಟೆಗಳಲ್ಲಿ ಭಾರಿ ಮಳೆ ನಿರೀಕ್ಷೆ",
    mr: "पुढील 48 तासांत मुसळधार पावसाचा अंदाज",
    pa: "ਅਗਲੇ 48 ਘੰਟਿਆਂ ਵਿੱਚ ਭਾਰੀ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ",
    bn: "পরবর্তী ৪৮ ঘণ্টায় ভারী বৃষ্টির পূর্বাভাস",
    gu: "આગામી 48 કલાકમાં ભારે વરસાદની આગાહી",
    ml: "അടുത്ത 48 മണിക്കൂറിൽ കനത്ത മഴ സാധ്യത",
  },
  rain_alert_body: {
    en: "Actionable Advice: Heavy rainfall (45mm) expected in 2 days. DELAY YOUR CHEMICAL SPRAYS until after rain passes to avoid wash-off waste.",
    te: "ఆచరణాత్మక సలహా: 2 రోజుల్లో భారీ వర్షం (45mm) కురిసే అవకాశం ఉంది. మందుల ద్రావణం కొట్టుకుపోకుండా ఉండటానికి రసాయన పిచికారీని వాయిదా వేయండి.",
    hi: "सलाह: 2 दिनों में भारी बारिश (45 मिमी) की संभावना है। रासायनिक छिड़काव को बारिश के बाद तक टालें ताकि दवा बहने से नुकसान न हो।",
    ta: "அறிவுரை: 2 நாட்களில் கனமழை (45 மி.மீ) பெய்யக்கூடும். மருந்து அடிப்பதைக் கொஞ்ச நாள் தள்ளிப்போடவும்.",
    kn: "ಸಲಹೆ: 2 ದಿನಗಳಲ್ಲಿ ಭಾರಿ ಮಳೆ ನಿರೀಕ್ಷೆಯಿದೆ. ಔಷಧ ತೊಳೆದು ಹೋಗುವುದನ್ನು ತಡೆಯಲು ಸಿಂಪಡಣೆಯನ್ನು ಮುಂದೂಡಿ.",
    mr: "सल्ला: 2 दिवसांत मुसळधार पाऊस अपेक्षित आहे. फवारणी पावसापर्यंत पुढे ढकला.",
    pa: "ਸਲਾਹ: 2 ਦਿਨਾਂ ਵਿੱਚ ਭਾਰੀ ਮੀਂਹ ਸੰਭਵ ਹੈ। ਸਪਰੇਅ ਨੂੰ ਮੁਲਤਵੀ ਕਰੋ।",
    bn: "পরামর্শ: ২ দিনে ভারী বৃষ্টি হতে পারে। স্প্রে করা পিছিয়ে দিন।",
    gu: "સલાહ: 2 દિવસમાં ભારે વરસાદની શક્યતા છે. છંટકાવ મોકૂફ રાખો.",
    ml: "നിർദ്ദേശം: 2 ദിവസത്തിനകം കനത്ത മഴ പ്രതീക്ഷിക്കുന്നു. സ്പ്രേ ചെയ്യുന്നത് മാറ്റിവെക്കുക.",
  },
  flood_alert_title: {
    en: "Waterlogging & Flood Risk",
    te: "నీరు నిల్వ ఉండే ప్రమాదం & మురుగు నీటి హెచ్చరిక",
    hi: "जलभराव और बाढ़ का जोखिम",
    ta: "நீர் தேங்குதல் மற்றும் வெள்ள ஆபத்து",
    kn: "ನೀರು ನಿಲ್ಲುವ ಅಪಾಯ ಮತ್ತು ಒಳಚರಂಡಿ ಎಚ್ಚರಿಕೆ",
    mr: "पाणी साचणे आणि पूर धोका",
    pa: "ਜਲ-ਜਮਾਓ ਅਤੇ ਹੜ੍ਹ ਦਾ ਜੋਖਮ",
    bn: "জলাবদ্ধতা এবং বন্যার ঝুঁকি",
    gu: "પાણી ભરાવાનો અને પૂરનો ખતરો",
    ml: "വെള്ളക്കെട്ട് സാധ്യത",
  },
  flood_alert_body: {
    en: "Actionable Advice: High moisture buildup at root zone. Open field drainage channels now to prevent root rot and wilt onset.",
    te: "ఆచరణాత్మక సలహా: వేరు మండలంలో అధిక తేమ చేరుతోంది. వేరుకుళ్ళు మరియు ఎండు తెగులు రాకుండా పొలంలో మురుగు కాల్వలను వెంటనే తెరవండి.",
    hi: "सलाह: जड़ क्षेत्र में अत्यधिक नमी बढ़ रही है। जड़ गलन और उकठा रोग से बचाव के लिए खेत से जल निकासी की नालियां खोलें।",
    ta: "அறிவுரை: வேர் அழுகலைத் தடுக்க வயலில் வடிகால் வாய்க்கால்களை உடனே திறக்கவும்.",
    kn: "ಸಲಹೆ: ಬೇರು ಕೊಳೆತ ರೋಗ ತಡೆಗಟ್ಟಲು ಜಮೀನಿನ ಒಳಚರಂಡಿ ಕಾಲುವೆಗಳನ್ನು ತೆರೆಯಿರಿ.",
    mr: "सल्ला: मूळ कुजणे टाळण्यासाठी शेतातील पाण्याचा निचरा करा.",
    pa: "ਸਲਾਹ: ਜੜ੍ਹਾਂ ਦੇ ਗਲਣ ਤੋਂ ਬਚਣ ਲਈ ਨਿਕਾਸੀ ਨਾਲੀਆਂ ਖੋਲ੍ਹੋ।",
    bn: "পরামর্শ: গোড়া পচা রোধ করতে ড্রেনেজ নালা কেটে দিন।",
    gu: "સલાહ: મૂળિયાં સડતા અટકાવવા માટે પાણીના નિકાલની વ્યવસ્થા કરો.",
    ml: "നിർദ്ദേശം: വേരുചീയൽ തടയാൻ വെള്ളം വാർന്നുപോകാനുള്ള ചാലുകൾ തുറക്കുക.",
  },
  temp: { en: "Temperature", te: "ఉష్ణోగ్రత", hi: "तापमान", ta: "வெப்பநிலை", kn: "ತಾಪಮಾನ", mr: "तापमान", pa: "ਤਾਪਮਾਨ", bn: "তাপমাত্রা", gu: "તાપમાન", ml: "താപനില" },
  humidity: { en: "Relative Humidity", te: "గాలిలో తేమ (హ్యుమిడిటీ)", hi: "सापेक्ष आर्द्रता", ta: "காற்றின் ஈரப்பதம்", kn: "ಆರ್ದ್ರತೆ", mr: "आर्द्रता", pa: "ਨਮੀ", bn: "আর্দ্রতা", gu: "ભેજ", ml: "ആർദ്രത" },
  wind: { en: "Wind Speed", te: "గాలి వేగం", hi: "हवा की गति", ta: "காற்றின் வேகம்", kn: "ಗಾಳಿಯ ವೇಗ", mr: "वाऱ्याचा वेग", pa: "ਹਵਾ ਦੀ ਰਫ਼ਤਾਰ", bn: "বাতাসের গতি", gu: "પવનની ગતિ", ml: "കാറ്റിന്റെ വേഗം" },
  rainfall: { en: "Expected Rainfall", te: "వర్షపాత అంచనా", hi: "अनुमानित वर्षा", ta: "எதிர்பார்க்கப்படும் மழை", kn: "ನಿರೀಕ್ಷಿತ ಮಳೆ", mr: "अपेक्षित पाऊस", pa: "ਮੀਂਹ ਦਾ ਅਨੁਮਾਨ", bn: "প্রত্যাশিত বৃষ্টিপাত", gu: "સંભવિત વરસાદ", ml: "പ്രതീക്ഷിക്കുന്ന മഴ" },
  forecast_title: {
    en: "5-Day Farm Weather & Spray Advisory Forecast",
    te: "5 రోజుల వాతావరణ & పిచికారీ సలహా సూచనలు",
    hi: "5 दिवसीय मौसम और छिड़काव सलाह पूर्वानुमान",
    ta: "5 நாள் வானிலை மற்றும் தெளிப்பு ஆலோசனை",
    kn: "5 ದಿನಗಳ ಹವಾಮಾನ ಮತ್ತು ಸಿಂಪಡಣೆ ಸಲಹೆ",
    mr: "5 दिवसांचा हवामान व फवारणी सल्ला",
    pa: "5 ਦਿਨਾਂ ਦਾ ਮੌਸਮ ਅਤੇ ਸਪਰੇਅ ਸਲਾਹ",
    bn: "৫ দিনের আবহাওয়া ও স্প্রে পরামর্শ",
    gu: "5 દિવસનું હવામાન અને છંટકાવ સલાહ",
    ml: "5 ദിവസത്തെ കാലാവസ്ഥ & സ്പ്രേയിംഗ് നിർദ്ദേശങ്ങൾ",
  }
};

export default function WeatherAnalysis() {
  const { location, setShowLocationModal, requestGpsLocation } = useLocationContext();
  const { language, t } = useLanguage();
  const [selectedCropName, setSelectedCropName] = useState("Tomato");

  const str = (key: keyof typeof WEATHER_STRINGS): string => {
    return WEATHER_STRINGS[key]?.[language] || WEATHER_STRINGS[key]?.en || "";
  };

  const localizedCrop = localizeCrop(selectedCropName, language);

  const forecastDays = [
    {
      day: language === "te" ? "ఈ రోజు" : language === "hi" ? "आज" : language === "ta" ? "இன்று" : "Today",
      temp: "28°C",
      humidity: "88%",
      rain: "5 mm",
      advice: language === "te" ? "తనిఖీకి అనుకూలం. ఆకుల అడుగున చూడండి." : language === "hi" ? "निरीक्षण के लिए अच्छा समय। पत्ती के नीचे जांचें।" : "Good for inspection. Check leaf undersides."
    },
    {
      day: language === "te" ? "రేపు" : language === "hi" ? "कल" : language === "ta" ? "நாளை" : "Tomorrow",
      temp: "26°C",
      humidity: "92%",
      rain: "35 mm",
      advice: language === "te" ? "భారీ వర్షం ప్రారంభం. మందుల స్ప్రే వాయిదా వేయండి." : language === "hi" ? "भारी बारिश शुरू होगी। रासायनिक छिड़काव टालें।" : "Heavy rain starting. Delay chemical sprays."
    },
    {
      day: language === "te" ? "3వ రోజు" : language === "hi" ? "तीसरा दिन" : language === "ta" ? "3 ஆம் நாள்" : "Day 3",
      temp: "24°C",
      humidity: "95%",
      rain: "45 mm",
      advice: language === "te" ? "ముంపు ప్రమాదం. మురుగు కాల్వలు తెరవండి." : language === "hi" ? "जलभराव का जोखिम। जल निकासी नाली खुली रखें।" : "Flood risk. Keep field drainage channels open."
    },
    {
      day: language === "te" ? "4వ రోజు" : language === "hi" ? "चौथा दिन" : language === "ta" ? "4 ஆம் நாள்" : "Day 4",
      temp: "27°C",
      humidity: "80%",
      rain: "2 mm",
      advice: language === "te" ? "వర్షం తగ్గుముఖం. పొలం తేమను పరిశీలించండి." : language === "hi" ? "बारिश कम होगी। खेत की नमी की जांच करें।" : "Rain clearing. Inspect for waterlogging damage."
    },
    {
      day: language === "te" ? "5వ రోజు" : language === "hi" ? "પાँचवाँ दिन" : language === "ta" ? "5 ஆம் நாள்" : "Day 5",
      temp: "29°C",
      humidity: "75%",
      rain: "0 mm",
      advice: language === "te" ? "అనుకూల స్ప్రే సమయం. రక్షణ మందు పిచికారీ చేయండి." : language === "hi" ? "छिड़काव के लिए उत्तम समय। सुरक्षात्मक दवा दें।" : "Ideal spray window. Apply protective fungicide."
    }
  ];

  return (
    <main className="workspace-page min-h-screen bg-[#f7f8f4] text-[#1c3827]">
      {/* Top Header */}
      <header className="workspace-topbar sticky top-0 z-40 bg-[#f7f8f4]/90 backdrop-blur border-b border-[#e1e6d7] px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="workspace-back inline-flex items-center gap-2 text-sm font-bold text-[#2f6b45] no-underline hover:underline">
          <ArrowLeft size={17} /> <span>{t("back_to_dashboard")}</span>
        </Link>
        <div className="flex items-center gap-2 font-display text-lg font-bold text-[#20402e]">
          <EditableFrame id="weather_header_icon" className="h-8 w-8 rounded-xl bg-[#2f6b45] text-white">
            <CloudSun size={18} />
          </EditableFrame>
          <span>{str("header_title")}</span>
        </div>
        <button
          type="button"
          onClick={() => setShowLocationModal(true)}
          className="text-xs font-extrabold uppercase tracking-wider text-[#456b52] bg-[#e5eddc] px-3 py-1 rounded-full flex items-center gap-1 hover:bg-[#d5e4c8] cursor-pointer"
        >
          <LocateFixed size={13} /> {location.villageCity}, {location.district}
        </button>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-8">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#2f6b45]">{str("eyebrow")}</p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold text-[#193625]">{str("main_heading")}</h1>
          <p className="mt-2 text-sm text-[#4d6957]">
            {location.villageCity}, {location.district} ({location.state})
          </p>
        </div>

        {/* Location & Crop Context Selector */}
        <div className="mb-8 rounded-3xl border border-[#d8e0cc] bg-white p-6 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#2f6b45]">{str("telemetry_label")}</span>
            <p className="font-display text-lg font-bold text-[#183624] flex items-center gap-2 mt-0.5">
              <Compass size={18} className="text-[#2f6b45]" /> {location.villageCity}, {location.district} ({location.isGps ? t("gps_live") : "Manual"})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={requestGpsLocation}
              className="rounded-xl border border-[#2f6b45] bg-[#eef4e8] px-3 py-2 text-xs font-bold text-[#2f6b45] hover:bg-[#e2edd8] cursor-pointer"
            >
              📍 {t("refresh_location")}
            </button>

            <select
              value={selectedCropName}
              onChange={(e) => setSelectedCropName(e.target.value)}
              className="rounded-xl border border-[#c4d6b7] bg-[#f2f7ec] px-3.5 py-2 text-xs font-bold text-[#1b3b27] focus:outline-none cursor-pointer"
            >
              {CROPS_DATABASE.map((c) => (
                <option key={c.id} value={c.name}>
                  {localizeCrop(c.name, language)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Proactive Disaster Warnings */}
        <div className="mb-8 space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
            <ShieldAlert size={16} /> {str("proactive_warnings_title")} {localizedCrop}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rain & Spray Delay */}
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs uppercase text-amber-900 flex items-center gap-1.5">
                  <CloudRain size={16} className="text-amber-700" /> {str("rain_alert_title")}
                </span>
                <span className="rounded-full bg-amber-200 text-amber-900 px-2.5 py-0.5 text-[10px] font-extrabold">
                  HIGH IMPACT
                </span>
              </div>
              <p className="text-xs font-bold text-amber-950 leading-relaxed">
                {str("rain_alert_body")}
              </p>
            </div>

            {/* Flood & Drainage */}
            <div className="rounded-2xl border border-rose-300 bg-rose-50 p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs uppercase text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle size={16} className="text-rose-700" /> {str("flood_alert_title")}
                </span>
                <span className="rounded-full bg-rose-200 text-rose-950 px-2.5 py-0.5 text-[10px] font-extrabold">
                  IMMEDIATE ACTION
                </span>
              </div>
              <p className="text-xs font-bold text-rose-950 leading-relaxed">
                {str("flood_alert_body")}
              </p>
            </div>
          </div>
        </div>

        {/* Current Weather Cards with Editable Frames */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="rounded-3xl border border-[#d8e0cc] bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#597864] uppercase">{str("temp")}</span>
              <EditableFrame id="weather_temp_frame" className="h-9 w-9 rounded-xl bg-amber-100 text-amber-700">
                <Thermometer size={20} />
              </EditableFrame>
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-[#163322]">28.4°C</p>
            <p className="mt-1 text-xs text-[#52705d] font-semibold">Min: 18°C · Max: 32°C</p>
          </div>

          <div className="rounded-3xl border border-[#d8e0cc] bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#597864] uppercase">{str("humidity")}</span>
              <EditableFrame id="weather_humidity_frame" className="h-9 w-9 rounded-xl bg-sky-100 text-sky-700">
                <Droplets size={20} />
              </EditableFrame>
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-[#163322]">88%</p>
            <p className="mt-1 text-xs text-rose-700 font-bold">Fungal Disease Window Active</p>
          </div>

          <div className="rounded-3xl border border-[#d8e0cc] bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#597864] uppercase">{str("wind")}</span>
              <EditableFrame id="weather_wind_frame" className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700">
                <Wind size={20} />
              </EditableFrame>
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-[#163322]">14 km/h</p>
            <p className="mt-1 text-xs text-[#52705d] font-semibold">Safe for spray</p>
          </div>

          <div className="rounded-3xl border border-[#d8e0cc] bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#597864] uppercase">{str("rainfall")}</span>
              <EditableFrame id="weather_rain_frame" className="h-9 w-9 rounded-xl bg-indigo-100 text-indigo-700">
                <CloudRain size={20} />
              </EditableFrame>
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-[#163322]">45 mm</p>
            <p className="mt-1 text-xs text-amber-700 font-bold">48 Hours Forecast</p>
          </div>
        </div>

        {/* 5-Day Farm Forecast */}
        <div className="rounded-3xl border border-[#d8e0cc] bg-white p-6 shadow-xl sm:p-8">
          <h2 className="font-display text-xl font-bold text-[#183624] mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-[#2f6b45]" /> {str("forecast_title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {forecastDays.map((f, idx) => (
              <div key={idx} className="rounded-2xl border border-[#e1e9d8] bg-[#fafcf7] p-4 flex flex-col justify-between space-y-3">
                <div>
                  <span className="font-display text-sm font-bold text-[#193625] block">{f.day}</span>
                  <div className="mt-2 text-xs space-y-1 text-[#3b5947]">
                    <div>{str("temp")}: <strong className="text-[#193625]">{f.temp}</strong></div>
                    <div>{str("humidity")}: <strong className="text-[#193625]">{f.humidity}</strong></div>
                    <div>{str("rainfall")}: <strong className="text-sky-700">{f.rain}</strong></div>
                  </div>
                </div>
                <div className="rounded-xl bg-[#eef4e8] p-2.5 text-[11px] font-bold text-[#20452f] border border-[#d6e3cb] leading-snug">
                  {f.advice}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
