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
  AlertTriangle,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUiEditContext } from "@/contexts/UiEditContext";
import { getApiErrorMessage } from "@/lib/api";
import EditableFrame from "@/components/EditableFrame";

const farmerImage = "/images/farmer-login-visual.jpg";

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
  const { register } = useAuth();
  const { getCustomization } = useUiEditContext();

  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const heroCustom = getCustomization("register_hero_panel");
  const headlineCustom = getCustomization("register_headline");
  const subtextCustom = getCustomization("register_subtext");
  const formHeadingCustom = getCustomization("register_form_heading");

  const updateField = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setServerError(null);
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (!values.fullName.trim()) nextErrors.fullName = "Please enter your full name.";
    const digits = values.mobile.replace(/\D/g, "");
    if (!values.mobile.trim() || digits.length < 10) nextErrors.mobile = "Please enter a valid 10-digit mobile number.";
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) nextErrors.email = "Please enter a valid email address.";
    if (values.password.length < 6) nextErrors.password = "Password must be at least 6 characters.";
    if (values.confirmPassword !== values.password) nextErrors.confirmPassword = "Passwords do not match.";
    if (!values.agree) nextErrors.agree = "Please accept the terms & conditions to continue.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);

    if (!validate()) return;
    setSubmitting(true);

    try {
      console.log("[REGISTER-FORM] Submitting farmer registration:", {
        fullName: values.fullName.trim(),
        mobile: values.mobile.trim(),
        email: values.email.trim(),
        language: values.language,
      });

      await register({
        fullName: values.fullName.trim(),
        mobile: values.mobile.trim(),
        email: values.email.trim(),
        password: values.password,
        language: values.language,
        agree: values.agree,
        role: "farmer",
      });

      console.log("[REGISTER-FORM] Registration success! Redirecting to /dashboard");
      setLocation("/dashboard");
    } catch (error) {
      const msg = getApiErrorMessage(error);
      console.error("[REGISTER-FORM] Registration failed:", msg, error);
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const heroBgImage = heroCustom?.customImageUrl || farmerImage;
  const overlayDarkness = heroCustom?.overlayDarkness !== undefined ? heroCustom.overlayDarkness : 0.76;

  return (
    <main className="auth-page">
      {/* Left Visual Hero Section wrapped in EditableFrame */}
      <EditableFrame
        id="register_hero_panel"
        isHeroPanel
        className="auth-visual"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(24,56,35,${overlayDarkness * 0.2}) 18%, rgba(24,56,35,${overlayDarkness}) 100%), url(${heroBgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Link href="/" className="auth-brand" aria-label="Back to AgroScan home">
          <EditableFrame id="register_brand_mark" className="auth-brand-mark">
            <Leaf size={21} />
          </EditableFrame>
          <span>AgroScan</span>
        </Link>

        <div className="auth-visual-copy">
          <EditableFrame id="register_index_kicker" isTextOnly>
            <p className="auth-visual-index">
              {getCustomization("register_index_kicker")?.title || "01 / START WITH YOUR FIELD"}
            </p>
          </EditableFrame>

          <EditableFrame id="register_headline" isTextOnly>
            <h1>
              {headlineCustom?.title || (
                <>
                  Smart farming,<br />
                  <em>better tomorrow.</em>
                </>
              )}
            </h1>
          </EditableFrame>

          <EditableFrame id="register_subtext" isTextOnly>
            <p>
              {subtextCustom?.subtitle ||
                "Keep your crop decisions close, clear, and ready for the next walk through the field."}
            </p>
          </EditableFrame>

          <div className="auth-visual-foot">
            <ShieldCheck size={17} /> Your crop notes stay yours.
          </div>
        </div>
      </EditableFrame>

      {/* Right Registration Form Panel */}
      <EditableFrame id="register_form_panel" className="auth-form-panel" defaultBgColor="#fdfcf8">
        <div className="auth-form-inner">
          <div className="auth-form-topline flex items-center justify-between">
            <Link href="/get-started" className="auth-back-link">
              <ArrowLeft size={15} /> Back to role select
            </Link>
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase">
              Farmer Account
            </span>
          </div>

          <div className="auth-heading mt-3">
            <EditableFrame id="register_eyebrow" isTextOnly>
              <p className="eyebrow">
                {getCustomization("register_eyebrow")?.title || "Set up your field notes"}
              </p>
            </EditableFrame>

            <EditableFrame id="register_form_heading" isTextOnly>
              <h2 id="register-title">
                {formHeadingCustom?.title || "Create your Farmer account."}
              </h2>
            </EditableFrame>

            <EditableFrame id="register_form_desc" isTextOnly>
              <p>
                {getCustomization("register_form_desc")?.subtitle ||
                  "Save crop scans, follow your plan, and keep useful advice in one place."}
              </p>
            </EditableFrame>
          </div>

          {/* Server Error Alert Banner */}
          {serverError && (
            <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs text-rose-900 font-semibold flex items-start gap-2.5 my-3 shadow-sm animate-in fade-in duration-150">
              <AlertTriangle size={17} className="text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-rose-950">Registration Failed</p>
                <p className="text-[11px] text-rose-800 leading-relaxed">{serverError}</p>
                {serverError.toLowerCase().includes("already exists") && (
                  <Link href="/login" className="inline-block text-[11px] font-bold text-[#2f6b45] hover:underline pt-1">
                    Click here to log in instead →
                  </Link>
                )}
              </div>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-form-grid">
              <div className="auth-control auth-control-wide">
                <EditableFrame id="register_label_name" isTextOnly>
                  <label htmlFor="fullName">Full name</label>
                </EditableFrame>
                <div className={`auth-input-wrap ${errors.fullName ? "ring-2 ring-rose-400" : ""}`}>
                  <FieldIcon><UserRound size={18} /></FieldIcon>
                  <input
                    id="fullName"
                    value={values.fullName}
                    onChange={(event) => updateField("fullName", event.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    autoComplete="name"
                  />
                </div>
                {errors.fullName && <p className="auth-error">{errors.fullName}</p>}
              </div>

              <div className="auth-control auth-control-wide">
                <EditableFrame id="register_label_mobile" isTextOnly>
                  <label htmlFor="mobile">Mobile number</label>
                </EditableFrame>
                <div className={`auth-input-wrap ${errors.mobile ? "ring-2 ring-rose-400" : ""}`}>
                  <FieldIcon><Phone size={18} /></FieldIcon>
                  <input
                    id="mobile"
                    type="tel"
                    value={values.mobile}
                    onChange={(event) => updateField("mobile", event.target.value)}
                    placeholder="10-digit mobile number"
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </div>
                {errors.mobile && <p className="auth-error">{errors.mobile}</p>}
              </div>

              <div className="auth-control auth-control-wide">
                <EditableFrame id="register_label_email" isTextOnly>
                  <label htmlFor="email">Email address</label>
                </EditableFrame>
                <div className={`auth-input-wrap ${errors.email ? "ring-2 ring-rose-400" : ""}`}>
                  <FieldIcon><Mail size={18} /></FieldIcon>
                  <input
                    id="email"
                    type="email"
                    value={values.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="auth-error">{errors.email}</p>}
              </div>

              <div className="auth-control">
                <EditableFrame id="register_label_pass" isTextOnly>
                  <label htmlFor="password">Create password</label>
                </EditableFrame>
                <div className={`auth-input-wrap ${errors.password ? "ring-2 ring-rose-400" : ""}`}>
                  <FieldIcon><LockKeyhole size={18} /></FieldIcon>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={(event) => updateField("password", event.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-visibility"
                    onClick={() => setShowPassword((show) => !show)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && <p className="auth-error">{errors.password}</p>}
              </div>

              <div className="auth-control">
                <EditableFrame id="register_label_confirmpass" isTextOnly>
                  <label htmlFor="confirmPassword">Confirm password</label>
                </EditableFrame>
                <div className={`auth-input-wrap ${errors.confirmPassword ? "ring-2 ring-rose-400" : ""}`}>
                  <FieldIcon><LockKeyhole size={18} /></FieldIcon>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={values.confirmPassword}
                    onChange={(event) => updateField("confirmPassword", event.target.value)}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                  />
                </div>
                {errors.confirmPassword && <p className="auth-error">{errors.confirmPassword}</p>}
              </div>

              <div className="auth-control auth-control-wide">
                <EditableFrame id="register_label_lang" isTextOnly>
                  <label htmlFor="language">Preferred language</label>
                </EditableFrame>
                <div className="auth-input-wrap">
                  <FieldIcon><Globe2 size={18} /></FieldIcon>
                  <select
                    id="language"
                    value={values.language}
                    onChange={(event) => updateField("language", event.target.value)}
                  >
                    <option>English</option>
                    <option>తెలుగు</option>
                    <option>हिन्दी</option>
                    <option>தமிழ்</option>
                    <option>ಕನ್ನಡ</option>
                    <option>मराठी</option>
                    <option>ਪੰਜਾਬੀ</option>
                    <option>বাংলা</option>
                    <option>ગુજરાતી</option>
                    <option>മലയാളം</option>
                  </select>
                </div>
              </div>
            </div>

            <label className={`auth-check-row ${errors.agree ? "auth-check-row-error" : ""}`}>
              <input
                type="checkbox"
                checked={values.agree}
                onChange={(event) => updateField("agree", event.target.checked)}
              />
              <span className="auth-check-box"><Check size={13} /></span>
              <span>I agree to the <a href="#terms" onClick={(event) => event.preventDefault()}>Terms &amp; Conditions</a>.</span>
            </label>
            {errors.agree && <p className="auth-error auth-error-check">{errors.agree}</p>}

            <EditableFrame id="register_submit_button" isTextOnly>
              <button type="submit" className="auth-submit" disabled={submitting}>
                {submitting
                  ? "Opening your field notes…"
                  : getCustomization("register_submit_button")?.buttonText || (
                      <>Create Farmer Account <ArrowRight size={17} /></>
                    )}
              </button>
            </EditableFrame>
          </form>

          <p className="auth-switch">
            Already have an account? <Link href="/login">Log in</Link>
          </p>
          <p className="auth-note">
            Your account is securely saved. Log in anytime to pick up your field notes.
          </p>
        </div>
      </EditableFrame>
    </main>
  );
}
