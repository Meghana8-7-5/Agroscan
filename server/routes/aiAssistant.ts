import { Router } from "express";

const router = Router();

// ── Agriculture-focused system prompt for LLM integration ───────────────
const AGRICULTURE_SYSTEM_PROMPT = `You are AgroScan's expert agricultural advisor assistant for Indian farmers.

RULES:
- Respond ONLY about agriculture, crops, farming, pest/disease management, fertilizers, irrigation, weather impact on farming, soil health, and market prices for agricultural products.
- Be specific with dosages, timing, and product names when recommending treatments.
- Always include both organic and chemical treatment options when applicable.
- Respond in the language specified by the user's language preference.
- Keep responses concise (under 200 words) and actionable.
- If the question is not about farming, politely redirect to agricultural topics.
- Reference the farmer's registered crops and location when relevant.
- Use simple, farmer-friendly language — avoid complex scientific jargon.`;

// ── Optional LLM call (OpenAI or Gemini) with explicit 6s timeout ────────
async function callLLM(
  message: string,
  language: string,
  farmerName: string,
  cropsStr: string,
  locationStr: string,
): Promise<string | null> {
  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  const contextPrompt = `Farmer: ${farmerName}
Registered crops: ${cropsStr || "Not specified"}
Farm location: ${locationStr}
Preferred language: ${language}
Respond in the farmer's preferred language (language code: ${language}).

Farmer's question: ${message}`;

  // 1. Try OpenAI with explicit 6s timeout
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
        const data = (await res.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        const reply = data.choices?.[0]?.message?.content?.trim();
        if (reply) return reply;
      }
    } catch (err) {
      console.warn("[AI-ASSISTANT] OpenAI call timeout or error, falling back:", err);
    }
  }

  // 2. Try Google Gemini with explicit 6s timeout
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
        const data = (await res.json()) as {
          candidates?: Array<{
            content?: { parts?: Array<{ text?: string }> };
          }>;
        };
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (reply) return reply;
      }
    } catch (err) {
      console.warn("[AI-ASSISTANT] Gemini call timeout or error, falling back:", err);
    }
  }

  return null;
}

// ── Built-in agronomy rule engine fallback ──────────────────────────────
function getRuleBasedReply(message: string, language: string, farmerName: string): string {
  const lower = message.toLowerCase();

  // Pest / Disease queries
  if (lower.includes("blast") || lower.includes("blight") || lower.includes("fungus") || lower.includes("spots")) {
    if (language === "te") {
      return `నమస్తే ${farmerName}! ఆకుమచ్చ లేదా బ్లాస్ట్ తెగులు నివారణకు మాంకోజెబ్ (Mancozeb 75% WP @ 2 గ్రా/లీ) లేదా ట్రైసైక్లాజోల్ (Tricyclazole 75% WP @ 0.6 గ్రా/లీ) పిచికారీ చేయండి. సేంద్రీయ పద్ధతిలో ట్రైకోడెర్మా విరిడే లేదా వేప నూనె 10,000 ppm @ 2 మి.లీ/లీ వాడండి.`;
    }
    if (language === "hi") {
      return `नमस्ते ${farmerName}! पत्ती धब्बा या झुलसा (ब्लास्ट) रोग के लिए मैंकोजेब (Mancozeb 75% WP @ 2 ग्राम/ली) या ट्राइसाइक्लाजोल (0.6 ग्राम/ली) का छिड़काव करें। जैविक उपाय में नीम तेल (10,000 ppm @ 2 मिली/ली) का उपयोग करें।`;
    }
    if (language === "ta") {
      return `வணக்கம் ${farmerName}! இலைக்கருகல் அல்லது குலை நோய்க்கு மான்கோசெப் (Mancozeb 75% WP @ 2g/L) அல்லது டிரைசைக்ளசோல் (0.6g/L) தெளிக்கவும். இயற்கை முறையில் வேப்பெண்ணெய் (2ml/L) பயன்படுத்தவும்.`;
    }
    if (language === "kn") {
      return `ನಮಸ್ಕಾರ ${farmerName}! ಎಲೆ ಚುಕ್ಕೆ ಅಥವಾ ಬೆಂಕಿ ರೋಗ ನಿಯಂತ್ರಣಕ್ಕೆ ಮ್ಯಾಂಕೋಜೆಬ್ (2g/L) ಅಥವಾ ಟ್ರೈಸೈಕ್ಲಾಜೋಲ್ (0.6g/L) ಸಿಂಪಡಿಸಿ. ಸಾವಯವವಾಗಿ ಬೇವಿನ ಎಣ್ಣೆ (2ml/L) ಬಳಸಿ.`;
    }
    if (language === "mr") {
      return `नमस्कार ${farmerName}! करपा किंवा ब्लास्ट रोगाच्या नियंत्रणासाठी मॅनकोझेब (2 ग्रॅम/ली) किंवा ट्रायसायक्लॅझोल (0.6 ग्रॅम/ली) फवारा. सेंद्रिय नियंत्रणासाठी कडुनिंब तेल वापरा.`;
    }
    return `Hello ${farmerName}! For fungal leaf blast or blight spots, apply Mancozeb 75% WP @ 2g/L or Tricyclazole 75% WP @ 0.6g/L. For organic control, spray Neem Oil 10,000 ppm @ 2ml/L.`;
  }

  // Fertilizer / Nutrient queries
  if (lower.includes("fertilizer") || lower.includes("urea") || lower.includes("dap") || lower.includes("npk") || lower.includes("potash")) {
    if (language === "te") {
      return `ఎరువుల యాజమాన్యం: విత్తే సమయంలో బేసల్ డోస్‌గా DAP 50 కిలోలు + పొటాష్ 25 కిలోలు ఎకరాకు వేయండి. నాటిన 25 మరియు 45 రోజులలో యూరియా 25 కిలోలు చొప్పున వేయండి. వేప పూత పూసిన యూరియా వేయడం వల్ల నత్రజని నష్టం తగ్గుతుంది.`;
    }
    if (language === "hi") {
      return `उर्वरक प्रबंधन: बुवाई के समय बेसल खुराक के रूप में 50 किग्रा डीएपी + 25 किग्रा पोटाश प्रति एकड़ दें। 25 और 45 दिन बाद 25 किग्रा यूरिया की टॉप ड्रेसिंग करें।`;
    }
    if (language === "ta") {
      return `உர மேலாண்மை: விதைக்கும் போது டிஏபி 50 கிலோ + பொட்டாஷ் 25 கிலோ/ஏக்கர் இடவும். 25 மற்றும் 45 நாட்களில் 25 கிலோ யூரியா இடவும்.`;
    }
    if (language === "kn") {
      return `ಗೊಬ್ಬರ ನಿರ್ವಹಣೆ: ಬಿತ್ತನೆ ಸಮಯದಲ್ಲಿ ಡಿಎಪಿ 50 ಕೆಜಿ + ಪೊಟ್ಯಾಶ್ 25 ಕೆಜಿ/ಎಕರೆಗೆ ಹಾಕಿ. 25 ಮತ್ತು 45 ದಿನಗಳಲ್ಲಿ ಯೂರಿಯಾ 25 ಕೆಜಿ ಸಿಂಪಡಿಸಿ.`;
    }
    if (language === "mr") {
      return `खत व्यवस्थापन: पेरणीच्या वेळी 50 किलो डीएपी + 25 किलो पोटॅश प्रति एकर द्या. 25 आणि 45 दिवसांनी युरिया 25 किलो द्या.`;
    }
    return `Fertilizer schedule: Apply DAP 50 kg + MOP Potash 25 kg per acre as basal dose at sowing. Top dress with 25 kg Urea at 25 and 45 days after sowing.`;
  }

  // Sucking pests / Insects
  if (lower.includes("borer") || lower.includes("worm") || lower.includes("pest") || lower.includes("fly") || lower.includes("insect")) {
    if (language === "te") {
      return `కాండం తొలిచే పురుగు మరియు రసం పీల్చే పురుగుల నివారణకు క్లోరాంట్రానిలిప్రోల్ (Coragen @ 0.4 మి.లీ/లీ) లేదా ఇమిడాక్లోప్రిడ్ (0.5 మి.లీ/లీ) పిచికారీ చేయండి. పసుపు జిగురు అట్టలు ఎకరాకు 10 అమర్చండి.`;
    }
    if (language === "hi") {
      return `तना छेदक और रस चूसक कीटों के लिए कोराजन (Coragen @ 0.4 मिली/ली) या इमिडाक्लोप्रिड (0.5 मिली/ली) का छिड़काव करें। पीले चिपचिपे ट्रैप 10 प्रति एकड़ लगाएं।`;
    }
    if (language === "ta") {
      return `தண்டு துளைப்பான் மற்றும் பூச்சிகளுக்கு கோராசன் (0.4ml/L) அல்லது இமிடாக்ளோபிரிட் (0.5ml/L) தெளிக்கவும். மஞ்சள் ஒட்டும் பொறிகளை வைக்கவும்.`;
    }
    if (language === "kn") {
      return `ಕಾಂಡ ಕೊರೆಯುವ ಕೀಟಗಳಿಗೆ ಕೋರಾಜೆನ್ (0.4ml/L) ಅಥವಾ ಇಮಿಡಾಕ್ಲೋಪ್ರಿಡ್ (0.5ml/L) ಸಿಂಪಡಿಸಿ. ಹಳದಿ ಜಿಗುಟು ಬಲೆಗಳನ್ನು ಅಳವಡಿಸಿ.`;
    }
    if (language === "mr") {
      return `खोडकिडा आणि किडींसाठी कोराजेन (0.4 मिली/ली) किंवा इमिडाक्लोप्रिड फवारा. पिवळे चिकट सापळे लावा.`;
    }
    return `For stem borer and sucking pest management, spray Chlorantraniliprole (Coragen 18.5% SC @ 0.4ml/L) or Imidacloprid 17.8% SL @ 0.5ml/L. Install yellow sticky traps @ 10/acre.`;
  }

  // Irrigation queries
  if (lower.includes("water") || lower.includes("irrigation") || lower.includes("drainage")) {
    if (language === "te") {
      return `నీటి యాజమాన్యం: పైరు తొలిదశలో 2-3 సెం.మీ పలుచని నీరు నిలకడగా ఉంచండి. పూత మరియు గింజ పాలుపోసుకునే దశలో నేలలో తగినంత తేమ ఉండేలా చూసుకోండి. పొలంలో నీరు నిల్వ ఉండకుండా డ్రైనేజ్ సరిగ్గా ఉంచండి.`;
    }
    if (language === "hi") {
      return `सिंचाई प्रबंधन: प्रारंभिक अवस्था में 2-3 सेमी उथला पानी रखें। फूल आने और दाना भरने के समय पर्याप्त नमी बनाए रखें। खेत में जलभराव न होने दें।`;
    }
    if (language === "ta") {
      return `நீர்ப்பாசனம்: தொடக்க கட்டத்தில் 2-3 செ.மீ நீர் வைத்திருக்கவும். பூக்கும் மற்றும் கதிர் வரும் போது சரியான ஈரப்பதம் பராமரிக்கவும்.`;
    }
    if (language === "kn") {
      return `ನೀರಾವರಿ: ಆರಂಭಿಕ ಹಂತದಲ್ಲಿ 2-3 ಸೆಂ.ಮೀ ನೀರು ಇರಲಿ. ಹೂವಾಡುವ ಮತ್ತು ಕಾಳು ಕಟ್ಟುವ ಹಂತದಲ್ಲಿ ಮಣ್ಣಿನಲ್ಲಿ ತೇವಾಂಶ ಕಾಪಾಡಿಕೊಳ್ಳಿ.`;
    }
    if (language === "mr") {
      return `सिंचन व्यवस्थापन: सुरुवातीला 2-3 सेमी पाणी ठेवा. फुलोरा आणि दाणे भरण्याच्या काळात ओलावा टिकवून ठेवा.`;
    }
    return `Irrigation advice: Maintain shallow standing water (2-3 cm) in early tillering. Ensure adequate moisture during flowering and grain fill stages. Provide drainage channels to avoid waterlogging.`;
  }

  // Default helpful response
  if (language === "te") {
    return `నమస్తే ${farmerName}! మీ పంట రక్షణ, ఎరువుల మోతాదు, తెగుళ్ల నివారణ లేదా వాతావరణ సలహాల గురించి ఏదైనా అడగవచ్చు. ఉదాహరణకు: "వరిలో తెగుళ్ల నివారణ ఎలా?" అని అడగండి.`;
  }
  if (language === "hi") {
    return `नमस्ते ${farmerName}! आप अपनी फसल सुरक्षा, खाद की खुराक, कीट नियंत्रण या मौसम संबंधी सलाह के बारे में पूछ सकते हैं। उदाहरण: "धान में झुलसा रोग का इलाज क्या है?"`;
  }
  if (language === "ta") {
    return `வணக்கம் ${farmerName}! உங்கள் பயிர் பாதுகாப்பு, உர அளவு, பூச்சி கட்டுப்பாடு அல்லது வானிலை ஆலோசனை பற்றி கேட்கலாம்.`;
  }
  if (language === "kn") {
    return `ನಮಸ್ಕಾರ ${farmerName}! ನಿಮ್ಮ ಬೆಳೆ ರಕ್ಷಣೆ, ಗೊಬ್ಬರದ ಪ್ರಮಾಣ, ಕೀಟ ನಿಯಂತ್ರಣ ಅಥವಾ ಹವಾಮಾನ ಸಲಹೆಗಳ ಬಗ್ಗೆ ನೀವು ಕೇಳಬಹುದು.`;
  }
  if (language === "mr") {
    return `नमस्कार ${farmerName}! तुम्ही पीक संरक्षण, खतांचे प्रमाण, कीड नियंत्रण किंवा हवामान सल्ल्याबद्दल विचारू शकता.`;
  }
  return `Hello ${farmerName}! You can ask me about crop protection, fertilizer dosage, disease treatments, or irrigation advice. For example: "How to prevent blast in Paddy?" or "Best fertilizer for Tomato?"`;
}

// ── POST /api/ai/chat ───────────────────────────────────────────────────
router.post("/chat", async (req, res) => {
  try {
    const {
      message,
      language = "en",
      farmerName = "Farmer",
      registeredCrops = [],
      location = "Andhra Pradesh",
    } = req.body as {
      message?: string;
      language?: string;
      farmerName?: string;
      registeredCrops?: string[];
      location?: string;
    };

    if (!message || typeof message !== "string" || !message.trim()) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const cropsStr = Array.isArray(registeredCrops) ? registeredCrops.join(", ") : "";

    // 1. Try LLM first (with 6s timeout guard)
    let reply = await callLLM(message.trim(), language, farmerName, cropsStr, location);

    // 2. Fall back to expert agronomy rule engine if LLM is unavailable or timed out
    if (!reply) {
      reply = getRuleBasedReply(message.trim(), language, farmerName);
    }

    res.json({
      success: true,
      reply,
      language,
    });
  } catch (error: any) {
    console.error("[AI-CHAT] Error:", error);
    res.status(200).json({
      success: true,
      reply: getRuleBasedReply(req.body?.message || "", req.body?.language || "en", req.body?.farmerName || "Farmer"),
      language: req.body?.language || "en",
    });
  }
});

export default router;
