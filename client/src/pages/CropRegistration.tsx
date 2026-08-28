import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Droplets,
  Leaf,
  LocateFixed,
  MapPin,
  Mountain,
  Sprout,
  Tractor,
  Wheat,
  ShieldCheck
} from "lucide-react";
import { cropsApi, getApiErrorMessage } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizeCrop } from "@/lib/i18n";
import EditableFrame from "@/components/EditableFrame";

const PROCESS_TRANSLATIONS: Record<string, Record<string, string>> = {
  Ploughing: { en: "Ploughing", te: "దుక్కి దున్నడం (Ploughing)", hi: "खेत की जुताई", ta: "உழுதல்", kn: "ಉಳುಮೆ", mr: "नांगरणी", pa: "ਵਾਹੀ", bn: "জমি চাষ", gu: "ખેડ", ml: "നിലമുഴുൽ" },
  Seeding: { en: "Seeding / Sowing", te: "విత్తడం / నాట్లు (Seeding)", hi: "बुवाई / रोपाई", ta: "விதைப்பு", kn: "ಬಿತ್ತನೆ", mr: "पेरणी", pa: "ਬਿਜਾਈ", bn: "বপন", gu: "વાવણી", ml: "വിത്ത് വിതയ്ക്കൽ" },
  Irrigation: { en: "Irrigation", te: "నీటి తడులు (Irrigation)", hi: "सिंचाई", ta: "நீர்ப்பாசனம்", kn: "ನೀರಾವರಿ", mr: "सिंचन", pa: "ਸਿੰਚਾਈ", bn: "সেচ", gu: "પિયત", ml: "നനയ്ക്കൽ" },
  "None yet": { en: "None yet", te: "ఇంకా ప్రారంభించలేదు", hi: "अभी शुरू नहीं हुआ", ta: "இன்னும் தொடங்கவில்லை", kn: "ಇನ್ನೂ ಪ್ರಾರಂಭವಾಗಿಲ್ಲ", mr: "अजून नाही", pa: "ਹਾਲੇ ਨਹੀਂ", bn: "এখনও নয়", gu: "હજી નથી", ml: "ഇതുവരെയില്ല" },
};

const STEP_LABELS: Record<string, string[]> = {
  en: ["Location", "Crop details", "Farming process", "Review", "Complete"],
  te: ["పొలం స్థలం", "పంట వివరాలు", "వ్యవసాయ దశ", "సమీక్ష", "పూర్తయింది"],
  hi: ["खेत स्थान", "फसल विवरण", "कृषि प्रक्रिया", "समीक्षा", "पूर्ण"],
  ta: ["இருப்பிடம்", "பயிர் விவரங்கள்", "விவசாய முறை", "சரிபார்த்தல்", "முடிந்தது"],
  kn: ["ಸ್ಥಳ", "ಬೆಳೆ ವಿವರಗಳು", "ಕೃಷಿ ಹಂತ", "ಪರಿಶೀಲನೆ", "ಪೂರ್ಣ"],
  mr: ["स्थान", "पीक तपशील", "शेती प्रक्रिया", "पुನरावलोकन", "पूर्ण"],
  pa: ["ਸਥਾਨ", "ਫਸਲ ਦੇ ਵੇਰਵੇ", "ਖੇਤੀ ਪ੍ਰਕਿਰਿਆ", "ਸਮੀਖਿਆ", "ਮੁਕੰਮਲ"],
  bn: ["অবস্থান", "ফসলের বিবরণ", "কৃষি প্রক্রিয়া", "পর্যালোচনা", "সম্পূর্ণ"],
  gu: ["સ્થળ", "પાકની વિગત", "ખેતી પ્રક્રિયા", "સમીક્ષા", "પૂર્ણ"],
  ml: ["സ്ഥലം", "വിള വിവരങ്ങൾ", "കൃഷി രീതി", "പരിശോധന", "പൂർത്തിയായി"],
};

const REG_STRINGS: Record<string, Record<string, string>> = {
  eyebrow: { en: "Add a new field note", te: "కొత్త పంట క్షేత్ర నమోదు", hi: "नया खेत विवरण जोड़ें", ta: "புதிய பண்ணை பதிவு", kn: "ಹೊಸ ಜಮೀನು ನೋಂದಣಿ", mr: "नवीन शेत नोंद", pa: "ਨਵਾਂ ਖੇਤ ਨੋਟ", bn: "নতুন খামার নোট", gu: "નવી ખેતર નોંધ", ml: "പുതിയ കൃഷി വിവരങ്ങൾ" },
  title: { en: "Register your crop.", te: "మీ పంటను నమోదు చేసుకోండి.", hi: "अपनी फसल दर्ज करें।", ta: "உங்கள் பயிரைப் பதிவு செய்யுங்கள்.", kn: "ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ನೋಂದಾಯಿಸಿ.", mr: "तुमचे पीक नोंदवा.", pa: "ਆਪਣੀ ਫਸਲ ਦਰਜ ਕਰੋ।", bn: "আপনার ফসল নিবন্ধন করুন।", gu: "તમારો પાક નોંધાવો.", ml: "നിങ്ങളുടെ വിള രജിസ്റ്റർ ചെയ്യുക." },
  lede: { en: "Tell us a little about the field. We’ll use it to shape your personalized crop plan.", te: "మీ పొలం వివరాలను తెలపండి. దీని ఆధారంగా దశలవారీ సంరక్షణ ప్రణాళికను తయారు చేస్తాము.", hi: "खेत के बारे में विवरण दें। हम इसके आधार पर आपकी व्यक्तिगत फसल योजना बनाएंगे।", ta: "உங்கள் வயல் பற்றிய தகவல்களைத் தெரிவிக்கவும்.", kn: "ನಿಮ್ಮ ಜಮೀನಿನ ಮಾಹಿತಿ ನೀಡಿ. ನಾವು ನಿಮಗಾಗಿ ಆರೈಕೆ ವೇಳಾಪಟ್ಟಿ ರಚಿಸುತ್ತೇವೆ.", mr: "शेताची माहिती द्या. आम्ही वैयक्तिक पीक नियोजन तयार करू.", pa: "ਆਪਣੇ ਖੇਤ ਬਾਰੇ ਦੱਸੋ। ਅਸੀਂ ਫਸਲ ਯੋਜਨਾ ਤਿਆਰ ਕਰਾਂਗੇ।", bn: "খামারের বিবরণ দিন। আমরা ফসল পরিকল্পনা তৈরি করব।", gu: "ખેતરની વિગત આપો. અમે પાક યોજના બનાવીશું.", ml: "കൃഷി വിവരങ്ങൾ നൽകുക. ഞങ്ങൾ പരിപാലന പ്ലാൻ തയാറാക്കും." },
  next: { en: "Next step", te: "తరువాతి దశ", hi: "अगला चरण", ta: "அடுத்த படி", kn: "ಮುಂದಿನ ಹಂತ", mr: "पुढील पायरी", pa: "ਅਗਲਾ ਕਦਮ", bn: "পরবর্তী ধাপ", gu: "આગલું પગલું", ml: "അടുത്ത ഘട്ടം" },
  back: { en: "Back", te: "వెనుకకు", hi: "पीछे", ta: "பின்னால்", kn: "ಹಿಂದಕ್ಕೆ", mr: "मागे", pa: "ਪਿੱਛੇ", bn: "পেছনে", gu: "પાછળ", ml: "പിന്നോട്ട്" },
  create_plan: { en: "Create crop plan & alerts", te: "పంట ప్రణాళిక & హెచ్చరికలను సృష్టించండి", hi: "फसल योजना व अलर्ट बनाएं", ta: "பயிர் திட்டம் & எச்சரிக்கைகளை உருவாக்கு", kn: "ಬೆಳೆ ಯೋಜನೆ & ಎಚ್ಚರಿಕೆಗಳನ್ನು ರಚಿಸಿ", mr: "पीक नियोजन व सूचना तयार करा", pa: "ਫਸਲ ਯੋਜਨਾ ਤੇ ਅਲਰਟ ਬਣਾਓ", bn: "ফসল পরিকল্পনা ও সতর্কতা তৈরি করুন", gu: "પાક યોજના અને ચેતવણી બનાવો", ml: "വിള പ്ലാൻ & അലേർട്ടുകൾ ഉണ്ടാക്കുക" },
  creating: { en: "Creating Care Schedule…", te: "సంరక్షణ షెడ్యూల్ రూపొందిస్తున్నాము…", hi: "देखभाल अनुसूची तैयार हो रही है…", ta: "பராமரிப்பு திட்டம் தயாராகிறது…", kn: "ಆರೈಕೆ ವೇಳಾಪಟ್ಟಿ ಸಿದ್ಧವಾಗುತ್ತಿದೆ…", mr: "नियोजन तयार होत आहे…", pa: "ਸਮਾਂ-ਸਾਰਣੀ ਤਿਆਰ ਹੋ ਰਹੀ ਹੈ…", bn: "পরিকল্পনা তৈরি হচ্ছে…", gu: "યોજના બની રહી છે…", ml: "പ്ലാൻ തയ്യാറാക്കുന്നു…" },
  view_plan: { en: "View my crop plan", te: "నా పంట ప్రణాళికను చూడండి", hi: "मेरी फसल योजना देखें", ta: "எனது பயிர் திட்டத்தைக் காண்க", kn: "ನನ್ನ ಬೆಳೆ ಯೋಜನೆ ವೀಕ್ಷಿಸಿ", mr: "माझे पीक नियोजन पहा", pa: "ਮੇਰੀ ਫਸਲ ਯੋਜਨਾ ਦੇਖੋ", bn: "আমার ফসল পরিকল্পনা দেখুন", gu: "મારી પાક યોજના જુઓ", ml: "വിള പ്ലാൻ കാണുക" },
  ready_msg: { en: "Your crop care schedule is ready.", te: "మీ పంట సంరక్షణ షెడ్యూల్ సిద్ధంగా ఉంది.", hi: "आपकी फसल देखभाल अनुसूची तैयार है।", ta: "உங்கள் பயிர் பராமரிப்பு அட்டவணை தயாராக உள்ளது.", kn: "ನಿಮ್ಮ ಬೆಳೆ ಆರೈಕೆ ವೇಳಾಪಟ್ಟಿ ಸಿದ್ಧವಾಗಿದೆ.", mr: "तुमचे पीक नियोजन तयार आहे.", pa: "ਤੁਹਾਡੀ ਫਸਲ ਸਮਾਂ-ਸਾਰਣੀ ਤਿਆਰ ਹੈ।", bn: "আপনার ফসল পরিচর্যা সময়সূচী প্রস্তুত।", gu: "તમારી પાક સંભાળ સમયરેખા તૈયાર છે.", ml: "നിങ്ങളുടെ വിള പരിപാലന ഷെഡ്യൂൾ തയ്യാറാണ്." }
};

const processOptions = [
  { key: "Ploughing", icon: Tractor },
  { key: "Seeding", icon: Sprout },
  { key: "Irrigation", icon: Droplets },
  { key: "None yet", icon: Mountain },
];

type CropForm = {
  location: string;
  state: string;
  district: string;
  landArea: string;
  startDate: string;
  cropCount: string;
  process: string;
  cropName: string;
  variety: string;
  season: string;
  notes: string;
};

const initialForm: CropForm = {
  location: "Village A",
  state: "Andhra Pradesh",
  district: "Guntur",
  landArea: "2.5",
  startDate: "2026-08-14",
  cropCount: "1",
  process: "Seeding",
  cropName: "",
  variety: "",
  season: "Kharif",
  notes: "",
};

function Field({ label, icon, children, wide = false }: { label: string; icon: React.ReactNode; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`workspace-field ${wide ? "workspace-field-wide" : ""}`}>
      <label>{label}</label>
      <div className="workspace-input-wrap">
        <span className="workspace-field-icon" aria-hidden="true">{icon}</span>
        {children}
      </div>
    </div>
  );
}

export default function CropRegistration() {
  const { language, t } = useLanguage();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CropForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const str = (key: keyof typeof REG_STRINGS): string => {
    return REG_STRINGS[key]?.[language] || REG_STRINGS[key]?.en || "";
  };

  const stepsList = STEP_LABELS[language] || STEP_LABELS.en;

  const setField = <K extends keyof CropForm>(key: K, value: CropForm[K]) => setForm((current) => ({ ...current, [key]: value }));

  const next = async () => {
    if (step === 3) {
      setSubmitting(true);
      setError("");
      try {
        await cropsApi.register({
          location: form.location,
          state: form.state,
          district: form.district,
          landArea: form.landArea,
          startDate: form.startDate,
          cropName: form.cropName || "Paddy",
          variety: form.variety,
          season: form.season,
          process: form.process,
          notes: form.notes,
        });
        setStep(stepsList.length - 1);

        // Dispatch proactive contextual nudge to AI Voice Assistant
        try {
          const proactiveEvent = new CustomEvent("agroscan:proactive-crop-registered", {
            detail: {
              cropName: form.cropName || "Crop",
              variety: form.variety,
              location: form.location,
            },
          });
          window.dispatchEvent(proactiveEvent);
        } catch (evtErr) {
          console.warn("Could not dispatch proactive assistant event:", evtErr);
        }
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setStep((current) => Math.min(stepsList.length - 1, current + 1));
  };
  const back = () => setStep((current) => Math.max(0, current - 1));

  return (
    <main className="workspace-page">
      <header className="workspace-topbar">
        <Link href="/dashboard" className="workspace-back">
          <ArrowLeft size={17} /> <span>{t("back_to_dashboard")}</span>
        </Link>
        <div className="workspace-brand">
          <EditableFrame id="reg_crop_brand_mark" className="workspace-brand-mark">
            <Leaf size={17} />
          </EditableFrame>
          <span>AgroScan</span>
        </div>
        <span className="workspace-top-context">{t("register_crop")} / 01</span>
      </header>

      <div className="workspace-content crop-registration-content">
        <div className="workspace-heading-row">
          <div>
            <EditableFrame id="reg_crop_heading" isTextOnly>
              <p className="dashboard-kicker dashboard-kicker-dark">{str("eyebrow")}</p>
              <h1 className="workspace-title">{str("title")}</h1>
              <p className="workspace-lede">{str("lede")}</p>
            </EditableFrame>
          </div>
          <div className="workspace-heading-mark">
            <Wheat size={27} />
          </div>
        </div>

        <nav className="registration-stepper" aria-label="Crop registration progress">
          {stepsList.map((label, index) => (
            <div
              className={`registration-step ${index === step ? "registration-step-current" : ""} ${index < step ? "registration-step-done" : ""}`}
              key={label}
            >
              <span className="registration-step-circle">{index < step ? <Check size={14} /> : index + 1}</span>
              <span>{label}</span>
              {index < stepsList.length - 1 && <span className="registration-step-line" aria-hidden="true" />}
            </div>
          ))}
        </nav>

        <div className="registration-layout">
          <EditableFrame id="reg_crop_card_container" className="registration-card" defaultBgColor="#ffffff">
            {step === 0 && (
              <>
                <div className="registration-card-heading">
                  <div>
                    <p className="dashboard-kicker dashboard-kicker-dark">{stepsList[0]}</p>
                    <h2>Where is the crop growing?</h2>
                    <p>Start with the place you know best: the field itself.</p>
                  </div>
                  <span className="registration-card-icon"><MapPin size={22} /></span>
                </div>
                <div className="workspace-form-grid">
                  <Field label="Crop growing location" icon={<LocateFixed size={18} />} wide>
                    <input aria-label="Crop growing location" value={form.location} onChange={(event) => setField("location", event.target.value)} placeholder="Village or city" />
                  </Field>
                  <Field label="Select state" icon={<MapPin size={18} />}>
                    <select aria-label="Select state" value={form.state} onChange={(event) => setField("state", event.target.value)}>
                      <option>Andhra Pradesh</option>
                      <option>Telangana</option>
                      <option>Karnataka</option>
                      <option>Maharashtra</option>
                      <option>Tamil Nadu</option>
                      <option>Punjab</option>
                    </select>
                    <ChevronDown className="workspace-select-chevron" size={16} />
                  </Field>
                  <Field label="Select district" icon={<MapPin size={18} />}>
                    <select aria-label="Select district" value={form.district} onChange={(event) => setField("district", event.target.value)}>
                      <option>Guntur</option>
                      <option>Krishna</option>
                      <option>Warangal</option>
                      <option>Nashik</option>
                      <option>Thanjavur</option>
                      <option>Ludhiana</option>
                    </select>
                    <ChevronDown className="workspace-select-chevron" size={16} />
                  </Field>
                  <Field label="Land area in acres" icon={<Mountain size={18} />}>
                    <input aria-label="Land area in acres" type="number" min="0" step="0.1" value={form.landArea} onChange={(event) => setField("landArea", event.target.value)} />
                  </Field>
                  <Field label="Date crop started" icon={<CalendarDays size={18} />}>
                    <input aria-label="Date crop started" type="date" value={form.startDate} onChange={(event) => setField("startDate", event.target.value)} />
                  </Field>
                  <Field label="Number of crops" icon={<Wheat size={18} />}>
                    <select aria-label="Number of crops" value={form.cropCount} onChange={(event) => setField("cropCount", event.target.value)}>
                      <option value="1">1 crop</option>
                      <option value="2">2 crops</option>
                      <option value="3">3 crops</option>
                      <option value="4">4+ crops</option>
                    </select>
                    <ChevronDown className="workspace-select-chevron" size={16} />
                  </Field>
                </div>
                <div className="registration-process">
                  <label>Process started, if any</label>
                  <div className="process-chip-grid">
                    {processOptions.map(({ key, icon: Icon }) => (
                      <button
                        type="button"
                        className={`process-chip ${form.process === key ? "process-chip-active" : ""}`}
                        key={key}
                        onClick={() => setField("process", key)}
                      >
                        <Icon size={17} />{PROCESS_TRANSLATIONS[key]?.[language] || key}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <div className="registration-simple-step">
                <p className="dashboard-kicker dashboard-kicker-dark">{stepsList[1]}</p>
                <h2>What are you growing?</h2>
                <p>Use the name you use in the field. You can add more detail later.</p>
                <div className="workspace-form-grid workspace-form-grid-single">
                  <Field label="Crop name" icon={<Leaf size={18} />} wide>
                    <input aria-label="Crop name" value={form.cropName} onChange={(event) => setField("cropName", event.target.value)} placeholder="e.g. Paddy, Maize, Tomato, Cotton, Chilli" />
                  </Field>
                  <Field label="Variety (optional)" icon={<Sprout size={18} />} wide>
                    <input aria-label="Crop variety" value={form.variety} onChange={(event) => setField("variety", event.target.value)} placeholder="e.g. BPT 5204, US 312, Hybrid 65" />
                  </Field>
                  <Field label="Growing season" icon={<CalendarDays size={18} />} wide>
                    <select aria-label="Growing season" value={form.season} onChange={(event) => setField("season", event.target.value)}>
                      <option value="Kharif">Kharif (Monsoon)</option>
                      <option value="Rabi">Rabi (Winter)</option>
                      <option value="Summer">Summer (Zaid)</option>
                      <option value="Year-round">Year-round</option>
                    </select>
                    <ChevronDown className="workspace-select-chevron" size={16} />
                  </Field>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="registration-simple-step">
                <p className="dashboard-kicker dashboard-kicker-dark">{stepsList[2]}</p>
                <h2>What is happening in the field?</h2>
                <p>Choose the activity you’re working through now. This keeps your plan in step with the season.</p>
                <div className="process-detail-grid">
                  {processOptions.map(({ key, icon: Icon }) => (
                    <button
                      type="button"
                      className={`process-detail-card ${form.process === key ? "process-detail-card-active" : ""}`}
                      key={key}
                      onClick={() => setField("process", key)}
                    >
                      <span className="process-detail-icon"><Icon size={23} /></span>
                      <strong>{PROCESS_TRANSLATIONS[key]?.[language] || key}</strong>
                      <span>{form.process === key ? "Selected for your plan" : "Add this to the field note"}</span>
                    </button>
                  ))}
                </div>
                <Field label="A note for later (optional)" icon={<CircleHelp size={18} />} wide>
                  <textarea aria-label="A note for later" value={form.notes} onChange={(event) => setField("notes", event.target.value)} placeholder="Anything you want AgroScan to remember?" rows={4} />
                </Field>
              </div>
            )}

            {step === 3 && (
              <div className="registration-simple-step">
                <p className="dashboard-kicker dashboard-kicker-dark">{stepsList[3]}</p>
                <h2>Check the field note.</h2>
                <p>Make sure the basics look right before we create your proactive crop plan.</p>
                <div className="review-grid">
                  <div><span>Location</span><strong>{form.location}, {form.district}</strong></div>
                  <div><span>Land area</span><strong>{form.landArea || "—"} acres</strong></div>
                  <div><span>Started</span><strong>{form.startDate || "—"}</strong></div>
                  <div><span>Crop</span><strong>{form.cropName ? localizeCrop(form.cropName, language) : "Paddy"}</strong></div>
                  <div><span>Process</span><strong>{PROCESS_TRANSLATIONS[form.process]?.[language] || form.process}</strong></div>
                  <div><span>Season</span><strong>{form.season}</strong></div>
                </div>
                <div className="review-note">
                  <ShieldCheck size={15} /> Your crop care schedule and preventive alerts will be generated automatically.
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="registration-complete">
                <span className="complete-icon"><Check size={28} /></span>
                <p className="dashboard-kicker dashboard-kicker-dark">{stepsList[4]}</p>
                <h2>{str("ready_msg")}</h2>
                <p>We’ve generated a stage-by-stage care timeline with proactive risk alerts for {form.cropName ? localizeCrop(form.cropName, language) : "your field"} in {form.location}.</p>
                <Link href="/my-crops" className="workspace-primary-button">
                  {str("view_plan")} <ArrowRight size={17} />
                </Link>
              </div>
            )}

            {step < 4 && (
              <div className="registration-actions">
                <button type="button" className="workspace-secondary-button cursor-pointer" onClick={back} disabled={step === 0}>
                  {str("back")}
                </button>
                <button type="button" className="workspace-primary-button cursor-pointer" onClick={next} disabled={submitting}>
                  {submitting ? str("creating") : step === 3 ? str("create_plan") : str("next")} <ArrowRight size={17} />
                </button>
              </div>
            )}
            {error && <p className="auth-error">{error}</p>}
          </EditableFrame>

          <aside className="registration-tip">
            <span className="tip-kicker">Field tip / 01</span>
            <span className="tip-illustration"><Leaf size={36} /></span>
            <h2>Start with what you know.</h2>
            <p>A location and a crop stage are enough to begin a proactive care plan with risk alerts.</p>
            <div className="tip-check"><Check size={14} /> Auto-generates preventive alerts</div>
            <div className="tip-check"><Check size={14} /> Saved to your account</div>
          </aside>
        </div>
      </div>
    </main>
  );
}
