import { FormEvent, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  Phone,
  ShieldCheck,
  ShieldAlert,
  User,
  Lock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUiEditContext } from "@/contexts/UiEditContext";
import { getApiErrorMessage } from "@/lib/api";
import EditableFrame from "@/components/EditableFrame";

const farmerImage = "/images/farmer-login-visual.jpg";
const adminImage = "/images/admin-agri-desk.jpg";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { loginAdmin, getCustomization } = useUiEditContext();

  const [activeTab, setActiveTab] = useState<"farmer" | "admin">(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("role") === "admin" ? "admin" : "farmer";
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get("role");
    if (roleParam === "admin" || roleParam === "farmer") {
      setActiveTab(roleParam);
    }
  }, []);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string; form?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const heroCustom = getCustomization("login_hero_panel");
  const headlineCustom = getCustomization("login_headline");
  const subtextCustom = getCustomization("login_subtext");
  const formHeadingCustom = getCustomization("login_form_heading");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};

    if (!identifier.trim()) {
      nextErrors.identifier = activeTab === "admin" ? "Enter your admin email." : "Enter your mobile number or email.";
    }
    if (password.length < 6) {
      nextErrors.password = "Enter at least 6 characters.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      if (activeTab === "admin") {
        const res = loginAdmin(identifier.trim(), password);
        if (!res.success) {
          setErrors({ form: res.message || "Invalid admin credentials." });
          setSubmitting(false);
          return;
        }
        try {
          await login(identifier.trim(), password);
        } catch {
          // fallback to admin demo token
        }
        setLocation("/dashboard");
      } else {
        await login(identifier.trim(), password);
        setLocation("/dashboard");
      }
    } catch (error) {
      setErrors({ form: getApiErrorMessage(error) });
    } finally {
      setSubmitting(false);
    }
  };

  const currentRoleImage = activeTab === "admin" ? adminImage : farmerImage;
  const heroBgImage = heroCustom?.customImageUrl || currentRoleImage;
  const overlayDarkness = heroCustom?.overlayDarkness !== undefined ? heroCustom.overlayDarkness : (activeTab === "admin" ? 0.72 : 0.68);

  return (
    <main className="auth-page auth-page-login">
      {/* Left Visual Hero Section wrapped in EditableFrame */}
      <EditableFrame
        id="login_hero_panel"
        isHeroPanel
        className="auth-visual"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(20,48,30,${overlayDarkness * 0.25}) 15%, rgba(20,48,30,${overlayDarkness}) 100%), url(${heroBgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Link href="/" className="auth-brand" aria-label="Back to AgroScan home">
          <EditableFrame id="login_brand_mark" className="auth-brand-mark">
            <Leaf size={21} />
          </EditableFrame>
          <span>AgroScan</span>
        </Link>

        <div className="auth-visual-copy">
          <EditableFrame id="login_index_kicker" isTextOnly>
            <p className="auth-visual-index">
              {getCustomization("login_index_kicker")?.title || (activeTab === "admin" ? "02 / ADMIN OPERATIONS DESK" : "02 / RETURN TO YOUR FIELD")}
            </p>
          </EditableFrame>

          <EditableFrame id="login_headline" isTextOnly>
            <h1>
              {headlineCustom?.title || (
                activeTab === "admin" ? (
                  <>
                    Administrator Portal,<br />
                    <em>Smart crop analytics &amp; oversight.</em>
                  </>
                ) : (
                  <>
                    Your crop notes,<br />
                    <em>right where you left them.</em>
                  </>
                )
              )}
            </h1>
          </EditableFrame>

          <EditableFrame id="login_subtext" isTextOnly>
            <p>
              {subtextCustom?.subtitle || (
                activeTab === "admin"
                  ? "Access administrative controls, review incoming farmer complaints, manage crop care advisories, and track Gram Sachivalayam agronomist referrals."
                  : "Pick up your saved scans, field plans, and practical recommendations whenever you need them."
              )}
            </p>
          </EditableFrame>

          <div className="auth-visual-foot">
            {activeTab === "admin" ? (
              <><ShieldAlert size={17} className="text-amber-400" /> Verified Agronomic Control Center</>
            ) : (
              <><ShieldCheck size={17} /> Clear advice, ready when you are.</>
            )}
          </div>
        </div>
      </EditableFrame>

      {/* Right Login Form Panel */}
      <EditableFrame id="login_form_panel" className="auth-form-panel" defaultBgColor="#fdfcf8">
        <div className="auth-form-inner auth-form-inner-login">
          <div className="auth-form-topline flex items-center justify-between">
            <Link href="/get-started" className="auth-back-link">
              <ArrowLeft size={15} /> Back to role select
            </Link>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#52705d]">Role:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                activeTab === "admin" ? "bg-amber-200 text-amber-900 border border-amber-300" : "bg-emerald-100 text-emerald-800 border border-emerald-200"
              }`}>
                {activeTab === "admin" ? "Admin" : "Farmer"}
              </span>
            </div>
          </div>

          {/* Role Tab Selector (Farmer vs Admin) */}
          <div className="flex rounded-2xl bg-[#e8eedd] p-1 my-3 border border-[#d2dcb3]">
            <button
              type="button"
              onClick={() => {
                setActiveTab("farmer");
                setErrors({});
              }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "farmer"
                  ? "bg-[#2f6b45] text-white shadow"
                  : "text-[#34543e] hover:text-[#183624]"
              }`}
            >
              <User size={14} /> Farmer Login
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("admin");
                setErrors({});
              }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "admin"
                  ? "bg-amber-600 text-white shadow"
                  : "text-[#34543e] hover:text-[#183624]"
              }`}
            >
              <ShieldAlert size={14} /> Admin Login
            </button>
          </div>

          <div className="auth-heading">
            <EditableFrame id="login_eyebrow" isTextOnly>
              <p className="eyebrow">
                {getCustomization("login_eyebrow")?.title || (activeTab === "admin" ? "Administrator Access" : "Good to have you back")}
              </p>
            </EditableFrame>

            <EditableFrame id="login_form_heading" isTextOnly>
              <h2 id="login-title">
                {formHeadingCustom?.title || (activeTab === "admin" ? "Admin Login Portal" : "Open your field desk.")}
              </h2>
            </EditableFrame>

            <EditableFrame id="login_form_desc" isTextOnly>
              <p>
                {getCustomization("login_form_desc")?.subtitle ||
                  (activeTab === "admin"
                    ? "Enter pre-provisioned administrator credentials to unlock site-wide Edit Mode."
                    : "Log in to access your crops, weather alerts, and AI Leaf Assistant.")}
              </p>
            </EditableFrame>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-form-grid auth-form-grid-login">
              <div className="auth-control auth-control-wide">
                <label htmlFor="identifier">
                  {activeTab === "admin" ? "Admin Email Address" : "Mobile number or email"}
                </label>
                <div className="auth-input-wrap">
                  <span className="auth-field-icon" aria-hidden="true">
                    {activeTab === "admin" ? <ShieldAlert size={18} /> : <Phone size={18} />}
                  </span>
                  <input
                    id="identifier"
                    type={activeTab === "admin" ? "email" : "text"}
                    value={identifier}
                    onChange={(event) => {
                      setIdentifier(event.target.value);
                      setErrors((current) => ({ ...current, identifier: undefined }));
                    }}
                    placeholder={activeTab === "admin" ? "Enter authorized admin email" : "e.g. 98765 43210"}
                    autoComplete="username"
                  />
                </div>
                {errors.identifier && <p className="auth-error">{errors.identifier}</p>}
              </div>

              <div className="auth-control auth-control-wide">
                <div className="auth-label-row">
                  <label htmlFor="login-password">Password</label>
                  {activeTab === "farmer" && (
                    <a href="#forgot-password" onClick={(event) => event.preventDefault()}>
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="auth-input-wrap">
                  <span className="auth-field-icon" aria-hidden="true">
                    <LockKeyhole size={18} />
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setErrors((current) => ({ ...current, password: undefined }));
                    }}
                    placeholder="Enter password"
                    autoComplete="current-password"
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
            </div>

            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting
                ? "Authenticating…"
                : activeTab === "admin"
                ? "Log in as Admin"
                : "Log in to AgroScan"}
              <ArrowRight size={17} />
            </button>
            {errors.form && <p className="auth-error mt-2">{errors.form}</p>}
          </form>

          {/* Registration link shown ONLY for farmer role */}
          {activeTab === "farmer" ? (
            <p className="auth-switch">
              New to AgroScan? <Link href="/register">Create a Farmer account</Link>
            </p>
          ) : (
            <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-950 space-y-1">
              <p className="font-bold flex items-center gap-1 text-amber-900">
                <ShieldAlert size={14} className="text-amber-700" />
                Admin Portal &amp; Farmer Tickets Desk
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Log in to review incoming farmer complaints, manage crop care advisories, and track Gram Sachivalayam agronomist referrals on the notice board.
              </p>
            </div>
          )}
        </div>
      </EditableFrame>
    </main>
  );
}
