/*
  AgroScan / Field Notes design reminder:
  Registration should feel like opening a field notebook: warm oat surfaces,
  generous spacing, explicit labels, and a reassuring path into the crop dashboard.
*/
import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Globe2,
  Leaf,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const farmerImage = "/manus-storage/agroscan-farmer-stock_130c484b.jpeg";

type FormValues = {
  fullName: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
  language: string;
  agree: boolean;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  fullName: "",
  mobile: "",
  email: "",
  password: "",
  confirmPassword: "",
  language: "English",
  agree: false,
};

function FieldIcon({ children }: { children: React.ReactNode }) {
  return <span className="auth-field-icon" aria-hidden="true">{children}</span>;
}

export default function Register() {
  const [, setLocation] = useLocation();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const updateField = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (!values.fullName.trim()) nextErrors.fullName = "Enter your full name.";
    if (!values.mobile.trim() || values.mobile.replace(/\D/g, "").length < 10) nextErrors.mobile = "Enter a valid mobile number.";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) nextErrors.email = "Enter a valid email address.";
    if (values.password.length < 6) nextErrors.password = "Use at least 6 characters.";
    if (values.confirmPassword !== values.password) nextErrors.confirmPassword = "Passwords do not match.";
    if (!values.agree) nextErrors.agree = "Please accept the terms to continue.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    window.setTimeout(() => setLocation("/dashboard"), 650);
  };

  return (
    <main className="auth-page">
      <section className="auth-visual" style={{ backgroundImage: `linear-gradient(180deg, rgba(24,56,35,.08) 18%, rgba(24,56,35,.76) 100%), url(${farmerImage})` }} aria-label="Farmer examining crops">
        <Link href="/" className="auth-brand" aria-label="Back to AgroScan home">
          <span className="auth-brand-mark"><Leaf size={21} /></span>
          <span>AgroScan</span>
        </Link>
        <div className="auth-visual-copy">
          <p className="auth-visual-index">01 / START WITH YOUR FIELD</p>
          <h1>Smart farming,<br /><em>better tomorrow.</em></h1>
          <p>Keep your crop decisions close, clear, and ready for the next walk through the field.</p>
          <div className="auth-visual-foot"><ShieldCheck size={17} /> Your crop notes stay yours.</div>
        </div>
      </section>

      <section className="auth-form-panel" aria-labelledby="register-title">
        <div className="auth-form-inner">
          <div className="auth-form-topline">
            <Link href="/" className="auth-back-link"><ArrowLeft size={15} /> Back to home</Link>
            <span className="auth-step-label">Step 1 of 1 <span className="auth-step-dot" /></span>
          </div>
          <div className="auth-heading">
            <p className="eyebrow">Set up your field notes</p>
            <h2 id="register-title">Create your AgroScan account.</h2>
            <p>Save crop scans, follow your plan, and keep useful advice in one place.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-form-grid">
              <div className="auth-control auth-control-wide">
                <label htmlFor="fullName">Full name</label>
                <div className="auth-input-wrap"><FieldIcon><UserRound size={18} /></FieldIcon><input id="fullName" value={values.fullName} onChange={(event) => updateField("fullName", event.target.value)} placeholder="e.g. Ramesh Kumar" autoComplete="name" /></div>
                {errors.fullName && <p className="auth-error">{errors.fullName}</p>}
              </div>
              <div className="auth-control auth-control-wide">
                <label htmlFor="mobile">Mobile number</label>
                <div className="auth-input-wrap"><FieldIcon><Phone size={18} /></FieldIcon><input id="mobile" type="tel" value={values.mobile} onChange={(event) => updateField("mobile", event.target.value)} placeholder="10-digit mobile number" autoComplete="tel" inputMode="tel" /></div>
                {errors.mobile && <p className="auth-error">{errors.mobile}</p>}
              </div>
              <div className="auth-control auth-control-wide">
                <label htmlFor="email">Email address</label>
                <div className="auth-input-wrap"><FieldIcon><Mail size={18} /></FieldIcon><input id="email" type="email" value={values.email} onChange={(event) => updateField("email", event.target.value)} placeholder="you@example.com" autoComplete="email" /></div>
                {errors.email && <p className="auth-error">{errors.email}</p>}
              </div>
              <div className="auth-control">
                <label htmlFor="password">Create password</label>
                <div className="auth-input-wrap"><FieldIcon><LockKeyhole size={18} /></FieldIcon><input id="password" type={showPassword ? "text" : "password"} value={values.password} onChange={(event) => updateField("password", event.target.value)} placeholder="At least 6 characters" autoComplete="new-password" /><button type="button" className="auth-visibility" onClick={() => setShowPassword((show) => !show)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
                {errors.password && <p className="auth-error">{errors.password}</p>}
              </div>
              <div className="auth-control">
                <label htmlFor="confirmPassword">Confirm password</label>
                <div className="auth-input-wrap"><FieldIcon><LockKeyhole size={18} /></FieldIcon><input id="confirmPassword" type={showPassword ? "text" : "password"} value={values.confirmPassword} onChange={(event) => updateField("confirmPassword", event.target.value)} placeholder="Repeat your password" autoComplete="new-password" /></div>
                {errors.confirmPassword && <p className="auth-error">{errors.confirmPassword}</p>}
              </div>
              <div className="auth-control auth-control-wide">
                <label htmlFor="language">Preferred language</label>
                <div className="auth-input-wrap"><FieldIcon><Globe2 size={18} /></FieldIcon><select id="language" value={values.language} onChange={(event) => updateField("language", event.target.value)}><option>English</option><option>हिन्दी</option><option>తెలుగు</option></select></div>
              </div>
            </div>

            <label className={`auth-check-row ${errors.agree ? "auth-check-row-error" : ""}`}>
              <input type="checkbox" checked={values.agree} onChange={(event) => updateField("agree", event.target.checked)} />
              <span className="auth-check-box"><Check size={13} /></span>
              <span>I agree to the <a href="#terms" onClick={(event) => event.preventDefault()}>Terms &amp; Conditions</a>.</span>
            </label>
            {errors.agree && <p className="auth-error auth-error-check">{errors.agree}</p>}

            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting ? "Opening your field notes…" : <>Create my account <ArrowRight size={17} /></>}
            </button>
          </form>

          <p className="auth-switch">Already have an account? <Link href="/login">Log in</Link></p>
          <p className="auth-note">You can explore AgroScan without a subscription. Connect a real account later when backend auth is added.</p>
        </div>
      </section>
    </main>
  );
}
