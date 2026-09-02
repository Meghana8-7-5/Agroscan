import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Droplets,
  Layers,
  Leaf,
  LoaderCircle,
  MapPin,
  Mountain,
  Plus,
  ShieldCheck,
  Sparkles,
  Sprout,
  Wheat,
  X
} from "lucide-react";
import { cropsApi } from "@/lib/api";
import { CROPS_DATABASE, CropData } from "../data/cropsDatabase";
import { useLocationContext } from "@/contexts/LocationContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizeCrop, localizeCategory } from "@/lib/i18n";
import EditableFrame from "@/components/EditableFrame";

const leafImage = "/manus-storage/agroscan-leaf-stock_de49ea7d.jpg";

const STEP_LABELS: Record<string, string[]> = {
  en: ["Basic Field Info", "Select Crop & Season", "Farming Stage", "Review & Create Plan", "Plan Created"],
  te: ["పొలం ప్రాథమిక సమాచారం", "పంట & సీజన్ ఎంపిక", "సాగు దశ", "సమీక్షించి షెడ్యూల్ రూపొందించండి", "ప్రణాళిక సిద్ధమైంది"],
  hi: ["खेत की बुनियादी जानकारी", "फसल और मौसम चयन", "खेती का चरण", "समीक्षा व योजना निर्माण", "योजना तैयार"],
  ta: ["பண்ணை அடிப்படை தகவல்", "பயிர் & பருவம் தேர்வு", "விவசாய நிலை", "மதிப்பாய்வு & திட்டம்", "திட்டம் தயார்"],
  kn: ["ಜಮೀನಿನ ಮೂಲ ಮಾಹಿತಿ", "ಬೆಳೆ & ಋತು ಆಯ್ಕೆ", "ಕೃಷಿ ಹಂತ", "ಪರಿಶೀಲನೆ & ಯೋಜನೆ", "ಯೋಜನೆ ಸಿದ್ಧ"],
  mr: ["शेताची मूलभूत माहिती", "पीक व हंगाम निवड", "शेतीचा टप्पा", "पुनरावलोकन व योजना", "योजना तयार"],
  pa: ["ਖੇਤ ਦੀ ਮੁੱਢਲੀ ਜਾਣਕਾਰੀ", "ਫਸਲ ਤੇ ਸੀਜ਼ਨ ਚੋਣ", "ਖੇਤੀ ਦਾ ਪੜਾਅ", "ਸਮੀਖਿਆ ਤੇ ਯੋਜਨਾ", "ਯੋਜਨਾ ਤਿਆਰ"],
  bn: ["খামারের প্রাথমিক তথ্য", "ফসল ও মৌসুম নির্বাচন", "চাষের পর্যায়", "পর্যালোচনা ও পরিকল্পনা", "পরিকল্পনা তৈরি"],
  gu: ["ખેતરની પ્રાથમિક માહિતી", "પાક અને મોસમ પસંદગી", "ખેતીનો તબક્કો", "સમીક્ષા અને યોજના", "યોજના તૈયાર"],
  ml: ["കൃഷിയിട അടിസ്ഥാന വിവരങ്ങൾ", "വിള & സീസൺ തിരഞ്ഞെടുപ്പ്", "കൃഷി ഘട്ടം", "പ്ലാൻ തയ്യാറാക്കുക", "പ്ലാൻ തയ്യാറായി"],
};

const REG_STRINGS: Record<string, Record<string, string>> = {
  eyebrow: {
    en: "New Crop Onboarding & Care Schedule",
    te: "కొత్త పంట నమోదు & సంరక్షణ ప్రణాళిక",
    hi: "नई फसल पंजीकरण व देखभाल योजना",
    ta: "புதிய பயிர் பதிவு & பராமரிப்பு திட்டம்",
    kn: "ಹೊಸ ಬೆಳೆ ನೋಂದಣಿ & ಆರೈಕೆ ಯೋಜನೆ",
    mr: "नवीन पीक नोंदणी व काळजी योजना",
    pa: "ਨਵੀਂ ਫਸਲ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਤੇ ਸੰਭਾਲ ਯੋਜਨਾ",
    bn: "নতুন ফসল নিবন্ধন ও যত্ন পরিকল্পনা",
    gu: "નવી પાક નોંધણી અને સંભાળ યોજના",
    ml: "പുതിയ വിള രജിസ്ട്രേഷൻ & പരിചരണ പ്ലാൻ",
  },
  main_heading: {
    en: "Register Crop Field & Generate Care Plan",
    te: "పంట పొలాన్ని నమోదు చేసి సంరక్షణ ప్రణాళికను రూపొందించండి",
    hi: "फसल खेत दर्ज करें और देखभाल योजना बनाएं",
    ta: "பயிர் வயலைப் பதிவு செய்து பராமரிப்புத் திட்டத்தை உருவாக்கவும்",
    kn: "ಬೆಳೆ ಜಮೀನು ನೋಂದಾಯಿಸಿ ಆರೈಕೆ ಯೋಜನೆ ರಚಿಸಿ",
    mr: "पीक शेत नोंदवा आणि काळजी योजना तयार करा",
    pa: "ਫਸਲ ਖੇਤ ਦਰਜ ਕਰੋ ਅਤੇ ਸੰਭਾਲ ਯੋਜਨਾ ਬਣਾਓ",
    bn: "ফসলের জমি নিবন্ধন করুন এবং যত্ন পরিকল্পনা তৈরি করুন",
    gu: "પાક ખેતર નોંધો અને સંભાળ યોજના બનાવો",
    ml: "വിള കൃഷിയിടം രജിസ്റ്റർ ചെയ്ത് പരിചരണ പ്ലാൻ ഉണ്ടാക്കുക",
  },
};

const processes = [
  { key: "Ploughing", icon: Layers },
  { key: "Seeding", icon: Sprout },
  { key: "Irrigation", icon: Droplets },
  { key: "None yet", icon: Mountain },
];

const LAND_UNITS = [
  { id: "acres", label: "Acres" },
  { id: "hectares", label: "Hectares" },
  { id: "guntas", label: "Guntas (AP/TS/KA)" },
  { id: "cents", label: "Cents (AP/TN/KL)" },
  { id: "bigha", label: "Bigha" },
];

type CropForm = {
  location: string;
  state: string;
  district: string;
  landArea: string;
  landUnit: string;
  startDate: string;
  cropCount: string;
  process: string;
  cropName: string;
  variety: string;
  season: string;
  notes: string;
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
  const [, setLocation] = useLocation();
  const { language, t } = useLanguage();
  const { location } = useLocationContext();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CropForm>({
    location: location.villageCity || "Gowdapalem",
    state: location.state || "Andhra Pradesh",
    district: location.district || "Guntur",
    landArea: "2.5",
    landUnit: "acres",
    startDate: new Date().toISOString().split("T")[0],
    cropCount: "1",
    process: "Seeding",
    cropName: "Paddy",
    variety: "BPT-5204 (Samba Mahsuri)",
    season: "Kharif",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdRegistration, setCreatedRegistration] = useState<any>(null);

  // Sync village & district when GPS location updates
  useEffect(() => {
    if (location.villageCity) {
      setForm((f) => ({
        ...f,
        location: f.location === "Gowdapalem" ? location.villageCity : f.location,
        district: f.district === "Guntur" ? location.district : f.district,
        state: f.state === "Andhra Pradesh" ? location.state : f.state,
      }));
    }
  }, [location.villageCity, location.district, location.state]);

  const str = (key: keyof typeof REG_STRINGS): string => {
    return REG_STRINGS[key]?.[language] || REG_STRINGS[key]?.en || "";
  };

  const stepsList = STEP_LABELS[language] || STEP_LABELS.en;

  const setField = <K extends keyof CropForm>(key: K, value: CropForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const next = async () => {
    if (step === 3) {
      setSubmitting(true);
      setError("");
      try {
        const res = await cropsApi.register({
          location: form.location,
          state: form.state,
          district: form.district,
          landArea: form.landArea,
          landUnit: form.landUnit,
          startDate: form.startDate,
          cropName: form.cropName || "Paddy",
          variety: form.variety,
          season: form.season,
          process: form.process,
          notes: form.notes,
        });

        setCreatedRegistration({
          ...res,
          cropName: form.cropName || "Paddy",
          variety: form.variety,
          landArea: form.landArea,
          landUnit: form.landUnit,
          startDate: form.startDate,
          season: form.season,
          location: form.location,
        });

        setStep(4);
      } catch (err: any) {
        setError(err?.response?.data?.error || "Failed to register crop. Please check your inputs.");
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setStep((current) => Math.min(stepsList.length - 1, current + 1));
  };

  const prev = () => setStep((current) => Math.max(0, current - 1));

  return (
    <main className="workspace-page min-h-screen bg-[#f7f8f4] text-[#1c3827]">
      <header className="workspace-topbar sticky top-0 z-40 bg-[#f7f8f4]/90 backdrop-blur border-b border-[#e1e6d7] px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="workspace-back inline-flex items-center gap-2 text-sm font-bold text-[#2f6b45] no-underline hover:underline">
          <ArrowLeft size={17} /> <span>{t("back_to_dashboard")}</span>
        </Link>
        <div className="flex items-center gap-2 font-display text-lg font-bold text-[#20402e]">
          <EditableFrame id="crop_reg_brand_mark" className="h-8 w-8 rounded-xl bg-[#2f6b45] text-white">
            <Leaf size={18} />
          </EditableFrame>
          <span>AgroScan</span>
        </div>
        <span className="hidden sm:inline-block text-xs font-extrabold uppercase tracking-wider text-[#456b52] bg-[#e5eddc] px-3 py-1 rounded-full">
          Crop Registration Engine
        </span>
      </header>

      <div className="workspace-content max-w-5xl mx-auto px-4 py-8 space-y-8">
        <EditableFrame id="crop_reg_heading_panel" isTextOnly>
          <div className="space-y-1">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#2f6b45]">
              {str("eyebrow")}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#193625]">
              {str("main_heading")}
            </h1>
            <p className="text-sm text-[#4d6957]">
              Step-by-step agronomy wizard configured with local land measurement units and satellite GPS geolocation.
            </p>
          </div>
        </EditableFrame>

        {/* Step Progress Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {stepsList.map((label, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold shrink-0 transition-all ${
                index === step
                  ? "bg-[#2f6b45] text-white shadow-md scale-105"
                  : index < step
                  ? "bg-[#e5eddc] text-[#2f6b45]"
                  : "bg-white text-gray-400 border border-[#d8e2cf]"
              }`}
            >
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                index === step ? "bg-white text-[#2f6b45]" : index < step ? "bg-[#2f6b45] text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {index < step ? "✓" : index + 1}
              </span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <EditableFrame id="crop_reg_wizard_card" className="rounded-3xl border border-[#d8e0cc] bg-white p-6 sm:p-10 shadow-xl">
          {/* Step 0: Basic Field Info with GPS Auto-fill and Flexible Land Units */}
          {step === 0 && (
            <div className="space-y-6">
              <h3 className="font-display text-xl font-bold text-[#183624]">Field Geolocation &amp; Land Size</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Village / Growing Location *" icon={<MapPin size={16} />}>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setField("location", e.target.value)}
                    placeholder="e.g. Gowdapalem"
                    required
                    className="w-full bg-transparent px-3 py-2 text-xs font-bold text-[#1b3b27] focus:outline-none"
                  />
                </Field>

                <Field label="District *" icon={<MapPin size={16} />}>
                  <input
                    type="text"
                    value={form.district}
                    onChange={(e) => setField("district", e.target.value)}
                    placeholder="e.g. Guntur"
                    required
                    className="w-full bg-transparent px-3 py-2 text-xs font-bold text-[#1b3b27] focus:outline-none"
                  />
                </Field>
              </div>

              {/* Land Area + Land Unit Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Land Area Size *" icon={<Layers size={16} />}>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={form.landArea}
                    onChange={(e) => setField("landArea", e.target.value)}
                    placeholder="e.g. 2.5"
                    required
                    className="w-full bg-transparent px-3 py-2 text-xs font-bold text-[#1b3b27] focus:outline-none"
                  />
                </Field>

                <Field label="Land Measurement Unit *" icon={<Layers size={16} />}>
                  <select
                    value={form.landUnit}
                    onChange={(e) => setField("landUnit", e.target.value)}
                    className="w-full bg-transparent px-3 py-2 text-xs font-bold text-[#1b3b27] focus:outline-none cursor-pointer"
                  >
                    {LAND_UNITS.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Exact Date Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Date Crop Started / Sowing Date *" icon={<Calendar size={16} />}>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setField("startDate", e.target.value)}
                    required
                    className="w-full bg-transparent px-3 py-2 text-xs font-bold text-[#1b3b27] focus:outline-none cursor-pointer"
                  />
                </Field>

                <Field label="State *" icon={<MapPin size={16} />}>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => setField("state", e.target.value)}
                    required
                    className="w-full bg-transparent px-3 py-2 text-xs font-bold text-[#1b3b27] focus:outline-none"
                  />
                </Field>
              </div>
            </div>
          )}

          {/* Step 1: Select Crop & Season */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="font-display text-xl font-bold text-[#183624]">Select Crop &amp; Season</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Target Crop *" icon={<Sprout size={16} />}>
                  <select
                    value={form.cropName}
                    onChange={(e) => setField("cropName", e.target.value)}
                    className="w-full bg-transparent px-3 py-2 text-xs font-bold text-[#1b3b27] focus:outline-none cursor-pointer"
                  >
                    {CROPS_DATABASE.map((c) => (
                      <option key={c.id} value={c.name}>
                        {localizeCrop(c.name, language)} ({c.category})
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Crop Variety / Cultivar" icon={<Wheat size={16} />}>
                  <input
                    type="text"
                    value={form.variety}
                    onChange={(e) => setField("variety", e.target.value)}
                    placeholder="e.g. BPT-5204, MTU-1010, Hybrid 6444"
                    className="w-full bg-transparent px-3 py-2 text-xs font-bold text-[#1b3b27] focus:outline-none"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Agricultural Season *" icon={<Calendar size={16} />}>
                  <select
                    value={form.season}
                    onChange={(e) => setField("season", e.target.value)}
                    className="w-full bg-transparent px-3 py-2 text-xs font-bold text-[#1b3b27] focus:outline-none cursor-pointer"
                  >
                    <option value="Kharif">Kharif (Monsoon / June - Oct)</option>
                    <option value="Rabi">Rabi (Winter / Nov - March)</option>
                    <option value="Zaid / Summer">Zaid / Summer (March - June)</option>
                    <option value="Annual / Perennial">Annual / Perennial</option>
                  </select>
                </Field>

                <Field label="Field Notes (Optional)" icon={<Leaf size={16} />}>
                  <input
                    type="text"
                    value={form.notes}
                    onChange={(e) => setField("notes", e.target.value)}
                    placeholder="e.g. Drip irrigated, clay loam soil"
                    className="w-full bg-transparent px-3 py-2 text-xs font-bold text-[#1b3b27] focus:outline-none"
                  />
                </Field>
              </div>
            </div>
          )}

          {/* Step 2: Farming Stage */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="font-display text-xl font-bold text-[#183624]">Current Farming Stage</h3>
              <p className="text-xs text-[#52705d]">Select which stage your field is currently in so we can sequence your care tasks properly.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {processes.map((proc) => {
                  const Icon = proc.icon;
                  const isSelected = form.process === proc.key;
                  return (
                    <button
                      key={proc.key}
                      type="button"
                      onClick={() => setField("process", proc.key)}
                      className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#2f6b45] bg-[#edf4e8] shadow-md scale-102"
                          : "border-[#d8e2cf] bg-[#fafcf7] hover:bg-[#f2f7ec]"
                      }`}
                    >
                      <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                        isSelected ? "bg-[#2f6b45] text-white" : "bg-[#e5eddc] text-[#2f6b45]"
                      }`}>
                        <Icon size={22} />
                      </span>
                      <div>
                        <h4 className="font-display text-sm font-bold text-[#183624]">{proc.key}</h4>
                        <p className="text-xs text-[#52705d] mt-0.5">
                          {proc.key === "Ploughing" && "Land prep, harrowing & basal manure application"}
                          {proc.key === "Seeding" && "Nursery transplanting or direct seed drilling"}
                          {proc.key === "Irrigation" && "Active vegetative growth & early nutrition"}
                          {proc.key === "None yet" && "Planning phase before physical fieldwork"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-display text-xl font-bold text-[#183624]">Review Crop Plan Summary</h3>

              <div className="rounded-2xl bg-[#fafcf7] border border-[#dce5d2] p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-[#567560] font-semibold block">Crop:</span>
                    <strong className="text-sm font-bold text-[#183624]">{form.cropName} ({form.variety || "Standard"})</strong>
                  </div>
                  <div>
                    <span className="text-[#567560] font-semibold block">Land Area:</span>
                    <strong className="text-sm font-bold text-[#183624]">{form.landArea} {form.landUnit}</strong>
                  </div>
                  <div>
                    <span className="text-[#567560] font-semibold block">Sowing Date:</span>
                    <strong className="text-sm font-bold text-[#183624]">{form.startDate}</strong>
                  </div>
                  <div>
                    <span className="text-[#567560] font-semibold block">Growing Village:</span>
                    <strong className="text-sm font-bold text-[#183624]">{form.location}, {form.district}</strong>
                  </div>
                  <div>
                    <span className="text-[#567560] font-semibold block">Season:</span>
                    <strong className="text-sm font-bold text-[#183624]">{form.season}</strong>
                  </div>
                  <div>
                    <span className="text-[#567560] font-semibold block">Current Stage:</span>
                    <strong className="text-sm font-bold text-[#183624]">{form.process}</strong>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-rose-50 border border-rose-300 p-3 text-xs text-rose-800 font-semibold">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Plan Created (Fix 404 & Rich Summary View) */}
          {step === 4 && (
            <div className="space-y-6 text-center animate-in zoom-in-95 duration-200">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#e5eddc] text-[#2f6b45] mx-auto shadow-md">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-1">
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-0.5 text-xs font-extrabold uppercase">
                  Care Schedule Generated Successfully
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#183624]">
                  {form.cropName} Care Plan is Active!
                </h3>
                <p className="text-xs text-[#52705d] max-w-md mx-auto">
                  Stage-by-stage tasks, automated pest risk windows, and weather SMS alerts are now active for your {form.landArea} {form.landUnit} field in {form.location}.
                </p>
              </div>

              <div className="rounded-2xl bg-[#fafcf7] border border-[#dce5d2] p-5 max-w-lg mx-auto text-xs text-left space-y-2">
                <div className="flex justify-between border-b border-[#e5edd8] pb-2">
                  <span className="text-[#567560]">Crop &amp; Variety:</span>
                  <strong className="text-[#183624]">{form.cropName} {form.variety ? `(${form.variety})` : ""}</strong>
                </div>
                <div className="flex justify-between border-b border-[#e5edd8] pb-2">
                  <span className="text-[#567560]">Land Size:</span>
                  <strong className="text-[#183624]">{form.landArea} {form.landUnit}</strong>
                </div>
                <div className="flex justify-between border-b border-[#e5edd8] pb-2">
                  <span className="text-[#567560]">Start / Sowing Date:</span>
                  <strong className="text-[#183624]">{form.startDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#567560]">Location:</span>
                  <strong className="text-[#183624]">{form.location}, {form.district}</strong>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <Link
                  href="/my-crops"
                  className="rounded-2xl bg-[#2f6b45] px-8 py-3.5 text-xs font-bold text-white shadow-xl hover:bg-[#20492f] no-underline flex items-center justify-center gap-2"
                >
                  <span>Open My Crops &amp; Care Schedule</span> <ArrowRight size={15} />
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-2xl border border-[#cbd8bf] bg-white px-6 py-3.5 text-xs font-bold text-[#1b3b27] hover:bg-[#f3f7ee] no-underline flex items-center justify-center"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          )}

          {/* Action Buttons for Step 0-3 */}
          {step < 4 && (
            <div className="mt-8 pt-6 border-t border-[#e5eddc] flex items-center justify-between">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={prev}
                  className="rounded-2xl border border-[#cbd8bf] bg-white px-5 py-2.5 text-xs font-bold text-[#1b3b27] hover:bg-[#f3f7ee] cursor-pointer"
                >
                  ← Previous Step
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={next}
                disabled={submitting}
                className="rounded-2xl bg-[#2f6b45] px-7 py-3 text-xs font-bold text-white shadow-lg hover:bg-[#20492f] disabled:opacity-50 flex items-center gap-2 cursor-pointer transition-all"
              >
                {submitting ? (
                  <>
                    <LoaderCircle size={16} className="animate-spin" /> Creating Care Schedule…
                  </>
                ) : step === 3 ? (
                  <>
                    Create Crop Plan &amp; Alerts <Sparkles size={15} />
                  </>
                ) : (
                  <>
                    Continue <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          )}
        </EditableFrame>
      </div>
    </main>
  );
}
