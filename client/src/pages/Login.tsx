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
  CheckCircle2,
  RefreshCw,
  LoaderCircle,
  MapPin,
  Globe
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUiEditContext } from "@/contexts/UiEditContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocationContext } from "@/contexts/LocationContext";
import { getApiErrorMessage } from "@/lib/api";
import EditableFrame from "@/components/EditableFrame";

const farmerImage = "/images/farmer-login-visual.jpg";
const adminImage = "/images/admin-agri-desk.jpg";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, sendOtp, verifyOtp, completeProfile } = useAuth();
  const { loginAdmin, getCustomization } = useUiEditContext();
  const { language, setLanguage, languages } = useLanguage();
  const { location } = useLocationContext();

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

  // Farmer OTP Flow state
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpStep, setOtpStep] = useState<"enter_mobile" | "enter_otp" | "setup_profile">("enter_mobile");
  const [cooldown, setCooldown] = useState(0);
  const [devOtpHint, setDevOtpHint] = useState<string | undefined>();
  const [isNewFarmer, setIsNewFarmer] = useState(false);

  // New Farmer Minimal Setup form
  const [profileName, setProfileName] = useState("");
  const [profileLang, setProfileLang] = useState(language);
  const [profileVillage, setProfileVillage] = useState(location.villageCity || "Gowdapalem");
  const [profileDistrict, setProfileDistrict] = useState(location.district || "Guntur");

  // Admin Login state
  const [adminIdentifier, setAdminIdentifier] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Shared state
  const [errors, setErrors] = useState<{ general?: string; mobile?: string; otp?: string; admin?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const heroCustom = getCustomization("login_hero_panel");
  const headlineCustom = getCustomization("login_headline");
  const subtextCustom = getCustomization("login_subtext");
  const formHeadingCustom = getCustomization("login_form_heading");

  // ── 1. Farmer: Request OTP ──────────────────────────────────────────────
  const handleRequestOtp = async (e: FormEvent) => {
    e.preventDefault();
    const digits = mobileNumber.replace(/\D/g, "");
    if (!digits || digits.length < 10) {
      setErrors({ mobile: "Please enter a valid 10-digit mobile number." });
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const res = await sendOtp(mobileNumber.trim(), language);
      setCooldown(res.cooldownSeconds || 30);
      if (res.devOtp) setDevOtpHint(res.devOtp);
      setOtpStep("enter_otp");
    } catch (err) {
      setErrors({ general: getApiErrorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  };

  // ── 2. Farmer: Verify OTP ───────────────────────────────────────────────
  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.length < 4) {
      setErrors({ otp: "Please enter the 6-digit OTP sent to your phone." });
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const { isNewUser, user } = await verifyOtp(mobileNumber.trim(), otpCode.trim());
      setIsNewFarmer(isNewUser);

      if (isNewUser) {
        setProfileName(user.fullName || `Farmer ${mobileNumber.slice(-4)}`);
        setProfileLang(language);
        setProfileVillage(location.villageCity || "My Village");
        setProfileDistrict(location.district || "Guntur");
        setOtpStep("setup_profile");
      } else {
        // Returning farmer -> straight to dashboard!
        setLocation("/dashboard");
      }
    } catch (err) {
      setErrors({ otp: getApiErrorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  };

  // ── 3. Farmer: Complete Profile Setup (First Time Only) ─────────────────
  const handleCompleteProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      setErrors({ general: "Please enter your name." });
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await completeProfile({
        fullName: profileName.trim(),
        language: profileLang,
        villageCity: profileVillage.trim(),
        district: profileDistrict.trim(),
        state: location.state || "Andhra Pradesh",
      });
      setLanguage(profileLang);
      setLocation("/dashboard");
    } catch (err) {
      setErrors({ general: getApiErrorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  };

  // ── 4. Admin: Email + Password Login ────────────────────────────────────
  const handleAdminSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!adminIdentifier.trim()) {
      setErrors({ admin: "Enter authorized admin email." });
      return;
    }
    if (adminPassword.length < 6) {
      setErrors({ admin: "Enter at least 6 characters for admin password." });
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const res = loginAdmin(adminIdentifier.trim(), adminPassword);
      if (!res.success) {
        setErrors({ admin: res.message || "Invalid admin credentials." });
        setSubmitting(false);
        return;
      }
      try {
        await login(adminIdentifier.trim(), adminPassword);
      } catch {}
      setLocation("/dashboard");
    } catch (err) {
      setErrors({ admin: getApiErrorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  };

  const currentRoleImage = activeTab === "admin" ? adminImage : farmerImage;
  const heroBgImage = heroCustom?.customImageUrl || currentRoleImage;
  const overlayDarkness = heroCustom?.overlayDarkness !== undefined ? heroCustom.overlayDarkness : (activeTab === "admin" ? 0.72 : 0.68);

  return (
    <main className="auth-page auth-page-login min-h-screen flex flex-col md:flex-row">
      {/* Left Visual Hero Section */}
      <EditableFrame
        id="login_hero_panel"
        isHeroPanel
        className="auth-visual md:w-1/2 min-h-[380px] md:min-h-screen p-8 sm:p-12 lg:p-16 flex flex-col justify-between"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(20,48,30,${overlayDarkness * 0.25}) 15%, rgba(20,48,30,${overlayDarkness}) 100%), url(${heroBgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Link href="/" className="auth-brand inline-flex items-center gap-2.5 text-white font-display text-2xl font-bold no-underline" aria-label="Back to AgroScan home">
          <EditableFrame id="login_brand_mark" className="auth-brand-mark h-10 w-10 rounded-xl bg-[#2f6b45] text-white flex items-center justify-center shadow-lg">
            <Leaf size={22} />
          </EditableFrame>
          <span>AgroScan</span>
        </Link>

        <div className="auth-visual-copy space-y-4 my-auto py-8">
          <EditableFrame id="login_index_kicker" isTextOnly>
            <p className="auth-visual-index text-xs font-extrabold uppercase tracking-widest text-emerald-300">
              {getCustomization("login_index_kicker")?.title || (activeTab === "admin" ? "02 / ADMIN OPERATIONS DESK" : "02 / INSTANT FARMER MOBILE ACCESS")}
            </p>
          </EditableFrame>

          <EditableFrame id="login_headline" isTextOnly>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] text-white tracking-tight">
              {headlineCustom?.title || (
                activeTab === "admin" ? (
                  <>
                    Administrator Portal,<br />
                    <em>Smart crop analytics &amp; oversight.</em>
                  </>
                ) : (
                  <>
                    Fast OTP Login,<br />
                    <em>no passwords to remember.</em>
                  </>
                )
              )}
            </h1>
          </EditableFrame>

          <EditableFrame id="login_subtext" isTextOnly>
            <p className="text-base text-emerald-100 max-w-lg mt-4 leading-relaxed">
              {subtextCustom?.subtitle || (
                activeTab === "admin"
                  ? "Access administrative controls, review incoming farmer complaints, manage crop care advisories, and track Gram Sachivalayam agronomist referrals."
                  : "Enter your mobile number to receive a secure SMS OTP. Access your crop health schedule, live weather alerts, and AI voice leaf advisor."
              )}
            </p>
          </EditableFrame>

          <div className="auth-visual-foot text-sm text-emerald-200 mt-6 flex items-center gap-2.5 font-medium">
            {activeTab === "admin" ? (
              <><ShieldAlert size={19} className="text-amber-400 shrink-0" /> Verified Agronomic Control Center</>
            ) : (
              <><ShieldCheck size={19} className="text-emerald-400 shrink-0" /> Safe &amp; verified mobile OTP login</>
            )}
          </div>
        </div>
      </EditableFrame>

      {/* Right Login / OTP Form Panel */}
      <EditableFrame id="login_form_panel" className="auth-form-panel md:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16" defaultBgColor="#fdfcf8">
        <div className="auth-form-inner auth-form-inner-login max-w-lg w-full space-y-7">
          <div className="auth-form-topline flex items-center justify-between">
            <Link href="/get-started" className="auth-back-link text-sm font-bold text-[#2f6b45] flex items-center gap-1.5 hover:underline">
              <ArrowLeft size={16} /> Back to role select
            </Link>
            <div className="flex items-center gap-1.5">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${
                activeTab === "admin" ? "bg-amber-200 text-amber-900 border border-amber-300" : "bg-emerald-100 text-emerald-800 border border-emerald-200"
              }`}>
                {activeTab === "admin" ? "Admin Access" : "Farmer OTP Flow"}
              </span>
            </div>
          </div>

          {/* Role Tab Selector (Farmer vs Admin) */}
          <div className="flex rounded-2xl bg-[#e8eedd] p-1.5 border border-[#d2dcb3]">
            <button
              type="button"
              onClick={() => {
                setActiveTab("farmer");
                setErrors({});
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "farmer"
                  ? "bg-[#2f6b45] text-white shadow"
                  : "text-[#34543e] hover:text-[#183624]"
              }`}
            >
              <Phone size={15} /> Farmer (Mobile + OTP)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("admin");
                setErrors({});
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "admin"
                  ? "bg-amber-600 text-white shadow"
                  : "text-[#34543e] hover:text-[#183624]"
              }`}
            >
              <ShieldAlert size={15} /> Admin Login
            </button>
          </div>

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* TAB 1: FARMER OTP FLOW */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {activeTab === "farmer" && (
            <div className="space-y-6">
              {/* Step 1: Enter Mobile Number */}
              {otpStep === "enter_mobile" && (
                <form onSubmit={handleRequestOtp} className="space-y-5">
                  <div className="auth-heading space-y-1.5">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-[#2f6b45]">
                      Farmer Direct Login
                    </p>
                    <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#183624] tracking-tight">
                      Enter your mobile number
                    </h2>
                    <p className="text-sm text-[#52705d] leading-relaxed">
                      We'll send a 6-digit verification code via SMS. Works for both new and returning farmers.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-[#193625]">Mobile Number</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-sm font-extrabold text-[#2f6b45] bg-[#e5eddc] px-2.5 py-1.5 rounded-xl border border-[#c9d8bf]">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => {
                          setMobileNumber(e.target.value);
                          setErrors({});
                        }}
                        placeholder="98765 43210"
                        maxLength={15}
                        autoFocus
                        className="w-full rounded-2xl border border-[#cbd8bf] bg-white pl-24 pr-4 py-4 text-base font-bold text-[#1b3b27] focus:outline-none focus:ring-2 focus:ring-[#2f6b45]/30 shadow-sm"
                      />
                    </div>
                    {errors.mobile && <p className="text-xs text-rose-600 font-semibold mt-1">{errors.mobile}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !mobileNumber.trim()}
                    className="w-full rounded-2xl bg-[#2f6b45] py-4 text-sm font-extrabold text-white shadow-xl hover:bg-[#20492f] disabled:opacity-50 flex items-center justify-center gap-2.5 cursor-pointer transition-all"
                  >
                    {submitting ? (
                      <>
                        <LoaderCircle size={17} className="animate-spin" /> Sending SMS OTP…
                      </>
                    ) : (
                      <>
                        Get Verification OTP <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                  {errors.general && <p className="text-xs text-rose-600 font-semibold">{errors.general}</p>}
                </form>
              )}

              {/* Step 2: Enter & Verify OTP */}
              {otpStep === "enter_otp" && (
                <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in">
                  <div className="auth-heading space-y-1.5">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-[#2f6b45]">
                      Verification Code Sent
                    </p>
                    <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#183624] tracking-tight">
                      Enter 6-digit OTP
                    </h2>
                    <p className="text-sm text-[#52705d] leading-relaxed">
                      Sent via SMS to <strong>+91 {mobileNumber}</strong>.{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep("enter_mobile");
                          setErrors({});
                        }}
                        className="text-[#2f6b45] font-bold underline cursor-pointer hover:text-[#1b4229]"
                      >
                        Change number
                      </button>
                    </p>
                  </div>

                  {devOtpHint && (
                    <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-3.5 text-sm text-emerald-900 flex items-center justify-between">
                      <span>SMS Sent! Code: <strong>{devOtpHint}</strong></span>
                      <button
                        type="button"
                        onClick={() => setOtpCode(devOtpHint)}
                        className="font-bold underline text-emerald-800 cursor-pointer hover:text-emerald-950"
                      >
                        Auto-fill
                      </button>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-[#193625]">6-Digit Code</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={otpCode}
                      onChange={(e) => {
                        setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                        setErrors({});
                      }}
                      placeholder="• • • • • •"
                      maxLength={6}
                      autoFocus
                      className="w-full text-center tracking-[0.5em] font-mono rounded-2xl border border-[#cbd8bf] bg-white px-4 py-4 text-2xl font-extrabold text-[#1b3b27] focus:outline-none focus:ring-2 focus:ring-[#2f6b45]/30 shadow-sm"
                    />
                    {errors.otp && <p className="text-xs text-rose-600 font-semibold mt-1">{errors.otp}</p>}
                  </div>

                  <div className="flex items-center justify-between text-sm text-[#52705d]">
                    {cooldown > 0 ? (
                      <span>Resend OTP in <strong>00:{cooldown < 10 ? `0${cooldown}` : cooldown}</strong></span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        className="font-bold text-[#2f6b45] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw size={13} /> Resend OTP now
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || otpCode.length < 4}
                    className="w-full rounded-2xl bg-[#2f6b45] py-4 text-sm font-extrabold text-white shadow-xl hover:bg-[#20492f] disabled:opacity-50 flex items-center justify-center gap-2.5 cursor-pointer transition-all"
                  >
                    {submitting ? (
                      <>
                        <LoaderCircle size={17} className="animate-spin" /> Verifying…
                      </>
                    ) : (
                      <>
                        Verify &amp; Enter Dashboard <CheckCircle2 size={17} />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Step 3: Minimal Profile Completion (First-Time Farmers Only) */}
              {otpStep === "setup_profile" && (
                <form onSubmit={handleCompleteProfile} className="space-y-5 animate-in fade-in">
                  <div className="auth-heading space-y-1.5">
                    <span className="inline-block rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-extrabold uppercase tracking-wide">
                      One-Time Farmer Setup
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#183624] tracking-tight">
                      Tell us about your farm
                    </h2>
                    <p className="text-sm text-[#52705d] leading-relaxed">
                      We'll tailor your crop care reminders and local weather telemetry to your village.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-[#193625]">Your Full Name *</label>
                    <div className="relative flex items-center">
                      <User size={18} className="absolute left-3.5 text-[#557662]" />
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        required
                        className="w-full rounded-2xl border border-[#cbd8bf] bg-white pl-11 pr-4 py-3.5 text-base font-bold text-[#1b3b27] focus:outline-none focus:ring-2 focus:ring-[#2f6b45]/30 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-bold text-[#193625]">Preferred Language</label>
                      <div className="relative flex items-center">
                        <Globe size={18} className="absolute left-3.5 text-[#557662]" />
                        <select
                          value={profileLang}
                          onChange={(e) => setProfileLang(e.target.value)}
                          className="w-full rounded-2xl border border-[#cbd8bf] bg-white pl-11 pr-4 py-3.5 text-base font-bold text-[#1b3b27] focus:outline-none focus:ring-2 focus:ring-[#2f6b45]/30 cursor-pointer shadow-sm"
                        >
                          {languages.map((l) => (
                            <option key={l.code} value={l.code}>
                              {l.nativeName} ({l.name})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-bold text-[#193625]">Village / City</label>
                      <div className="relative flex items-center">
                        <MapPin size={18} className="absolute left-3.5 text-[#557662]" />
                        <input
                          type="text"
                          value={profileVillage}
                          onChange={(e) => setProfileVillage(e.target.value)}
                          placeholder="e.g. Gowdapalem"
                          className="w-full rounded-2xl border border-[#cbd8bf] bg-white pl-11 pr-4 py-3.5 text-base font-bold text-[#1b3b27] focus:outline-none focus:ring-2 focus:ring-[#2f6b45]/30 shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !profileName.trim()}
                    className="w-full rounded-2xl bg-[#2f6b45] py-4 text-sm font-extrabold text-white shadow-xl hover:bg-[#20492f] disabled:opacity-50 flex items-center justify-center gap-2.5 cursor-pointer transition-all"
                  >
                    {submitting ? (
                      <>
                        <LoaderCircle size={17} className="animate-spin" /> Saving Profile…
                      </>
                    ) : (
                      <>
                        Save &amp; Open My Field Desk <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                  {errors.general && <p className="text-xs text-rose-600 font-semibold">{errors.general}</p>}
                </form>
              )}
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* TAB 2: ADMIN LOGIN FLOW (PRESERVED) */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {activeTab === "admin" && (
            <form onSubmit={handleAdminSubmit} className="space-y-5 animate-in fade-in" noValidate>
              <div className="auth-heading space-y-1.5">
                <p className="text-xs font-extrabold uppercase tracking-widest text-amber-700">
                  Administrator Portal
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#183624] tracking-tight">
                  Admin Login
                </h2>
                <p className="text-sm text-[#52705d] leading-relaxed">
                  Authorized agronomist and administrative access with site-wide Edit Mode.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-[#193625]">Admin Email</label>
                <div className="relative flex items-center">
                  <ShieldAlert size={18} className="absolute left-3.5 text-amber-700" />
                  <input
                    type="email"
                    value={adminIdentifier}
                    onChange={(e) => {
                      setAdminIdentifier(e.target.value);
                      setErrors({});
                    }}
                    placeholder="e.g. meghanakotaru07@gmail.com"
                    autoFocus
                    className="w-full rounded-2xl border border-[#cbd8bf] bg-white pl-11 pr-4 py-4 text-base font-bold text-[#1b3b27] focus:outline-none focus:ring-2 focus:ring-amber-500/30 shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-[#193625]">Admin Password</label>
                <div className="relative flex items-center">
                  <LockKeyhole size={18} className="absolute left-3.5 text-amber-700" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      setErrors({});
                    }}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-[#cbd8bf] bg-white pl-11 pr-11 py-4 text-base font-bold text-[#1b3b27] focus:outline-none focus:ring-2 focus:ring-amber-500/30 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {errors.admin && <p className="text-xs text-rose-600 font-semibold">{errors.admin}</p>}

              <button
                type="submit"
                disabled={submitting || !adminIdentifier.trim() || !adminPassword}
                className="w-full rounded-2xl bg-amber-600 hover:bg-amber-700 py-4 text-sm font-extrabold text-white shadow-xl disabled:opacity-50 flex items-center justify-center gap-2.5 cursor-pointer transition-all"
              >
                {submitting ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" /> Authenticating Admin…
                  </>
                ) : (
                  <>
                    Sign In as Administrator <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </EditableFrame>
    </main>
  );
}

