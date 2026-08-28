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
  Leaf
} from "lucide-react";
import { SOIL_TYPES, CROPS_DATABASE, SoilTypeInfo } from "../data/cropsDatabase";
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
    en: "Best Matching Crops for",
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
    bn: "ব্যবস্থাপনা টিপস",
    gu: "સંચાલન ટીપ",
    ml: "പരിപാലന നിർദ്ദേശം",
  }
};

const SOIL_TRANSLATIONS: Record<string, Record<string, string>> = {
  "Black Clayey Soil (Regur)": {
    en: "Black Clayey Soil (Regur)",
    te: "నల్లరేగడి నేల (Black Clay Soil)",
    hi: "काली चिकनी मिट्टी (रेगुर)",
    ta: "கரிசல் மண் (Black Soil)",
    kn: "ಕಪ್ಪು ಜೇಡಿಮಣ್ಣು (Black Soil)",
    mr: "काळी कसदार माती (रेगूर)",
    pa: "ਕਾਲੀ ਮਿੱਟੀ",
    bn: "কালো দোআঁশ মাটি",
    gu: "કાળી ચીકણી જમીન",
    ml: "കരിമണ്ണ്",
  },
  "Red Loamy Soil": {
    en: "Red Loamy Soil",
    te: "ఎర్ర నేల / ఎర్ర గరప నేల (Red Loamy)",
    hi: "लाल दोमट मिट्टी",
    ta: "செம்மண் (Red Loam)",
    kn: "ಕೆಂಪು ಗೋಡು ಮಣ್ಣು",
    mr: "तांबडी गाळाची माती",
    pa: "ਲਾਲ ਦੋਮਟ ਮਿੱਟੀ",
    bn: "লাল দোআঁশ মাটি",
    gu: "લાલ ગોરાડુ જમીન",
    ml: "ചെമ്മണ്ണ്",
  },
  "Alluvial Soil": {
    en: "Alluvial Soil",
    te: "ఒండ్రు నేల (Alluvial Soil)",
    hi: "जलोढ़ मिट्टी",
    ta: "வண்டல் மண்",
    kn: "ಮೆಕ್ಕಲು ಮಣ್ಣು",
    mr: "गाळाची माती (अल्लुव्हिअल)",
    pa: "ਜਲੋੜ ਮਿੱਟੀ",
    bn: "পলি মাটি",
    gu: "કાંપવાળી જમીન",
    ml: "എക്കൽ മണ്ണ്",
  },
  "Sandy Loam Soil": {
    en: "Sandy Loam Soil",
    te: "ఇసుక గరప నేల (Sandy Loam)",
    hi: "बलुई दोमट मिट्टी",
    ta: "மணல் கலந்த செம்மண்",
    kn: "ಮರಳು ಗೋಡು ಮಣ್ಣು",
    mr: "रेताड गाळाची माती",
    pa: "ਰੇਤਲੀ ਦੋਮਟ ਮਿੱਟੀ",
    bn: "বেলে দোআঁশ মাটি",
    gu: "રેતાળ ગોરાડુ જમીન",
    ml: "മണൽ കലർന്ന മണ്ണ്",
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
};

export default function SoilRecommendation() {
  const { language, t } = useLanguage();
  const [selectedSoil, setSelectedSoil] = useState<SoilTypeInfo>(SOIL_TYPES[0]);

  const str = (key: keyof typeof SOIL_STRINGS): string => {
    return SOIL_STRINGS[key]?.[language] || SOIL_STRINGS[key]?.en || "";
  };

  const getLocalizedSoilName = (soilName: string): string => {
    return SOIL_TRANSLATIONS[soilName]?.[language] || SOIL_TRANSLATIONS[soilName]?.en || soilName;
  };

  // Find matching crop objects from dataset
  const recommendedCropObjects = CROPS_DATABASE.filter((crop) =>
    crop.suitableSoilTypes.some((s) => s.toLowerCase().includes(selectedSoil.name.toLowerCase().split(" ")[0]))
  );

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
              onClick={() => setSelectedSoil(soil)}
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

          {/* Recommended Crops Grid */}
          <div>
            <h3 className="font-display text-xl font-bold text-[#183624] mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" /> {str("matching_crops")} {getLocalizedSoilName(selectedSoil.name)}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendedCropObjects.map((crop) => (
                <div
                  key={crop.id}
                  className="rounded-2xl border border-[#d8e0cc] bg-[#fafcf7] p-5 flex flex-col justify-between hover:shadow-md hover:border-[#2f6b45]/40 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="rounded-md bg-[#e5eddc] px-2 py-0.5 text-[10px] font-extrabold uppercase text-[#2f6b45]">
                        {localizeCategory(crop.category, language)}
                      </span>
                      <span className="text-xs font-bold text-[#567560]">{crop.season}</span>
                    </div>
                    <h4 className="font-display text-lg font-bold text-[#183624]">{localizeCrop(crop.name, language)}</h4>
                    <p className="text-xs text-[#52705d] mt-1">{str("yield_label")}: {crop.expectedYieldPerAcre}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#e3ecda] flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2f6b45]">
                      {crop.durationDays} Days Duration
                    </span>
                    <Link
                      href="/knowledge"
                      className="inline-flex items-center gap-1 font-bold text-[#20452f] hover:underline"
                    >
                      {t("knowledge_base")} <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </EditableFrame>
      </div>
    </main>
  );
}
