/*
  AgroScan / Field Notes design reminder:
  Detection must make the next action obvious. Keep the upload surface large,
  the mock result calm and readable, and treatment guidance separated into clear tabs.
*/
import { ChangeEvent, DragEvent, useEffect, useState } from "react";
import { Link } from "wouter";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CircleHelp,
  Camera,
  FileImage,
  Leaf,
  LoaderCircle,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { detectCrop, DetectionResult } from "../mock/detectCrop";

const leafImage = "/manus-storage/agroscan-leaf-stock_de49ea7d.jpg";

type DetectionSection = "organic" | "chemical" | "preventive";

const recentDetections = [
  { name: "Leaf blight", crop: "Tomato", date: "Today, 09:42", confidence: "94%" },
  { name: "Aphids", crop: "Chilli", date: "Yesterday, 17:10", confidence: "91%" },
  { name: "Powdery mildew", crop: "Maize", date: "22 Aug 2026", confidence: "87%" },
];

const sectionLabels: Record<DetectionSection, string> = {
  organic: "Organic treatment",
  chemical: "Chemical treatment",
  preventive: "Preventive measures",
};

export default function PestDetection() {
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | undefined>();
  const [section, setSection] = useState<DetectionSection>("organic");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }
    const nextUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [selectedFile]);

  const selectFile = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setSelectedFile(file);
    setResult(undefined);
    setSaved(false);
  };

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => selectFile(event.target.files?.[0]);
  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    selectFile(event.dataTransfer.files?.[0]);
  };

  const analyze = async () => {
    if (!selectedFile) return;
    setAnalyzing(true);
    setResult(undefined);
    const nextResult = await detectCrop(selectedFile);
    setResult(nextResult);
    setAnalyzing(false);
  };

  const reset = () => {
    setSelectedFile(undefined);
    setResult(undefined);
    setAnalyzing(false);
    setSaved(false);
    setCameraOpen(false);
  };

  return (
    <main className="workspace-page detection-page">
      <header className="workspace-topbar">
        <Link href="/dashboard" className="workspace-back"><ArrowLeft size={17} /> <span>Back to dashboard</span></Link>
        <div className="workspace-brand"><span className="workspace-brand-mark"><Leaf size={17} /></span><span>AgroScan</span></div>
        <span className="workspace-top-context">Pest detection / Photo scan</span>
      </header>

      <div className="workspace-content">
        {!result ? <>
          <div className="workspace-heading-row"><div><p className="dashboard-kicker dashboard-kicker-dark">Scan a crop / Mock model</p><h1 className="workspace-title">Show us what changed.</h1><p className="workspace-lede">Upload a clear photo of the leaf. AgroScan will return a likely issue, confidence, and practical treatment steps.</p></div><div className="workspace-heading-mark"><ScanLine size={27} /></div></div>
          <div className="detection-layout">
            <section className="detection-upload-card" aria-labelledby="upload-title">
              <div className="detection-card-heading"><div><p className="dashboard-kicker dashboard-kicker-dark">Step 1 / Add a photo</p><h2 id="upload-title">Choose how to scan.</h2></div><span className="detection-mode-note"><Sparkles size={13} /> Demo mode</span></div>
              <div className="detection-action-row"><button type="button" className={`detection-action detection-action-camera ${cameraOpen ? "detection-action-selected" : ""}`} onClick={() => setCameraOpen((open) => !open)}><span><Camera size={22} /></span><strong>Live camera</strong><small>{cameraOpen ? "Camera preview open" : "Use your phone camera"}</small></button><label className="detection-action detection-action-upload" htmlFor="crop-photo" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}><span><Upload size={22} /></span><strong>Upload photo</strong><small>Drag &amp; drop or choose a file</small><input id="crop-photo" type="file" accept="image/*" onChange={handleFileInput} /></label></div>
              {cameraOpen && <div className="camera-placeholder"><span className="camera-placeholder-icon"><Camera size={21} /></span><div><strong>Camera preview is ready for the next build.</strong><p>For now, choose “Upload photo” to try the mock analysis with an image from your device.</p></div><button type="button" onClick={() => setCameraOpen(false)} aria-label="Close camera preview"><X size={17} /></button></div>}
              <label className={`detection-dropzone ${selectedFile ? "detection-dropzone-selected" : ""}`} htmlFor="crop-photo" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
                {previewUrl ? <><img src={previewUrl} alt="Selected crop leaf preview" /><span className="detection-preview-overlay"><Check size={15} /> Photo ready</span></> : <><span className="detection-dropzone-icon"><FileImage size={28} /></span><strong>Drop a leaf photo here</strong><span>PNG or JPG · a clear close-up works best</span></>}
              </label>
              {selectedFile && <div className="selected-file-row"><span><FileImage size={14} /> {selectedFile.name}</span><button type="button" onClick={reset}><X size={14} /> Remove</button></div>}
              <button type="button" className="detection-submit" disabled={!selectedFile || analyzing} onClick={analyze}>{analyzing ? <><LoaderCircle size={17} className="detection-spinner" /> Reading the leaf…</> : <>Analyze this photo <ArrowRight size={17} /></>}</button>
              <p className="detection-disclaimer"><ShieldCheck size={14} /> This is a frontend demo. Treatment advice will connect to the ML and advisory backend later.</p>
            </section>

            <aside className="detection-side-card"><span className="detection-side-number">Before you scan / 01</span><span className="detection-side-icon"><Leaf size={28} /></span><h2>Make the leaf easy to read.</h2><p>Use daylight, keep the leaf inside the frame, and avoid a busy background. One strong photo is better than many blurry ones.</p><div className="detection-side-tips"><span><Check size={13} /> Show the whole leaf</span><span><Check size={13} /> Keep the camera steady</span><span><Check size={13} /> Scan one problem at a time</span></div></aside>
          </div>

          <section className="recent-detections" aria-labelledby="recent-title"><div className="subsection-heading"><div><p className="dashboard-kicker dashboard-kicker-dark">Your saved field notes</p><h2 id="recent-title">Recent detections</h2></div><Link href="/my-crops" className="text-link">View saved notes <ArrowRight size={14} /></Link></div><div className="recent-list">{recentDetections.map((item) => <div className="recent-detection-row" key={`${item.name}-${item.date}`}><span className="recent-thumb"><img src={leafImage} alt="" /></span><span className="recent-detection-copy"><strong>{item.name}</strong><small>{item.crop} · {item.date}</small></span><span className="recent-confidence">{item.confidence}<small>confidence</small></span><button type="button" className="recent-view-button">View <ChevronRight size={14} /></button></div>)}</div></section>
        </> : <DetectionResultView result={result} previewUrl={previewUrl} section={section} setSection={setSection} saved={saved} setSaved={setSaved} reset={reset} />}
      </div>
    </main>
  );
}

function DetectionResultView({ result, previewUrl, section, setSection, saved, setSaved, reset }: { result: DetectionResult; previewUrl: string; section: DetectionSection; setSection: (section: DetectionSection) => void; saved: boolean; setSaved: (saved: boolean) => void; reset: () => void }) {
  const content = result[section];
  return <>
    <div className="workspace-heading-row"><div><p className="dashboard-kicker dashboard-kicker-dark">Scan complete / Mock result</p><h1 className="workspace-title">Here’s what we found.</h1><p className="workspace-lede">Use this as a starting point, then check the product label or a local crop expert before treatment.</p></div><div className="result-ready-badge"><Check size={16} /> Ready</div></div>
    <div className="detection-result-layout">
      <section className="detection-result-card"><div className="detection-result-image"><img src={previewUrl} alt="Uploaded crop leaf" /><span><ScanLine size={14} /> Photo scanned</span></div><div className="detection-result-summary"><p className="dashboard-kicker dashboard-kicker-dark">Likely issue</p><h2>{result.disease}</h2><div className="result-summary-meta"><span>{result.crop}</span><span className={`severity-badge severity-${result.severity.toLowerCase()}`}><AlertTriangle size={12} /> {result.severity} severity</span></div><div className="confidence-meter"><div className="confidence-meter-label"><span>Confidence</span><strong>{result.confidence}%</strong></div><div className="confidence-meter-track"><span style={{ width: `${result.confidence}%` }} /></div></div><p className="result-summary-copy">The pattern looks consistent with {result.disease.toLowerCase()}. Start with the least disruptive option and watch the crop over the next few days.</p></div></section>
      <section className="advisory-card"><div className="advisory-heading"><div><p className="dashboard-kicker dashboard-kicker-dark">Practical advisory</p><h2>What you can do next.</h2></div><CircleHelp size={19} /></div><div className="advisory-tabs" role="tablist" aria-label="Treatment advice sections">{(Object.keys(sectionLabels) as DetectionSection[]).map((key) => <button type="button" role="tab" aria-selected={section === key} className={section === key ? "advisory-tab advisory-tab-active" : "advisory-tab"} key={key} onClick={() => setSection(key)}>{sectionLabels[key]}</button>)}</div><div className="advisory-list">{content.map((item) => <div className="advisory-item" key={item}><span><Check size={13} /></span><p>{item}</p></div>)}</div><div className="advisory-actions"><button type="button" className={`save-detection-button ${saved ? "save-detection-button-saved" : ""}`} onClick={() => setSaved(!saved)}>{saved ? <><Check size={16} /> Saved to my detections</> : <>Save to my detections <ArrowRight size={16} /></>}</button><button type="button" className="new-scan-button" onClick={reset}><ScanLine size={15} /> Scan another leaf</button></div></section>
    </div>
  </>;
}
