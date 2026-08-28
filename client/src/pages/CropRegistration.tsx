/*
  AgroScan / Field Notes design reminder:
  Registration is a guided field note, not a long form. Keep the stepper visible,
  group questions by the farmer's mental model, and make progress feel tangible.
*/
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
} from "lucide-react";

const steps = ["Location", "Crop details", "Farming process", "Review", "Complete"];
const processOptions = [
  { label: "Ploughing", icon: Tractor },
  { label: "Seeding", icon: Sprout },
  { label: "Irrigation", icon: Droplets },
  { label: "None yet", icon: Mountain },
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
  return <div className={`workspace-field ${wide ? "workspace-field-wide" : ""}`}><label>{label}</label><div className="workspace-input-wrap"><span className="workspace-field-icon" aria-hidden="true">{icon}</span>{children}</div></div>;
}

export default function CropRegistration() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CropForm>(initialForm);

  const setField = <K extends keyof CropForm>(key: K, value: CropForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  const next = () => setStep((current) => Math.min(steps.length - 1, current + 1));
  const back = () => setStep((current) => Math.max(0, current - 1));

  return (
    <main className="workspace-page">
      <header className="workspace-topbar">
        <Link href="/dashboard" className="workspace-back"><ArrowLeft size={17} /> <span>Back to dashboard</span></Link>
        <div className="workspace-brand"><span className="workspace-brand-mark"><Leaf size={17} /></span><span>AgroScan</span></div>
        <span className="workspace-top-context">Field registration / 01</span>
      </header>

      <div className="workspace-content crop-registration-content">
        <div className="workspace-heading-row"><div><p className="dashboard-kicker dashboard-kicker-dark">Add a new field note</p><h1 className="workspace-title">Register your crop.</h1><p className="workspace-lede">Tell us a little about the field. We’ll use it to shape your crop plan.</p></div><div className="workspace-heading-mark"><Wheat size={27} /></div></div>

        <nav className="registration-stepper" aria-label="Crop registration progress">
          {steps.map((label, index) => <div className={`registration-step ${index === step ? "registration-step-current" : ""} ${index < step ? "registration-step-done" : ""}`} key={label}><span className="registration-step-circle">{index < step ? <Check size={14} /> : index + 1}</span><span>{label}</span>{index < steps.length - 1 && <span className="registration-step-line" aria-hidden="true" />}</div>)}
        </nav>

        <div className="registration-layout">
          <section className="registration-card">
            {step === 0 && <>
              <div className="registration-card-heading"><div><p className="dashboard-kicker dashboard-kicker-dark">Step 1 / Location</p><h2>Where is the crop growing?</h2><p>Start with the place you know best: the field itself.</p></div><span className="registration-card-icon"><MapPin size={22} /></span></div>
              <div className="workspace-form-grid">
                <Field label="Crop growing location" icon={<LocateFixed size={18} />} wide><input aria-label="Crop growing location" value={form.location} onChange={(event) => setField("location", event.target.value)} placeholder="Village or city" /></Field>
                <Field label="Select state" icon={<MapPin size={18} />}><select aria-label="Select state" value={form.state} onChange={(event) => setField("state", event.target.value)}><option>Andhra Pradesh</option><option>Telangana</option><option>Karnataka</option><option>Maharashtra</option></select><ChevronDown className="workspace-select-chevron" size={16} /></Field>
                <Field label="Select district" icon={<MapPin size={18} />}><select aria-label="Select district" value={form.district} onChange={(event) => setField("district", event.target.value)}><option>Guntur</option><option>Krishna</option><option>Warangal</option><option>Nashik</option></select><ChevronDown className="workspace-select-chevron" size={16} /></Field>
                <Field label="Land area in acres" icon={<Mountain size={18} />}><input aria-label="Land area in acres" type="number" min="0" step="0.1" value={form.landArea} onChange={(event) => setField("landArea", event.target.value)} /></Field>
                <Field label="Date crop started" icon={<CalendarDays size={18} />}><input aria-label="Date crop started" type="date" value={form.startDate} onChange={(event) => setField("startDate", event.target.value)} /></Field>
                <Field label="Number of crops" icon={<Wheat size={18} />}><select aria-label="Number of crops" value={form.cropCount} onChange={(event) => setField("cropCount", event.target.value)}><option value="1">1 crop</option><option value="2">2 crops</option><option value="3">3 crops</option><option value="4">4+ crops</option></select><ChevronDown className="workspace-select-chevron" size={16} /></Field>
              </div>
              <div className="registration-process"><label>Process started, if any</label><div className="process-chip-grid">{processOptions.map(({ label, icon: Icon }) => <button type="button" className={`process-chip ${form.process === label ? "process-chip-active" : ""}`} key={label} onClick={() => setField("process", label)}><Icon size={17} />{label}</button>)}</div></div>
            </>}

            {step === 1 && <div className="registration-simple-step"><p className="dashboard-kicker dashboard-kicker-dark">Step 2 / Crop details</p><h2>What are you growing?</h2><p>Use the name you use in the field. You can add more detail later.</p><div className="workspace-form-grid workspace-form-grid-single"><Field label="Crop name" icon={<Leaf size={18} />} wide><input aria-label="Crop name" value={form.cropName} onChange={(event) => setField("cropName", event.target.value)} placeholder="e.g. Paddy, Maize, Tomato" /></Field><Field label="Variety (optional)" icon={<Sprout size={18} />} wide><input aria-label="Crop variety" value={form.variety} onChange={(event) => setField("variety", event.target.value)} placeholder="e.g. BPT 5204" /></Field><Field label="Growing season" icon={<CalendarDays size={18} />} wide><select aria-label="Growing season" value={form.season} onChange={(event) => setField("season", event.target.value)}><option>Kharif</option><option>Rabi</option><option>Summer</option><option>Year-round</option></select><ChevronDown className="workspace-select-chevron" size={16} /></Field></div></div>}

            {step === 2 && <div className="registration-simple-step"><p className="dashboard-kicker dashboard-kicker-dark">Step 3 / Farming process</p><h2>What is happening in the field?</h2><p>Choose the activity you’re working through now. This keeps your plan in step with the season.</p><div className="process-detail-grid">{processOptions.map(({ label, icon: Icon }) => <button type="button" className={`process-detail-card ${form.process === label ? "process-detail-card-active" : ""}`} key={label} onClick={() => setField("process", label)}><span className="process-detail-icon"><Icon size={23} /></span><strong>{label}</strong><span>{form.process === label ? "Selected for your plan" : "Add this to the field note"}</span></button>)}</div><Field label="A note for later (optional)" icon={<CircleHelp size={18} />} wide><textarea aria-label="A note for later" value={form.notes} onChange={(event) => setField("notes", event.target.value)} placeholder="Anything you want AgroScan to remember?" rows={4} /></Field></div>}

            {step === 3 && <div className="registration-simple-step"><p className="dashboard-kicker dashboard-kicker-dark">Step 4 / Review</p><h2>Check the field note.</h2><p>Make sure the basics look right before we create your crop plan.</p><div className="review-grid"><div><span>Location</span><strong>{form.location}, {form.district}</strong></div><div><span>Land area</span><strong>{form.landArea || "—"} acres</strong></div><div><span>Started</span><strong>{form.startDate || "—"}</strong></div><div><span>Crop</span><strong>{form.cropName || "Add crop name next time"}</strong></div><div><span>Process</span><strong>{form.process}</strong></div><div><span>Season</span><strong>{form.season}</strong></div></div><div className="review-note"><ShieldNote /> You can update these details from My Crops whenever the field changes.</div></div>}

            {step === 4 && <div className="registration-complete"><span className="complete-icon"><Check size={28} /></span><p className="dashboard-kicker dashboard-kicker-dark">Field note saved</p><h2>Your crop plan can begin here.</h2><p>We’ve recorded the essentials for {form.location}. Next, AgroScan can help you keep an eye on the crop as it grows.</p><Link href="/my-crops" className="workspace-primary-button">View my crop plan <ArrowRight size={17} /></Link></div>}

            {step < 4 && <div className="registration-actions"><button type="button" className="workspace-secondary-button" onClick={back} disabled={step === 0}>Back</button><button type="button" className="workspace-primary-button" onClick={next}>{step === 3 ? "Create crop plan" : "Next step"} <ArrowRight size={17} /></button></div>}
          </section>

          <aside className="registration-tip"><span className="tip-kicker">Field tip / 01</span><span className="tip-illustration"><Leaf size={36} /></span><h2>Start with what you know.</h2><p>You don’t need every detail today. A location and a crop stage are enough to begin a useful plan.</p><div className="tip-check"><Check size={14} /> You can edit this later</div><div className="tip-check"><Check size={14} /> Nothing is sent anywhere yet</div></aside>
        </div>
      </div>
    </main>
  );
}

function ShieldNote() {
  return <span className="review-note-icon"><ShieldCheckIcon /></span>;
}

function ShieldCheckIcon() {
  return <Check size={15} />;
}
