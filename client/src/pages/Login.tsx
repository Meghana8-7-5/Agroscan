/*
  AgroScan / Field Notes design reminder:
  Login is the quiet return to the field notebook: strong contrast,
  explicit labels, calm form rhythm, and the same leaf-notch identity as Register.
*/
import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Leaf, LockKeyhole, Phone, ShieldCheck } from "lucide-react";

const farmerImage = "/manus-storage/agroscan-farmer-stock_130c484b.jpeg";

export default function Login() {
  const [, setLocation] = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!identifier.trim()) nextErrors.identifier = "Enter your mobile number or email.";
    if (password.length < 6) nextErrors.password = "Enter at least 6 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSubmitting(true);
    window.setTimeout(() => setLocation("/dashboard"), 650);
  };

  return (
    <main className="auth-page auth-page-login">
      <section className="auth-visual" style={{ backgroundImage: `linear-gradient(180deg, rgba(24,56,35,.08) 18%, rgba(24,56,35,.76) 100%), url(${farmerImage})` }} aria-label="Farmer examining crops">
        <Link href="/" className="auth-brand" aria-label="Back to AgroScan home">
          <span className="auth-brand-mark"><Leaf size={21} /></span>
          <span>AgroScan</span>
        </Link>
        <div className="auth-visual-copy">
          <p className="auth-visual-index">02 / RETURN TO YOUR FIELD</p>
          <h1>Your crop notes,<br /><em>right where you left them.</em></h1>
          <p>Pick up your saved scans, field plans, and practical recommendations whenever you need them.</p>
          <div className="auth-visual-foot"><ShieldCheck size={17} /> Clear advice, ready when you are.</div>
        </div>
      </section>

      <section className="auth-form-panel" aria-labelledby="login-title">
        <div className="auth-form-inner auth-form-inner-login">
          <div className="auth-form-topline">
            <Link href="/" className="auth-back-link"><ArrowLeft size={15} /> Back to home</Link>
            <span className="auth-step-label">AgroScan / Login <span className="auth-step-dot" /></span>
          </div>
          <div className="auth-heading">
            <p className="eyebrow">Good to have you back</p>
            <h2 id="login-title">Open your field notes.</h2>
            <p>Log in to see your crops, saved detections, and the next task in your plan.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-form-grid auth-form-grid-login">
              <div className="auth-control auth-control-wide">
                <label htmlFor="identifier">Mobile number or email</label>
                <div className="auth-input-wrap"><span className="auth-field-icon" aria-hidden="true"><Phone size={18} /></span><input id="identifier" value={identifier} onChange={(event) => { setIdentifier(event.target.value); setErrors((current) => ({ ...current, identifier: undefined })); }} placeholder="e.g. 98765 43210" autoComplete="username" /></div>
                {errors.identifier && <p className="auth-error">{errors.identifier}</p>}
              </div>
              <div className="auth-control auth-control-wide">
                <div className="auth-label-row"><label htmlFor="login-password">Password</label><a href="#forgot-password" onClick={(event) => event.preventDefault()}>Forgot password?</a></div>
                <div className="auth-input-wrap"><span className="auth-field-icon" aria-hidden="true"><LockKeyhole size={18} /></span><input id="login-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => { setPassword(event.target.value); setErrors((current) => ({ ...current, password: undefined })); }} placeholder="Enter your password" autoComplete="current-password" /><button type="button" className="auth-visibility" onClick={() => setShowPassword((show) => !show)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
                {errors.password && <p className="auth-error">{errors.password}</p>}
              </div>
            </div>
            <button type="submit" className="auth-submit" disabled={submitting}>{submitting ? "Opening your field notes…" : <>Log in to AgroScan <ArrowRight size={17} /></>}</button>
          </form>

          <p className="auth-switch">New to AgroScan? <Link href="/register">Create an account</Link></p>
          <p className="auth-note">Demo mode is active for now. Your login will open the dashboard locally until backend authentication is connected.</p>
        </div>
      </section>
    </main>
  );
}
