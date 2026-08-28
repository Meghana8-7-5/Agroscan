export interface Language {
  code: string;
  name: string;
  nativeName: string;
  speechCode: string;
}

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", speechCode: "en-IN" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", speechCode: "te-IN" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", speechCode: "hi-IN" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", speechCode: "ta-IN" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", speechCode: "kn-IN" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", speechCode: "mr-IN" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", speechCode: "pa-IN" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", speechCode: "bn-IN" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", speechCode: "gu-IN" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", speechCode: "ml-IN" },
];

export type TranslationKeys =
  | "app_name"
  | "dashboard"
  | "scan_leaf"
  | "my_crops"
  | "stores_near_me"
  | "knowledge_base"
  | "weather"
  | "notifications"
  | "soil_recommender"
  | "register_crop"
  | "help_desk"
  | "language_settings"
  | "welcome_farmer"
  | "voice_kicker"
  | "voice_assistant_ready"
  | "tap_leaf_to_speak"
  | "listening"
  | "thinking"
  | "speaking"
  | "auto_greeting"
  | "farm_location"
  | "gps_live"
  | "change_location"
  | "refresh_location"
  | "edit_mode"
  | "exit_edit_mode"
  | "preview_as_farmer"
  | "reset_layout"
  | "admin_portal"
  | "save_layout"
  | "tool_scan_title"
  | "tool_scan_desc"
  | "tool_stores_title"
  | "tool_stores_desc"
  | "tool_weather_title"
  | "tool_weather_desc"
  | "tool_soil_title"
  | "tool_soil_desc"
  | "tool_kb_title"
  | "tool_kb_desc"
  | "tool_plan_title"
  | "tool_plan_desc"
  | "tool_reg_title"
  | "tool_reg_desc"
  | "tool_notif_title"
  | "tool_notif_desc"
  | "tool_voice_title"
  | "tool_voice_desc"
  | "tool_help_title"
  | "tool_help_desc"
  | "tool_lang_title"
  | "tool_lang_desc"
  | "distance_km"
  | "in_stock"
  | "out_of_stock"
  | "call_store"
  | "directions"
  | "back_to_dashboard"
  | "open"
  | "search_placeholder"
  | "search_radius"
  | "nearby_dealers"
  | "sorted_by_distance"
  | "no_stores_found"
  | "product_chemical"
  | "brand_name"
  | "price_per_unit"
  | "stock_status"
  | "farm_control_desk"
  | "location_unavailable"
  | "enable_gps"
  | "try_again"
  | "scan_header_title"
  | "scan_eyebrow"
  | "scan_main_heading"
  | "scan_main_subtext"
  | "step1_capture_upload"
  | "open_camera"
  | "close_camera"
  | "snap_photo"
  | "drop_leaf_image"
  | "leaf_image_format_note"
  | "ready_to_scan"
  | "select_target_crop_label"
  | "analyze_leaf_button"
  | "analyzing_leaf_progress"
  | "instant_sample_demos"
  | "instant_sample_subtext"
  | "scan_sample_btn"
  | "recent_scan_history"
  | "verdict_top_title"
  | "read_verdict_aloud"
  | "scan_another_leaf"
  | "symptoms_observed_title"
  | "root_cause_title"
  | "organic_treatment_title"
  | "chemical_treatment_title"
  | "find_dealers_link"
  | "cultural_prevention_title"
  | "logout"
  | "profile_settings"
  | "logout_confirm_title"
  | "unsaved_changes_warning"
  | "save_and_logout"
  | "discard_and_logout"
  | "cancel"
  | "logged_in_as"
  | "role_farmer"
  | "role_admin"
  | "view_profile";

// ── English ──────────────────────────────────────────────────────────────
const en: Record<string, string> = {
  app_name: "AgroScan",
  dashboard: "Dashboard",
  scan_leaf: "Plant & Disease Scan",
  my_crops: "My Crops & Plans",
  stores_near_me: "Stores Near Me",
  knowledge_base: "Knowledge Base",
  weather: "Weather & Spray",
  notifications: "Notifications",
  soil_recommender: "Soil Crop Recommender",
  register_crop: "Register New Crop",
  help_desk: "Help Desk Support",
  language_settings: "Language Preference",
  welcome_farmer: "Hello, {name}",
  voice_kicker: "AgroScan Field Desk",
  voice_assistant_ready: "Tree Leaf Voice Assistant is ready. Tap the leaf button to speak!",
  tap_leaf_to_speak: "Tap the Leaf button to speak",
  listening: "Listening...",
  thinking: "Thinking & Consulting Advisory...",
  speaking: "Speaking answer...",
  auto_greeting: "Hello {name}! I'm your AgroScan farming assistant. How can I help you today?",
  farm_location: "Farm Location",
  gps_live: "GPS Live",
  change_location: "Change Location",
  refresh_location: "Refresh GPS Location",
  edit_mode: "Edit Mode",
  exit_edit_mode: "Exit Edit Mode",
  preview_as_farmer: "Preview as Farmer",
  reset_layout: "Reset to Default Layout",
  admin_portal: "Admin Portal",
  save_layout: "Save Custom Layout",
  tool_scan_title: "Plant & Disease Scan",
  tool_scan_desc: "Scan leaf photo for general health & specific disease diagnosis.",
  tool_stores_title: "Nearby Agri Stores",
  tool_stores_desc: "Locate authorized chemical, fertilizer & seed dealers near your farm.",
  tool_weather_title: "Weather & Disasters",
  tool_weather_desc: "GPS farm alerts for heavy rain, flood risk & optimal spray timing.",
  tool_soil_title: "Soil Crop Recommender",
  tool_soil_desc: "Choose best suited crops according to your soil matrix type.",
  tool_kb_title: "37-Crop Knowledge Base",
  tool_kb_desc: "Full botanical disease library & WALES tank mixing rules.",
  tool_plan_title: "Personalized Crop Plan",
  tool_plan_desc: "Stage-by-stage growth progress & pest risk window checklist.",
  tool_reg_title: "Register New Crop",
  tool_reg_desc: "Setup sowing date, land area in acres, and field plot details.",
  tool_notif_title: "Notifications & Alerts",
  tool_notif_desc: "Stay updated on real-time weather warnings & task due dates.",
  tool_voice_title: "AI Voice Assistant",
  tool_voice_desc: "Multilingual natural voice assistant for crop advisory & navigation.",
  tool_help_title: "Agronomist Help Desk",
  tool_help_desc: "Connect directly with agricultural experts for field guidance.",
  tool_lang_title: "Language Preference",
  tool_lang_desc: "Change app UI & voice assistant language anytime.",
  distance_km: "{dist} km away",
  in_stock: "In Stock",
  out_of_stock: "Out of Stock",
  call_store: "Call Store",
  directions: "Get Directions",
  back_to_dashboard: "Back to Dashboard",
  open: "Open",
  search_placeholder: "Search chemical or brand name...",
  search_radius: "Search Radius",
  nearby_dealers: "Nearby Dealers",
  sorted_by_distance: "Sorted by GPS Distance",
  no_stores_found: "No stores found within {radius} km. Expand search radius.",
  product_chemical: "Product Chemical",
  brand_name: "Brand Name",
  price_per_unit: "Price / Unit",
  stock_status: "Stock Status",
  farm_control_desk: "Farm Control Desk",
  location_unavailable: "Location unavailable — showing results for",
  enable_gps: "Enable GPS",
  try_again: "Try Again",
  logout: "Logout",
  profile_settings: "Profile & Settings",
  logout_confirm_title: "Log Out?",
  unsaved_changes_warning: "You have unsaved customizations in Edit Mode. Unsaved changes will be lost if you log out without saving.",
  save_and_logout: "Save & Log Out",
  discard_and_logout: "Discard & Log Out",
  cancel: "Cancel",
  logged_in_as: "Logged in as",
  role_farmer: "Farmer",
  role_admin: "Admin",
  view_profile: "View Profile",
};

// ── Telugu ────────────────────────────────────────────────────────────────
const te: Record<string, string> = {
  app_name: "అగ్రోస్కాన్",
  dashboard: "డాష్‌బోర్డ్",
  scan_leaf: "ఆకు జబ్బుల స్కాన్",
  my_crops: "నా పంటలు & ప్రణాళిక",
  stores_near_me: "దగ్గరలోని ఎరువుల దుకాణాలు",
  knowledge_base: "సమాచార వేదిక",
  weather: "వాతావరణ సమాచారం",
  notifications: "ముఖ్యమైన ప్రకటనలు",
  soil_recommender: "నేల పంటల సిఫార్సు",
  register_crop: "కొత్త పంట నమోదు",
  help_desk: "రైతు సహాయ కేంద్రం",
  language_settings: "భాష ఎంపిక",
  welcome_farmer: "నమస్తే, {name} గారు",
  voice_kicker: "అగ్రోస్కాన్ రైతు సేవా వేదిక",
  voice_assistant_ready: "వాయిస్ అసిస్టెంట్ సిద్ధంగా ఉంది. మాట్లాడేందుకు ఆకు ఐకాన్ నొక్కండి!",
  tap_leaf_to_speak: "మాట్లాడేందుకు ఆకు బటన్ నొక్కండి",
  listening: "వింటున్నాను...",
  thinking: "సలహా ఆలోచిస్తున్నాను...",
  speaking: "సమాధానం చెబుతున్నాను...",
  auto_greeting: "నమస్తే {name} గారు! నేను మీ అగ్రోస్కాన్ రైతు సహాయకుడిని. ఈ రోజు మీకు ఏ విధంగా సహాయపడగలను?",
  farm_location: "పొలం ప్రాంతం",
  gps_live: "లైవ్ GPS",
  change_location: "ప్రాంతం మార్చు",
  refresh_location: "GPS రిఫ్రెష్ చేయండి",
  edit_mode: "ఎడిట్ మోడ్",
  exit_edit_mode: "ఎడిట్ మోడ్ ముగించు",
  preview_as_farmer: "రైతు మోడ్ లో చూడు",
  reset_layout: "యథాస్థానానికి మార్చు",
  admin_portal: "అడ్మిన్ లాగిన్",
  save_layout: "సేవ్ చేయండి",
  tool_scan_title: "ఆకు వ్యాధుల స్కాన్",
  tool_scan_desc: "ఆకు ఫోటో తీసి రోగాలు మరియు నివారణ పద్ధతులు తెలుసుకోండి.",
  tool_stores_title: "దగ్గరలోని ఎరువుల షాపులు",
  tool_stores_desc: "మీ ప్రాంతంలోని పురుగుమందులు మరియు విత్తనాల షాపుల వివరాలు.",
  tool_weather_title: "వాతావరణ నివేదిక",
  tool_weather_desc: "వర్షపాతం, గాలులు మరియు మందుల పిచికారీ సమయాల అలర్ట్లు.",
  tool_soil_title: "నేల రకాన్ని బట్టి పంటలు",
  tool_soil_desc: "మీ పొలం నేలకు తగిన పంటల సిఫార్సులు.",
  tool_kb_title: "37 పంటల సమాచారం",
  tool_kb_desc: "సంపూర్ణ పంట వ్యాధుల గైడ్ మరియు ట్యాంక్ మిక్సింగ్ నియమాలు.",
  tool_plan_title: "వ్యక్తిగత పంట ప్రణాళిక",
  tool_plan_desc: "విత్తినప్పటి నుండి కోత వరకు దశల వారీ తనిఖీ జాబితా.",
  tool_reg_title: "కొత్త పంట నమోదు",
  tool_reg_desc: "విత్తిన తేదీ, విస్తీర్ణం మరియు భూమి వివరాలను నమోదు చేయండి.",
  tool_notif_title: "హెచ్చరికలు & సమాచారం",
  tool_notif_desc: "వాతావరణ సూచనలు మరియు పనుల జ్ఞాపికలు.",
  tool_voice_title: "AI వాయిస్ అసిస్టెంట్",
  tool_voice_desc: "మీ స్వంత భాషలో మాట్లాడి సమాధానాలు మరియు సహాయం పొందండి.",
  tool_help_title: "వ్యవసాయ నిపుణుల సహాయం",
  tool_help_desc: "వ్యవసాయ నిపుణులతో నేరుగా మాట్లాడి సలహాలు పొందండి.",
  tool_lang_title: "భాష ఎంపిక",
  tool_lang_desc: "యాప్ మరియు వాయిస్ అసిస్టెంట్ భాషను ఎప్పుడైనా మార్చుకోండి.",
  distance_km: "{dist} కి.మీ దూరంలో",
  in_stock: "స్టాక్ ఉంది",
  out_of_stock: "స్టాక్ లేదు",
  call_store: "షాపుకి కాల్ చేయి",
  directions: "దారి చూపు",
  back_to_dashboard: "డాష్‌బోర్డ్ కు వెనక్కి",
  open: "తెరవు",
  search_placeholder: "రసాయనం లేదా బ్రాండ్ పేరు వెతకండి...",
  search_radius: "శోధన పరిధి",
  nearby_dealers: "దగ్గరలోని డీలర్లు",
  sorted_by_distance: "GPS దూరం ప్రకారం",
  no_stores_found: "{radius} కి.మీ లోపల దుకాణాలు కనుగొనబడలేదు. పరిధి పెంచండి.",
  product_chemical: "రసాయన ఉత్పత్తి",
  brand_name: "బ్రాండ్ పేరు",
  price_per_unit: "ధర / యూనిట్",
  stock_status: "స్టాక్ స్థితి",
  farm_control_desk: "రైతు నియంత్రణ డెస్క్",
  location_unavailable: "ప్రాంతం అందుబాటులో లేదు — ఫలితాలు చూపుతోంది",
  enable_gps: "GPS ఆన్ చేయండి",
  try_again: "మళ్ళీ ప్రయత్నించండి",
  unsaved_changes_warning: "ఎడిట్ మోడ్‌లో మీరు సేవ్ చేయని మార్పులు ఉన్నాయి. సేవ్ చేయకుండా లాగ్ అవుట్ చేస్తే అవి పోతాయి.",
  save_and_logout: "లాగ్ అవుట్",
  discard_and_logout: "వదిలేసి లాగ్ అవుట్ చేయండి",
  cancel: "రద్దు చేయండి",
  logged_in_as: "లాగిన్ అయిన ఖాతా",
  role_farmer: "రైతు ఖాతా",
  role_admin: "అడ్మిన్ ఖాతా",
  view_profile: "ప్రొఫైల్ చూడండి",
};

// ── Hindi ─────────────────────────────────────────────────────────────────
const hi: Record<string, string> = {
  app_name: "एग्रोस्कैन",
  dashboard: "डैशबोर्ड",
  scan_leaf: "पौधे का स्कैन",
  my_crops: "मेरी फसल योजना",
  stores_near_me: "दुकानें और डीलर",
  knowledge_base: "रोग लाइब्रेरी",
  weather: "मौसम विश्लेषण",
  notifications: "अलर्ट व सूचनाएं",
  soil_recommender: "मृदा सिफारिश",
  register_crop: "फसल पंजीकरण",
  help_desk: "कृषि परामर्श",
  language_settings: "भाषा सेटिंग्स",
  welcome_farmer: "नमस्ते, किसान भाई",
  voice_kicker: "AI वॉइस असिस्टेंट",
  voice_assistant_ready: "वॉइस असिस्टेंट तैयार है",
  tap_leaf_to_speak: "पत्ती बटन दबाएं और बोलें",
  listening: "सुन रहे हैं...",
  thinking: "कृषि डेटा विश्लेषण हो रहा है...",
  speaking: "सलाह बोल रहे हैं...",
  auto_greeting: "नमस्ते! मैं ट्री वॉइस असिस्टेंट हूँ। अपनी फसल का हाल पूछिए।",
  farm_location: "खेत स्थान",
  gps_live: "GPS लाइव",
  change_location: "बदलें",
  refresh_location: "स्थान रीफ़्रेश",
  edit_mode: "एडिट मोड",
  exit_edit_mode: "एडिट मोड से बाहर निकलें",
  preview_as_farmer: "किसान दृश्य में देखें",
  reset_layout: "लेआउट रीसेट",
  admin_portal: "व्यवस्थापक पोर्टल",
  save_layout: "लेआउट सहेजें",
  tool_scan_title: "पौधे का स्कैन",
  tool_scan_desc: "कैमरा से रोग पहचानें व तत्काल इलाज पाएं।",
  tool_stores_title: "दुकानें और डीलर",
  tool_stores_desc: "दवाओं के लिए नजदीकी कीटनाशक दुकानें खोजें।",
  tool_weather_title: "मौसम विश्लेषण",
  tool_weather_desc: "स्प्रे अनुकूलता व छिड़काव का सही समय।",
  tool_soil_title: "मृदा सिफारिश",
  tool_soil_desc: "मिट्टी के अनुसार सही फसल और उर्वरक सलाह।",
  tool_kb_title: "रोग लाइब्रेरी",
  tool_kb_desc: "रोग लक्षण, कारण व जैविक उपचार गाइड।",
  tool_plan_title: "मेरी फसल योजना",
  tool_plan_desc: "बुवाई से कटाई तक का चरणबद्ध शेड्यूल।",
  tool_reg_title: "फसल पंजीकरण",
  tool_reg_desc: "नया खेत और फसल विवरण जोड़ें।",
  tool_notif_title: "अलर्ट व सूचनाएं",
  tool_notif_desc: "कीट प्रकोप चेतावनी व मौसम अलर्ट।",
  tool_voice_title: "AI वॉइस असिस्टेंट",
  tool_voice_desc: "अपनी भाषा में बोलकर कृषि सलाह पाएं।",
  tool_help_title: "कृषि परामर्श",
  tool_help_desc: "कृषि विशेषज्ञों से सीधे सहायता और समाधान पाएं।",
  tool_lang_title: "भाषा सेटिंग्स",
  tool_lang_desc: "अपनी क्षेत्रीय भाषा चुनें।",
  distance_km: "किमी दूर",
  in_stock: "उपलब्ध है",
  out_of_stock: "स्टॉक में नहीं",
  call_store: "कॉल करें",
  directions: "दिशा-निर्देश",
  back_to_dashboard: "डैशबोर्ड पर लौटें",
  open: "खोलें",
  search_placeholder: "दवा या ब्रांड का नाम खोजें...",
  search_radius: "खोज का दायरा",
  nearby_dealers: "नजदीकी डीलर",
  sorted_by_distance: "दूरी के अनुसार",
  no_stores_found: "{radius} किमी में कोई दुकान नहीं मिली। दायरा बढ़ाएं।",
  product_chemical: "रासायनिक उत्पाद",
  brand_name: "ब्रांड नाम",
  price_per_unit: "मूल्य / इकाई",
  stock_status: "स्टॉक स्थिति",
  farm_control_desk: "खेत नियंत्रण डेस्क",
  location_unavailable: "स्थान अनुपलब्ध — परिणाम दिखा रहा है",
  enable_gps: "GPS चालू करें",
  try_again: "पुनः प्रयास करें",
  logout: "लॉग आउट",
  profile_settings: "प्रोफ़ाइल और सेटिंग्स",
  logout_confirm_title: "లాగ్ అవుట్ చేయాలా?",
  unsaved_changes_warning: "एडिट मोड में आपके पास बिना सहेजे गए बदलाव हैं। बिना सहेजे लॉग आउट करने पर बदलाव खो जाएंगे।",
  save_and_logout: "सहेजें और लॉग आउट करें",
  discard_and_logout: "रद्द करें और लॉग आउट करें",
  cancel: "रद्द करें",
  logged_in_as: "लॉगिन खाता",
  role_farmer: "किसान",
  role_admin: "एडमिन",
  view_profile: "प्रोफ़ाइल देखें",
};

// ── Tamil ─────────────────────────────────────────────────────────────────
const ta: Record<string, string> = {
  app_name: "அக்ரோஸ்கேன்",
  dashboard: "டாஷ்போர்டு",
  scan_leaf: "இலை நோய் ஸ்கேன்",
  my_crops: "என் பயிர்கள் & திட்டம்",
  stores_near_me: "அருகிலுள்ள கடைகள்",
  knowledge_base: "அறிவுக் களஞ்சியம்",
  weather: "வானிலை & தெளிப்பு",
  notifications: "அறிவிப்புகள்",
  soil_recommender: "மண் பயிர் பரிந்துரை",
  register_crop: "புதிய பயிர் பதிவு",
  help_desk: "விவசாயி உதவி மையம்",
  language_settings: "மொழி விருப்பம்",
  welcome_farmer: "வணக்கம், {name}",
  voice_kicker: "அக்ரோஸ்கேன் விவசாய மேசை",
  voice_assistant_ready: "குரல் உதவியாளர் தயார். பேச இலை பொத்தானை அழுத்தவும்!",
  tap_leaf_to_speak: "பேச இலை பொத்தானை அழுத்தவும்",
  listening: "கேட்கிறேன்...",
  thinking: "ஆலோசனை தயாரிக்கிறேன்...",
  speaking: "பதில் சொல்கிறேன்...",
  auto_greeting: "வணக்கம் {name}! நான் உங்கள் அக்ரோஸ்கேன் விவசாய உதவியாளர். இன்று நான் எப்படி உதவ முடியும்?",
  farm_location: "பண்ணை இடம்",
  gps_live: "GPS நேரடி",
  change_location: "இடம் மாற்று",
  refresh_location: "GPS புதுப்பி",
  edit_mode: "திருத்த பயன்முறை",
  exit_edit_mode: "திருத்தம் முடி",
  preview_as_farmer: "விவசாயி போல் பார்",
  reset_layout: "இயல்புநிலைக்கு மீட்டமை",
  admin_portal: "நிர்வாக போர்டல்",
  save_layout: "தளவமைப்பை சேமி",
  tool_scan_title: "இலை நோய் ஸ்கேன்",
  tool_scan_desc: "இலை புகைப்படம் எடுத்து நோய்கள் மற்றும் சிகிச்சைகளை அறியவும்.",
  tool_stores_title: "அருகிலுள்ள வேளாண் கடைகள்",
  tool_stores_desc: "உங்கள் பகுதியில் உரம், விதை மற்றும் பூச்சிக்கொல்லி கடைகள்.",
  tool_weather_title: "வானிலை அறிக்கை",
  tool_weather_desc: "மழை, காற்று மற்றும் தெளிப்பு நேர எச்சரிக்கைகள்.",
  tool_soil_title: "மண் வகை பயிர் பரிந்துரை",
  tool_soil_desc: "உங்கள் வயல் மண்ணிற்கு ஏற்ற பயிர்களைத் தேர்ந்தெடுக்கவும்.",
  tool_kb_title: "37 பயிர் தகவல் தளம்",
  tool_kb_desc: "முழுமையான நோய் நூலகம் மற்றும் கலவை விதிகள்.",
  tool_plan_title: "தனிப்பயன் பயிர் திட்டம்",
  tool_plan_desc: "விதைப்பு முதல் அறுவடை வரை படிப்படியான சரிபார்ப்பு.",
  tool_reg_title: "புதிய பயிர் பதிவு",
  tool_reg_desc: "விதைப்பு தேதி, நில பரப்பு மற்றும் வயல் விவரங்களை பதிவு செய்யவும்.",
  tool_notif_title: "எச்சரிக்கைகள் & அறிவிப்புகள்",
  tool_notif_desc: "வானிலை எச்சரிக்கைகள் மற்றும் பணி நினைவூட்டல்கள்.",
  tool_voice_title: "AI குரல் உதவியாளர்",
  tool_voice_desc: "உங்கள் மொழியில் பேசி ஆலோசனை பெறுங்கள்.",
  tool_help_title: "வேளாண் நிபுணர் உதவி",
  tool_help_desc: "வேளாண் நிபுணர்களிடம் நேரடியாக ஆலோசனை பெறுங்கள்.",
  tool_lang_title: "மொழி விருப்பம்",
  tool_lang_desc: "ஆப் மற்றும் குரல் உதவியாளர் மொழியை எப்போது வேண்டுமானாலும் மாற்றவும்.",
  distance_km: "{dist} கி.மீ தொலைவில்",
  in_stock: "கையிருப்பில் உள்ளது",
  out_of_stock: "கையிருப்பில் இல்லை",
  call_store: "கடைக்கு அழைப்பு",
  directions: "வழி காட்டு",
  back_to_dashboard: "டாஷ்போர்டுக்கு திரும்பு",
  open: "திறக்க",
  search_placeholder: "ரசாயனம் அல்லது பிராண்ட் தேடுங்கள்...",
  search_radius: "தேடல் தூரம்",
  nearby_dealers: "அருகிலுள்ள டீலர்கள்",
  sorted_by_distance: "GPS தூரப்படி",
  no_stores_found: "{radius} கி.மீ க்குள் கடைகள் இல்லை. தூரம் அதிகரிக்கவும்.",
  product_chemical: "ரசாயன பொருள்",
  brand_name: "பிராண்ட் பெயர்",
  price_per_unit: "விலை / யூனிட்",
  stock_status: "கையிருப்பு நிலை",
  farm_control_desk: "விவசாயி கட்டுப்பாட்டு மேசை",
  location_unavailable: "இடம் கிடைக்கவில்லை — முடிவுகள் காட்டுகிறது",
  enable_gps: "GPS இயக்கு",
  try_again: "மீண்டும் முயற்சிக்கவும்",
  logout: "வெளியேறு",
  profile_settings: "சுயவிவரம் & அமைப்புகள்",
  logout_confirm_title: "வெளியேறவா?",
  unsaved_changes_warning: "எடிட் பயன்முறையில் சேமிக்கப்படாத மாற்றங்கள் உள்ளன. சேமிக்காமல் வெளியேறினால் அவை இழக்கப்படும்.",
  save_and_logout: "சேமித்து வெளியேறு",
  discard_and_logout: "நிராகரித்து வெளியேறு",
  cancel: "ரத்துசெய்",
  logged_in_as: "உள்நுழைந்துள்ள கணக்கு",
  role_farmer: "விவசாயி",
  role_admin: "நிர்வாகி",
  view_profile: "சுயவிவரம் காண்க",
};

// ── Kannada ───────────────────────────────────────────────────────────────
const kn: Record<string, string> = {
  app_name: "ಅಗ್ರೋಸ್ಕ್ಯಾನ್",
  dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  scan_leaf: "ಎಲೆ ರೋಗ ಸ್ಕ್ಯಾನ್",
  my_crops: "ನನ್ನ ಬೆಳೆಗಳು & ಯೋಜನೆ",
  stores_near_me: "ಹತ್ತಿರದ ಅಂಗಡಿಗಳು",
  knowledge_base: "ಜ್ಞಾನ ಕೇಂದ್ರ",
  weather: "ಹವಾಮಾನ & ಸ್ಪ್ರೇ",
  notifications: "ಅಧಿಸೂಚನೆಗಳು",
  soil_recommender: "ಮಣ್ಣು ಬೆಳೆ ಶಿಫಾರಸು",
  register_crop: "ಹೊಸ ಬೆಳೆ ನೋಂದಣಿ",
  help_desk: "ರೈತ ಸಹಾಯ ಕೇಂದ್ರ",
  language_settings: "ಭಾಷೆ ಆಯ್ಕೆ",
  welcome_farmer: "ನಮಸ್ಕಾರ, {name}",
  voice_kicker: "ಅಗ್ರೋಸ್ಕ್ಯಾನ್ ರೈತ ಡೆಸ್ಕ್",
  voice_assistant_ready: "ವಾಯ್ಸ್ ಅಸಿಸ್ಟೆಂಟ್ ಸಿದ್ಧವಾಗಿದೆ. ಮಾತನಾಡಲು ಎಲೆ ಬಟನ್ ಒತ್ತಿ!",
  tap_leaf_to_speak: "ಮಾತನಾಡಲು ಎಲೆ ಬಟನ್ ಒತ್ತಿ",
  listening: "ಕೇಳುತ್ತಿದ್ದೇನೆ...",
  thinking: "ಸಲಹೆ ತಯಾರಿಸುತ್ತಿದ್ದೇನೆ...",
  speaking: "ಉತ್ತರ ಹೇಳುತ್ತಿದ್ದೇನೆ...",
  auto_greeting: "ನಮಸ್ಕಾರ {name}! ನಾನು ನಿಮ್ಮ ಅಗ್ರೋಸ್ಕ್ಯಾನ್ ಕೃಷಿ ಸಹಾಯಕ. ಇಂದು ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
  farm_location: "ಹೊಲದ ಸ್ಥಳ",
  gps_live: "GPS ನೇರ",
  change_location: "ಸ್ಥಳ ಬದಲಿಸಿ",
  refresh_location: "GPS ರಿಫ್ರೆಶ್",
  edit_mode: "ಎಡಿಟ್ ಮೋಡ್",
  exit_edit_mode: "ಎಡಿಟ್ ಮೋಡ್ ನಿಲ್ಲಿಸಿ",
  preview_as_farmer: "ರೈತನಂತೆ ನೋಡಿ",
  reset_layout: "ಡೀಫಾಲ್ಟ್ ಲೇಔಟ್ ಮರುಹೊಂದಿಸಿ",
  admin_portal: "ಅಡ್ಮಿನ್ ಪೋರ್ಟಲ್",
  save_layout: "ಲೇಔಟ್ ಉಳಿಸಿ",
  tool_scan_title: "ಎಲೆ ರೋಗ ಸ್ಕ್ಯಾನ್",
  tool_scan_desc: "ಎಲೆ ಫೋಟೋ ತೆಗೆದು ರೋಗ ಪತ್ತೆ ಮಾಡಿ ಚಿಕಿತ್ಸೆ ತಿಳಿಯಿರಿ.",
  tool_stores_title: "ಹತ್ತಿರದ ಕೃಷಿ ಅಂಗಡಿಗಳು",
  tool_stores_desc: "ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ಗೊಬ್ಬರ, ಬೀಜ ಮತ್ತು ಕೀಟನಾಶಕ ಅಂಗಡಿಗಳು.",
  tool_weather_title: "ಹವಾಮಾನ ವರದಿ",
  tool_weather_desc: "ಮಳೆ, ಗಾಳಿ ಮತ್ತು ಸ್ಪ್ರೇ ಸಮಯ ಎಚ್ಚರಿಕೆಗಳು.",
  tool_soil_title: "ಮಣ್ಣಿನ ಬೆಳೆ ಶಿಫಾರಸು",
  tool_soil_desc: "ನಿಮ್ಮ ಹೊಲದ ಮಣ್ಣಿಗೆ ಸೂಕ್ತ ಬೆಳೆಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.",
  tool_kb_title: "37 ಬೆಳೆ ಮಾಹಿತಿ",
  tool_kb_desc: "ಸಂಪೂರ್ಣ ರೋಗ ಪುಸ್ತಕ ಮತ್ತು ಟ್ಯಾಂಕ್ ಮಿಕ್ಸಿಂಗ್ ನಿಯಮಗಳು.",
  tool_plan_title: "ವೈಯಕ್ತಿಕ ಬೆಳೆ ಯೋಜನೆ",
  tool_plan_desc: "ಬಿತ್ತನೆಯಿಂದ ಕೊಯ್ಲಿನವರೆಗೆ ಹಂತ ಹಂತದ ಚೆಕ್‌ಲಿಸ್ಟ್.",
  tool_reg_title: "ಹೊಸ ಬೆಳೆ ನೋಂದಣಿ",
  tool_reg_desc: "ಬಿತ್ತನೆ ದಿನಾಂಕ, ಎಕರೆ ಮತ್ತು ಹೊಲದ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.",
  tool_notif_title: "ಎಚ್ಚರಿಕೆಗಳು & ಅಧಿಸೂಚನೆ",
  tool_notif_desc: "ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಕೆಲಸದ ಜ್ಞಾಪನೆಗಳು.",
  tool_voice_title: "AI ವಾಯ್ಸ್ ಸಹಾಯಕ",
  tool_voice_desc: "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ ಸಲಹೆ ಪಡೆಯಿರಿ.",
  tool_help_title: "ಕೃಷಿ ತಜ್ಞ ಸಹಾಯ",
  tool_help_desc: "ಕೃಷಿ ತಜ್ಞರಿಂದ ನೇರ ಸಲಹೆ ಪಡೆಯಿರಿ.",
  tool_lang_title: "ಭಾಷೆ ಆಯ್ಕೆ",
  tool_lang_desc: "ಆ್ಯಪ್ ಮತ್ತು ವಾಯ್ಸ್ ಭಾಷೆಯನ್ನು ಯಾವಾಗ ಬೇಕಾದರೂ ಬದಲಿಸಿ.",
  distance_km: "{dist} ಕಿ.ಮೀ ದೂರದಲ್ಲಿ",
  in_stock: "ಸ್ಟಾಕ್ ಇದೆ",
  out_of_stock: "ಸ್ಟಾಕ್ ಇಲ್ಲ",
  call_store: "ಅಂಗಡಿಗೆ ಕಾಲ್",
  directions: "ದಿಕ್ಕು ತೋರಿಸು",
  back_to_dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ",
  open: "ತೆರೆ",
  search_placeholder: "ರಸಾಯನ ಅಥವಾ ಬ್ರಾಂಡ್ ಹುಡುಕಿ...",
  search_radius: "ಹುಡುಕಾಟ ತ್ರಿಜ್ಯ",
  nearby_dealers: "ಹತ್ತಿರದ ಡೀಲರ್‌ಗಳು",
  sorted_by_distance: "GPS ದೂರದ ಪ್ರಕಾರ",
  no_stores_found: "{radius} ಕಿ.ಮೀ ಒಳಗೆ ಅಂಗಡಿಗಳಿಲ್ಲ. ದೂರ ಹೆಚ್ಚಿಸಿ.",
  product_chemical: "ರಾಸಾಯನಿಕ ಉತ್ಪನ್ನ",
  brand_name: "ಬ್ರಾಂಡ್ ಹೆಸರು",
  price_per_unit: "ಬೆಲೆ / ಘಟಕ",
  stock_status: "ಸ್ಟಾಕ್ ಸ್ಥಿತಿ",
  farm_control_desk: "ರೈತ ನಿಯಂತ್ರಣ ಡೆಸ್ಕ್",
  location_unavailable: "ಸ್ಥಳ ಲಭ್ಯವಿಲ್ಲ — ಫಲಿತಾಂಶ ತೋರಿಸುತ್ತಿದೆ",
  enable_gps: "GPS ಸಕ್ರಿಯಗೊಳಿಸಿ",
  try_again: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
  logout: "ಲಾಗ್ ಔಟ್",
  profile_settings: "ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸೆಟ್ಟಿಂಗ್ಗಳು",
  logout_confirm_title: "ಲಾಗ್ ಔಟ್ ಮಾಡಬೇಕೆ?",
  unsaved_changes_warning: "ಎಡಿಟ್ ಮೋಡ್‌ನಲ್ಲಿ ಉಳಿಸದ ಬದಲಾವಣೆಗಳಿವೆ. ಉಳಿಸದೆ ಲಾಗ್ ಔಟ್ ಮಾಡಿದರೆ ಬದಲಾವಣೆಗಳು ಕಳೆದುಹೋಗುತ್ತವೆ.",
  save_and_logout: "ಉಳಿಸಿ ಲಾಗ್ ಔಟ್ ಮಾಡಿ",
  discard_and_logout: "ತಿರಸ್ಕರಿಸಿ ಲಾಗ್ ಔಟ್ ಮಾಡಿ",
  cancel: "ರದ್ದುಮಾಡಿ",
  logged_in_as: "ಲಾಗಿನ್ ಆಗಿರುವ ಖಾತೆ",
  role_farmer: "ರೈತ",
  role_admin: "ನಿರ್ವಾಹಕ",
  view_profile: "ಪ್ರೊಫೈಲ್ ವೀಕ್ಷಿಸಿ",
};

// ── Marathi ───────────────────────────────────────────────────────────────
const mr: Record<string, string> = {
  app_name: "अ‍ॅग्रोस्कॅन",
  dashboard: "डॅशबोर्ड",
  scan_leaf: "पान रोग स्कॅन",
  my_crops: "माझी पिके & योजना",
  stores_near_me: "जवळची दुकाने",
  knowledge_base: "ज्ञान केंद्र",
  weather: "हवामान & फवारणी",
  notifications: "सूचना",
  soil_recommender: "माती पीक शिफारस",
  register_crop: "नवीन पीक नोंदणी",
  help_desk: "शेतकरी मदत केंद्र",
  language_settings: "भाषा निवड",
  welcome_farmer: "नमस्कार, {name}",
  voice_kicker: "अ‍ॅग्रोस्कॅन शेतकरी डेस्क",
  voice_assistant_ready: "व्हॉइस असिस्टंट तयार आहे. बोलण्यासाठी पान बटण दाबा!",
  tap_leaf_to_speak: "बोलण्यासाठी पान बटण दाबा",
  listening: "ऐकतो आहे...",
  thinking: "सल्ला तयार करतो आहे...",
  speaking: "उत्तर देतो आहे...",
  auto_greeting: "नमस्कार {name}! मी तुमचा अ‍ॅग्रोस्कॅन शेती सहाय्यक आहे. आज मी कशी मदत करू शकतो?",
  farm_location: "शेताचे ठिकाण",
  gps_live: "GPS लाइव्ह",
  change_location: "ठिकाण बदला",
  refresh_location: "GPS रिफ्रेश करा",
  edit_mode: "एडिट मोड",
  exit_edit_mode: "एडिट मोड बंद करा",
  preview_as_farmer: "शेतकरी म्हणून पहा",
  reset_layout: "मूळ लेआउट पुनर्स्थापित करा",
  admin_portal: "अ‍ॅडमिन पोर्टल",
  save_layout: "लेआउट जतन करा",
  tool_scan_title: "पान रोग स्कॅन",
  tool_scan_desc: "पानाचा फोटो काढून रोग व उपचार जाणून घ्या.",
  tool_stores_title: "जवळचे कृषी दुकाने",
  tool_stores_desc: "तुमच्या परिसरातील खत, बियाणे व कीटकनाशक दुकाने.",
  tool_weather_title: "हवामान अहवाल",
  tool_weather_desc: "पाऊस, वारा आणि फवारणी वेळेच्या सूचना.",
  tool_soil_title: "माती पीक शिफारस",
  tool_soil_desc: "तुमच्या शेतातील मातीनुसार योग्य पिके निवडा.",
  tool_kb_title: "37 पिकांची माहिती",
  tool_kb_desc: "संपूर्ण रोग ग्रंथालय व टँक मिश्रण नियम.",
  tool_plan_title: "वैयक्तिक पीक योजना",
  tool_plan_desc: "पेरणीपासून काढणीपर्यंत टप्प्या टप्प्याची चेकलिस्ट.",
  tool_reg_title: "नवीन पीक नोंदणी",
  tool_reg_desc: "पेरणी तारीख, एकर क्षेत्र व शेत तपशील प्रविष्ट करा.",
  tool_notif_title: "सूचना व इशारे",
  tool_notif_desc: "हवामान सूचना व कामाचे स्मरणपत्रे.",
  tool_voice_title: "AI व्हॉइस सहाय्यक",
  tool_voice_desc: "तुमच्या भाषेत बोलून शेती सल्ला मिळवा.",
  tool_help_title: "कृषी तज्ञ मदत",
  tool_help_desc: "कृषी तज्ञांकडून थेट सल्ला घ्या.",
  tool_lang_title: "भाषा प्राधान्य",
  tool_lang_desc: "अ‍ॅप व व्हॉइस भाषा कधीही बदला.",
  distance_km: "{dist} किमी अंतरावर",
  in_stock: "स्टॉक उपलब्ध",
  out_of_stock: "स्टॉक संपला",
  call_store: "दुकानाला कॉल करा",
  directions: "दिशादर्शन पहा",
  back_to_dashboard: "डॅशबोर्डवर परत",
  open: "उघडा",
  search_placeholder: "रसायन किंवा ब्रँड शोधा...",
  search_radius: "शोध अंतर",
  nearby_dealers: "जवळचे डीलर",
  sorted_by_distance: "GPS अंतरानुसार",
  no_stores_found: "{radius} किमी आत दुकाने सापडली नाहीत. अंतर वाढवा.",
  product_chemical: "रासायनिक उत्पादन",
  brand_name: "ब्रँड नाव",
  price_per_unit: "किंमत / युनिट",
  stock_status: "स्टॉक स्थिती",
  farm_control_desk: "शेतकरी नियंत्रण डेस्क",
  location_unavailable: "स्थान अनुपलब्ध — निकाल दाखवतो",
  enable_gps: "GPS सुरू करा",
  try_again: "पुन्हा प्रयत्न करा",
  logout: "लॉग आउट",
  profile_settings: "प्रोफाइल आणि सेटिंग्ज",
  logout_confirm_title: "लॉग आउट करायचे का?",
  unsaved_changes_warning: "एडिट मोडमध्ये जतन न केलेले बदल आहेत. जतन न करता लॉग आउट केल्यास ते नष्ट होतील.",
  save_and_logout: "जतन करा आणि लॉग आउट करा",
  discard_and_logout: "रद्द करा आणि लॉग आउट करा",
  cancel: "रद्द करा",
  logged_in_as: "लॉगिन खाते",
  role_farmer: "शेतकरी",
  role_admin: "प्रशासक",
  view_profile: "प्रोफाइल पहा",
};

// ── Punjabi ───────────────────────────────────────────────────────────────
const pa: Record<string, string> = {
  app_name: "ਐਗਰੋਸਕੈਨ",
  dashboard: "ਡੈਸ਼ਬੋਰਡ",
  scan_leaf: "ਪੱਤਾ ਰੋਗ ਸਕੈਨ",
  my_crops: "ਮੇਰੀਆਂ ਫ਼ਸਲਾਂ & ਯੋਜਨਾ",
  stores_near_me: "ਨੇੜੇ ਦੀਆਂ ਦੁਕਾਨਾਂ",
  knowledge_base: "ਗਿਆਨ ਕੇਂਦਰ",
  weather: "ਮੌਸਮ & ਸਪਰੇ",
  notifications: "ਸੂਚਨਾਵਾਂ",
  soil_recommender: "ਮਿੱਟੀ ਫ਼ਸਲ ਸਿਫ਼ਾਰਸ਼",
  register_crop: "ਨਵੀਂ ਫ਼ਸਲ ਦਰਜ ਕਰੋ",
  help_desk: "ਕਿਸਾਨ ਮਦਦ ਕੇਂਦਰ",
  language_settings: "ਭਾਸ਼ਾ ਚੋਣ",
  welcome_farmer: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, {name} ਜੀ",
  voice_kicker: "ਐਗਰੋਸਕੈਨ ਕਿਸਾਨ ਡੈਸਕ",
  voice_assistant_ready: "ਵੌਇਸ ਅਸਿਸਟੈਂਟ ਤਿਆਰ ਹੈ। ਬੋਲਣ ਲਈ ਪੱਤਾ ਬਟਨ ਦਬਾਓ!",
  tap_leaf_to_speak: "ਬੋਲਣ ਲਈ ਪੱਤਾ ਬਟਨ ਦਬਾਓ",
  listening: "ਸੁਣ ਰਿਹਾ ਹਾਂ...",
  thinking: "ਸਲਾਹ ਤਿਆਰ ਕਰ ਰਿਹਾ ਹਾਂ...",
  speaking: "ਜਵਾਬ ਦੇ ਰਿਹਾ ਹਾਂ...",
  auto_greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ {name} ਜੀ! ਮੈਂ ਤੁਹਾਡਾ ਐਗਰੋਸਕੈਨ ਖੇਤੀ ਸਹਾਇਕ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
  farm_location: "ਖੇਤ ਦੀ ਥਾਂ",
  gps_live: "GPS ਲਾਈਵ",
  change_location: "ਥਾਂ ਬਦਲੋ",
  refresh_location: "GPS ਰਿਫ਼ਰੈਸ਼ ਕਰੋ",
  edit_mode: "ਐਡਿਟ ਮੋਡ",
  exit_edit_mode: "ਐਡਿਟ ਮੋਡ ਬੰਦ ਕਰੋ",
  preview_as_farmer: "ਕਿਸਾਨ ਵਜੋਂ ਵੇਖੋ",
  reset_layout: "ਮੂਲ ਲੇਆਉਟ ਬਹਾਲ ਕਰੋ",
  admin_portal: "ਐਡਮਿਨ ਪੋਰਟਲ",
  save_layout: "ਲੇਆਉਟ ਸੁਰੱਖਿਅਤ ਕਰੋ",
  tool_scan_title: "ਪੱਤਾ ਰੋਗ ਸਕੈਨ",
  tool_scan_desc: "ਪੱਤੇ ਦੀ ਫੋਟੋ ਖਿੱਚ ਕੇ ਬਿਮਾਰੀ ਅਤੇ ਇਲਾਜ ਜਾਣੋ.",
  tool_stores_title: "ਨੇੜੇ ਦੀਆਂ ਖੇਤੀ ਦੁਕਾਨਾਂ",
  tool_stores_desc: "ਖਾਦ, ਬੀਜ ਅਤੇ ਕੀਟਨਾਸ਼ਕ ਦੁਕਾਨਾਂ ਲੱਭੋ.",
  tool_weather_title: "ਮੌਸਮ ਰਿਪੋਰਟ",
  tool_weather_desc: "ਮੀਂਹ, ਹਵਾ ਅਤੇ ਸਪਰੇ ਸਮੇਂ ਦੀ ਚੇਤਾਵਨੀ.",
  tool_soil_title: "ਮਿੱਟੀ ਫ਼ਸਲ ਸਿਫ਼ਾਰਸ਼",
  tool_soil_desc: "ਖੇਤ ਦੀ ਮਿੱਟੀ ਮੁਤਾਬਕ ਸਹੀ ਫ਼ਸਲ ਚੁਣੋ.",
  tool_kb_title: "37 ਫ਼ਸਲਾਂ ਦੀ ਜਾਣਕਾਰੀ",
  tool_kb_desc: "ਰੋਗ ਲਾਇਬ੍ਰੇਰੀ ਅਤੇ ਟੈਂਕ ਮਿਕਸ ਨਿਯਮ.",
  tool_plan_title: "ਨਿੱਜੀ ਫ਼ਸਲ ਯੋਜਨਾ",
  tool_plan_desc: "ਬਿਜਾਈ ਤੋਂ ਕਟਾਈ ਤੱਕ ਪੜਾਅ-ਦਰ-ਪੜਾਅ ਚੈੱਕਲਿਸਟ.",
  tool_reg_title: "ਨਵੀਂ ਫ਼ਸਲ ਰਜਿਸਟਰ",
  tool_reg_desc: "ਬਿਜਾਈ ਤਾਰੀਖ਼, ਏਕੜ ਅਤੇ ਖੇਤ ਵੇਰਵੇ ਦਰਜ ਕਰੋ.",
  tool_notif_title: "ਸੂਚਨਾਵਾਂ & ਚੇਤਾਵਨੀਆਂ",
  tool_notif_desc: "ਮੌਸਮ ਚੇਤਾਵਨੀਆਂ ਅਤੇ ਕੰਮ ਯਾਦ-ਦਹਾਨੀ.",
  tool_voice_title: "AI ਵੌਇਸ ਸਹਾਇਕ",
  tool_voice_desc: "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਬੋਲ ਕੇ ਸਲਾਹ ਲਓ.",
  tool_help_title: "ਖੇਤੀ ਮਾਹਿਰ ਮਦਦ",
  tool_help_desc: "ਖੇਤੀ ਮਾਹਿਰਾਂ ਤੋਂ ਸਿੱਧੀ ਸਲਾਹ ਲਓ.",
  tool_lang_title: "ਭਾਸ਼ਾ ਪਸੰਦ",
  tool_lang_desc: "ਐਪ ਅਤੇ ਵੌਇਸ ਭਾਸ਼ਾ ਕਦੇ ਵੀ ਬਦਲੋ.",
  distance_km: "{dist} ਕਿ.ਮੀ. ਦੂਰ",
  in_stock: "ਸਟਾਕ ਵਿੱਚ",
  out_of_stock: "ਸਟਾਕ ਖ਼ਤਮ",
  call_store: "ਦੁਕਾਨ ਨੂੰ ਕਾਲ",
  directions: "ਰਸਤਾ ਦਿਖਾਓ",
  back_to_dashboard: "ਡੈਸ਼ਬੋਰਡ ਤੇ ਵਾਪਸ",
  open: "ਖੋਲੋ",
  search_placeholder: "ਰਸਾਇਣ ਜਾਂ ਬ੍ਰਾਂਡ ਖੋਜੋ...",
  search_radius: "ਖੋਜ ਦੂਰੀ",
  nearby_dealers: "ਨੇੜੇ ਦੇ ਡੀਲਰ",
  sorted_by_distance: "GPS ਦੂਰੀ ਅਨੁਸਾਰ",
  no_stores_found: "{radius} ਕਿ.ਮੀ. ਅੰਦਰ ਦੁਕਾਨ ਨਹੀਂ ਮਿਲੀ. ਦੂਰੀ ਵਧਾਓ.",
  product_chemical: "ਰਸਾਇਣਕ ਉਤਪਾਦ",
  brand_name: "ਬ੍ਰਾਂਡ ਨਾਮ",
  price_per_unit: "ਕੀਮਤ / ਯੂਨਿਟ",
  stock_status: "ਸਟਾਕ ਸਥਿਤੀ",
  farm_control_desk: "ਕਿਸਾਨ ਨਿਯੰਤਰਣ ਡੈਸਕ",
  location_unavailable: "ਥਾਂ ਉਪਲਬਧ ਨਹੀਂ — ਨਤੀਜੇ ਦਿਖਾ ਰਿਹਾ ਹੈ",
  enable_gps: "GPS ਚਾਲੂ ਕਰੋ",
  try_again: "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
  logout: "ਲਾਗ ਆਊਟ",
  profile_settings: "ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਸੈਟਿੰਗਾਂ",
  logout_confirm_title: "ਲਾਗ ਆਊਟ ਕਰਨਾ ਹੈ?",
  unsaved_changes_warning: "ਐਡਿਟ ਮੋਡ ਵਿੱਚ ਅਣਸੇਵ ਕੀਤੇ ਬਦਲਾਅ ਹਨ। ਬਿਨਾਂ ਸੇਵ ਕੀਤੇ ਲਾਗ ਆਊਟ ਕਰਨ 'ਤੇ ਉਹ ਗੁਆਚ ਜਾਣਗੇ।",
  save_and_logout: "ਸੇਵ ਕਰੋ ਅਤੇ ਲਾਗ ਆਊਟ ਕਰੋ",
  discard_and_logout: "ਰੱਦ ਕਰੋ ਅਤੇ ਲਾਗ ਆਊਟ ਕਰੋ",
  cancel: "ਰੱਦ ਕਰੋ",
  logged_in_as: "ਲਾਗਇਨ ਖਾਤਾ",
  role_farmer: "ਕਿਸਾਨ",
  role_admin: "ਪ੍ਰਬੰਧਕ",
  view_profile: "ਪ੍ਰੋਫਾਈਲ ਵੇਖੋ",
};

// ── Bengali ───────────────────────────────────────────────────────────────
const bn: Record<string, string> = {
  app_name: "অ্যাগ্রোস্ক্যান",
  dashboard: "ড্যাশবোর্ড",
  scan_leaf: "পাতা রোগ স্ক্যান",
  my_crops: "আমার ফসল ও পরিকল্পনা",
  stores_near_me: "কাছের দোকান",
  knowledge_base: "জ্ঞান ভান্ডার",
  weather: "আবহাওয়া ও স্প্রে",
  notifications: "বিজ্ঞপ্তি",
  soil_recommender: "মাটি ফসল সুপারিশ",
  register_crop: "নতুন ফসল নিবন্ধন",
  help_desk: "কৃষক সহায়তা কেন্দ্র",
  language_settings: "ভাষা পছন্দ",
  welcome_farmer: "নমস্কার, {name}",
  voice_kicker: "অ্যাগ্রোস্ক্যান কৃষি ডেস্ক",
  voice_assistant_ready: "ভয়েস সহকারী প্রস্তুত। কথা বলতে পাতা বোতাম টিপুন!",
  tap_leaf_to_speak: "কথা বলতে পাতা বোতাম টিপুন",
  listening: "শুনছি...",
  thinking: "পরামর্শ তৈরি করছি...",
  speaking: "উত্তর দিচ্ছি...",
  auto_greeting: "নমস্কার {name}! আমি আপনার অ্যাগ্রোস্ক্যান কৃষি সহায়ক। আজ কীভাবে সাহায্য করতে পারি?",
  farm_location: "খামারের অবস্থান",
  gps_live: "GPS লাইভ",
  change_location: "অবস্থান পরিবর্তন",
  refresh_location: "GPS রিফ্রেশ করুন",
  edit_mode: "এডিট মোড",
  exit_edit_mode: "এডিট মোড বন্ধ করুন",
  preview_as_farmer: "কৃষক হিসেবে দেখুন",
  reset_layout: "ডিফল্ট লেআউটে ফেরত",
  admin_portal: "অ্যাডমিন পোর্টাল",
  save_layout: "লেআউট সংরক্ষণ",
  tool_scan_title: "পাতা রোগ স্ক্যান",
  tool_scan_desc: "পাতার ছবি তুলে রোগ ও চিকিৎসা জানুন।",
  tool_stores_title: "কাছের কৃষি দোকান",
  tool_stores_desc: "আপনার এলাকায় সার, বীজ ও কীটনাশক দোকান খুঁজুন।",
  tool_weather_title: "আবহাওয়া রিপোর্ট",
  tool_weather_desc: "বৃষ্টি, বায়ু ও স্প্রে সময়ের সতর্কতা।",
  tool_soil_title: "মাটি ফসল সুপারিশ",
  tool_soil_desc: "আপনার ক্ষেতের মাটি অনুযায়ী সেরা ফসল বেছে নিন।",
  tool_kb_title: "৩৭ ফসল তথ্য ভান্ডার",
  tool_kb_desc: "সম্পূর্ণ রোগ গ্রন্থাগার ও ট্যাঙ্ক মিশ্রণ নিয়ম।",
  tool_plan_title: "ব্যক্তিগত ফসল পরিকল্পনা",
  tool_plan_desc: "বপন থেকে কাটা পর্যন্ত ধাপে ধাপে চেকলিস্ট।",
  tool_reg_title: "নতুন ফসল নিবন্ধন",
  tool_reg_desc: "বপন তারিখ, একর ও ক্ষেত্রের বিবরণ লিখুন।",
  tool_notif_title: "সতর্কতা ও বিজ্ঞপ্তি",
  tool_notif_desc: "আবহাওয়া সতর্কতা ও কাজের মনে করিয়ে দেওয়া।",
  tool_voice_title: "AI ভয়েস সহকারী",
  tool_voice_desc: "আপনার ভাষায় কথা বলে কৃষি পরামর্শ পান।",
  tool_help_title: "কৃষি বিশেষজ্ঞ সহায়তা",
  tool_help_desc: "কৃষি বিশেষজ্ঞদের কাছ থেকে সরাসরি পরামর্শ নিন।",
  tool_lang_title: "ভাষা পছন্দ",
  tool_lang_desc: "অ্যাপ ও ভয়েস ভাষা যেকোনো সময় পরিবর্তন করুন।",
  distance_km: "{dist} কিমি দূরে",
  in_stock: "স্টক আছে",
  out_of_stock: "স্টক নেই",
  call_store: "দোকানে কল করুন",
  directions: "পথ দেখান",
  back_to_dashboard: "ড্যাশবোর্ডে ফিরে যান",
  open: "খুলুন",
  search_placeholder: "রাসায়নিক বা ব্র্যান্ড খুঁজুন...",
  search_radius: "অনুসন্ধান পরিসীমা",
  nearby_dealers: "কাছের ডিলার",
  sorted_by_distance: "GPS দূরত্ব অনুযায়ী",
  no_stores_found: "{radius} কিমি এর মধ্যে দোকান পাওয়া যায়নি। পরিসীমা বাড়ান।",
  product_chemical: "রাসায়নিক পণ্য",
  brand_name: "ব্র্যান্ড নাম",
  price_per_unit: "মূল্য / ইউনিট",
  stock_status: "স্টক অবস্থা",
  farm_control_desk: "কৃষক নিয়ন্ত্রণ ডেস্ক",
  location_unavailable: "অবস্থান পাওয়া যাচ্ছে না — ফলাফল দেখাচ্ছে",
  enable_gps: "GPS চালু করুন",
  try_again: "আবার চেষ্টা করুন",
  logout: "লগ আউট",
  profile_settings: "প্রোফাইল এবং সেটিংস",
  logout_confirm_title: "লগ আউট করবেন?",
  unsaved_changes_warning: "এডিট মোডে অসংরক্ষিত পরিবর্তন রয়েছে। সংরক্ষণ না করে লগ আউট করলে তা হারিয়ে যাবে।",
  save_and_logout: "সংরক্ষণ করুন এবং লগ আউট করুন",
  discard_and_logout: "বাতিল করুন এবং লগ আউট করুন",
  cancel: "বাতিল",
  logged_in_as: "লগইন অ্যাকাউন্ট",
  role_farmer: "কৃষক",
  role_admin: "অ্যাডমিন",
  view_profile: "প্রোফাইল দেখুন",
};

// ── Gujarati ──────────────────────────────────────────────────────────────
const gu: Record<string, string> = {
  app_name: "એગ્રોસ્કેન",
  dashboard: "ડેશબોર્ડ",
  scan_leaf: "પાંદડા રોગ સ્કેન",
  my_crops: "મારા પાક & યોજના",
  stores_near_me: "નજીકની દુકાનો",
  knowledge_base: "જ્ઞાન કેન્દ્ર",
  weather: "હવામાન & છંટકાવ",
  notifications: "સૂચનાઓ",
  soil_recommender: "માટી પાક ભલામણ",
  register_crop: "નવો પાક નોંધણી",
  help_desk: "ખેડૂત મદદ કેન્દ્ર",
  language_settings: "ભાષા પસંદગી",
  welcome_farmer: "નમસ્તે, {name}",
  voice_kicker: "એગ્રોસ્કેન ખેડૂત ડેસ્ક",
  voice_assistant_ready: "વૉઇસ આસિસ્ટન્ટ તૈયાર છે. બોલવા માટે પાંદડા બટન દબાવો!",
  tap_leaf_to_speak: "બોલવા માટે પાંદડા બટન દબાવો",
  listening: "સાંભળું છું...",
  thinking: "સલાહ તૈયાર કરું છું...",
  speaking: "જવાબ આપું છું...",
  auto_greeting: "નમસ્તે {name}! હું તમારો એગ્રોસ્કેન ખેતી સહાયક છું. આજે હું કેવી રીતે મદદ કરી શકું?",
  farm_location: "ખેતરનું સ્થળ",
  gps_live: "GPS લાઈવ",
  change_location: "સ્થળ બદલો",
  refresh_location: "GPS રિફ્રેશ કરો",
  edit_mode: "એડિટ મોડ",
  exit_edit_mode: "એડિટ મોડ બંધ કરો",
  preview_as_farmer: "ખેડૂત તરીકે જુઓ",
  reset_layout: "ડિફોલ્ટ લેઆઉટ પર પાછા",
  admin_portal: "એડમિન પોર્ટલ",
  save_layout: "લેઆઉટ સાચવો",
  tool_scan_title: "પાંદડા રોગ સ્કેન",
  tool_scan_desc: "પાંદડાનો ફોટો લઈને રોગ અને ઉપચાર જાણો.",
  tool_stores_title: "નજીકની કૃષિ દુકાનો",
  tool_stores_desc: "ખાતર, બીજ અને જંતુનાશક દુકાનો શોધો.",
  tool_weather_title: "હવામાન અહેવાલ",
  tool_weather_desc: "વરસાદ, પવન અને છંટકાવ સમયની ચેતવણી.",
  tool_soil_title: "માટી પાક ભલામણ",
  tool_soil_desc: "ખેતરની માટી પ્રમાણે શ્રેષ્ઠ પાક પસંદ કરો.",
  tool_kb_title: "37 પાક માહિતી",
  tool_kb_desc: "સંપૂર્ણ રોગ પુસ્તકાલય અને ટેંક મિક્સિંગ નિયમો.",
  tool_plan_title: "વ્યક્તિગત પાક યોજના",
  tool_plan_desc: "વાવણીથી લણણી સુધી તબક્કાવાર ચેકલિસ્ટ.",
  tool_reg_title: "નવો પાક નોંધણી",
  tool_reg_desc: "વાવણી તારીખ, એકર અને ખેતર વિગતો દાખલ કરો.",
  tool_notif_title: "ચેતવણીઓ & સૂચનાઓ",
  tool_notif_desc: "હવામાન ચેતવણીઓ અને કામ યાદ અપાવવા.",
  tool_voice_title: "AI વૉઇસ સહાયક",
  tool_voice_desc: "તમારી ભાષામાં બોલીને ખેતી સલાહ મેળવો.",
  tool_help_title: "કૃષિ નિષ્ણાત મદદ",
  tool_help_desc: "કૃષિ નિષ્ણાતો પાસેથી સીધી સલાહ લો.",
  tool_lang_title: "ભાષા પસંદગી",
  tool_lang_desc: "એપ અને વૉઇસ ભાષા ગમે ત્યારે બદલો.",
  distance_km: "{dist} કિ.મી. દૂર",
  in_stock: "સ્ટૉક છે",
  out_of_stock: "સ્ટૉક નથી",
  call_store: "દુકાનને કૉલ કરો",
  directions: "રસ્તો બતાવો",
  back_to_dashboard: "ડેશબોર્ડ પર પાછા",
  open: "ખોલો",
  search_placeholder: "રસાયણ અથવા બ્રાન્ડ શોધો...",
  search_radius: "શોધ અંતર",
  nearby_dealers: "નજીકના ડીલર",
  sorted_by_distance: "GPS અંતર પ્રમાણે",
  no_stores_found: "{radius} કિ.મી.ની અંદર દુકાન મળી નથી. અંતર વધારો.",
  product_chemical: "રાસાયણિક ઉત્પાદન",
  brand_name: "બ્રાન્ડ નામ",
  price_per_unit: "કિંમત / યુનિટ",
  stock_status: "સ્ટૉક સ્થિતિ",
  farm_control_desk: "ખેડૂત નિયંત્રણ ડેસ્ક",
  location_unavailable: "સ્થાન ઉપલબ્ધ નથી — પરિણામ બતાવે છે",
  enable_gps: "GPS ચાલુ કરો",
  try_again: "ફરી પ્રયાસ કરો",
  logout: "લૉગ આઉટ",
  profile_settings: "પ્રોફાઇલ અને સેટિંગ્સ",
  logout_confirm_title: "લૉગ આઉટ કરવું છે?",
  unsaved_changes_warning: "એડિટ મોડમાં સાચવ્યા વગરના ફેરફારો છે. સાચવ્યા વગર લૉગ આઉટ કરશો તો ફેરફારો ખોવાઈ જશે.",
  save_and_logout: "સાચવો અને લૉગ આઉਟ કરો",
  discard_and_logout: "રદ કરો અને લૉગ આઉટ કરો",
  cancel: "રદ કરો",
  logged_in_as: "લૉગિન ખાતું",
  role_farmer: "ખેડૂત",
  role_admin: "એડમિન",
  view_profile: "પ્રોફાઇલ જુઓ",
};

// ── Malayalam ─────────────────────────────────────────────────────────────
const ml: Record<string, string> = {
  app_name: "അഗ്രോസ്കാൻ",
  dashboard: "ഡാഷ്‌ബോർഡ്",
  scan_leaf: "ഇല രോഗ സ്കാൻ",
  my_crops: "എന്റെ വിളകൾ & പ്ലാൻ",
  stores_near_me: "അടുത്തുള്ള കടകൾ",
  knowledge_base: "അറിവ് ശേഖരം",
  weather: "കാലാവസ്ഥ & സ്പ്രേ",
  notifications: "അറിയിപ്പുകൾ",
  soil_recommender: "മണ്ണ് വിള ശുപാർശ",
  register_crop: "പുതിയ വിള രജിസ്റ്റർ",
  help_desk: "കർഷക സഹായ കേന്ദ്രം",
  language_settings: "ഭാഷ ക്രമീകരണം",
  welcome_farmer: "നമസ്കാരം, {name}",
  voice_kicker: "അഗ്രോസ്കാൻ കൃഷി ഡെസ്ക്",
  voice_assistant_ready: "വോയ്സ് അസിസ്റ്റന്റ് തയ്യാറാണ്. സംസാരിക്കാൻ ഇല ബട്ടൺ ടാപ്പ് ചെയ്യുക!",
  tap_leaf_to_speak: "സംസാരിക്കാൻ ഇല ബട്ടൺ ടാപ്പ് ചെയ്യുക",
  listening: "കേൾക്കുന്നു...",
  thinking: "ഉപദേശം തയ്യാറാക്കുന്നു...",
  speaking: "ഉത്തരം പറയുന്നു...",
  auto_greeting: "നമസ്കാരം {name}! ഞാൻ നിങ്ങളുടെ അഗ്രോസ്കാൻ കൃഷി സഹായിയാണ്. ഇന്ന് ഞാൻ എങ്ങനെ സഹായിക്കാം?",
  farm_location: "കൃഷിയിടത്തിന്റെ സ്ഥലം",
  gps_live: "GPS ലൈവ്",
  change_location: "സ്ഥലം മാറ്റുക",
  refresh_location: "GPS റിഫ്രഷ് ചെയ്യുക",
  edit_mode: "എഡിറ്റ് മോഡ്",
  exit_edit_mode: "എഡിറ്റ് മോഡ് അവസാനിപ്പിക്കുക",
  preview_as_farmer: "കർഷകനായി കാണുക",
  reset_layout: "ഡിഫോൾട്ട് ലേഔട്ട് പുന restore സ്ഥാപിക്കുക",
  admin_portal: "അഡ്മിൻ പോർട്ടൽ",
  save_layout: "ലേഔട്ട് സേവ് ചെയ്യുക",
  tool_scan_title: "ഇല രോഗ സ്കാൻ",
  tool_scan_desc: "ഇലയുടെ ഫോട്ടോ എടുത്ത് രോഗവും ചികിത്സയും അറിയുക.",
  tool_stores_title: "അടുത്തുള്ള കൃഷി കടകൾ",
  tool_stores_desc: "വളം, വിത്ത്, കീടനാശിനി കടകൾ കണ്ടെത്തുക.",
  tool_weather_title: "കാലാവസ്ഥ റിപ്പോർട്ട്",
  tool_weather_desc: "മഴ, കാറ്റ്, സ്പ്രേ സമയ മുന്നറിയിപ്പുകൾ.",
  tool_soil_title: "മണ്ണ് വിള ശുപാർശ",
  tool_soil_desc: "നിങ്ങളുടെ നിലത്തെ മണ്ണിന് അനുയോജ്യമായ വിളകൾ തിരഞ്ഞെടുക്കുക.",
  tool_kb_title: "37 വിള വിവരങ്ങൾ",
  tool_kb_desc: "സമ്പൂർണ രോഗ ലൈബ്രറി, ടാങ്ക് മിക്സിംഗ് നിയമങ്ങൾ.",
  tool_plan_title: "വ്യക്തിഗത വിള പ്ലാൻ",
  tool_plan_desc: "വിതയ്ക്കൽ മുതൽ വിളവെടുപ്പ് വരെ ഘട്ടങ്ങൾ.",
  tool_reg_title: "പുതിയ വിള രജിസ്റ്റർ",
  tool_reg_desc: "വിതയ്ക്കൽ തീയതി, ഏക്കർ, നിലം വിവരങ്ങൾ ചേർക്കുക.",
  tool_notif_title: "മുന്നറിയിപ്പുകൾ & അറിയിപ്പുകൾ",
  tool_notif_desc: "കാലാവസ്ഥ മുന്നറിയിപ്പ്, ജോലി ഓർമ്മപ്പെടുത്തലുകൾ.",
  tool_voice_title: "AI വോയ്സ് സഹായി",
  tool_voice_desc: "നിങ്ങളുടെ ഭാഷയിൽ സംസാരിച്ച് കൃഷി ഉപദേശം നേടുക.",
  tool_help_title: "കൃഷി വിദഗ്ധ സഹായം",
  tool_help_desc: "കൃഷി വിദഗ്ധരിൽ നിന്ന് നേരിട്ട് ഉപദേശം നേടുക.",
  tool_lang_title: "ഭാഷ ക്രമീകരണം",
  tool_lang_desc: "ആപ്പ്, വോയ്സ് ഭാഷ എപ്പോൾ വേണമെങ്കിലും മാറ്റുക.",
  distance_km: "{dist} കി.മീ അകലെ",
  in_stock: "സ്റ്റോക്ക് ഉണ്ട്",
  out_of_stock: "സ്റ്റോക്ക് ഇല്ല",
  call_store: "കടയിലേക്ക് കോൾ",
  directions: "വഴി കാണിക്കുക",
  back_to_dashboard: "ഡാഷ്‌ബോർഡിലേക്ക് മടങ്ങുക",
  open: "തുറക്കുക",
  search_placeholder: "രാസവസ്തു അല്ലെങ്കിൽ ബ്രാൻഡ് തിരയുക...",
  search_radius: "തിരയൽ പരിധി",
  nearby_dealers: "അടുത്തുള്ള ഡീലർമാർ",
  sorted_by_distance: "GPS ദൂരം അനുസരിച്ച്",
  no_stores_found: "{radius} കി.മീ ഉള്ളിൽ കടകൾ കണ്ടെത്തിയില്ല. പരിധി വർദ്ധിപ്പിക്കുക.",
  product_chemical: "രാസ ഉൽപ്പന്നം",
  brand_name: "ബ്രാൻഡ് പേര്",
  price_per_unit: "വില / യൂണിറ്റ്",
  stock_status: "സ്റ്റോക്ക് സ്ഥിതി",
  farm_control_desk: "കർഷക നിയന്ത്രണ ഡെസ്ക്",
  location_unavailable: "സ്ഥലം ലഭ്യമല്ല — ഫലങ്ങൾ കാണിക്കുന്നു",
  enable_gps: "GPS ഓൺ ചെയ്യുക",
  try_again: "വീണ്ടും ശ്രമിക്കുക",
  logout: "ലോഗ് ഔട്ട്",
  profile_settings: "പ്രൊഫൈലും ക്രമീകരണങ്ങളും",
  logout_confirm_title: "ലോഗ് ഔട്ട് ചെയ്യണോ?",
  unsaved_changes_warning: "എഡിറ്റ് മോഡിൽ സേവ് ചെയ്യാത്ത മാറ്റങ്ങളുണ്ട്. സേവ് ചെയ്യാതെ ലോഗ് ഔട്ട് ചെയ്താൽ അവ നഷ്ടപ്പെടും.",
  save_and_logout: "സേവ് ചെയ്ത് ലോഗ് ഔട്ട് ചെയ്യുക",
  discard_and_logout: "ഉപേക്ഷിച്ച് ലോഗ് ഔട്ട് ചെയ്യുക",
  cancel: "റദ്ദാക്കുക",
  logged_in_as: "ലോഗിൻ ചെയ്ത അക്കൗണ്ട്",
  role_farmer: "കർഷകൻ",
  role_admin: "അഡ്മിൻ",
  view_profile: "പ്രൊഫൈൽ കാണുക",
};

export const DICTIONARIES: Record<string, Record<string, string>> = {
  en,
  te,
  hi,
  ta,
  kn,
  mr,
  pa,
  bn,
  gu,
  ml,
};

const CROP_NAME_MAP: Record<string, Record<string, string>> = {
  paddy: { en: "Rice (Paddy)", te: "వరి (వరి పైరు)", hi: "धान / चावल", ta: "நெல் (அரிசி)", kn: "ಭತ್ತ", mr: "भात (धान)", pa: "ਝੋਨਾ", bn: "ধান", gu: "ડાંગર (ચોખા)", ml: "നെല്ല്" },
  rice: { en: "Rice (Paddy)", te: "వరి", hi: "धान", ta: "நெல்", kn: "ಭತ್ತ", mr: "भात", pa: "ਝੋਨਾ", bn: "ধান", gu: "ડાંગર", ml: "നെല്ല്" },
  tomato: { en: "Tomato", te: "టమోటా", hi: "टमाटर", ta: "தக்காளி", kn: "ಟೊಮ್ಯಾಟೊ", mr: "टोमॅटो", pa: "ਟਮਾਟਰ", bn: "টমেটো", gu: "ટમેટા", ml: "തക്കാളി" },
  maize: { en: "Maize (Corn)", te: "మొక్కజొన్న", hi: "मक्का", ta: "மக்காச்சோளம்", kn: "ಮೆಕ್ಕೆಜೋಳ", mr: "मका", pa: "ਮੱਕੀ", bn: "ভুট্টা", gu: "મકાઈ", ml: "ചോളം" },
  cotton: { en: "Cotton", te: "ప్రత్తి", hi: "कपास", ta: "பருத்தி", kn: "ಹತ್ತಿ", mr: "कापूस", pa: "ਕਪਾਹ", bn: "তুলা", gu: "કપાસ", ml: "പരുത്തി" },
  chilli: { en: "Chilli", te: "మిర్చి", hi: "मिर्च", ta: "மிளகாய்", kn: "ಮೆಣಸಿನಕಾಯಿ", mr: "मिरची", pa: "ਮਿਰਚ", bn: "লঙ্কা", gu: "મરચાં", ml: "മുളക്" },
  wheat: { en: "Wheat", te: "గోధుమ", hi: "गेहूं", ta: "கோதுமை", kn: "ಗೋಧಿ", mr: "गहू", pa: "ਕਣਕ", bn: "গম", gu: "ઘઉં", ml: "ഗോതമ്പ്" },
};

const VERDICT_MAP: Record<string, Record<string, string>> = {
  healthy: {
    en: "Healthy Plant",
    te: "ఆరోగ్యకరమైన పైరు (తెగుళ్లు లేవు)",
    hi: "स्वस्थ पौधा (कोई रोग नहीं)",
    ta: "ஆரோக்கியமான பயிர்",
    kn: "ಆರೋಗ್ಯಕರ ಬೆಳೆ",
    mr: "निरोगी पीक",
    pa: "ਸਿਹਤਮੰਦ ਫਸਲ",
    bn: "সুস্থ ফসল",
    gu: "તંદુરસ્ત પાક",
    ml: "ആരോഗ്യമുള്ള വിള",
  },
  disease: {
    en: "Disease detected",
    te: "తెగులు గుర్తించబడింది",
    hi: "रोग पाया गया",
    ta: "நோய் கண்டறியப்பட்டது",
    kn: "ರೋಗ ಪತ್ತೆಯಾಗಿದೆ",
    mr: "रोग आढळला",
    pa: "ਬਿਮਾਰੀ ਦਾ ਪਤਾ ਲੱਗਾ",
    bn: "রোগ সনাক্ত হয়েছে",
    gu: "રોગ જોવા મળ્યો",
    ml: "രോഗം കണ്ടെത്തി",
  },
  pest: {
    en: "Pest detected",
    te: "పురుగుల దాడి గుర్తించబడింది",
    hi: "कीट का प्रकोप",
    ta: "பூச்சி தாக்குதல்",
    kn: "ಕೀಟ ಬಾಧೆ",
    mr: "कीड आढळली",
    pa: "ਕੀੜੇ ਦਾ ਹਮਲਾ",
    bn: "পোকার আক্রমণ",
    gu: "જીવાતનો ઉપદ્રવ",
    ml: "കീടബാധ കണ്ടെത്തി",
  },
  uncertain: {
    en: "Uncertain / Needs a clearer photo",
    te: "అస్పష్టమైన చిత్రం — స్పష్టమైన ఫోటో తీయండి",
    hi: "अस्पष्ट फोटो — कृपया साफ फोटो लें",
    ta: "தெளிவற்ற புகைப்படம் — தெளிவான படம் எடுக்கவும்",
    kn: "ಅಸ್ಪಷ್ಟ ಫೋಟೋ — ಸ್ಪಷ್ಟ ಫೋಟೋ ತೆಗೆಯಿರಿ",
    mr: "अस्पष्ट फोटो — कृपया स्पष्ट फोटो घ्या",
    pa: "ਅਸਪੱਸ਼ਟ ਫੋਟੋ — ਕਿਰਪਾ ਕਰਕੇ ਸਾਫ਼ ਫੋਟੋ ਲਵੋ",
    bn: "অস্পষ্ট ছবি — দয়া করে পরিষ্কার ছবি তুলুন",
    gu: "અસ્પષ્ટ ફોટો — સ્પષ્ટ ફોટો લો",
    ml: "വ്യക്തമല്ലാത്ത ഫോട്ടോ — വ്യക്തമായ ചിത്രം എടുക്കുക",
  },
};

const SEVERITY_MAP: Record<string, Record<string, string>> = {
  high: { en: "High", te: "తీవ్రమైనది (High)", hi: "गंभीर (High)", ta: "தீவிரமானது", kn: "ಹೆಚ್ಚು", mr: "गंभीर", pa: "ਗੰਭੀਰ", bn: "তীব্র", gu: "ગંભીર", ml: "തീവ്രം" },
  moderate: { en: "Moderate", te: "మధ్యస్థం (Moderate)", hi: "मध्यम (Moderate)", ta: "மிதமான", kn: "ಮಧ್ಯಮ", mr: "मध्यम", pa: "ਦਰਮਿਆਨਾ", bn: "মাঝারি", gu: "મધ્યમ", ml: "മിതമായ" },
  low: { en: "Low", te: "తక్కువ (Low)", hi: "हल्का (Low)", ta: "குறைவான", kn: "ಕಡಿಮೆ", mr: "कमी", pa: "ਘੱਟ", bn: "কম", gu: "ઓછું", ml: "കുറഞ്ഞ" },
  none: { en: "None", te: "ఏమీ లేదు", hi: "कोई नहीं", ta: "இல்லை", kn: "ಇಲ್ಲ", mr: "काही नाही", pa: "ਕੋਈ ਨਹੀਂ", bn: "কিছুই নেই", gu: "કંઈ નથી", ml: "ഇല്ല" },
};

const CATEGORY_MAP: Record<string, Record<string, string>> = {
  land_preparation: { en: "Land Preparation", te: "నేల తయారీ", hi: "खेत की तैयारी", ta: "நிலம் தயாரித்தல்", kn: "ಭೂಮಿ ಸಿದ್ಧತೆ", mr: "जमीन तयारी", pa: "ਜ਼ਮੀਨ ਦੀ ਤਿਆਰੀ", bn: "জমি প্রস্তুত", gu: "જમીન તૈયારી", ml: "നിലമൊരുക്കൽ" },
  seeding: { en: "Seeding / Sowing", te: "విత్తడం / నాట్లు", hi: "बुवाई / रोपाई", ta: "விதைப்பு", kn: "ಬಿತ್ತನೆ", mr: "पेरणी", pa: "ਬਿਜਾਈ", bn: "বপন", gu: "વાવણી", ml: "വിത്ത് വിതയ്ക്കൽ" },
  irrigation: { en: "Irrigation", te: "నీటి యాజమాన్యం", hi: "सिंचाई", ta: "நீர்ப்பாசனம்", kn: "ನೀರಾವರಿ", mr: "सिंचन", pa: "ਸਿੰਚਾਈ", bn: "সেচ", gu: "પિયત", ml: "നനയ്ക്കൽ" },
  fertilizer: { en: "Fertilizer Application", te: "ఎరువుల యాజమాన్యం", hi: "खाद व उर्वरक", ta: "உரமிடுதல்", kn: "ಗೊಬ್ಬರ ನಿರ್ವಹಣೆ", mr: "खत व्यवस्थापन", pa: "ਖਾਦ ਪ੍ਰਬੰਧਨ", bn: "সার প্রয়োগ", gu: "ખાતર વ્યવસ્થાપન", ml: "വളപ്രയോഗം" },
  pest_control: { en: "Pest & Disease Control", te: "తెగుళ్లు & పురుగుల నివారణ", hi: "कीट व रोग नियंत्रण", ta: "பூச்சி & நோய் கட்டுப்பாடு", kn: "ಕೀಟ & ರೋಗ ನಿಯಂತ್ರಣ", mr: "कीड व रोग नियंत्रण", pa: "ਕੀਟ ਤੇ ਬਿਮਾਰੀ ਕੰਟਰੋਲ", bn: "পোকা ও রোগ দমন", gu: "જીવાત અને રોગ નિયંત્રણ", ml: "കീട & രോഗ നിയന്ത്രണം" },
  weed_management: { en: "Weed Management", te: "కలుపు యాజమాన్యం", hi: "खरपतवार नियंत्रण", ta: "களை மேலாண்மை", kn: "ಕಳೆ ನಿರ್ವಹಣೆ", mr: "तण व्यवस्थापन", pa: "ਨਦੀਨ ਪ੍ਰਬੰਧਨ", bn: "আগাছা দমন", gu: "નીંદણ નિયંત્રણ", ml: "കള നിയന്ത്രണം" },
  harvest: { en: "Harvesting", te: "కోత & నూర్పిడి", hi: "कटाई व गहाई", ta: "அறுவடை", kn: "ಕೊಯ್ಲು", mr: "कापणी", pa: "ਵਾਢੀ", bn: "ফসল কাটা", gu: "લણણી", ml: "വിളവെടുപ്പ്" },
};

const STATUS_MAP: Record<string, Record<string, string>> = {
  new: { en: "New", te: "కొత్తది", hi: "नया", ta: "புதியது", kn: "ಹೊಸತು", mr: "नवीन", pa: "ਨਵਾਂ", bn: "নতুন", gu: "નવું", ml: "പുതിയത്" },
  "in progress": { en: "In Progress", te: "పరిశీలనలో ఉంది", hi: "प्रगति पर", ta: "செயலில் உள்ளது", kn: "ಪ್ರಗತಿಯಲ್ಲಿದೆ", mr: "प्रगतीपथावर", pa: "ਚੱਲ ਰਿਹਾ ਹੈ", bn: "চলমান", gu: "ચાલુ છે", ml: "പുരോഗതിയിൽ" },
  resolved: { en: "Resolved", te: "పరిష్కరించబడింది", hi: "हल हो गया", ta: "தீர்க்கப்பட்டது", kn: "ಪರಿಹರಿಸಲಾಗಿದೆ", mr: "निराकरण झाले", pa: "ਹੱਲ ਹੋ ਗਿਆ", bn: "সমাধান হয়েছে", gu: "ઉકેલાઈ ગયું", ml: "പരിഹരിച്ചു" },
  done: { en: "Completed", te: "పూర్తయింది", hi: "पूरा हुआ", ta: "முடிந்தது", kn: "ಪೂರ್ಣಗೊಂಡಿದೆ", mr: "पूर्ण झाले", pa: "ਪੂਰਾ ਹੋਇਆ", bn: "সম্পন্ন", gu: "પૂર્ણ થયું", ml: "പൂർത്തിയായി" },
  upcoming: { en: "Upcoming", te: "రాబోయే పని", hi: "आगामी", ta: "வரவிருக்கும்", kn: "ಮುಂಬರುವ", mr: "आगामी", pa: "ਆਉਣ ਵਾਲਾ", bn: "আসন্ন", gu: "આગામી", ml: "വരാനിരിക്കുന്നത്" },
  active: { en: "Active", te: "యాక్టివ్", hi: "सक्रिय", ta: "செயலில்", kn: "ಸಕ್ರಿಯ", mr: "सक्रिय", pa: "ਸਰਗਰਮ", bn: "সক্রিয়", gu: "સક્રિય", ml: "സജീവം" },
};

export function localizeCrop(cropName: string, lang: string): string {
  if (!cropName) return "";
  const key = cropName.toLowerCase().trim();
  for (const [k, map] of Object.entries(CROP_NAME_MAP)) {
    if (key.includes(k)) return map[lang] || map["en"] || cropName;
  }
  return cropName;
}

export function localizeVerdict(verdict: string, lang: string): string {
  if (!verdict) return "";
  const lower = verdict.toLowerCase();
  if (lower.includes("healthy")) return VERDICT_MAP.healthy[lang] || VERDICT_MAP.healthy.en;
  if (lower.includes("pest")) return VERDICT_MAP.pest[lang] || VERDICT_MAP.pest.en;
  if (lower.includes("disease")) return VERDICT_MAP.disease[lang] || VERDICT_MAP.disease.en;
  if (lower.includes("uncertain")) return VERDICT_MAP.uncertain[lang] || VERDICT_MAP.uncertain.en;
  return verdict;
}

export function localizeSeverity(severity: string, lang: string): string {
  if (!severity) return "";
  const lower = severity.toLowerCase();
  return SEVERITY_MAP[lower]?.[lang] || SEVERITY_MAP[lower]?.en || severity;
}

export function localizeCategory(category: string, lang: string): string {
  if (!category) return "";
  const lower = category.toLowerCase().replace(/[\s-]/g, "_");
  return CATEGORY_MAP[lower]?.[lang] || CATEGORY_MAP[lower]?.en || category;
}

export function localizeStatus(status: string, lang: string): string {
  if (!status) return "";
  const lower = status.toLowerCase();
  return STATUS_MAP[lower]?.[lang] || STATUS_MAP[lower]?.en || status;
}

const DISEASE_NAME_MAP: Record<string, Record<string, string>> = {
  blast: { en: "Leaf Blast", te: "ఆకుమచ్చ / బ్లాస్ట్ తెగులు", hi: "झुलसा (ब्लास्ट) रोग", ta: "இலைக்கருகல் / குலை நோய்", kn: "ಬೆಂಕಿ ರೋಗ", mr: "ब्लास्ट / करपा", pa: "ਝੁਲਸ ਰੋਗ", bn: "ব্লাস্ট রোগ", gu: "બ્લાસ્ટ રોગ", ml: "കുലവാട്ടം" },
  blight: { en: "Early / Late Blight", te: "ఆకు మాడు తెగులు (బ్లైట్)", hi: "अगेती / पछेती झुलसा", ta: "இலைக்கருகல் நோய்", kn: "ಮುಂಚಿತ ಕರಗು ರೋಗ", mr: "करपा रोग", pa: "ਬਲਾਈਟ", bn: "ব্লাইট", gu: "ઝુલસા", ml: "കരിച്ചിൽ" },
  aphid: { en: "Aphids & Sucking Pests", te: "పేనుబంక & రసం పీల్చే పురుగులు", hi: "माहू व रस चूसक कीट", ta: "அசுவினி மற்றும் உறிஞ்சும் பூச்சிகள்", kn: "ಹೇನು ಹಾಗೂ ಹೀರುವ ಕೀಟಗಳು", mr: "मावा व तुडतुडे", pa: "ਤੇਲਾ", bn: "জাবপোকা", gu: "મોલો-મશી", ml: "ഇലപ്പേൻ" },
  rust: { en: "Yellow / Brown Rust", te: "కుంకుమ / తుప్పు తెగులు", hi: "रतुआ / गेरुआ रोग", ta: "துரு நோய்", kn: "ತುಕ್ಕು ರೋಗ", mr: "तांबेरा", pa: "ਕੁੰਗੀ", bn: "মরিচা রোগ", gu: "ગેરુ", ml: "തുരുമ്പ് രോഗം" },
  borer: { en: "Stem Borer / Armyworm", te: "కాండం తొలిచే పురుగు / కత్తెర పురుగు", hi: "तना छेदक / सैनिक कीट", ta: "தண்டு துளைப்பான் / படைப்புழு", kn: "ಕಾಂಡ ಕೊರೆಯುವ ಹುಳು", mr: "खोडकिडा", pa: "ਤਣਾ ਛੇਦਕ", bn: "মাজরা পোকা", gu: "ગાભમારાની ઈયળ", ml: "തണ്ടുതുരപ്പൻ" },
  armyworm: { en: "Fall Armyworm", te: "కత్తెర పురుగు", hi: "फॉल आर्मीवॉर्म", ta: "படைப்புழு", kn: "ಸೈನಿಕ ಹುಳು", mr: "लष्करी अळी", pa: "ਫਾਲ ਆਰਮੀਵਰਮ", bn: "আর্মিওয়ার্ম", gu: "લશ્કરી ઈયળ", ml: "ആർമിവേം" },
  fly: { en: "Shoot Fly / Whitefly", te: "తెల్లదోమ / ఈగ", hi: "सफेद मक्खी / प्ररोह मक्खी", ta: "வெள்ளை ஈ", kn: "ಬಿಳಿ ನೊಣ", mr: "पांढरी माशी", pa: "ਚਿੱਟੀ ਮੱਖੀ", bn: "সাদা মাছি", gu: "સફેદ માખી", ml: "വെള്ളീച്ച" },
  healthy: { en: "Healthy Plant Foliage", te: "ఆరోగ్యకరమైన పైరు ఆకులు", hi: "स्वस्थ फसल पत्ती", ta: "ஆரோக்கியமான இலைகள்", kn: "ಆರೋಗ್ಯಕರ ಎಲೆಗಳು", mr: "निरोगी पाने", pa: "ਸਿਹਤਮੰਦ ਪੱਤੇ", bn: "সুস্থ পাতা", gu: "તંદુરસ્ત પાંદડા", ml: "ആരോഗ്യമുള്ള ഇലകൾ" }
};

export function localizeDisease(diseaseName: string, lang: string): string {
  if (!diseaseName) return "";
  const lower = diseaseName.toLowerCase();
  for (const [k, map] of Object.entries(DISEASE_NAME_MAP)) {
    if (lower.includes(k)) return map[lang] || map["en"] || diseaseName;
  }
  return diseaseName;
}


export function translate(lang: string, key: TranslationKeys, params?: Record<string, string>): string {
  const dict = DICTIONARIES[lang] || DICTIONARIES['en'] || DICTIONARIES.en;
  let text = (dict && dict[key]) || (DICTIONARIES.en && DICTIONARIES.en[key]) || (key as string);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.split('{' + k + '}').join(v);
    }
  }
  return text;
}
