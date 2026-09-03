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

  // Natural synthetic voice selection for all supported Indic & English languages
  const selectSyntheticVoice = useCallback((speechCode: string): SpeechSynthesisVoice | null => {
    if (availableVoices.length === 0) return null;
    const targetCode = speechCode.toLowerCase();
    const codePrefix = targetCode.split("-")[0];

    // 1. Exact match (e.g. te-IN, hi-IN, ta-IN, kn-IN, mr-IN, en-IN)
    const exactMatch = availableVoices.find((v) => v.lang.toLowerCase().replace("_", "-") === targetCode);
    if (exactMatch) return exactMatch;

    // 2. Prefix match (e.g. te, hi, ta, kn, mr, pa, bn, gu, ml)
    const matching = availableVoices.filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith(codePrefix));
    const natural = matching.find((v) =>
      v.name.toLowerCase().includes("natural") ||
      v.name.toLowerCase().includes("neural") ||
      v.name.toLowerCase().includes("google") ||
      v.name.toLowerCase().includes("india")
    );
    return natural || matching[0] || null;
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

  // Web Speech STT Setup with Full Barge-In / Interrupt Handling
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = currentLangObj.speechCode;

      // Barge-in: immediately cut off TTS playback as soon as user starts speaking
      const handleUserSpeechStart = () => {
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
      };

      recognition.onstart = () => {
        handleUserSpeechStart();
        setIsListening(true);
        setTranscript("");
        setErrorMessage("");
      };

      if ("onspeechstart" in recognition) {
        recognition.onspeechstart = handleUserSpeechStart;
      }
      if ("onsoundstart" in recognition) {
        recognition.onsoundstart = handleUserSpeechStart;
      }

      recognition.onresult = (event: any) => {
        handleUserSpeechStart();
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
    // Barge-in: stop any playing speech when mic is pressed
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
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

  // ═══════════════════════════════════════════════════════════════════════════
  // ALL 11 DASHBOARD FEATURE ROUTES & MULTILINGUAL VOICE INTENT REGISTRY
  // ═══════════════════════════════════════════════════════════════════════════
  const NAVIGATION_INTENTS: Array<{
    route: string;
    keywords: string[];
    replies: Record<string, string>;
  }> = [
    {
      route: "/detection",
      keywords: ["scan", "scanner", "disease", "pest", "leaf", "plant diagnosis", "diagnosis", "ఆకు", "స్కాన్", "తెగులు", "రోగం", "రోగ", "పత్తి", "पत्ती", "रोग", "स्कैन", "कीट", "நோய்", "ஸ்கேன்", "ರೋಗ", "ಎಲೆ"],
      replies: {
        en: "Navigating to Plant & Disease Scanner. Show me a leaf photo to diagnose.",
        te: "ఆకు తెగుళ్లు & పురుగుల స్కానర్‌ను తెరుస్తున్నాను. విశ్లేషణకు ఆకు ఫోటోను చూపించండి.",
        hi: "पौधा व रोग स्कैनर खोल रहा हूँ। निदान के लिए पत्ती की फोटो दिखाएं।",
        ta: "பயிர் மற்றும் நோய் ஸ்கேனரைத் திறக்கிறேன். இலையைக் காட்டவும்.",
        kn: "ಬೆಳೆ ಮತ್ತು ರೋಗ ಸ್ಕ್ಯಾನರ್ ತೆರೆಯುತ್ತಿದ್ದೇನೆ. ಎಲೆಯ ಫೋಟೋ ತೋರಿಸಿ.",
      },
    },
    {
      route: "/soil-recommendation",
      keywords: ["soil", "soil test", "soil recommender", "recommend crop", "soil analysis", "fertilizer test", "భూమి", "నేల", "మట్టి", "సాయిల్", "మిట్టి", "मिट्टी", "मृदा", "मृदा परीक्षण", "मண்", "ಮಣ್ಣು", "ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ"],
      replies: {
        en: "Opening Soil Crop Recommender for optimal crop and nutrient selection.",
        te: "నేల పరీక్ష & అనువైన పంటల సిఫార్సు విభాగాన్ని తెరుస్తున్నాను.",
        hi: "मिट्टी परीक्षण और फसल सिफारिश पृष्ठ खोल रहा हूँ।",
        ta: "மண் பரிசோதனை மற்றும் பயிர் பரிந்துரை பக்கத்தைத் திறக்கிறேன்.",
        kn: "ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮತ್ತು ಬೆಳೆ ಶಿಫಾರಸು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.",
      },
    },
    {
      route: "/stores",
      keywords: ["store", "stores", "market", "dealer", "shop", "shops", "fertilizer shop", "pesticide store", "షాప్", "దుకాణం", "మార్కెట్", "మందుల షాప్", "दुकान", "बाजार", "खाद की दुकान", "கடை", "அங்காடி", "ಅಂಗಡಿ"],
      replies: {
        en: `Opening Market & Store locator for ${location.villageCity}.`,
        te: `${location.villageCity} సమీపంలోని ఎరువులు మరియు పురుగుమందుల దుకాణాల వివరాలను తెరుస్తున్నాను.`,
        hi: `${location.villageCity} के नजदीकी कृषि दुकानों की सूची खोल रहा हूँ।`,
        ta: `${location.villageCity} அருகிலுள்ள வேளாண் கடைகளைத் திறக்கிறேன்.`,
        kn: `${location.villageCity} ಹತ್ತಿರದ ಕೃಷಿ ಅಂಗಡಿಗಳ ಪಟ್ಟಿ ತೆರೆಯುತ್ತಿದ್ದೇನೆ.`,
      },
    },
    {
      route: "/weather",
      keywords: ["weather", "rain", "forecast", "climate", "temperature", "spray weather", "వాతావరణం", "వర్షం", "ఎండ", "मौसम", "बारिश", "तापमान", "வானிலை", "மழை", "ಹವಾಮಾನ", "ಮಳೆ"],
      replies: {
        en: `Opening Live Weather Analysis and Spray Forecast for ${location.villageCity}.`,
        te: `${location.villageCity} లైవ్ వాతావరణం మరియు మందుల పిచికారీ సూచనలను తెరుస్తున్నాను.`,
        hi: `${location.villageCity} का लाइव मौसम और छिड़काव पूर्वानुमान खोल रहा हूँ।`,
        ta: `${location.villageCity} நேரடி வானிலை மற்றும் தெளிப்பு முன்னறிவிப்பைத் திறக்கிறேன்.`,
        kn: `${location.villageCity} ಹವಾಮಾನ ಮತ್ತು ಸಿಂಪಡಣೆ ಮುನ್ಸೂಚನೆ ತೆರೆಯುತ್ತಿದ್ದೇನೆ.`,
      },
    },
    {
      route: "/crop-registration",
      keywords: ["register", "registration", "add crop", "new crop", "enroll crop", "crop registration", "నమోదు", "కొత్త పంట", "పంట నమోదు", "पंजीकरण", "नई फसल", "फसल जोड़ें", "பதிவு", "புதிய பயிர்", "ನೋಂದಣಿ"],
      replies: {
        en: "Opening Crop Registration desk to register your new crop field.",
        te: "కొత్త పంట నమోదు విభాగాన్ని తెరుస్తున్నాను.",
        hi: "नया फसल पंजीकरण पृष्ठ खोल रहा हूँ।",
        ta: "புதிய பயிர் பதிவு பக்கத்தைத் திறக்கிறேன்.",
        kn: "ಹೊಸ ಬೆಳೆ ನೋಂದಣಿ ಪುಟ ತೆರೆಯುತ್ತಿದ್ದೇನೆ.",
      },
    },
    {
      route: "/crop-plan",
      keywords: ["my crops", "crop plan", "plan", "calendar", "schedule", "fertilizer schedule", "spray schedule", "నా పంటలు", "పంట ప్లాన్", "షెడ్యూల్", "క్యాలెండర్", "मेरी फसलें", "फसल योजना", "कैलेंडर", "பயிர் திட்டம்", "ನನ್ನ ಬೆಳೆ"],
      replies: {
        en: "Opening your personalized My Crops and Farm Planning calendar.",
        te: "మీ పంటల ప్రణాళిక మరియు దశల వారీ షెడ్యూల్‌ను తెరుస్తున్నాను.",
        hi: "आपकी फसल योजना और देखभाल कैलेंडर खोल रहा हूँ।",
        ta: "உங்கள் பயிர் பராமரிப்பு திட்டத்தைத் திறக்கிறேன்.",
        kn: "ನಿಮ್ಮ ಬೆಳೆ ಯೋಜನೆ ಮತ್ತು ಆರೈಕೆ ವೇಳಾಪಟ್ಟಿ ತೆರೆಯುತ್ತಿದ್ದೇನೆ.",
      },
    },
    {
      route: "/knowledge-base",
      keywords: ["knowledge", "knowledge base", "guide", "crops list", "encyclopedia", "library", "37 crop", "విజ్ఞానం", "పంటల సమాచారం", "పుస్తకం", "జ్ఞానం", "ज्ञान", "फसल जानकारी", "कृषि ज्ञान", "அறிவுக்களஞ்சியம்", "ಜ್ಞಾನ ಭಂಡಾರ"],
      replies: {
        en: "Opening 37-Crop Agricultural Knowledge Base.",
        te: "37 ప్రధాన పంటల సమగ్ర వ్యవసాయ విజ్ఞాన విభాగాన్ని తెరుస్తున్నాను.",
        hi: "37 फसलों का संपूर्ण कृषि ज्ञानकोश खोल रहा हूँ।",
        ta: "37 பயிர்களின் வேளாண் அறிவுக்களஞ்சியத்தைத் திறக்கிறேன்.",
        kn: "37 ಬೆಳೆಗಳ ಸಮಗ್ರ ಕೃಷಿ ಜ್ಞಾನ ಭಂಡಾರ ತೆರೆಯುತ್ತಿದ್ದೇನೆ.",
      },
    },
    {
      route: "/notifications",
      keywords: ["notification", "notifications", "alert", "alerts", "updates", "నోటిఫికేషన్", "హెచ్చరిక", "సందేశాలు", "సూచనలు", "सूचना", "अलर्ट", "संदेश", "அறிவிப்பு", "எச்சரிக்கை", "ತಿಳುವಳಿಕೆ"],
      replies: {
        en: "Opening your Notifications & Agricultural Alert Center.",
        te: "మీ పంట హెచ్చరికలు మరియు నోటిఫికేషన్ల విభాగాన్ని తెరుస్తున్నాను.",
        hi: "आपकी सूचनाएं और कृषि अलर्ट पृष्ठ खोल रहा हूँ।",
        ta: "உங்கள் அறிவிப்புகள் மற்றும் எச்சரிக்கைப் பக்கத்தைத் திறக்கிறேன்.",
        kn: "ನಿಮ್ಮ ಕೃಷಿ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಅಧಿಸೂಚನೆಗಳು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.",
      },
    },
    {
      route: "/help-desk",
      keywords: ["help", "support", "helpdesk", "officer", "agronomist", "complaint", "ticket", "call officer", "సహాయం", "హెల్ప్‌డెస్క్", "అధికారి", "ఫిర్యాదు", "మద్దతు", "मदद", "सहयोग", "अधिकारी", "हेल्पडेस्क", "शिकायत", "உதவி", "ಸಹಾಯ"],
      replies: {
        en: "Opening Agronomist Help Desk & Support Center.",
        te: "వ్యవసాయ శాస్త్రవేత్తల హెల్ప్‌డెస్క్ మరియు మద్దతు విభాగాన్ని తెరుస్తున్నాను.",
        hi: "कृषि विशेषज्ञ हेल्पडेस्क और सहायता केंद्र खोल रहा हूँ।",
        ta: "வேளாண் நிபுணர் உதவி மையத்தைத் திறக்கிறேன்.",
        kn: "ಕೃಷಿ ತಜ್ಞರ ಸಹಾಯ ಕೇಂದ್ರ ತೆರೆಯುತ್ತಿದ್ದೇನೆ.",
      },
    },
    {
      route: "/dashboard",
      keywords: ["dashboard", "home", "main screen", "control desk", "హోమ్", "డాష్‌బోర్డ్", "డెస్క్", "होम", "डैशबोर्ड", "முக்கிய பக்கம்", "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್"],
      replies: {
        en: "Navigating to your Farm Control Dashboard.",
        te: "మీ ఫార్మ్ కంట్రోల్ డాష్‌బోర్డ్‌కు వెళ్తున్నాను.",
        hi: "आपके मुख्य फार्म डैशबोर्ड पर जा रहा हूँ।",
        ta: "உங்கள் முக்கிய கட்டுப்பாட்டுப் பக்கத்திற்கு செல்கிறேன்.",
        kn: "ಮುಖ್ಯ ಕೃಷಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹೋಗುತ್ತಿದ್ದೇನೆ.",
      },
    },
  ];

  // Process user input (Speech or Typed) via LLM backend route
  const processQuestion = async (queryText: string) => {
    if (!queryText.trim()) return;
    setErrorMessage("");
    const text = queryText.toLowerCase().trim();

    // Check generic navigation intent across all 11 features
    const matchedIntent = NAVIGATION_INTENTS.find((intent) =>
      intent.keywords.some((kw) => text.includes(kw.toLowerCase()))
    );

    if (matchedIntent) {
      const reply = matchedIntent.replies[language] || matchedIntent.replies.en;
      setAssistantReply(reply);
      speakText(reply);
      setTimeout(() => {
        setPageLocation(matchedIntent.route);
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

      const reply = data?.reply || data?.answer;
      if (reply) {
        setAssistantReply(reply);
        speakText(reply);
      }
    } catch (err) {
      console.warn("AI advisory call failed, providing local agricultural fallback:", err);
      const fallbackReplies: Record<string, string> = {
        te: "నేను మీ ఆగ్రోస్కాన్ వ్యవసాయ సలహాదారుని. పంట సంరక్షణ, ఎరువుల మోతాదు లేదా తెగుళ్ల నివారణ గురించి అడగండి.",
        hi: "मैं आपका एग्रोस्कैन कृषि सलाहकार हूँ। फसल सुरक्षा, खाद या कीट नियंत्रण के बारे में पूछें।",
        ta: "நான் உங்கள் அக்ரோஸ்கேன் வேளாண் ஆலோசகர். பயிர் பாதுகாப்பு மற்றும் உரங்களைப் பற்றி கேளுங்கள்.",
        kn: "ನಾನು ನಿಮ್ಮ ಆಗ್ರೋಸ್ಕ್ಯಾನ್ ಕೃಷಿ ಸಲಹೆಗಾರ. ಬೆಳೆ ರಕ್ಷಣೆ ಮತ್ತು ರಸಗೊಬ್ಬರದ ಬಗ್ಗೆ ಕೇಳಿ.",
        mr: "मी तुमचा कृषी सल्लागार आहे. पीक संरक्षण, खतांचे प्रमाण किंवा कीड नियंत्रणाबद्दल विचारा.",
        pa: "ਮੈਂ ਤੁਹਾਡਾ ਖੇਤੀਬਾੜੀ ਸਲਾਹਕਾਰ ਹਾਂ। ਫਸਲ ਸੁਰੱਖਿਆ ਅਤੇ ਖਾਦ ਬਾਰੇ ਪੁੱਛੋ।",
        bn: "আমি আপনার কৃষি উপদেষ্টা। ফসল সুরক্ষা এবং সার সম্পর্কে জিজ্ঞাসা করুন।",
        gu: "હું તમારો કૃષિ સલાહકાર છું. પાક સંરક્ષણ અને ખાતર વિશે પૂછો.",
        ml: "ഞാൻ നിങ്ങളുടെ കാർഷിക ഉപദേഷ്ടാവാണ്. വിള സംരക്ഷണത്തെക്കുറിച്ച് ചോദിക്കുക.",
        en: "I am your AgroScan agricultural advisor. Please ask about crop protection, fertilizer dosage, or pest management.",
      };
      const fallback = fallbackReplies[language] || fallbackReplies.en;
      setAssistantReply(fallback);
      speakText(fallback);
      setErrorMessage("Advisory engine momentarily busy. Provided offline agronomic advice.");
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
