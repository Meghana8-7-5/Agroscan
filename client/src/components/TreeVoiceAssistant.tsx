import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";
import {
  Leaf,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Globe,
  Send,
  LoaderCircle,
  HelpCircle,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLocationContext } from "../contexts/LocationContext";
import { useLanguage } from "../contexts/LanguageContext";
import { cropsApi, aiAssistantApi, type CropRegistration } from "../lib/api";
import EditableFrame from "./EditableFrame";

export default function TreeVoiceAssistant() {
  const [, setPageLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { location } = useLocationContext();
  const { language, setLanguage, languages, currentLangObj, t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [transcript, setTranscript] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [registeredCrops, setRegisteredCrops] = useState<CropRegistration[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const farmerName = user?.fullName?.split(" ")[0] || "Farmer";
  const autoGreetingText = t("auto_greeting", { name: farmerName });

  const [assistantReply, setAssistantReply] = useState(autoGreetingText);
  const recognitionRef = useRef<any>(null);

  // Keep greeting text updated when language changes
  useEffect(() => {
    setAssistantReply(t("auto_greeting", { name: farmerName }));
  }, [language, farmerName, t]);

  // Load farmer's registered crops for dynamic prompt chips when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    cropsApi.list()
      .then((crops) => {
        if (Array.isArray(crops)) {
          setRegisteredCrops(crops);
        }
      })
      .catch(() => {});
  }, [isAuthenticated]);

  // Synthetic voices setup
  useEffect(() => {
    if ("speechSynthesis" in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Natural synthetic voice selection
  const selectSyntheticVoice = useCallback((speechCode: string): SpeechSynthesisVoice | null => {
    if (availableVoices.length === 0) return null;
    const codePrefix = speechCode.toLowerCase().split("-")[0];
    const matching = availableVoices.filter((v) => v.lang.toLowerCase().includes(codePrefix));
    const natural = matching.find((v) =>
      v.name.toLowerCase().includes("natural") ||
      v.name.toLowerCase().includes("neural") ||
      v.name.toLowerCase().includes("google")
    );
    return natural || matching[0] || availableVoices[0] || null;
  }, [availableVoices]);

  const speakText = useCallback((text: string) => {
    if (!audioEnabled || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLangObj.speechCode;

      const chosenVoice = selectSyntheticVoice(currentLangObj.speechCode);
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      utterance.pitch = 1.0;
      utterance.rate = 0.95;
      utterance.volume = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS speak error:", e);
    }
  }, [audioEnabled, currentLangObj, selectSyntheticVoice]);

  // Web Speech STT Setup — re-initialize immediately when language changes
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = currentLangObj.speechCode;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript("");
        setErrorMessage("");
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
        if (event.results[current].isFinal) {
          processQuestion(text);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
        if (err.error === "not-allowed" || err.error === "service-not-allowed") {
          setErrorMessage("Microphone access denied. Please allow microphone permission in browser settings, or type your question below.");
        } else if (err.error === "no-speech") {
          setErrorMessage("No speech detected. Please tap the Leaf button and speak clearly.");
        } else if (err.error === "network") {
          setErrorMessage("Network error during speech recognition. Please check your internet connection.");
        } else {
          setErrorMessage("I couldn't hear that clearly. Please tap the Leaf button to try again, or type below.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [currentLangObj]);

  // EVERY TIME the assistant is opened, immediately greet aloud & in text
  const openAssistant = useCallback(() => {
    setIsOpen(true);
    setErrorMessage("");
    const greeting = t("auto_greeting", { name: farmerName });
    setAssistantReply(greeting);

    // Speak immediate greeting
    if (audioEnabled) {
      setTimeout(() => {
        speakText(greeting);
      }, 350);
    }
  }, [farmerName, t, audioEnabled, speakText]);

  // Listen for custom event from Dashboard quick-action chips
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setIsOpen(true);
        setTranscript(customEvent.detail);
        processQuestion(customEvent.detail);
      }
    };
    window.addEventListener("agroscan:ask-assistant", handler);
    return () => window.removeEventListener("agroscan:ask-assistant", handler);
  }, [language, farmerName, registeredCrops]);

  // Proactive Voice Assistant Nudge immediately after new Crop Registration
  useEffect(() => {
    const proactiveCropHandler = (e: Event) => {
      const customEvent = e as CustomEvent<{ cropName: string; variety?: string; location?: string }>;
      const cropName = customEvent.detail?.cropName || "your new crop";

      let proactiveMsg = `I see you just registered ${cropName}! Want me to walk you through its care schedule, or answer any questions about growing it?`;
      if (language === "te") {
        proactiveMsg = `మీరు ${cropName} పంటను విజయవంతంగా నమోదు చేసుకున్నారు! దీని దశల వారీ సంరక్షణ షెడ్యూల్ మరియు తెగుళ్ల నివారణ సలహాలు వివరించమంటారా?`;
      } else if (language === "hi") {
        proactiveMsg = `मैंने देखा कि आपने अभी ${cropName} फसल दर्ज की है! क्या आप इसकी देखभाल अनुसूची और कीट नियंत्रण के बारे में जानना चाहते हैं?`;
      } else if (language === "ta") {
        proactiveMsg = `நீங்கள் இப்போது ${cropName} பயிரை பதிவு செய்துள்ளீர்கள்! இதன் பராமரிப்பு அட்டவணையை நான் உங்களுக்கு விளக்கவா?`;
      } else if (language === "kn") {
        proactiveMsg = `ನೀವು ${cropName} ಬೆಳೆಯನ್ನು ನೋಂದಾಯಿಸಿದ್ದೀರಿ! ಇದರ ಹಂತ ಹಂತದ ಆರೈಕೆ ವೇಳಾಪಟ್ಟಿಯನ್ನು ವಿವರಿಸಲೇ?`;
      }

      setIsOpen(true);
      setTranscript(`Registered ${cropName}`);
      setAssistantReply(proactiveMsg);

      if (audioEnabled) {
        setTimeout(() => {
          speakText(proactiveMsg);
        }, 400);
      }
    };

    window.addEventListener("agroscan:proactive-crop-registered", proactiveCropHandler);
    return () => window.removeEventListener("agroscan:proactive-crop-registered", proactiveCropHandler);
  }, [language, audioEnabled, speakText]);

  const toggleListening = () => {
    setErrorMessage("");
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        setErrorMessage("Speech recognition is not supported in this browser. Please type your question below.");
        return;
      }
      try {
        recognitionRef.current?.start();
      } catch {
        setIsListening(false);
        setErrorMessage("Unable to start speech recognition. Please try again or type your question.");
      }
    }
  };

  // Process user input (Speech or Typed) via LLM backend route
  const processQuestion = async (queryText: string) => {
    if (!queryText.trim()) return;
    setErrorMessage("");
    const text = queryText.toLowerCase();

    // Check fast navigation commands
    if (text.includes("scan") || text.includes("disease scanner") || text.includes("leaf")) {
      const reply = "Navigating to Plant & Disease Scanner. Show me a leaf photo to diagnose.";
      setAssistantReply(reply);
      speakText(reply);
      setTimeout(() => {
        setPageLocation("/detection");
        setIsOpen(false);
      }, 1200);
      return;
    }

    if (text.includes("store") || text.includes("market") || text.includes("dealer")) {
      const reply = `Opening Market Store locator for ${location.villageCity}.`;
      setAssistantReply(reply);
      speakText(reply);
      setTimeout(() => {
        setPageLocation("/stores");
        setIsOpen(false);
      }, 1200);
      return;
    }

    if (text.includes("weather") || text.includes("rain") || text.includes("forecast")) {
      const reply = `Opening Weather Analysis for ${location.villageCity}.`;
      setAssistantReply(reply);
      speakText(reply);
      setTimeout(() => {
        setPageLocation("/weather");
        setIsOpen(false);
      }, 1200);
      return;
    }

    // Call Backend AI LLM Advisory Endpoint
    setIsThinking(true);
    try {
      const cropNames = registeredCrops.map((c) => c.cropName);
      const data = await aiAssistantApi.chat({
        message: queryText,
        language,
        farmerName,
        registeredCrops: cropNames,
        location: `${location.villageCity}, ${location.district}`,
      });

      if (data.reply) {
        setAssistantReply(data.reply);
        speakText(data.reply);
      }
    } catch (err) {
      console.warn("AI LLM call failed:", err);
      setErrorMessage("I'm having trouble connecting to the advisory service. Please check your internet connection.");
      setAssistantReply("Connection issue. Please try again or check your internet.");
    } finally {
      setIsThinking(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    setTranscript(textInput);
    processQuestion(textInput);
    setTextInput("");
  };

  const handleRetry = () => {
    setErrorMessage("");
    if (transcript) {
      processQuestion(transcript);
    }
  };

  // Generate dynamic crop suggestion chips in farmer's preferred language
  const dynamicChips = language === "te"
    ? [
        "వరిలో ఆకుమచ్చ / బ్లాస్ట్ తెగులు నివారణ ఎలా?",
        "మొక్కజొన్నకు సరైన ఎరువుల మోతాదు ఎంత?",
        "టమోటా పైరుకు ఎప్పుడు నీరు పెట్టాలి?",
        "ప్రత్తిలో పురుగుల నివారణ ఎలా?"
      ]
    : language === "hi"
    ? [
        "धान में झुलसा (ब्लास्ट) रोग का इलाज क्या है?",
        "मक्का फसल के लिए उत्तम उर्वरक कौन सा है?",
        "टमाटर में सिंचाई कब करनी चाहिए?",
        "कपास में कीट नियंत्रण कैसे करें?"
      ]
    : language === "ta"
    ? [
        "நெல்லில் குலை நோய் கட்டுப்பாடு எப்படி?",
        "மக்காச்சோளத்திற்கான சிறந்த உரம் எது?",
        "தக்காளிக்கு எப்போது தண்ணீர் பாய்ச்ச வேண்டும்?"
      ]
    : language === "kn"
    ? [
        "ಭತ್ತದಲ್ಲಿ ಬೆಂಕಿ ರೋಗ ನಿಯಂತ್ರಣ ಹೇಗೆ?",
        "ಮೆಕ್ಕೆಜೋಳಕ್ಕೆ ಉತ್ತಮ ಗೊಬ್ಬರ ಯಾವುದು?",
        "ಟೊಮ್ಯಾಟೊ ಬೆಳೆಗೆ ಯಾವಾಗ ನೀರು ಹಾಕಬೇಕು?"
      ]
    : [
        "How to control Leaf Blast in Paddy?",
        "Best fertilizer for Maize crop?",
        "When to irrigate Tomato crop?",
        "How to prevent Pink Bollworm in Cotton?"
      ];

  return (
    <>
      {/* Floating In-App Assistant LEAF Button */}
      <div
        role="button"
        tabIndex={0}
        className={`fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-300/40 bg-gradient-to-r from-[#2f6b45] to-[#1d422a] text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${
          isListening ? "animate-pulse ring-8 ring-emerald-500/30" : ""
        }`}
        onClick={openAssistant}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openAssistant();
          }
        }}
        aria-label="Open AgroScan Leaf Voice Assistant"
      >
        <EditableFrame id="voice_assistant_floating_icon" className="h-10 w-10 rounded-full bg-transparent text-emerald-200">
          <Leaf size={28} className={isListening ? "text-emerald-300 animate-spin" : "text-emerald-200"} />
        </EditableFrame>
      </div>

      {/* Voice Assistant Overlay Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#dfe4d5] bg-[#fafaf7] p-6 shadow-2xl sm:p-8 space-y-4">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-[#e2e7d7] pb-4">
              <div className="flex items-center gap-3">
                <EditableFrame id="voice_assistant_drawer_icon" className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#2f6b45] to-[#1a3d27] text-emerald-300 shadow">
                  <Leaf size={24} />
                </EditableFrame>
                <div>
                  <h2 className="font-display text-xl font-bold text-[#1f3829] flex items-center gap-2">
                    {t("tool_voice_title")} <Sparkles size={16} className="text-amber-500" />
                  </h2>
                  <p className="text-xs font-semibold text-[#5a7362]">{t("voice_assistant_ready")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className="rounded-full p-2 text-[#466350] hover:bg-[#e6ebd9] cursor-pointer"
                  title={audioEnabled ? "Mute Synthetic Speech" : "Enable Synthetic Speech"}
                >
                  {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} className="text-red-500" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.speechSynthesis?.cancel();
                    setIsOpen(false);
                  }}
                  className="rounded-full p-2 text-[#466350] hover:bg-[#e6ebd9] cursor-pointer"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center justify-between rounded-xl border border-[#e5eadb] bg-[#f0f4ea] p-2.5">
              <span className="flex items-center gap-2 text-xs font-bold text-[#2f6b45]">
                <Globe size={15} /> {t("language_settings")}:
              </span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-lg border border-[#c9d4bd] bg-white px-2.5 py-1 text-xs font-bold text-[#1e3828] focus:outline-none focus:ring-2 focus:ring-[#2f6b45] cursor-pointer"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message with Retry */}
            {errorMessage && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-start gap-2">
                <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-amber-800">{errorMessage}</p>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="mt-1.5 inline-flex items-center gap-1 rounded-lg bg-amber-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-amber-700 cursor-pointer"
                  >
                    <RefreshCw size={10} /> Try Again
                  </button>
                </div>
              </div>
            )}

            {/* LEAF Voice Trigger Button */}
            <div className="my-4 flex flex-col items-center justify-center text-center">
              <button
                type="button"
                onClick={toggleListening}
                className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${
                  isListening
                    ? "bg-gradient-to-r from-emerald-600 to-teal-700 shadow-lg shadow-emerald-500/40 animate-pulse ring-8 ring-emerald-200"
                    : isThinking
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg shadow-amber-500/40"
                    : "bg-gradient-to-br from-[#2f6b45] to-[#1c3d28] shadow-lg shadow-[#2f6b45]/30 hover:scale-105"
                }`}
              >
                {isThinking ? (
                  <LoaderCircle size={38} className="text-white animate-spin" />
                ) : (
                  <Leaf size={42} className="text-emerald-200" />
                )}
              </button>

              <p className="mt-3 text-xs font-bold tracking-wider uppercase text-[#2f6b45]">
                {isListening
                  ? `🎙️ ${t("listening")} (${currentLangObj.name})`
                  : isThinking
                  ? `🧠 ${t("thinking")}`
                  : isSpeaking
                  ? `🔊 ${t("speaking")}`
                  : `🍃 ${t("tap_leaf_to_speak")}`}
              </p>

              {transcript && (
                <div className="mt-2 max-w-sm rounded-xl bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-900 border border-amber-200">
                  "{transcript}"
                </div>
              )}
            </div>

            {/* Assistant Reply Card */}
            <div className="rounded-2xl border border-[#d8e0cc] bg-white p-4 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#2f6b45] mb-1 flex items-center gap-1.5">
                <Leaf size={14} /> AgroScan Leaf AI Answer
              </p>
              <p className="text-xs font-medium leading-relaxed text-[#1d3527]">{assistantReply}</p>
            </div>

            {/* Dynamic Crop Suggestion Chips */}
            <div>
              <p className="text-xs font-bold text-[#56705d] mb-1.5 flex items-center gap-1">
                <HelpCircle size={13} /> Quick Crop Questions ({registeredCrops.length > 0 ? "From your registered crops" : "Popular"}):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {dynamicChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTranscript(chip);
                      processQuestion(chip);
                    }}
                    className="rounded-xl border border-[#e1e6d6] bg-white px-3 py-1.5 text-[11px] font-bold text-[#274633] hover:bg-[#eef4e6] hover:border-[#2f6b45] shadow-sm text-left cursor-pointer"
                  >
                    "{chip}"
                  </button>
                ))}
              </div>
            </div>

            {/* Type Question Input Fallback */}
            <form onSubmit={handleTextSubmit} className="flex gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={t("tap_leaf_to_speak")}
                className="flex-1 rounded-xl border border-[#d5ded0] bg-white px-3.5 py-2 text-xs font-semibold text-[#1c3827]"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#2f6b45] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#20492f] cursor-pointer"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
