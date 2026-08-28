/*
  AgroScan / Field Notes design reminder:
  Keep the shell calm and explicit: warm oat canvas, deep ink type,
  botanical green actions, and clear escape routes on every page.
*/
import { useState } from "react";
import { Link, Route, Switch } from "wouter";
import { ArrowLeft, Leaf } from "lucide-react";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CropRegistration from "./pages/CropRegistration";
import MyCropPlan from "./pages/MyCropPlan";
import PestDetection from "./pages/PestDetection";
import WeatherAnalysis from "./pages/WeatherAnalysis";
import Notifications from "./pages/Notifications";

function ComingSoon({ title }: { title: string }) {
  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground sm:px-10">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center">
        <Link href="/" className="mb-10 inline-flex w-fit items-center gap-2 text-sm font-bold text-[#2f6b45] no-underline">
          <ArrowLeft size={16} /> Back to AgroScan
        </Link>
        <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-[#e5eddc] text-[#2f6b45]">
          <Leaf size={25} />
        </div>
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f6b45]">Field Notes / Next page</p>
        <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-[#214433] sm:text-7xl">{title}</h1>
        <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">This screen is part of the AgroScan roadmap. The shared route is ready, and this page will be built one approval at a time.</p>
      </div>
    </main>
  );
}

function App() {
  const [theme] = useState("light");

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/crop-registration" component={CropRegistration} />
        <Route path="/my-crops" component={MyCropPlan} />
        <Route path="/pest-detection" component={PestDetection} />
        <Route path="/weather" component={WeatherAnalysis} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/market-store"><ComingSoon title="Market store" /></Route>
        <Route path="/help-desk"><ComingSoon title="Help desk" /></Route>
        <Route path="/ai-voice-assistant"><ComingSoon title="AI voice assistant" /></Route>
        <Route path="/language"><ComingSoon title="Language" /></Route>
        <Route path="/more-tools"><ComingSoon title="More tools" /></Route>
        <Route path="/detection" component={PestDetection} />
        <Route path="/about"><ComingSoon title="About AgroScan" /></Route>
        <Route path="/services"><ComingSoon title="Services" /></Route>
        <Route path="/disease-library"><ComingSoon title="Disease Library" /></Route>
        <Route path="/pest-guide"><ComingSoon title="Pest Guide" /></Route>
        <Route path="/resources"><ComingSoon title="Resources" /></Route>
        <Route path="/contact"><ComingSoon title="Contact" /></Route>
        <Route><ComingSoon title="Page not found" /></Route>
      </Switch>
    </div>
  );
}

export default App;
