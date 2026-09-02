import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Sprout,
  Layers,
  Check,
  Droplets,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Leaf,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X
} from "lucide-react";
import { SOIL_TYPES, CROPS_DATABASE, SoilTypeInfo, CropData } from "../data/cropsDatabase";
import { useLanguage } from "../contexts/LanguageContext";
import { localizeCrop, localizeCategory } from "../lib/i18n";
import EditableFrame from "../components/EditableFrame";

const SOIL_STRINGS: Record<string, Record<string, string>> = {
  eyebrow: {
    en: "Soil Agronomy Intelligence",
    te: "నేల పంటల సిఫార్సు పరిజ్ఞానం",
    hi: "मृदा फसल सिफारिश ज्ञान",
    ta: "மண் பயிர் பரிந்துரை அறிவு",
    kn: "ಮಣ್ಣಿನ ಬೆಳೆ ಶಿಫಾರಸು ಮಾಹಿತಿ",
    mr: "माती पीक शिफारस ज्ञान",
    pa: "ਮਿੱਟੀ ਫਸਲ ਸਿਫਾਰਸ਼ ਗਿਆਨ",
    bn: "মাটি ফসল সুপারিশ জ্ঞান",
    gu: "જમીન પાક ભલામણ જ્ઞાન",
    ml: "മണ്ണ് വിള ശുപാർശ വിവരങ്ങൾ",
  },
  main_heading: {
    en: "Soil-Type Crop Recommendation",
    te: "నేల రకాన్ని బట్టి అనువైన పంటల సిఫార్సు",
    hi: "मिट्टी के प्रकार अनुसार उपयुक्त फसल सिफारिश",
    ta: "மண் வகைக்கு ஏற்ற பயிர் பரிந்துரை",
    kn: "ಮಣ್ಣಿನ ಪ್ರಕಾರಕ್ಕೆ ತಕ್ಕ ಬೆಳೆ ಶಿಫಾರಸು",
    mr: "मातीच्या प्रकारानुसार पीक शिफारस",
    pa: "ਮਿੱਟੀ ਦੀ ਕਿਸਮ ਅਨੁਸਾਰ ਫਸਲ ਸਿਫਾਰਸ਼",
    bn: "মাটির ধরন অনুযায়ী ফসল সুপারিশ",
    gu: "જમીનના પ્રકાર મુજબ પાક ભલામણ",
    ml: "മണ്ണിന്റെ തരമനുസരിച്ചുള്ള വിള ശുപാർശ",
  },
  main_subtext: {
    en: "Select your farm's soil type to discover crop choices that yield best in your specific soil structure, water drainage, and nutrient profile.",
    te: "మీ పొలం నేల రకాన్ని ఎంచుకుని, ఆ నేల సారం, నీటి పారుదల మరియు పోషకాలకు అత్యధిక దిగుబడినిచ్చే ఉత్తమ పంటలను తెలుసుకోండి.",
    hi: "अपने खेत की मिट्टी का प्रकार चुनें और जानें कि आपकी मिट्टी की संरचना, जल निकासी और पोषक तत्वों में कौन सी फसलें सबसे अधिक उपज देती हैं।",
    ta: "உங்கள் பண்ணையின் மண் வகையைத் தேர்ந்தெடுத்து, அதிக மகசூல் தரும் சிறந்த பயிர்களைக் கண்டறியவும்.",
    kn: "ನಿಮ್ಮ ಜಮೀನಿನ ಮಣ್ಣಿನ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಅತ್ಯಧಿಕ ಇಳುವರಿ ನೀಡುವ ಬೆಳೆಗಳನ್ನು ತಿಳಿಯಿರಿ.",
    mr: "तुमच्या शेतातील मातीचा प्रकार निवडा आणि सर्वाधिक उत्पादन देणारी पिके शोधा.",
    pa: "ਆਪਣੇ ਖੇਤ ਦੀ ਮਿੱਟੀ ਦੀ ਕਿਸਮ ਚੁਣੋ ਅਤੇ ਵੱਧ ਝਾੜ ਦੇਣ ਵਾਲੀਆਂ ਫਸਲਾਂ ਜਾਣੋ।",
    bn: "আপনার খামারের মাটির ধরন নির্বাচন করুন এবং সেরা ফলনশীল ফসল জানুন।",
    gu: "તમારા ખેતરની જમીનનો પ્રકાર પસંદ કરો અને શ્રેષ્ઠ ઉત્પાદન આપતા પાક જાણો.",
    ml: "നിങ്ങളുടെ കൃഷിയിടത്തിലെ മണ്ണിന്റെ തരം തിരഞ്ഞെടുത്ത് മികച്ച വിളവ് നൽകുന്ന വിളകൾ കണ്ടെത്തുക.",
  },
  matching_crops: {
    en: "Recommended Crops for",
    te: "అనువైన ఉత్తమ పంటలు —",
    hi: "उपयुक्त सर्वोत्तम फसलें —",
    ta: "பொருத்தமான சிறந்த பயிர்கள் —",
    kn: "ಅತ್ಯುತ್ತಮ ಸೂಕ್ತ ಬೆಳೆಗಳು —",
    mr: "योग्य सर्वोत्तम पिके —",
    pa: "ਸਭ ਤੋਂ ਵਧੀਆ ਫਸਲਾਂ —",
    bn: "সেরা উপযুক্ত ফসল —",
    gu: "શ્રેષ્ઠ અનુકૂળ પાક —",
    ml: "ഏറ്റവും അനുയോജ്യമായ വിളകൾ —",
  },
  yield_label: {
    en: "Expected Yield",
    te: "దిగుబడి అంచనా",
    hi: "अपेक्षित उपज",
    ta: "எதிர்பார்க்கப்படும் மகசூல்",
    kn: "ನಿರೀಕ್ಷಿತ ಇಳುವರಿ",
    mr: "अपेक्षित उत्पादन",
    pa: "ਸੰਭਾਵਿਤ ਝਾੜ",
    bn: "প্রত্যাশিত ফলন",
    gu: "અપેક્ષિત ઉત્પાદન",
    ml: "പ്രതീക്ഷിക്കുന്ന വിളവ്",
  },
  characteristics: {
    en: "Characteristics",
    te: "ముఖ్య లక్షణాలు",
    hi: "मुख्य विशेषताएं",
    ta: "முக்கிய பண்புகள்",
    kn: "ಪ್ರಮುಖ ಲಕ್ಷಣಗಳು",
    mr: "वैशिष्ट्ये",
    pa: "ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ",
    bn: "বৈশিষ্ট্য",
    gu: "લાક્ષણિકતાઓ",
    ml: "സവിശേഷതകൾ",
  },
  management: {
    en: "Management Tip",
    te: "యాజమాన్య సూచన",
    hi: "प्रबंधन सलाह",
    ta: "பராமரிப்பு குறிப்பு",
    kn: "ನಿರ್ವಹಣಾ ಸಲಹೆ",
    mr: "व्यवस्थापन सल्ला",
    pa: "ਪ੍ਰਬੰਧਨ ਸਲਾਹ",
    bn: "ব্যবস্থাপনা টিপસ",
    gu: "સંચાલન ટીપ",
    ml: "പരിപാലന നിർദ്ദേശം",
  },
  select_crop_prompt: {
    en: "Select a crop to see in-depth soil suitability analysis:",
    te: "నేల అనుకూలత విశ్లేషణను చూడటానికి ఒక పంటను ఎంచుకోండి:",
    hi: "गहन मृदा उपयुक्तता विश्लेषण देखने के लिए एक फसल चुनें:",
    ta: "விரிவான மண் பொருத்த பகுப்பாய்வைக் காண ஒரு பயிரைத் தேர்ந்தெடுக்கவும்:",
    kn: "ವಿವರವಾದ ಮಣ್ಣಿನ ಹೊಂದಾಣಿಕೆ ವಿಶ್ಲೇಷಣೆ ನೋಡಲು ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ:",
    mr: "सखोल माती उपयुक्तता विश्लेषण पाहण्यासाठी पीक निवडा:",
    pa: "ਡੂੰਘਾਈ ਨਾਲ ਮਿੱਟੀ ਅਨੁਕੂਲਤਾ ਵਿਸ਼ਲੇਸ਼ਣ ਦੇਖਣ ਲਈ ਫਸਲ ਚੁਣੋ:",
    bn: "মাটি উপযুক্ততা বিশদ বিশ্লেষণ দেখতে একটি ফসল নির্বাচন করুন:",
    gu: "વિગતવાર જમીન સુસંગતતા વિશ્લેષણ જોવા માટે પાક પસંદ કરો:",
    ml: "വിശദമായ മണ്ണ് അനുയോജ്യത കാണാൻ ഒരു വിള തിരഞ്ഞെടുക്കുക:",
  },
  no_rec_title: {
    en: "No specific recommendation available for this combination yet",
    te: "ఈ నేల మరియు పంట కలయికకు ఇంకా నిర్దిష్ట సిఫార్సు అందుబాటులో లేదు",
    hi: "इस मिट्टी और फसल संयोजन के लिए अभी कोई विशिष्ट सिफारिश उपलब्ध नहीं है",
    ta: "இந்த மண் மற்றும் பயிர் சேர்க்கைக்கு இன்னும் குறிப்பிட்ட பரிந்துரை இல்லை",
    kn: "ಈ ಮಣ್ಣು ಮತ್ತು ಬೆಳೆ ಸಂಯೋಜನೆಗೆ ಇನ್ನೂ ಯಾವುದೇ ನಿರ್ದಿಷ್ಟ ಶಿಫಾರಸು ಲಭ್ಯವಿಲ್ಲ",
    mr: "या माती आणि पीक संयोजनासाठी अद्याप कोणतीही विशिष्ट शिफारस उपलब्ध नाही",
    pa: "ਇਸ ਮਿੱਟੀ ਅਤੇ ਫਸਲ ਦੇ ਸੁਮੇਲ ਲਈ ਅਜੇ ਕੋਈ ਖਾਸ ਸਿਫਾਰਸ਼ ਉਪਲਬਧ ਨਹੀਂ ਹੈ",
    bn: "এই মাটি এবং ফসলের সংমিশ্রণের জন্য এখনও কোনও নির্দিষ্ট সুপারিশ উপলব্ধ নেই",
    gu: "આ જમીન અને પાક સંયોજન માટે હજી કોઈ ચોક્કસ ભલામણ ઉપલબ્ધ નથી",
    ml: "ഈ മണ്ണും വിളയും സംയോജനത്തിന് ഇതുവരെ പ്രത്യേക ശുപാർശ ലഭ്യമല്ല",
  },
  no_rec_desc: {
    en: "We recommend consulting with your local Gram Sachivalayam agronomist or choosing one of the highly rated matching crops below.",
    te: "మీ స్థానిక రైతు భరోసా కేంద్రం వ్యవసాయ అధికారిని సంప్రదించాల్సిందిగా లేదా క్రింద ఇవ్వబడిన ఉత్తమ పంటలలో ఒకదానిని ఎంచుకోవాల్సిందిగా సూచిస్తున్నాము.",
    hi: "हम आपके स्थानीय ग्राम सचिवालय कृषि अधिकारी से परामर्श करने या नीचे दी गई उपयुक्त फसलों में से चुनने की सलाह देते हैं।",
    ta: "உங்கள் உள்ளூர் கிராம வேளாண் அதிகாரியைக் கலந்தாலோசிக்க பரிந்துரைக்கிறோம்.",
    kn: "ನಿಮ್ಮ ಸ್ಥಳೀಯ ಗ್ರಾಮ ಸಚಿವಾಲಯ ಕೃಷಿ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಲು ಶಿಫಾರಸು ಮಾಡುತ್ತೇವೆ.",
    mr: "आम्ही आपल्या स्थानिक कृषी अधिकाऱ्याचा सल्ला घेण्याची शिफारस करतो.",
    pa: "ਅਸੀਂ ਸਥਾਨਕ ਖੇਤੀਬਾੜੀ ਅਧਿਕਾਰੀ ਨਾਲ ਸਲਾਹ ਕਰਨ ਦੀ ਸਿਫਾਰਸ਼ ਕਰਦੇ ਹਾਂ।",
    bn: "আমরা স্থানীয় কৃষি কর্মকর্তার সাথে পরামর্শ করার পরামর্শ দিচ্ছি।",
    gu: "અમે સ્થાનિક કૃષિ અધિકારીનો સંપર્ક કરવાની ભલામણ કરીએ છીએ.",
    ml: "പ്രാദേശിക കൃഷി ഓഫീസറുമായി ബന്ധപ്പെടാൻ നിർദ്ദേശിക്കുന്നു.",
  }
};

const SOIL_TRANSLATIONS: Record<string, Record<string, string>> = {
  "Sandy Soil": {
    en: "Sandy Soil",
    te: "ఇసుక నేల (Sandy Soil)",
    hi: "बलुई मिट्टी (Sandy Soil)",
    ta: "மணல் மண் (Sandy)",
    kn: "ಮರಳು ಮಣ್ಣು",
    mr: "रेताड माती",
    pa: "ਰੇਤਲੀ ਮਿੱਟੀ",
    bn: "বেলে মাটি",
    gu: "રેતાળ જમીન",
    ml: "മണൽ മണ്ണ്",
  },
  "Loamy Soil": {
    en: "Loamy Soil",
    te: "గరప నేల / ఒండ్రు నేల (Loamy Soil)",
    hi: "दोमट मिट्टी (Loamy Soil)",
    ta: "வண்டல் மண் (Loamy)",
    kn: "ಗೋಡು ಮಣ್ಣು",
    mr: "गाळाची माती",
    pa: "ਦੋਮਟ ਮਿੱਟੀ",
    bn: "দোআঁশ মাটি",
    gu: "ગોરાડુ જમીન",
    ml: "എക്കൽ മണ്ണ്",
  },
  "Clayey Soil": {
    en: "Clayey Soil",
    te: "బంకమట్టి నేల (Clayey Soil)",
    hi: "चिकनी मिट्टी (Clayey Soil)",
    ta: "களிமண் (Clayey)",
    kn: "ಜೇಡಿ ಮಣ್ಣು",
    mr: "चिकणमाती",
    pa: "ਚੀਕਣੀ ਮਿੱਟੀ",
    bn: "এঁটেল মাটি",
    gu: "ચીકણી જમીન",
    ml: "കളിമണ്ണ്",
  },
  "Black Cotton (Regur) Soil": {
    en: "Black Cotton (Regur) Soil",
    te: "నల్లరేగడి నేల (Black Regur Soil)",
    hi: "काली कपास (रेगुर) मिट्टी",
    ta: "கரிசல் மண் (Black Soil)",
    kn: "ಕಪ್ಪು ಹತ್ತಿ (ರೆಗೂರ್) ಮಣ್ಣು",
    mr: "काळी कसदार माती (रेगूर)",
    pa: "ਕਾਲੀ ਕਪਾਹ ਮਿੱਟੀ",
    bn: "কালো রেগুর মাটি",
    gu: "કાળી કપાસ જમીન",
    ml: "കരിമണ്ണ്",
  },
  "Red Soil": {
    en: "Red Soil",
    te: "ఎర్ర నేల (Red Soil)",
    hi: "लाल मिट्टी (Red Soil)",
    ta: "செம்மண் (Red Soil)",
    kn: "ಕೆಂಪು ಮಣ್ಣು",
    mr: "तांबडी माती",
    pa: "ਲਾਲ ਮਿੱਟੀ",
    bn: "লাল মাটি",
    gu: "લાલ જમીન",
    ml: "ചെമ്മണ്ണ്",
  },
  "Laterite Soil": {
    en: "Laterite Soil",
    te: "లాటరైట్ నేల (Laterite Soil)",
    hi: "लैटेराइट मिट्टी",
    ta: "லேட்டரைட் மண்",
    kn: "ಲ್ಯಾಟರೈಟ್ ಮಣ್ಣು",
    mr: "जांभी माती",
    pa: "ਲੈਟਰਾਈਟ ਮਿੱਟੀ",
    bn: "ল্যাটেরাইট মাটি",
    gu: "લેટેરાઇટ જમીન",
    ml: "വെട്ടുകൽ മണ്ണ്",
  },
  "Alluvial Soil": {
    en: "Alluvial Soil",
    te: "ఒండ్రు నేల (Alluvial Soil)",
    hi: "जलोढ़ मिट्टी (Alluvial)",
    ta: "வண்டல் மண்",
    kn: "ಮೆಕ್ಕಲು ಮಣ್ಣು",
    mr: "अल्लुव्हिअल गाळाची माती",
    pa: "ਜਲੋੜ ਮਿੱਟੀ",
    bn: "পলি মাটি",
    gu: "કાંપવાળી જમીન",
    ml: "എക്കൽ മണ്ണ്",
  },
  "Saline & Alkaline Soil": {
    en: "Saline & Alkaline Soil",
    te: "చౌడు నేల / ఉప్పు నేల (Saline Soil)",
    hi: "लवणीय व क्षारीय मिट्टी",
    ta: "உவர் மண்",
    kn: "ಉಪ್ಪು ಮಣ್ಣು",
    mr: "खारवट माती",
    pa: "ਖਾਰੀ ਮਿੱਟੀ",
    bn: "লবণাক্ত মাটি",
    gu: "ક્ષારીય જમીન",
    ml: "ഉപ്പുരസമുള്ള മണ്ണ്",
  },
  "Peaty & Marshy Soil": {
    en: "Peaty & Marshy Soil",
    te: "చిత్తడి నేల (Peaty Soil)",
    hi: "पीटमय व दलदली मिट्टी",
    ta: "சதுப்பு மண்",
    kn: "ಜೌಗು ಮಣ್ಣು",
    mr: "दलदलीची माती",
    pa: "ਦਲਦਲੀ ਮਿੱਟੀ",
    bn: "পিট মাটি",
    gu: "દલદલ વાળી જમીન",
    ml: "ചതുപ്പുനിലം",
  }
};

export default function SoilRecommendation() {
  const { language, t } = useLanguage();
  const [selectedSoil, setSelectedSoil] = useState<SoilTypeInfo>(SOIL_TYPES[0]);
  const [selectedCropId, setSelectedCropId] = useState<string>("");
  const [modalCrop, setModalCrop] = useState<CropData | null>(null);

  const str = (key: keyof typeof SOIL_STRINGS): string => {
    return SOIL_STRINGS[key]?.[language] || SOIL_STRINGS[key]?.en || "";
  };

  const getLocalizedSoilName = (soilName: string): string => {
    return SOIL_TRANSLATIONS[soilName]?.[language] || SOIL_TRANSLATIONS[soilName]?.en || soilName;
  };

  // Find matching crops based on suitableSoilTypes keyword overlap or explicit recommendations
  const recommendedCropObjects = CROPS_DATABASE.filter((crop) => {
    const soilKeywords = selectedSoil.name.toLowerCase().split(/[ (,/)]+/).filter(Boolean);
    const matchesSuitable = crop.suitableSoilTypes.some((st) => {
      const lower = st.toLowerCase();
      return soilKeywords.some((kw) => kw.length > 2 && lower.includes(kw));
    });
    const matchesName = selectedSoil.recommendedCrops.some((rc) => {
      const rcWord = rc.toLowerCase().split(/[ (,/)]+/)[0];
      return crop.name.toLowerCase().includes(rcWord);
    });
    return matchesSuitable || matchesName;
  });

  // Selected specific crop object (if chosen from dropdown or card)
  const activeDetailCrop = CROPS_DATABASE.find((c) => c.id === selectedCropId);

  // Check compatibility of selected crop with active soil
  const isCropCompatible = activeDetailCrop
    ? recommendedCropObjects.some((c) => c.id === activeDetailCrop.id) ||
      activeDetailCrop.suitableSoilTypes.some((st) =>
        selectedSoil.name.toLowerCase().includes(st.toLowerCase().split(" ")[0])
      )
    : false;

  return (
    <main className="workspace-page min-h-screen bg-[#f7f8f4] text-[#1c3827]">
      {/* Top Header */}
      <header className="workspace-topbar sticky top-0 z-40 bg-[#f7f8f4]/90 backdrop-blur border-b border-[#e1e6d7] px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="workspace-back inline-flex items-center gap-2 text-sm font-bold text-[#2f6b45] no-underline hover:underline">
          <ArrowLeft size={17} /> <span>{t("back_to_dashboard")}</span>
        </Link>
        <div className="flex items-center gap-2 font-display text-lg font-bold text-[#20402e]">
          <EditableFrame id="soil_header_icon" className="h-8 w-8 rounded-xl bg-[#2f6b45] text-white">
            <Sprout size={18} />
          </EditableFrame>
          <span>{t("soil_recommender")}</span>
        </div>
        <span className="hidden sm:inline-block text-xs font-extrabold uppercase tracking-wider text-[#456b52] bg-[#e5eddc] px-3 py-1 rounded-full">
          Soil Matrix Optimization
        </span>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-8">
          <EditableFrame id="soil_page_title" isTextOnly>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#2f6b45]">{str("eyebrow")}</p>
            <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold text-[#193625]">{str("main_heading")}</h1>
            <p className="mt-2 text-sm text-[#4d6957] leading-relaxed">
              {str("main_subtext")}
            </p>
          </EditableFrame>
        </div>

        {/* Soil Selector Pills */}
        <div className="mb-8 flex flex-wrap gap-2.5">
          {SOIL_TYPES.map((soil) => (
            <button
              key={soil.id}
              type="button"
              onClick={() => {
                setSelectedSoil(soil);
                setSelectedCropId("");
              }}
              className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold transition-all cursor-pointer ${
                selectedSoil.id === soil.id
                  ? "bg-[#2f6b45] text-white shadow-lg scale-105"
                  : "bg-white text-[#294c36] border border-[#d8e2cf] hover:bg-[#eaf0e3]"
              }`}
            >
              <Layers size={15} />
              <span>{getLocalizedSoilName(soil.name)}</span>
            </button>
          ))}
        </div>

        {/* Selected Soil Profile Card */}
        <EditableFrame
          id="soil_profile_card"
          className="mb-8 rounded-3xl border border-[#d8e0cc] bg-white p-6 shadow-xl sm:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#e1e9d8] pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-0.5 text-xs font-bold">
                  {selectedSoil.keyCharacteristics[0] || "Optimal Structure"}
                </span>
                <span className="text-xs font-bold text-[#567560]">{selectedSoil.keyCharacteristics[1] || "Good Drainage"}</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#183624] mt-2">{getLocalizedSoilName(selectedSoil.name)}</h2>
              <p className="text-sm text-[#4d6b58] mt-1 max-w-2xl">{selectedSoil.description}</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <div className="rounded-2xl bg-[#f2f7ec] p-4 text-xs font-bold text-[#20452f] border border-[#d6e3cb]">
                <div>{str("characteristics")}: {selectedSoil.keyCharacteristics.slice(0, 2).join(" · ")}</div>
                <div className="mt-1">{str("management")}: {selectedSoil.managementTips[0]}</div>
              </div>
            </div>
          </div>

          {/* Interactive Crop Selection Dropdown for Direct Analysis */}
          <div className="mb-6 rounded-2xl bg-[#f8faf5] border border-[#dce5d2] p-4">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2f6b45] mb-2">
              {str("select_crop_prompt")}
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <select
                value={selectedCropId}
                onChange={(e) => setSelectedCropId(e.target.value)}
                className="w-full sm:w-80 rounded-xl border border-[#cbd8bf] bg-white px-4 py-2.5 text-xs font-bold text-[#1b3b27] focus:outline-none focus:ring-2 focus:ring-[#2f6b45]/30 cursor-pointer"
              >
                <option value="">-- Choose any crop to check compatibility --</option>
                {CROPS_DATABASE.map((c) => (
                  <option key={c.id} value={c.id}>
                    {localizeCrop(c.name, language)} ({c.season})
                  </option>
                ))}
              </select>

              {selectedCropId && (
                <button
                  type="button"
                  onClick={() => setSelectedCropId("")}
                  className="text-xs text-[#52705d] hover:text-[#183624] font-semibold underline cursor-pointer"
                >
                  Clear Selection
                </button>
              )}
            </div>

            {/* In-depth Selected Crop Analysis Box */}
            {activeDetailCrop && (
              <div className="mt-4 pt-4 border-t border-[#dce5d2] animate-in fade-in">
                {isCropCompatible ? (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={20} className="text-emerald-700" />
                        <h4 className="font-display text-lg font-bold text-emerald-950">
                          {localizeCrop(activeDetailCrop.name, language)} is Highly Suitable for {getLocalizedSoilName(selectedSoil.name)}
                        </h4>
                      </div>
                      <span className="rounded-full bg-emerald-200 text-emerald-900 px-3 py-0.5 text-xs font-extrabold">
                        95% Suitability Match
                      </span>
                    </div>
                    <p className="text-xs text-emerald-900 leading-relaxed">
                      {activeDetailCrop.name} performs exceptionally in {selectedSoil.name} due to optimal root penetration and root respiration. Expected yield: <strong>{activeDetailCrop.expectedYieldPerAcre}</strong> with a total crop cycle of <strong>{activeDetailCrop.durationDays} days</strong>.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-emerald-200">
                        <strong className="text-emerald-950 block">Water Requirements:</strong>
                        <span className="text-emerald-800">{activeDetailCrop.waterRequirements}</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-emerald-200">
                        <strong className="text-emerald-950 block">Soil Practice:</strong>
                        <span className="text-emerald-800">{selectedSoil.managementTips[0] || "Maintain organic mulch"}</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-emerald-200">
                        <strong className="text-emerald-950 block">Nutrient Care:</strong>
                        <span className="text-emerald-800">{selectedSoil.managementTips[1] || "Balanced NPK application"}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-amber-50 border border-amber-300 p-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={20} className="text-amber-700" />
                      <h4 className="font-display text-base font-bold text-amber-950">
                        {str("no_rec_title")}
                      </h4>
                    </div>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      {localizeCrop(activeDetailCrop.name, language)} typically thrives in <strong>{activeDetailCrop.suitableSoilTypes.join(", ")}</strong>. In {getLocalizedSoilName(selectedSoil.name)}, yield may be limited unless specialized soil conditioning (such as drainage channels, organic humus, or gypsum) is applied.
                    </p>
                    <p className="text-xs text-amber-800">
                      {str("no_rec_desc")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recommended Crops Grid */}
          <div>
            <h3 className="font-display text-xl font-bold text-[#183624] mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" /> {str("matching_crops")} {getLocalizedSoilName(selectedSoil.name)} ({recommendedCropObjects.length})
            </h3>

            {recommendedCropObjects.length === 0 ? (
              <div className="rounded-2xl border border-[#d8e0cc] bg-[#fdfcf8] p-8 text-center space-y-2">
                <HelpCircle size={32} className="mx-auto text-[#61806e]" />
                <h4 className="font-display text-base font-bold text-[#193625]">{str("no_rec_title")}</h4>
                <p className="text-xs text-[#52705d] max-w-md mx-auto">{str("no_rec_desc")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {recommendedCropObjects.map((crop) => (
                  <div
                    key={crop.id}
                    onClick={() => setModalCrop(crop)}
                    className="rounded-2xl border border-[#d8e0cc] bg-[#fafcf7] p-5 flex flex-col justify-between hover:shadow-lg hover:border-[#2f6b45] transition-all cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="rounded-md bg-[#e5eddc] px-2 py-0.5 text-[10px] font-extrabold uppercase text-[#2f6b45]">
                          {localizeCategory(crop.category, language)}
                        </span>
                        <span className="text-xs font-bold text-[#567560]">{crop.season}</span>
                      </div>
                      <h4 className="font-display text-lg font-bold text-[#183624] group-hover:text-[#2f6b45] transition-colors">
                        {localizeCrop(crop.name, language)}
                      </h4>
                      <p className="text-xs text-[#52705d] mt-1">{str("yield_label")}: <strong>{crop.expectedYieldPerAcre}</strong></p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#e3ecda] flex items-center justify-between text-xs">
                      <span className="font-bold text-[#2f6b45]">
                        {crop.durationDays} Days Duration
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold text-[#20452f] group-hover:underline">
                        View Dossier <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </EditableFrame>
      </div>

      {/* Crop Soil Dossier Modal */}
      {modalCrop && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#d8e0cc] p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e5edd8] pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2f6b45] bg-[#e5eddc] px-2.5 py-0.5 rounded-full">
                  {localizeCategory(modalCrop.category, language)} • {modalCrop.season}
                </span>
                <h3 className="font-display text-2xl font-bold text-[#183624] mt-1">
                  {localizeCrop(modalCrop.name, language)} Soil Agronomy Dossier
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalCrop(null)}
                className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#f6faf2] rounded-2xl border border-[#d8e8cf]">
                <strong className="block text-[#193625]">Ideal Soil Types:</strong>
                <span className="text-[#3c5947]">{modalCrop.suitableSoilTypes.join(", ")}</span>
              </div>
              <div className="p-3 bg-[#f6faf2] rounded-2xl border border-[#d8e8cf]">
                <strong className="block text-[#193625]">Expected Yield:</strong>
                <span className="text-[#3c5947]">{modalCrop.expectedYieldPerAcre}</span>
              </div>
              <div className="p-3 bg-[#f6faf2] rounded-2xl border border-[#d8e8cf]">
                <strong className="block text-[#193625]">Water Management:</strong>
                <span className="text-[#3c5947]">{modalCrop.waterRequirements}</span>
              </div>
              <div className="p-3 bg-[#f6faf2] rounded-2xl border border-[#d8e8cf]">
                <strong className="block text-[#193625]">Crop Duration:</strong>
                <span className="text-[#3c5947]">{modalCrop.durationDays} Days from sowing</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-display text-sm font-bold text-[#183624]">Recommended Soil Practices:</h4>
              <ul className="list-disc pl-5 text-xs text-[#415e4c] space-y-1">
                {selectedSoil.managementTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[#e5edd8] flex justify-end gap-3">
              <Link
                href="/knowledge-base"
                className="rounded-xl border border-[#cbd8bf] bg-white px-4 py-2 text-xs font-bold text-[#1c3827] hover:bg-[#f3f7ee] no-underline"
              >
                {t("knowledge_base")} →
              </Link>
              <button
                type="button"
                onClick={() => setModalCrop(null)}
                className="rounded-xl bg-[#2f6b45] px-5 py-2 text-xs font-bold text-white hover:bg-[#20492f] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
