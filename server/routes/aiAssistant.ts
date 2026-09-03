import { Router } from "express";

const router = Router();

// Language auto-detection helper
export function detectLanguageFromText(text: string, fallback: string = "en"): string {
  if (!text || !text.trim()) return fallback;

  // Unicode character range checks for Indian scripts
  if (/[\u0C00-\u0C7F]/.test(text)) return "te"; // Telugu
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta"; // Tamil
  if (/[\u0C80-\u0CFF]/.test(text)) return "kn"; // Kannada
  if (/[\u0D00-\u0D7F]/.test(text)) return "ml"; // Malayalam
  if (/[\u0980-\u09FF]/.test(text)) return "bn"; // Bengali
  if (/[\u0A80-\u0AFF]/.test(text)) return "gu"; // Gujarati
  if (/[\u0A00-\u0A7F]/.test(text)) return "pa"; // Punjabi / Gurmukhi

  // Devanagari could be Hindi or Marathi
  if (/[\u0900-\u097F]/.test(text)) {
    if (/\b(माझे|शेत|पीक|आहे|नाही|कसे|सांगा)\b/i.test(text)) return "mr";
    return "hi";
  }

  // Transliterated romanized Telugu keywords
  if (/\b(panta|purugu|aaku|pasupu|mandu|neellu|varsham|rythu|chelu|rogam|mokka)\b/i.test(text)) {
    return "te";
  }

  // Transliterated romanized Hindi keywords
  if (/\b(khet|kisaan|paani|baat|dawa|rog|keeda|khad|gehun|chawal|tamatar)\b/i.test(text)) {
    return "hi";
  }

  return fallback;
}

const AGRICULTURE_SYSTEM_PROMPT = `You are AgroScan's expert agricultural advisor assistant for Indian farmers.

RULES:
- Respond ONLY about agriculture, crops, farming, pest/disease management, fertilizers, irrigation, weather impact on farming, soil health, government farmer schemes, and market prices for agricultural products.
- Be specific with dosages, timing, and product names when recommending treatments.
- Always include both organic and chemical treatment options when applicable.
- CRITICAL: Respond in the EXACT language of the user's question (if they asked in Telugu, answer in Telugu; if in Hindi, answer in Hindi; if in Tamil, answer in Tamil, etc.).
- Keep responses concise (under 200 words), warm, and actionable.
- If the question is not about farming or rural livelihood, politely redirect to agricultural topics.
- Use simple, farmer-friendly language.`;

async function callLLM(
  message: string,
  targetLang: string,
  farmerName: string,
  cropsStr: string,
  locationStr: string,
): Promise<string | null> {
  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  const contextPrompt = `Farmer: ${farmerName}
Registered crops: ${cropsStr || "Not specified"}
Farm location: ${locationStr}
Target Response Language: ${targetLang}

Farmer's query: ${message}

Please provide an immediate, practical agronomic response in the target language (${targetLang}).`;

  // 1. Try OpenAI (6s timeout)
  if (openaiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages: [
            { role: "system", content: AGRICULTURE_SYSTEM_PROMPT },
            { role: "user", content: contextPrompt },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(6000),
      });

      if (res.ok) {
        const data = (await res.json()) as any;
        const reply = data.choices?.[0]?.message?.content?.trim();
        if (reply) return reply;
      }
    } catch (err) {
      console.warn("[AI-ASSISTANT] OpenAI call timeout or error, falling back:", err);
    }
  }

  // 2. Try Google Gemini (6s timeout)
  if (geminiKey) {
    try {
      const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: AGRICULTURE_SYSTEM_PROMPT }] },
          contents: [{ parts: [{ text: contextPrompt }] }],
          generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
        }),
        signal: AbortSignal.timeout(6000),
      });

      if (res.ok) {
        const data = (await res.json()) as any;
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (reply) return reply;
      }
    } catch (err) {
      console.warn("[AI-ASSISTANT] Gemini call timeout or error, falling back:", err);
    }
  }

  return null;
}

// Multilingual Rule-Based Agricultural Expert Engine
function getRuleBasedAgronomyResponse(queryText: string, lang: string, cropName?: string): string {
  const q = queryText.toLowerCase();

  // 1. Blast / Fungal Leaf Spots
  if (q.includes("blast") || q.includes("మచ్చ") || q.includes("blight") || q.includes("धब्बा") || q.includes("fungus")) {
    if (lang === "te") {
      return "వరి/పంటలో అగ్గి తెగులు లేదా ఆకు మచ్చలకు సిఫార్సు:\n1. సేంద్రీయ పద్ధతి: సూడోమోనాస్ ఫ్లోరోసెన్స్ 5 గ్రాములు లీటరు నీటికి కలిపి పిచికారీ చేయండి.\n2. రసాయన మందు: ట్రైసైక్లాజోల్ 75% WP (బీమ్) 0.6 గ్రా/లీటరు లేదా కాసుగామైసిన్ 1.5 మి.లీ/లీటరు పిచికారీ చేయండి.\n3. యూరియా (నత్రజని) వాడకాన్ని తగ్గించండి.";
    }
    if (lang === "hi") {
      return "झुलसा / पत्ती धब्बा रोग नियंत्रण:\n1. जैविक उपचार: स्यूडोमोनास फ्लोरोसेंस @ 5 ग्राम/लीटर का छिड़काव करें।\n2. रासायनिक उपचार: ट्राइसाइक्लाजोल 75% WP @ 0.6 ग्राम/लीटर या कासुगामाइसिन @ 1.5 मिली/लीटर का छिड़काव करें।\n3. अत्यधिक यूरिया का प्रयोग रोकें।";
    }
    return "For leaf blast and fungal blight spots:\n1. Organic: Foliar spray of Pseudomonas fluorescens @ 5g/L or Trichoderma viride @ 5g/L.\n2. Chemical: Spray Tricyclazole 75% WP @ 0.6g/L or Kasugamycin @ 1.5ml/L.\n3. Avoid excess nitrogen (Urea) application during active infection.";
  }

  // 2. Yellow Leaves / Chlorosis / Micronutrients
  if (q.includes("yellow") || q.includes("పసుపు") || q.includes("పీలా") || q.includes("chlorosis") || q.includes("मंजळ")) {
    if (lang === "te") {
      return "ఆకులు పసుపు రంగులోకి మారడానికి నివారణ:\n1. జింక్ లోపం ఉంటే: జింక్ సల్ఫేట్ 21% (2 గ్రా/లీటరు) లేదా చీలేటెడ్ జింక్ 1 గ్రా/లీటరు పిచికారీ చేయండి.\n2. ఇనుము లోపం ఉంటే: ఫెర్రస్ సల్ఫేట్ 5 గ్రా + నిమ్మ ఉప్పు 1 గ్రా లీటరు నీటికి కలపండి.\n3. వేరు పురుగు ఉంటే క్లోరిపైరిఫాస్ 2.5 మి.లీ/లీటరుతో పాదులు తడపండి.";
    }
    if (lang === "hi") {
      return "पत्तियों का पीलापन दूर करने के उपाय:\n1. जिंक की कमी: जिंक सल्फेट 21% @ 2 ग्राम/लीटर का छिड़काव करें।\n2. लोहे की कमी: फेरस सल्फेट 5 ग्राम + 1 ग्राम साइट्रिक एसिड प्रति लीटर पानी में मिलाकर छिड़कें।\n3. जड़ों में जलभराव न होने दें।";
    }
    return "For yellowing leaves (Chlorosis / Nutrient deficiency):\n1. Zinc deficiency: Spray Zinc Sulphate 21% @ 2g/L or Chelated Zinc @ 1g/L.\n2. Iron deficiency: Spray Ferrous Sulphate 5g + 1g Citric Acid per liter.\n3. Ensure proper root aeration and avoid water stagnation.";
  }

  // 3. Sucking Pests / Aphids / Thrips / Whiteflies
  if (q.includes("pest") || q.includes("పురుగు") || q.includes("कीट") || q.includes("thrips") || q.includes("aphid") || q.includes("worm") || q.includes("curling")) {
    if (lang === "te") {
      return "రసం పీల్చే పురుగులు మరియు పేనుబంక నివారణ:\n1. సేంద్రీయ పద్ధతి: వేపనూనె 10,000 ppm 2-3 మి.లీ/లీటరు లేదా పసుపు/నీలం జిగురు అట్టలు (ఎకరానికి 12) పెట్టండి.\n2. రసాయన మందు: ఎసిటామిప్రిడ్ 20% SP 0.2 గ్రా/లీటరు లేదా ఇమిడాక్లోప్రిడ్ 17.8% SL 0.5 మి.లీ/లీటరు ఆకుల అడుగుభాగంలో పిచికారీ చేయండి.";
    }
    if (lang === "hi") {
      return "रस चूसक कीट व माहू/थ्रिप्स नियंत्रण:\n1. जैविक: नीम का तेल 10,000 ppm @ 3 मिली/लीटर या पीले चिपचिपे ट्रैप (12 प्रति एकड़) लगाएं।\n2. रासायनिक: एसिटामिप्रिड 20% SP @ 0.2 ग्राम/लीटर या इमिडाक्लोप्रिड 17.8% SL @ 0.5 मिली/लीटर का छिड़काव करें।";
    }
    return "For sucking pests (Aphids, Thrips, Whitefly):\n1. Organic: Neem Oil 10,000 ppm @ 3ml/L and install 12 yellow sticky traps per acre.\n2. Chemical: Spray Acetamiprid 20% SP @ 0.2g/L or Imidacloprid 17.8% SL @ 0.5ml/L targeting undersides of leaves.";
  }

  // 4. Fertilizer / Nutrition Guidance
  if (q.includes("fertilizer") || q.includes("ఎరువు") || q.includes("खाद") || q.includes("urea") || q.includes("dap") || q.includes("potash")) {
    if (lang === "te") {
      return "పోషక యాజమాన్యం:\n1. ప్రాథమిక మోతాదు: నాట్లకు ముందు ఎకరానికి 50 కిలోల DAP + 25 కిలోల పొటాష్ వేయండి.\n2. పైపాటుగా: దుబ్బు చేసే దశలో 25 కిలోల యూరియాను 3 విడతలుగా వేయండి.\n3. పూత మరియు కాయ దశలో 19:19:19 లేదా 0:52:34 స్ప్రే చేయండి.";
    }
    if (lang === "hi") {
      return "संतुलित पोषण प्रबंधन:\n1. बुवाई के समय: 50 किग्रा DAP + 25 किग्रा पोटाश प्रति एकड़ दें।\n2. बढ़वार के समय: 25 किग्रा यूरिया को 2-3 बार में विभाजित करके दें।\n3. फूल और फल बनने के समय 19:19:19 पानी में घुलनशील खाद 5 ग्राम/लीटर स्प्रे करें।";
    }
    return "Balanced Crop Nutrition Schedule:\n1. Basal dose: 50 kg DAP + 25 kg MOP Potash per acre at land preparation.\n2. Top dressing: Split Urea application into 2-3 equal doses at tillering and vegetative peak.\n3. Foliar booster: Spray 19:19:19 @ 5g/L during early vegetative and panicle initiation stages.";
  }

  // 5. Default General Agronomic Welcome
  if (lang === "te") {
    return `నమస్కారం! నేను మీ ఆగ్రోస్కాన్ స్మార్ట్ వ్యవసాయ సలహాదారుని. మీ ${cropName || "పంట"} సంరక్షణ, ఎరువుల మోతాదులు, తెగుళ్ల నివారణ లేదా వాతావరణ సలహాల గురించి ఏదైనా అడగవచ్చు.`;
  }
  if (lang === "hi") {
    return `नमस्ते! मैं आपका एग्रोस्कैन कृषि सलाहकार हूँ। आप अपनी ${cropName || "फसल"} की देखभाल, खाद की मात्रा, कीट नियंत्रण या मौसम के प्रभाव के बारे में कोई भी प्रश्न पूछ सकते हैं।`;
  }
  return `Hello! I am your AgroScan agricultural advisor. You can ask me about crop care for your ${cropName || "farm"}, pest & disease treatments, fertilizer dosage, or weather advisories.`;
}

// ── Unified Handler for AI Advisory Queries (/ask, /chat, /) ───────────
async function handleAiQuery(req: any, res: any) {
  try {
    const {
      message,
      language: userPrefLang = "en",
      farmerName = "Farmer",
      crops = [],
      registeredCrops = [],
      location = "Andhra Pradesh",
    } = req.body as {
      message?: string;
      language?: string;
      farmerName?: string;
      crops?: string[];
      registeredCrops?: string[];
      location?: string;
    };

    if (!message || !message.trim()) {
      res.status(400).json({ error: "Message cannot be empty." });
      return;
    }

    const trimmedMessage = message.trim();
    const effectiveCrops = registeredCrops.length > 0 ? registeredCrops : crops;
    const detectedLang = detectLanguageFromText(trimmedMessage, userPrefLang);
    const cropsStr = Array.isArray(effectiveCrops) ? effectiveCrops.join(", ") : String(effectiveCrops || "");
    const primaryCrop = Array.isArray(effectiveCrops) && effectiveCrops.length > 0 ? effectiveCrops[0] : undefined;

    console.log(`[AI-ASSISTANT] Incoming query: "${trimmedMessage.slice(0, 50)}..." (prefLang=${userPrefLang}, detectedLang=${detectedLang})`);

    // 1. Try real LLM with target language
    let answer = await callLLM(trimmedMessage, detectedLang, farmerName, cropsStr, location);

    // 2. Fallback to expert agronomic engine
    if (!answer) {
      answer = getRuleBasedAgronomyResponse(trimmedMessage, detectedLang, primaryCrop);
    }

    res.json({
      success: true,
      reply: answer,
      answer,
      detectedLanguage: detectedLang,
      language: detectedLang,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[AI-ASSISTANT] Error:", error);
    // Return graceful fallback rather than failing
    res.json({
      success: true,
      reply: "I am ready to assist with your farm queries. Please ask about pest control, fertilizer dosages, or irrigation scheduling.",
      answer: "I am ready to assist with your farm queries. Please ask about pest control, fertilizer dosages, or irrigation scheduling.",
      detectedLanguage: "en",
      language: "en",
      timestamp: new Date().toISOString(),
    });
  }
}

// Support both /ask and /chat routes
router.post("/ask", handleAiQuery);
router.post("/chat", handleAiQuery);
router.post("/", handleAiQuery);

export default router;
