export interface CropDisease {
  name: string;
  category: "fungal" | "bacterial" | "viral" | "insect" | "deficiency" | "water_stress";
  symptoms: string;
  cause: string;
  generalHealthImpact?: string;
  prevention: string[];
  curativeTreatment: {
    product: string;
    dosagePerAcre: string;
    applicationMethod: string;
    brandExamples: string[];
  };
  organicAlternative: string;
  recoveryPlan: string[];
  highestRiskStage: string;
  incompleteDataNotice?: string;
}

export interface GrowthStagePlan {
  stageName: string;
  dayRange: string;
  activities: string[];
  pestRiskWindow?: string;
  wildlifeProtection?: string;
}

export interface CropData {
  id: string;
  name: string;
  category: "Cereals & Coarse Cereals" | "Pulses & Oilseeds" | "Commercial Crops" | "Vegetables" | "Flowers & Plantation Crops" | "Fruit Crops (Horticulture)";
  season: string;
  durationDays: number;
  suitableSoilTypes: string[];
  expectedYieldPerAcre: string;
  waterRequirements: string;
  diseases: CropDisease[];
  growthPlan: GrowthStagePlan[];
  extraNotes?: string;
}

export interface AgriStore {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  distanceKm: number;
  village: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  stockedChemicals: {
    productName: string;
    brandName: string;
    pricePerUnit: string;
    inStock: boolean;
  }[];
}

export interface SoilTypeInfo {
  id: string;
  name: string;
  description: string;
  keyCharacteristics: string[];
  recommendedCrops: string[];
  managementTips: string[];
}

export const SOIL_TYPES: SoilTypeInfo[] = [
  {
    id: "sandy",
    name: "Sandy Soil",
    description: "Light, coarse, highly porous soil with fast drainage and low nutrient retention.",
    keyCharacteristics: ["High aeration", "Rapid drainage", "Low organic matter", "Warms up quickly"],
    recommendedCrops: ["Bajra (Pearl Millet)", "Groundnut (Peanut)", "Potato", "Watermelon/Cucurbits", "Mustard"],
    managementTips: ["Apply organic manure/compost liberally", "Use drip irrigation to prevent leaching", "Split fertilizer doses into small frequent applications"]
  },
  {
    id: "loamy",
    name: "Loamy Soil",
    description: "Ideal balanced soil with equal parts sand, silt, and clay. Excellent fertility and drainage.",
    keyCharacteristics: ["High nutrient capacity", "Optimal water retention", "Easy plowing", "Rich in humus"],
    recommendedCrops: ["Wheat", "Maize / Corn", "Tomato", "Sugarcane", "Papaya", "Banana", "Rose"],
    managementTips: ["Maintain organic mulch layer", "Standard crop rotation with leguminous pulses", "Avoid over-tillage when wet"]
  },
  {
    id: "clayey",
    name: "Clayey Soil",
    description: "Heavy, fine-textured soil that retains water and nutrients well but can become waterlogged.",
    keyCharacteristics: ["High moisture retention", "Slow drainage", "Rich in minerals", "Compacts when dry"],
    recommendedCrops: ["Rice / Paddy", "Wheat", "Sugarcane", "Cotton", "Jute"],
    managementTips: ["Ensure deep field drainage channels", "Add gypsum to improve soil structure", "Avoid heavy machinery when wet to prevent compaction"]
  },
  {
    id: "black_cotton",
    name: "Black Cotton (Regur) Soil",
    description: "Deep clayey dark soil rich in calcium, potassium, and magnesium. Swells when wet and cracks deep when dry.",
    keyCharacteristics: ["Self-plowing deep cracks", "Extreme moisture retention", "High lime content", "Ideal for dryland cash crops"],
    recommendedCrops: ["Cotton", "Jowar (Sorghum)", "Chickpea (Gram)", "Soybean", "Pigeon Pea (Tur)", "Citrus"],
    managementTips: ["Sow immediately after pre-monsoon shower", "Use broadbed furrow irrigation system", "Add zinc and phosphorus supplements"]
  },
  {
    id: "red",
    name: "Red Soil",
    description: "Porous and friable iron-rich soil found in warm semi-arid regions. Requires nitrogen and phosphorus boost.",
    keyCharacteristics: ["High iron oxide content", "Mildly acidic to neutral", "Moderate water retention", "Good drainage"],
    recommendedCrops: ["Ragi (Finger Millet)", "Groundnut", "Chilli / Hot Pepper", "Mango", "Guava", "Tea", "Coffee"],
    managementTips: ["Incorporate lime to correct high acidity if needed", "Frequent light irrigations", "Add bio-fertilizers (Azospirillum, PSB)"]
  },
  {
    id: "laterite",
    name: "Laterite Soil",
    description: "Leached reddish soil rich in iron and aluminum oxides, typical of heavy rainfall tropical regions.",
    keyCharacteristics: ["High acidity", "Leached potassium and nitrogen", "Coarse gravelly texture", "Durable under rain"],
    recommendedCrops: ["Tea", "Coffee", "Rubber", "Coconut", "Cashew", "Arecanut"],
    managementTips: ["Regular liming to raise soil pH", "Heavy organic compost applications", "Terracing on sloped plantations to stop soil erosion"]
  },
  {
    id: "alluvial",
    name: "Alluvial Soil",
    description: "Highly fertile river-deposited soil rich in potash and humus. Most productive agricultural soil.",
    keyCharacteristics: ["Fine to medium texture", "High natural fertility", "Balanced pH", "Excellent root depth"],
    recommendedCrops: ["Rice / Paddy", "Wheat", "Sugarcane", "Mustard", "Potato", "Jute", "Mango"],
    managementTips: ["Balanced NPK application", "Green manuring with Sunn hemp or Dhaincha", "Regular soil testing for micro-nutrients"]
  },
  {
    id: "saline_alkaline",
    name: "Saline & Alkaline Soil",
    description: "Soil containing excess soluble salts or sodium, common in arid or over-irrigated canal areas.",
    keyCharacteristics: ["High pH (>8.5)", "White salt crusting", "Poor water infiltration", "Nutrient lockup"],
    recommendedCrops: ["Barley", "Sugar Beet", "Cotton", "Guava", "Bajra"],
    managementTips: ["Apply Agricultural Gypsum @ 2–5 tonnes/acre", "Deep leaching with fresh water", "Grow salt-tolerant green manure crops"]
  },
  {
    id: "peaty",
    name: "Peaty & Marshy Soil",
    description: "Dark, highly organic heavy soil formed in humid submerged conditions with high water table.",
    keyCharacteristics: ["Very high organic matter", "Black color", "Acidic nature", "High moisture retention"],
    recommendedCrops: ["Rice / Paddy", "Coconut", "Jute", "Spices", "Cardamom"],
    managementTips: ["Construct deep drainage lines", "Apply lime and wood ash to balance acidity", "Zinc sulphate soil drenching"]
  }
];

export const CROPS_DATABASE: CropData[] = [
  // SECTION A — CEREALS & COARSE CEREALS
  {
    id: "rice",
    name: "Rice / Paddy",
    category: "Cereals & Coarse Cereals",
    season: "Kharif (Jun–Nov) or Rabi (Nov–Mar)",
    durationDays: 120,
    suitableSoilTypes: ["Clayey Soil", "Alluvial Soil", "Peaty & Marshy Soil"],
    expectedYieldPerAcre: "22 - 30 Quintals",
    waterRequirements: "High (1200-1400 mm, maintain 2-5 cm standing water)",
    diseases: [
      {
        name: "Rice Blast (Magnaporthe oryzae)",
        category: "fungal",
        symptoms: "Spindle/diamond-shaped leaf lesions with gray or white centers and brown margins; neck rot cutting off earhead.",
        cause: "High humidity (>90%), cool night temperatures (20-23°C), and excessive nitrogen application.",
        prevention: ["Seed treatment with Carbendazim 2g/kg + Streptocycline 1g/10L", "Avoid excess nitrogen fertilizer", "Maintain proper water depth (2-5cm)"],
        curativeTreatment: {
          product: "Tricyclazole 75WP",
          dosagePerAcre: "120g / acre in 200L water",
          applicationMethod: "Foliar spray at first appearance of leaf spots or booting stage",
          brandExamples: ["Beam", "Bavistin", "Indofil Baan"]
        },
        organicAlternative: "Foliar spray of 5% Neem Seed Kernel Extract (NSKE) or Pseudomonas fluorescens @ 10g/L",
        recoveryPlan: ["Apply Potash (MOP) @ 15kg/acre to strengthen cell walls", "Maintain shallow standing water", "Re-scan leaves after 5 days"],
        highestRiskStage: "Tillering to Booting stage (Day 35-65)"
      },
      {
        name: "Bacterial Leaf Blight (BLB)",
        category: "bacterial",
        symptoms: "Water-soaked streaks along leaf margins turning yellow to straw-colored with wavy margins; bacterial ooze beads on young leaves.",
        cause: "Xanthomonas oryzae transmitted by rain splash, wind, and warm temperatures (25-30°C).",
        prevention: ["Soak seeds in Streptocycline solution (1g/10L water) for 12 hours", "Use resistant varieties", "Drain field temporarily if infection starts"],
        curativeTreatment: {
          product: "Streptocycline + Copper Oxychloride",
          dosagePerAcre: "18g Streptocycline + 500g Copper Oxychloride / acre in 200L water",
          applicationMethod: "Foliar spray twice at 10-day intervals",
          brandExamples: ["Plantomycin", "Blitox 50", "Kocide"]
        },
        organicAlternative: "Fresh cow dung extract (20%) spray or Panchagavya 3% spray",
        recoveryPlan: ["Withhold nitrogen application until new clean leaves emerge", "Drain field for 3 days to dry lower canopy", "Apply bio-zinc"],
        highestRiskStage: "Panicle Initiation to Flowering (Day 50-80)"
      },
      {
        name: "Stem Borer (Scirpophaga incertulas)",
        category: "insect",
        symptoms: "Dead-hearts (dried central shoot in vegetative stage) or White-heads (empty white panicles at flowering).",
        cause: "Larvae bore into stem base and feed on inner vascular tissues.",
        prevention: ["Set up pheromone traps @ 8-10 traps/acre", "Clip leaf tips before transplanting to remove egg masses", "Deep plowing after harvest"],
        curativeTreatment: {
          product: "Cartap Hydrochloride 4G or Chlorantraniliprole 0.4% GR",
          dosagePerAcre: "7.5 - 10 kg / acre standing soil application",
          applicationMethod: "Broadcast granules in 2cm standing water",
          brandExamples: ["Virtako", "Padan 4G", "Ferterra"]
        },
        organicAlternative: "Release Trichogramma japonicum egg parasitoids @ 40,000/acre at 10-day intervals",
        recoveryPlan: ["Keep standing water in field for 4 days post-granule broadcast", "Top-dress 10kg Urea + 5kg Zinc per acre to boost tillering"],
        highestRiskStage: "Transplanting to Tillering stage (Day 25-50)"
      },
      {
        name: "Brown Plant Hopper (BPH)",
        category: "insect",
        symptoms: "Circular patches of dried brown plants ('hopper burn') starting from field centers.",
        cause: "Nilaparvata lugens multiplying at stem bases in dense wet canopies.",
        prevention: ["Adopt Alternate Wetting and Drying (AWD) irrigation", "Form 30cm alleyways every 2 meters for aeration", "Avoid synthetic pyrethroid overuse"],
        curativeTreatment: {
          product: "Pymetrozine 50WG or Dinotefuran 20SG",
          dosagePerAcre: "120g Pymetrozine / acre in 200L water directed at stem base",
          applicationMethod: "Direct nozzle spray down toward stem base, not over leaf top",
          brandExamples: ["Chess", "Osheen", "Token"]
        },
        organicAlternative: "Neem Oil 10,000 ppm @ 3ml/L water sprayed directly onto lower stem bases",
        recoveryPlan: ["Drain field completely for 48 hours", "Avoid high nitrogen top-dressing", "Rescan stem bases after 3 days"],
        highestRiskStage: "Panicle initiation to Grain filling (Day 60-95)"
      }
    ],
    growthPlan: [
      { stageName: "Nursery Care & Seed Treatment", dayRange: "Day 1 - 25", activities: ["Treat seed with Carbendazim + Streptocycline", "Maintain 2cm standing water in nursery", "Scout for early thrips"], pestRiskWindow: "Thrips window (Day 8-15)" },
      { stageName: "Transplanting & Stem Borer Watch", dayRange: "Day 26 - 65", activities: ["Transplant 2-3 seedlings per hill", "Broadcast Cartap 4G if stem borer egg masses seen", "Apply NPK fertilizer"], pestRiskWindow: "Stem Borer & Rice Blast window (Day 30-55)" },
      { stageName: "Flowering & Grain Formation", dayRange: "Day 66 - 105", activities: ["Spray Pymetrozine if BPH hoppers spotted at stem base", "Monitor for Neck Blast", "Keep field moist"], pestRiskWindow: "BPH Hopper Burn & Grain Discoloration (Day 70-95)" },
      { stageName: "Maturity & Pre-Harvest Drain", dayRange: "Day 106 - 120", activities: ["Drain field 10-14 days prior to harvest", "Harvest when 85% grains turn golden yellow"], wildlifeProtection: "Solar light deterrents for wild boars near harvest" }
    ]
  },
  {
    id: "wheat",
    name: "Wheat",
    category: "Cereals & Coarse Cereals",
    season: "Rabi (Nov–Apr)",
    durationDays: 120,
    suitableSoilTypes: ["Loamy Soil", "Clayey Soil", "Alluvial Soil"],
    expectedYieldPerAcre: "18 - 24 Quintals",
    waterRequirements: "Moderate (400-500 mm across 4-6 critical irrigations)",
    diseases: [
      {
        name: "Yellow / Stripe Rust (Puccinia striiformis)",
        category: "fungal",
        symptoms: "Bright yellow pustules arranged in linear stripes on upper leaf surface, rubbing off as yellow powder.",
        cause: "Cool, moist weather (10-15°C) with persistent fog or heavy dew.",
        prevention: ["Seed treatment with Tebuconazole 2DS @ 1.2g/kg", "Sow recommended rust-resistant varieties (HD-2967, PBW-550)", "Avoid late sowing"],
        curativeTreatment: {
          product: "Propiconazole 25EC or Tebuconazole 25.9EC",
          dosagePerAcre: "200ml / acre in 200L water",
          applicationMethod: "Foliar spray immediately when first yellow stripe is spotted",
          brandExamples: ["Tilt", "Result", "Folicur"]
        },
        organicAlternative: "Bio-fungicide Trichoderma harzianum 10g/L or Sour Butter Milk spray @ 50ml/L",
        recoveryPlan: ["Perform follow-up spray in 12 days if damp fog continues", "Apply 5kg Zinc Sulphate + 2kg Urea per acre"],
        highestRiskStage: "Tillering to Booting stage (Day 45-75)"
      },
      {
        name: "Termites (Odontotermes obesus)",
        category: "insect",
        symptoms: "Plants dry up, turn straw-colored, and pull out easily from soil with hollowed stem bases.",
        cause: "Soil-dwelling termites attacking roots in dry, light soils lacking organic matter.",
        prevention: ["Deep summer plowing", "Apply well-decomposed organic farmyard manure", "Seed treatment with Chlorpyrifos 20EC @ 4ml/kg"],
        curativeTreatment: {
          product: "Chlorpyrifos 20EC or Fipronil 0.3GR",
          dosagePerAcre: "1 Litre Chlorpyrifos / acre mixed with sand or in irrigation stream",
          applicationMethod: "Apply along with first or second irrigation water",
          brandExamples: ["Lethal 20", "Regent 0.3G", "Dursban"]
        },
        organicAlternative: "Neem cake application @ 100kg/acre during field preparation",
        recoveryPlan: ["Irrigate field immediately to suppress termite activity", "Apply light nitrogen top-dress"],
        highestRiskStage: "Germination & CRI stage (Day 15-40)"
      }
    ],
    growthPlan: [
      { stageName: "Sowing & Seed Treatment", dayRange: "Day 1 - 7", activities: ["Treat seed with Tebuconazole", "Sow at 4-5 cm depth with line sowing"] },
      { stageName: "Crown Root Initiation (CRI)", dayRange: "Day 8 - 28", activities: ["Provide 1st critical irrigation at Day 21 (CRI stage)", "Top dress Urea @ 45kg/acre", "Inspect for termites"], pestRiskWindow: "Termite & weed emergence window (Day 15-30)" },
      { stageName: "Tillering & Booting Stage", dayRange: "Day 29 - 70", activities: ["2nd & 3rd irrigation", "Scout for Yellow/Brown Rust stripes on leaf blades", "Spray Propiconazole if rust seen"], pestRiskWindow: "Yellow Stripe Rust critical window (Day 45-70)" },
      { stageName: "Grain Filling & Harvesting", dayRange: "Day 71 - 120", activities: ["Provide final irrigation at soft dough stage", "Stop watering 10 days pre-harvest", "Combine harvest at 14% grain moisture"], wildlifeProtection: "Bird scaring tape during grain ripening" }
    ]
  },
  {
    id: "maize",
    name: "Maize / Corn",
    category: "Cereals & Coarse Cereals",
    season: "Kharif (Jun–Sep) or Rabi (Oct–Feb)",
    durationDays: 100,
    suitableSoilTypes: ["Loamy Soil", "Alluvial Soil", "Black Cotton Soil"],
    expectedYieldPerAcre: "25 - 35 Quintals",
    waterRequirements: "Moderate (500-600 mm, sensitive to waterlogging)",
    diseases: [
      {
        name: "Fall Armyworm (Spodoptera frugiperda)",
        category: "insect",
        symptoms: "Ragged pinholes on leaves, whorl destruction filled with sawdust-like fecal frass, and Y-mark on larval head.",
        cause: "Moth infestation depositing egg masses on leaf undersides in warm weather.",
        prevention: ["Seed treatment with Cyantraniliprole 625FS @ 6ml/kg", "Intercrop with Desmodium or Cowpea (Push-Pull)", "Install pheromone traps @ 5/acre"],
        curativeTreatment: {
          product: "Emamectin Benzoate 5SG or Spinetoram 11.7SC",
          dosagePerAcre: "80g Emamectin Benzoate or 100ml Spinetoram / acre in 200L water",
          applicationMethod: "Direct spray nozzle directly down into plant whorls",
          brandExamples: ["Proclaim", "Delegate", "Ampligo"]
        },
        organicAlternative: "Whorl application of clean dry sand mixed with neem powder (9:1 ratio) or Metarhizium anisopliae @ 5g/L",
        recoveryPlan: ["Direct whorl spray again after 8 days if fresh frass appears", "Top dress Urea 20kg/acre to accelerate foliage recovery"],
        highestRiskStage: "Early Vegetative / Whorl stage (Day 15-40)"
      },
      {
        name: "Turcicum Leaf Blight (Exserohilum turcicum)",
        category: "fungal",
        symptoms: "Long, elliptical grayish-green or tan lesions (2-15 cm) on leaves, giving a burnt appearance.",
        cause: "High humidity (>80%) and moderate temperatures (18-27°C).",
        prevention: ["Crop rotation with non-graminaceous crops", "Deep plowing of crop residues", "Balanced NPK fertilization"],
        curativeTreatment: {
          product: "Mancozeb 75WP or Azoxystrobin 23SC",
          dosagePerAcre: "600g Mancozeb / acre in 200L water",
          applicationMethod: "Foliar spray at early appearance of leaf lesions",
          brandExamples: ["Dithane M-45", "Amistar", "Saaf"]
        },
        organicAlternative: "Pseudomonas fluorescens 10g/L foliar spray",
        recoveryPlan: ["Remove heavily blighted lower leaves", "Spray potassium sulphate to bolster drought/disease tolerance"],
        highestRiskStage: "Tasseling to Silking stage (Day 45-70)"
      }
    ],
    growthPlan: [
      { stageName: "Sowing & Seed Treatment", dayRange: "Day 1 - 7", activities: ["Seed treatment with Cyantraniliprole", "Maintain 60cm row x 20cm plant spacing"] },
      { stageName: "Whorl Phase & FAW Scouting", dayRange: "Day 8 - 35", activities: ["Scout whorls every 3 days for FAW egg masses and frass", "First weeding and earthing up", "Whorl spray if FAW damaged plants >10%"], pestRiskWindow: "Fall Armyworm peak attack (Day 12-30)" },
      { stageName: "Tasseling & Cob Filling", dayRange: "Day 36 - 75", activities: ["Critical irrigation at tasseling and cob development", "Apply Mancozeb for Turcicum Blight if humid", "Top-dress second dose of Nitrogen"], pestRiskWindow: "Turcicum Blight & Stem Borer window (Day 45-65)" },
      { stageName: "Cob Maturity & Harvest", dayRange: "Day 76 - 100", activities: ["Harvest when cob husk turns straw yellow and kernel moisture drops below 20%"], wildlifeProtection: "Watch for bird damage; install shiny foil tapes around field edges" }
    ]
  },
  {
    id: "jowar",
    name: "Jowar (Sorghum)",
    category: "Cereals & Coarse Cereals",
    season: "Kharif (Jun–Oct) or Rabi (Oct–Feb)",
    durationDays: 100,
    suitableSoilTypes: ["Black Cotton Soil", "Loamy Soil", "Clayey Soil"],
    expectedYieldPerAcre: "12 - 18 Quintals",
    waterRequirements: "Low (350-450 mm, highly drought resilient)",
    diseases: [
      {
        name: "Sorghum Shoot Fly (Atherigona soccata)",
        category: "insect",
        symptoms: "Drying of central leaf shoot ('dead-heart') in 1-4 week old seedlings; shoot pulls out easily emitting foul odor.",
        cause: "Fly laying white cigar-shaped eggs singly on leaf undersides of young seedlings.",
        prevention: ["High seed rate (4-5 kg/acre) and thin out affected dead-heart plants by Day 15", "Sow early within 7 days of monsoon onset", "Imidacloprid 70WS seed treatment @ 10g/kg"],
        curativeTreatment: {
          product: "Thiamethoxam 25WG or Chlorpyrifos 20EC",
          dosagePerAcre: "50g Thiamethoxam / acre in 200L water",
          applicationMethod: "Foliar spray on seedling leaves at Day 7 and Day 14",
          brandExamples: ["Actara", "Lethal 20", "Confidor"]
        },
        organicAlternative: "Neem Seed Kernel Extract 5% spray at 7th and 14th day after emergence",
        recoveryPlan: ["Thin infested seedlings and bury them", "Apply light nitrogen to stimulate side tillering"],
        highestRiskStage: "Seedling stage (Day 7-28)"
      },
      {
        name: "Grain Mold (Curvularia / Fusarium spp.)",
        category: "fungal",
        symptoms: "Pink, black, or gray discoloration on maturing grain heads, reducing seed weight and grain quality.",
        cause: "Heavy unseasonal rain coinciding with grain maturity and high atmospheric humidity.",
        prevention: ["Grow short duration varieties escaping late rains", "Avoid high plant density"],
        curativeTreatment: {
          product: "Mancozeb 75WP + Carbendazim 50WP",
          dosagePerAcre: "500g Mancozeb + 250g Carbendazim / acre in 200L water",
          applicationMethod: "Spray earheads at 50% flowering and grain filling stage",
          brandExamples: ["Dithane M-45", "Bavistin", "Saaf"]
        },
        organicAlternative: "Bio-agent Trichoderma viride 10g/L earhead spray",
        recoveryPlan: ["Harvest crop immediately if rain persists at grain maturity", "Air dry grains thoroughly on tarpaulin"],
        highestRiskStage: "Grain maturity (Day 75-95)"
      }
    ],
    growthPlan: [
      { stageName: "Sowing & Shoot Fly Defense", dayRange: "Day 1 - 25", activities: ["High density early sowing", "Seed treatment with Imidacloprid", "Thin excess seedlings at Day 15"], pestRiskWindow: "Shoot Fly critical window (Day 7-25)" },
      { stageName: "Vegetative Growth & Boot Stage", dayRange: "Day 26 - 65", activities: ["Inter-cultivation for weed removal", "Irrigate at boot leaf stage if dry spell"], pestRiskWindow: "Stem Borer & Leaf spot window (Day 35-55)" },
      { stageName: "Flowering to Grain Maturity", dayRange: "Day 66 - 100", activities: ["Monitor rain forecast; spray Mancozeb if rain expected at grain filling", "Harvest when grains become hard"], wildlifeProtection: "Use bird scarers during grain filling stage" }
    ]
  },
  {
    id: "bajra",
    name: "Bajra (Pearl Millet)",
    category: "Cereals & Coarse Cereals",
    season: "Kharif (Jun–Oct)",
    durationDays: 90,
    suitableSoilTypes: ["Sandy Soil", "Red Soil", "Saline & Alkaline Soil"],
    expectedYieldPerAcre: "10 - 15 Quintals",
    waterRequirements: "Low (250-350 mm, extreme heat & drought tolerant)",
    diseases: [
      {
        name: "Downy Mildew / Green Ear (Sclerospora graminicola)",
        category: "fungal",
        symptoms: "Yellowish chlorotic streaks on leaves with white downy cottony growth underneath; earhead transforms into leafy green structure.",
        cause: "Oospore infection from soil or infected seed favored by humid cloudy weather.",
        prevention: ["Seed treatment with Metalaxyl 35SD @ 6g/kg seed", "Rogue out infected green-ear plants early and burn them", "Crop rotation"],
        curativeTreatment: {
          product: "Mancozeb 75WP or Metalaxyl 8% + Mancozeb 64%WP",
          dosagePerAcre: "600g - 800g / acre in 200L water",
          applicationMethod: "Foliar spray when downy growth appears on leaf undersides",
          brandExamples: ["Ridomil Gold", "Dithane M-45", "Blitox 50"]
        },
        organicAlternative: "Pseudomonas fluorescens 10g/L soil drench and leaf spray",
        recoveryPlan: ["Pull out leaf-transformed green earheads completely to stop oospore buildup", "Spray micronutrient mixture"],
        highestRiskStage: "Vegetative to Earhead emergence (Day 20-50)"
      }
    ],
    growthPlan: [
      { stageName: "Sowing & Establishment", dayRange: "Day 1 - 20", activities: ["Seed treatment with Metalaxyl", "Sow in dry soil prior to monsoon"] },
      { stageName: "Tillering & Downy Mildew Watch", dayRange: "Day 21 - 50", activities: ["Thinning to maintain 15cm plant distance", "Rogue out green-ear affected plants immediately"], pestRiskWindow: "Downy Mildew / Green Ear phase (Day 25-45)" },
      { stageName: "Earhead Filling & Harvest", dayRange: "Day 51 - 90", activities: ["Protect earheads from birds", "Harvest when earheads dry completely"], wildlifeProtection: "Scarecrows and reflective ribbons against birds" }
    ]
  },
  {
    id: "ragi",
    name: "Ragi (Finger Millet)",
    category: "Cereals & Coarse Cereals",
    season: "Kharif (Jun–Nov)",
    durationDays: 110,
    suitableSoilTypes: ["Red Soil", "Loamy Soil", "Laterite Soil"],
    expectedYieldPerAcre: "12 - 16 Quintals",
    waterRequirements: "Low to Moderate (350-450 mm)",
    diseases: [
      {
        name: "Ragi Blast (Pyricularia oryzae)",
        category: "fungal",
        symptoms: "Spindle-shaped lesions on leaves; neck blast causing neck constriction and breaking of earhead fingers.",
        cause: "High relative humidity (>85%), rainfall during flowering, and dense crop canopy.",
        prevention: ["Seed treatment with Carbendazim 2g/kg or Trichoderma viride 4g/kg", "Balanced nitrogen use", "Ensure good field drainage"],
        curativeTreatment: {
          product: "Carbendazim 50WP or Mancozeb 75WP",
          dosagePerAcre: "250g Carbendazim or 500g Mancozeb / acre in 200L water",
          applicationMethod: "Foliar spray at leaf stage and heading stage",
          brandExamples: ["Bavistin", "Saaf", "Indofil M-45"]
        },
        organicAlternative: "Spray Panchagavya 3% or Pseudomonas fluorescens 10g/L",
        recoveryPlan: ["Spray immediate neck protection at flowering", "Apply potassium silicate"],
        highestRiskStage: "Heading & Flowering stage (Day 50-80)"
      }
    ],
    growthPlan: [
      { stageName: "Nursery & Transplanting", dayRange: "Day 1 - 25", activities: ["Raise nursery with Trichoderma seed treatment", "Transplant 25-day old seedlings"] },
      { stageName: "Vegetative & Drainage Check", dayRange: "Day 26 - 60", activities: ["Weeding at Day 35", "Ensure drainage channels are clear"], pestRiskWindow: "Leaf Blast window (Day 40-55)" },
      { stageName: "Earhead Flowering & Harvest", dayRange: "Day 61 - 110", activities: ["Spray Carbendazim at first sign of neck blast", "Harvest when earhead fingers turn brown"], wildlifeProtection: "Nets or shiny tapes for bird protection" }
    ]
  },

  // SECTION B — PULSES & OILSEEDS
  {
    id: "chickpea",
    name: "Chickpea (Gram)",
    category: "Pulses & Oilseeds",
    season: "Rabi (Oct–Mar)",
    durationDays: 110,
    suitableSoilTypes: ["Black Cotton Soil", "Loamy Soil", "Alluvial Soil"],
    expectedYieldPerAcre: "8 - 12 Quintals",
    waterRequirements: "Low (250-300 mm, strictly avoid standing water/over-irrigation)",
    diseases: [
      {
        name: "Gram Pod Borer (Helicoverpa armigera)",
        category: "insect",
        symptoms: "Defoliation, green caterpillars feeding on flowers, and circular bored holes in pods with head inside.",
        cause: "Moths laying eggs during cloudy weather and flowering peak.",
        prevention: ["Install T-shaped bird perches @ 20/acre", "Set up pheromone traps @ 5/acre", "Intercrop with Coriander or Mustard"],
        curativeTreatment: {
          product: "Chlorantraniliprole 18.5SC or Indoxacarb 14.5SC",
          dosagePerAcre: "60ml Chlorantraniliprole or 200ml Indoxacarb / acre in 200L water",
          applicationMethod: "Foliar spray at 50% flowering stage or when 1 caterpillar/meter row is seen",
          brandExamples: ["Coragen", "Avaunt", "Ampligo"]
        },
        organicAlternative: "Spray Helicoverpa NPV (HaNPV) @ 250 LE/acre + 0.5kg jaggery or 5% NSKE",
        recoveryPlan: ["Repeat spray after 10 days if live larvae persist", "Do not irrigate during peak flowering"],
        highestRiskStage: "Flowering & Pod formation (Day 45-80)"
      },
      {
        name: "Fusarium Wilt (Fusarium oxysporum f. sp. ciceris)",
        category: "fungal",
        symptoms: "Sudden drooping of whole plant, leaves turning yellow-brown from bottom up, dark brown vascular discoloration inside split stem.",
        cause: "Soil-borne pathogen multiplying rapidly in warm soil (25-30°C) and waterlogged conditions.",
        prevention: ["Seed treatment with Carboxin 37.5% + Thiram 37.5% @ 3g/kg", "Deep summer plowing", "Grow wilt-resistant varieties (JG-11, JAKI-9218)"],
        curativeTreatment: {
          product: "Trichoderma viride / harzianum soil drench",
          dosagePerAcre: "2kg Trichoderma mixed with 100kg organic farmyard manure / acre applied near roots",
          applicationMethod: "Soil application / root zone drenching at early wilt onset",
          brandExamples: ["Vitavax Power", "Bio-Derma", "Tricho-Shield"]
        },
        organicAlternative: "Root drenching with Trichoderma viride + Neem cake extract",
        recoveryPlan: ["Stop irrigation immediately; over-watering worsens wilt spread", "Uproot infected plants and burn"],
        highestRiskStage: "Seedling (Day 15-30) & Flowering stage (Day 50-70)"
      }
    ],
    growthPlan: [
      { stageName: "Sowing & Seed Care", dayRange: "Day 1 - 7", activities: ["Treat seed with Carboxin+Thiram & Rhizobium culture", "Sow at 8-10 cm depth"] },
      { stageName: "Nipping & Branching", dayRange: "Day 8 - 45", activities: ["Nip terminal shoot tops at Day 35 to encourage side branching", "Install T-shaped bird perches @ 20/acre"], pestRiskWindow: "Early wilt & Cutworm phase (Day 20-35)" },
      { stageName: "Flowering & Pod Borer Defense", dayRange: "Day 46 - 85", activities: ["STRICTLY NO IRRIGATION during peak bloom", "Spray Coragen at early podding", "Monitor HaNPV"], pestRiskWindow: "Helicoverpa Pod Borer critical window (Day 50-80)" },
      { stageName: "Pod Maturation & Harvest", dayRange: "Day 86 - 110", activities: ["Harvest when leaves turn yellow and pods rattle with dry seed"], wildlifeProtection: "Fence edges against blue bulls/peafowl" }
    ]
  },
  {
    id: "pigeon_pea",
    name: "Pigeon Pea (Tur / Arhar)",
    category: "Pulses & Oilseeds",
    season: "Kharif (Jun–Jan)",
    durationDays: 180,
    suitableSoilTypes: ["Black Cotton Soil", "Loamy Soil", "Red Soil"],
    expectedYieldPerAcre: "8 - 12 Quintals",
    waterRequirements: "Moderate (400-500 mm, deep rooted drought hardy)",
    diseases: [
      {
        name: "Sterility Mosaic Virus (SMV)",
        category: "viral",
        symptoms: "Bushy, pale green, small distorted leaves; complete absence of flowers/pods ('vegetative sterility').",
        cause: "Eriophyid mite (Aceria cajani) vector spreading virus from plant to plant.",
        prevention: ["Rogue out bushy infected plants early", "Seed treatment with Carbendazim", "Avoid continuous pigeon pea cropping"],
        curativeTreatment: {
          product: "Acetamiprid 20SP + Fenazaquin 10EC",
          dosagePerAcre: "60g Acetamiprid + 250ml Fenazaquin / acre in 200L water",
          applicationMethod: "Foliar spray to control mite vector as soon as pale foliage appears",
          brandExamples: ["Pride", "Magister", "Coragen"]
        },
        organicAlternative: "Neem oil 10,000 ppm @ 3ml/L spray to destroy mite colonies",
        recoveryPlan: ["Uproot and destroy infected stunted plants immediately", "Spray micronutrients to boost healthy plants"],
        highestRiskStage: "Vegetative growth stage (Day 30-75)"
      }
    ],
    growthPlan: [
      { stageName: "Sowing & Early Vegetative", dayRange: "Day 1 - 40", activities: ["Intercrop with soybean/sorghum", "Trichoderma seed treatment"] },
      { stageName: "Branching & Mite Scouting", dayRange: "Day 41 - 90", activities: ["Scout for pale bushy shoots (Sterility Mosaic)", "Rogue infected plants"] },
      { stageName: "Flowering & Pod Borer Dual Spray", dayRange: "Day 91 - 180", activities: ["Dual spray Chlorantraniliprole at flowering & podding", "Harvest when 80% pods turn brown"] }
    ]
  },
  {
    id: "moong_urad",
    name: "Moong (Green Gram) & Urad (Black Gram)",
    category: "Pulses & Oilseeds",
    season: "Kharif (Jun–Sep) or Summer (Mar–Jun)",
    durationDays: 70,
    suitableSoilTypes: ["Loamy Soil", "Alluvial Soil", "Black Cotton Soil"],
    expectedYieldPerAcre: "4 - 7 Quintals",
    waterRequirements: "Low (250-300 mm)",
    diseases: [
      {
        name: "Yellow Mosaic Virus (YMV)",
        category: "viral",
        symptoms: "Bright yellow and green mottled patches on leaves, expanding to complete leaf yellowing and stunted pods.",
        cause: "Whitefly (Bemisia tabaci) transmitting virus during dry warm weather.",
        prevention: ["Seed treatment with Imidacloprid 600FS @ 5ml/kg", "Yellow sticky traps @ 15/acre", "Rogue infected yellow plants immediately"],
        curativeTreatment: {
          product: "Imidacloprid 17.8SL or Dimethoate 30EC",
          dosagePerAcre: "50ml Imidacloprid / acre in 150L water",
          applicationMethod: "Foliar spray at 15-20 days stage to kill whiteflies before virus spreads",
          brandExamples: ["Confidor", "Rogor", "Saaf"]
        },
        organicAlternative: "Neem Seed Kernel Extract 5% or 3% Neem oil spray",
        recoveryPlan: ["Uproot infected yellow plants", "Control whitefly vector continuously"],
        highestRiskStage: "Early Vegetative stage (Day 15-35)"
      }
    ],
    growthPlan: [
      { stageName: "Sowing & Whitefly Defense", dayRange: "Day 1 - 15", activities: ["Imidacloprid seed treatment", "Install yellow sticky traps"] },
      { stageName: "Vegetative & YMV Scouting", dayRange: "Day 16 - 35", activities: ["Rogue yellow plants", "Spray Confidor if whitefly present"], pestRiskWindow: "Yellow Mosaic Virus critical window (Day 15-30)" },
      { stageName: "Podding & Harvest", dayRange: "Day 36 - 70", activities: ["Picking of mature black/brown pods", "Threshing and drying"] }
    ]
  },
  {
    id: "groundnut",
    name: "Groundnut (Peanut)",
    category: "Pulses & Oilseeds",
    season: "Kharif (Jun–Oct) or Summer (Jan–Apr)",
    durationDays: 110,
    suitableSoilTypes: ["Sandy Soil", "Red Soil", "Loamy Soil"],
    expectedYieldPerAcre: "12 - 18 Quintals",
    waterRequirements: "Moderate (450-500 mm)",
    diseases: [
      {
        name: "Tikka Leaf Spot (Cercospora arachidicola)",
        category: "fungal",
        symptoms: "Dark brown to black circular spots surrounded by yellow halos on leaves, causing severe premature defoliation.",
        cause: "High humidity (>85%) and warm temperatures (25-30°C).",
        prevention: ["Seed treatment with Thiram 75WP + Carbendazim @ 3g/kg", "Crop rotation", "Apply Gypsum at pegging stage"],
        curativeTreatment: {
          product: "Hexaconazole 5%EC or Mancozeb 75WP + Carbendazim 50WP",
          dosagePerAcre: "250ml Hexaconazole / acre in 200L water",
          applicationMethod: "Foliar spray at 40 and 60 days stage",
          brandExamples: ["Contaf Plus", "Saaf", "Indofil M-45"]
        },
        organicAlternative: "Sour butter milk (1L in 10L water) or Panchagavya 3% spray",
        recoveryPlan: ["Ensure good field drainage", "Apply Gypsum top-dressing @ 200kg/acre"],
        highestRiskStage: "Pegging to Pod filling stage (Day 40-75)"
      },
      {
        name: "White Grub (Holotrichia consanguinea)",
        category: "insect",
        symptoms: "C-shaped white grubs chew taproots, causing sudden wilting and drying of plants in patches.",
        cause: "Soil-dwelling grubs hatching after first monsoon rain.",
        prevention: ["Seed treatment with Chlorpyrifos 20EC @ 10ml/kg seed", "Deep summer plowing", "Light traps for adult beetles"],
        curativeTreatment: {
          product: "Phorate 10G or Fipronil 0.3GR",
          dosagePerAcre: "4 - 5 kg Phorate / acre broadcast into soil near root zone",
          applicationMethod: "Soil incorporation followed by light irrigation",
          brandExamples: ["Thimet 10G", "Regent 0.3G"]
        },
        organicAlternative: "Soil drench with Metarhizium anisopliae bio-insecticide @ 2kg/acre",
        recoveryPlan: ["Soil incorporation of Phorate granules", "Irrigate field to settle soil"],
        highestRiskStage: "Seedling to Pegging stage (Day 15-50)"
      }
    ],
    growthPlan: [
      { stageName: "Sowing & Seed Protection", dayRange: "Day 1 - 10", activities: ["Thiram+Carbendazim seed treatment", "Sow in well prepared loose soil"] },
      { stageName: "Pegging & Gypsum Application", dayRange: "Day 11 - 45", activities: ["Apply Gypsum @ 200kg/acre near root zone at Day 40 (Pegging)", "Avoid soil disturbance during peg entry"], pestRiskWindow: "White Grub root damage phase (Day 20-45)" },
      { stageName: "Pod Expansion & Tikka Defense", dayRange: "Day 46 - 110", activities: ["Spray Hexaconazole for Tikka leaf spot", "Harvest when pod inner shell turns dark brown"] }
    ]
  },
  {
    id: "mustard",
    name: "Mustard / Rapeseed",
    category: "Pulses & Oilseeds",
    season: "Rabi (Oct–Mar)",
    durationDays: 100,
    suitableSoilTypes: ["Loamy Soil", "Alluvial Soil", "Sandy Soil"],
    expectedYieldPerAcre: "8 - 12 Quintals",
    waterRequirements: "Low (250-300 mm, 2 critical irrigations)",
    diseases: [
      {
        name: "Mustard Aphid (Lipaphis erysimi)",
        category: "insect",
        symptoms: "Dense green/black insect colonies clustering on growing shoots, flower stalks, and young pods; honeydew honey coating.",
        cause: "Cloudy, humid, cool weather (15-20°C) during flowering.",
        prevention: ["Sow early before Oct 15 to escape aphid peak", "Yellow sticky traps @ 15/acre", "Balanced fertilizer"],
        curativeTreatment: {
          product: "Imidacloprid 17.8SL or Dimethoate 30EC",
          dosagePerAcre: "60ml Imidacloprid or 250ml Dimethoate / acre in 200L water",
          applicationMethod: "Foliar spray targeting terminal flower shoots when aphid population > 20/plant shoot",
          brandExamples: ["Confidor", "Rogor", "Metasystox"]
        },
        organicAlternative: "5% Neem Seed Kernel Extract spray or Verticillium lecanii 5g/L",
        recoveryPlan: ["Spray in evening to avoid harming honeybee pollinators", "Rescan flower tips in 4 days"],
        highestRiskStage: "Flowering & Pod formation (Day 40-75)"
      }
    ],
    growthPlan: [
      { stageName: "Sowing & Thinning", dayRange: "Day 1 - 25", activities: ["Metalaxyl seed treatment", "Thinning at Day 15 to maintain 10cm spacing"] },
      { stageName: "Flowering & Aphid Scouting", dayRange: "Day 26 - 65", activities: ["1st irrigation at flowering", "Inspect terminal shoots for aphid clusters", "Spray Imidacloprid if needed"], pestRiskWindow: "Mustard Aphid peak window (Day 40-65)" },
      { stageName: "Pod Development & Harvest", dayRange: "Day 66 - 100", activities: ["Provide 2nd irrigation at pod filling", "Harvest when pods (siliquae) turn golden yellow"] }
    ]
  },
  {
    id: "soybean",
    name: "Soybean",
    category: "Pulses & Oilseeds",
    season: "Kharif (Jun–Oct)",
    durationDays: 100,
    suitableSoilTypes: ["Black Cotton Soil", "Loamy Soil", "Alluvial Soil"],
    expectedYieldPerAcre: "10 - 15 Quintals",
    waterRequirements: "Moderate (450-550 mm)",
    diseases: [
      {
        name: "Girdle Beetle (Obereopsis brevis)",
        category: "insect",
        symptoms: "Two parallel ring girdles cut on stem/leaf petioles; plant above girdle wilts and snaps off.",
        cause: "Female beetle cutting girdles on stems to insert eggs in mid-monsoon.",
        prevention: ["Seed treatment with Thiamethoxam 30FS @ 10ml/kg", "Scout stem bases from Day 20"],
        curativeTreatment: {
          product: "Chlorantraniliprole 18.5SC or Triazophos 40EC",
          dosagePerAcre: "60ml Chlorantraniliprole or 300ml Triazophos / acre in 200L water",
          applicationMethod: "Foliar spray as soon as first girdle ring is noticed",
          brandExamples: ["Coragen", "Triazocin", "Ampligo"]
        },
        organicAlternative: "Neem oil 10,000 ppm spray @ 3ml/L water",
        recoveryPlan: ["Manually collect and destroy girdled cut plant parts", "Spray systemic insecticide"],
        highestRiskStage: "Vegetative stage (Day 20-50)"
      }
    ],
    growthPlan: [
      { stageName: "Sowing & Seed Treatment", dayRange: "Day 1 - 10", activities: ["Thiamethoxam seed treatment + Bradyrhizobium inoculation"] },
      { stageName: "Vegetative & Girdle Beetle Watch", dayRange: "Day 11 - 45", activities: ["Inspect stems for girdle cut rings", "Spray Coragen if girdling spotted"], pestRiskWindow: "Girdle Beetle & Stem Fly phase (Day 20-45)" },
      { stageName: "Pod Filling & Harvest", dayRange: "Day 46 - 100", activities: ["Pod filling irrigation if dry spell", "Harvest when leaves drop and pods turn straw brown"] }
    ]
  },

  // SECTION C — COMMERCIAL CROPS
  {
    id: "cotton",
    name: "Cotton",
    category: "Commercial Crops",
    season: "Kharif (May–Jan)",
    durationDays: 160,
    suitableSoilTypes: ["Black Cotton Soil", "Deep Clayey Soil", "Alluvial Soil"],
    expectedYieldPerAcre: "10 - 16 Quintals (Kapas)",
    waterRequirements: "High (600-800 mm)",
    diseases: [
      {
        name: "Pink Bollworm (Pectinophora gossypiella)",
        category: "insect",
        symptoms: "Rosette (fused closed) pink flowers, small exit pinholes in green bolls, stained lint, and damaged seeds inside boll.",
        cause: "Larvae boring directly into green bolls during square/boll stage.",
        prevention: ["Install pheromone traps @ 8/acre from Day 45", "Avoid extending crop beyond December", "Sow BG-II hybrids"],
        curativeTreatment: {
          product: "Profenofos 40% + Cypermethrin 4%EC or Spinetoram 11.7SC",
          dosagePerAcre: "400ml Profenofos+Cyper / acre in 200L water",
          applicationMethod: "Spray at peak boll development when pheromone trap catches exceed 8 moths/trap/night for 3 consecutive nights",
          brandExamples: ["Profex Super", "Delegate", "Curacron"]
        },
        organicAlternative: "Release Trichogrammatoidea bactrae egg parasitoid @ 50,000/acre at weekly intervals",
        recoveryPlan: ["Manually pick and destroy rosette flowers", "Do not repeat same chemical mode of action"],
        highestRiskStage: "Squaring & Boll formation (Day 60-120)"
      },
      {
        name: "Whitefly & Sucking Pests Complex",
        category: "insect",
        symptoms: "Leaf curling, shiny honeydew honey layer on leaves attracting black sooty mold, transmitted Leaf Curl Virus.",
        cause: "Bemisia tabaci thriving in hot dry spells during vegetative stage.",
        prevention: ["Seed treatment with Imidacloprid 70WS @ 7g/kg", "Yellow sticky traps @ 25/acre", "Avoid synthetic pyrethroid sprays early"],
        curativeTreatment: {
          product: "Diafenthiuron 50WP or Flonicamid 50WG",
          dosagePerAcre: "250g Diafenthiuron or 80g Flonicamid / acre in 200L water",
          applicationMethod: "Foliar spray with underside leaf coverage",
          brandExamples: ["Polo", "Ulala", "Lancer Gold"]
        },
        organicAlternative: "Neem oil 10,000 ppm @ 3ml/L or Castor oil soap spray",
        recoveryPlan: ["Alternate chemical modes of action to prevent whitefly resistance", "Apply potash spray"],
        highestRiskStage: "Vegetative to Squaring (Day 30-75)"
      }
    ],
    growthPlan: [
      { stageName: "Sowing & Germination", dayRange: "Day 1 - 20", activities: ["Imidacloprid seed treatment", "Maintain 90cm x 60cm row spacing"] },
      { stageName: "Squaring & Sucking Pest Defense", dayRange: "Day 21 - 60", activities: ["Install yellow sticky traps", "Spray Flonicamid if whitefly/thrips cross threshold"], pestRiskWindow: "Whitefly & Thrips phase (Day 25-55)" },
      { stageName: "Boll Formation & Pink Bollworm Defense", dayRange: "Day 61 - 120", activities: ["Install pheromone traps", "Spray Profex Super if moth count > 8/trap", "Stop irrigation at 50% boll opening"], pestRiskWindow: "Pink Bollworm critical window (Day 65-110)" },
      { stageName: "Boll Opening & Picking", dayRange: "Day 121 - 160", activities: ["Clean manual picking of open bolls", "Store in clean dry place"], wildlifeProtection: "Solar ultrasonic animal deterrents for wild boars" }
    ]
  },
  {
    id: "sugarcane",
    name: "Sugarcane",
    category: "Commercial Crops",
    season: "Planted Jan–Mar or Oct (12 Months)",
    durationDays: 360,
    suitableSoilTypes: ["Loamy Soil", "Clayey Soil", "Alluvial Soil", "Black Cotton Soil"],
    expectedYieldPerAcre: "35 - 50 Tonnes",
    waterRequirements: "Very High (1500-2000 mm)",
    diseases: [
      {
        name: "Early Shoot Borer (Chilo infuscatellus)",
        category: "insect",
        symptoms: "Drying of central young leaf spindle forming 'dead-heart' that can be pulled out easily with foul odor.",
        cause: "Larvae boring into young shoots near ground level during hot summer months.",
        prevention: ["Sett treatment with Carbendazim 0.1% solution", "Trash mulching in inter-rows", "Earthing up by Day 45"],
        curativeTreatment: {
          product: "Fipronil 0.3%GR or Chlorantraniliprole 0.4%GR",
          dosagePerAcre: "8-10 kg Fipronil or 7.5 kg Chlorantraniliprole granules / acre",
          applicationMethod: "Soil incorporation along cane rows followed by immediate irrigation",
          brandExamples: ["Regent 0.3G", "Ferterra", "Virtako"]
        },
        organicAlternative: "Release Granulosis Virus (GV) @ 10^9 inclusion bodies/ml or Trichogramma chilonis @ 20,000/acre",
        recoveryPlan: ["Manually pull out and destroy dead-heart shoots", "Irrigate field to promote tillering"],
        highestRiskStage: "Early shoot phase (Month 2 to 4)"
      }
    ],
    growthPlan: [
      { stageName: "Sett Planting & Germination", dayRange: "Month 1", activities: ["Sett dip treatment with Carbendazim (1g/L)", "Plant 3-bud setts in furrows"] },
      { stageName: "Early Shoot & Borer Soil Granules", dayRange: "Month 2 - 4", activities: ["Apply Chlorantraniliprole granules into soil", "Earthing up", "Weeding"], pestRiskWindow: "Early Shoot Borer window (Month 2-4)" },
      { stageName: "Grand Growth & Wrapping", dayRange: "Month 5 - 9", activities: ["Heavy irrigation and nitrogen top dressing", "Propping/wrapping cane stalks to prevent lodging"] },
      { stageName: "Maturity & Harvesting", dayRange: "Month 10 - 12", activities: ["Withhold irrigation 30 days prior to harvest", "Brix testing for sugar content", "Base cutting near soil level"] }
    ]
  },
  {
    id: "jute",
    name: "Jute",
    category: "Commercial Crops",
    season: "Kharif (Mar–Aug)",
    durationDays: 120,
    suitableSoilTypes: ["Alluvial Soil", "Clayey Soil", "Peaty & Marshy Soil"],
    expectedYieldPerAcre: "12 - 15 Quintals (Fiber)",
    waterRequirements: "High (1000-1200 mm)",
    diseases: [
      {
        name: "Jute Semilooper (Anomis sabulifera)",
        category: "insect",
        symptoms: "Caterpillars feed on apical leaves from margins inward, skeletonizing leaves and arresting apical height growth.",
        cause: "Moths laying eggs on young top leaves during warm humid weather.",
        prevention: ["Deep summer plowing", "Perches for insectivorous birds", "Seed treatment with Carbendazim @ 2g/kg"],
        curativeTreatment: {
          product: "Quinalphos 25EC or Profenofos 50EC",
          dosagePerAcre: "400ml Quinalphos / acre in 200L water",
          applicationMethod: "Foliar spray on top canopy when caterpillar count exceeds 15% leaf damage",
          brandExamples: ["Ekalux", "Curacron", "Bavistin"]
        },
        organicAlternative: "Neem oil 10,000 ppm @ 3ml/L spray",
        recoveryPlan: ["Spray top leaves to preserve fiber shoot height", "Light urea application"],
        highestRiskStage: "Vegetative growth (Day 40-70)"
      }
    ],
    growthPlan: [
      { stageName: "Sowing & Thinning", dayRange: "Day 1 - 25", activities: ["Carbendazim seed treatment", "Thinning to maintain 7cm spacing"] },
      { stageName: "Fiber Growth & Pest Scouting", dayRange: "Day 26 - 80", activities: ["Inter-cultivation", "Spray Quinalphos if semilooper seen"], pestRiskWindow: "Semilooper & Stem Rot phase (Day 40-70)" },
      { stageName: "Harvesting & Retting", dayRange: "Day 81 - 120", activities: ["Harvest at 50% flowering stage for best fiber quality", "Submerge stems in clean slow water for retting"] }
    ]
  },
  {
    id: "tobacco",
    name: "Tobacco",
    category: "Commercial Crops",
    season: "Rabi (Oct–Mar)",
    durationDays: 120,
    suitableSoilTypes: ["Light Sandy Soil", "Loamy Soil", "Black Cotton Soil"],
    expectedYieldPerAcre: "8 - 12 Quintals",
    waterRequirements: "Moderate (400-500 mm)",
    extraNotes: "⚠️ NOTE: Chemical dosages for tobacco are subject to strict regional tobacco board export standards. Source verified local agronomy label data before application.",
    diseases: [
      {
        name: "Black Shank (Phytophthora nicotianae)",
        category: "fungal",
        symptoms: "Blackened stem bases at soil level, wilting of leaves, and disk-like pith drying inside stem base.",
        cause: "Soil-borne oomycete multiplying in waterlogged poorly-drained soil.",
        prevention: ["Use raised nursery beds", "Ensure strict field drainage", "Crop rotation with paddy or maize"],
        curativeTreatment: {
          product: "Metalaxyl 8% + Mancozeb 64%WP soil drench",
          dosagePerAcre: "500g / acre in 200L water (Local Agronomy Label Verification Required)",
          applicationMethod: "Soil drenching around plant collar zone at early wilt onset",
          brandExamples: ["Ridomil Gold", "Curzate"]
        },
        organicAlternative: "Trichoderma harzianum soil application mixed with compost",
        recoveryPlan: ["Improve drainage trenches immediately", "Rogue out completely blackened dead plants"],
        highestRiskStage: "Transplanting & Early establishment (Day 15-45)",
        incompleteDataNotice: "Verify exact regional tobacco board approved chemical lists and pre-harvest intervals before spraying."
      }
    ],
    growthPlan: [
      { stageName: "Nursery & Raised Bed Transplanting", dayRange: "Day 1 - 30", activities: ["Raise seedlings in solarized beds", "Transplant to well drained field"] },
      { stageName: "Vegetative & Topping", dayRange: "Day 31 - 70", activities: ["Topping (removal of flower head)", "Sucker control application"], pestRiskWindow: "Black shank & TMV window (Day 20-50)" },
      { stageName: "Priming & Curing Harvest", dayRange: "Day 71 - 120", activities: ["Harvest leaf-by-leaf (priming) as bottom leaves turn yellowish", "Flue curing / Air curing"] }
    ]
  },

  // SECTION D — VEGETABLES
  {
    id: "potato",
    name: "Potato",
    category: "Vegetables",
    season: "Rabi (Oct–Feb)",
    durationDays: 100,
    suitableSoilTypes: ["Loamy Soil", "Sandy Soil", "Alluvial Soil"],
    expectedYieldPerAcre: "120 - 160 Quintals",
    waterRequirements: "Moderate (500-600 mm)",
    diseases: [
      {
        name: "Late Blight (Phytophthora infestans)",
        category: "fungal",
        symptoms: "Water-soaked dark brown spots on leaf tips and margins with white downy mold underneath in humid morning; rapid field destruction.",
        cause: "Cool temperatures (12-20°C) combined with high relative humidity (>90%) and persistent cloud/fog.",
        prevention: ["Boric acid 1% tuber dip before planting", "Earthing up at Day 25-30 to cover developing tubers from spores", "Prophylactic Mancozeb spray before fog onset"],
        curativeTreatment: {
          product: "Cymoxanil 8% + Mancozeb 64%WP or Metalaxyl+Mancozeb",
          dosagePerAcre: "600g Cymoxanil+Mancozeb / acre in 200L water",
          applicationMethod: "Foliar spray immediately upon first water-soaked spot sighting",
          brandExamples: ["Curzate", "Ridomil Gold", "Saaf"]
        },
        organicAlternative: "Foliar spray of Copper Oxychloride 50WP @ 3g/L or Trichoderma viride 10g/L",
        recoveryPlan: ["Re-spray with different systemic fungicide in 7 days if foggy weather continues", "Haulm cutting (stem clipping) 10 days pre-harvest to protect tubers"],
        highestRiskStage: "Tuberization to Bulking stage (Day 40-75)"
      }
    ],
    growthPlan: [
      { stageName: "Tuber Planting & Earthing Up", dayRange: "Day 1 - 30", activities: ["Plant well-sprouted disease-free seed tubers", "Earthing up at Day 25 to build deep soil ridges"], pestRiskWindow: "Cutworm & early blight phase (Day 15-30)" },
      { stageName: "Tuber Expansion & Late Blight Defense", dayRange: "Day 31 - 75", activities: ["Monitor weather for cool humid fog", "Prophylactic spray of Mancozeb / Curzate"], pestRiskWindow: "Late Blight CRITICAL DANGER WINDOW (Day 40-70)" },
      { stageName: "Haulm Cutting & Tuber Harvesting", dayRange: "Day 76 - 100", activities: ["Stop irrigation 10 days pre-harvest", "Cut green tops (haulms)", "Dig tubers carefully"] }
    ]
  },
  {
    id: "tomato",
    name: "Tomato",
    category: "Vegetables",
    season: "Year-round",
    durationDays: 140,
    suitableSoilTypes: ["Loamy Soil", "Alluvial Soil", "Red Soil"],
    expectedYieldPerAcre: "150 - 250 Quintals",
    waterRequirements: "Moderate to High (600-700 mm, drip recommended)",
    diseases: [
      {
        name: "Tomato Early & Late Blight",
        category: "fungal",
        symptoms: "Concentric target-like brown spots (Early Blight) or water-soaked expanding brown lesions with white mold (Late Blight).",
        cause: "Alternaria solani / Phytophthora infestans under humid warm/cool weather cycles.",
        prevention: ["Root dip in Pseudomonas fluorescens @ 10g/L before transplanting", "Staking plants off ground", "Mulching with plastic sheet"],
        curativeTreatment: {
          product: "Azoxystrobin 18.2% + Difenoconazole 11.4%SC",
          dosagePerAcre: "200ml / acre in 200L water",
          applicationMethod: "Foliar spray targeting upper and lower canopy",
          brandExamples: ["Amistar Top", "Score", "Natty"]
        },
        organicAlternative: "Copper Hydroxide 77WP @ 2g/L or Neem oil 3ml/L spray",
        recoveryPlan: ["Prune lower blighted foliage", "Apply Potash to strengthen skin"],
        highestRiskStage: "Flowering & Fruiting picking stage (Day 45-110)"
      },
      {
        name: "Fruit Borer & Tuta Absoluta",
        category: "insect",
        symptoms: "Bored holes in green tomatoes (Helicoverpa) or blotch mines/tunnels inside leaf lamina and pinholes near calyx (Tuta).",
        cause: "Moths laying eggs on leaves and young fruit.",
        prevention: ["Pheromone traps @ 12/acre for Tuta & Helicoverpa", "Marigold trap crop every 16 rows", "Insect-proof netting"],
        curativeTreatment: {
          product: "Spinosad 45SC or Chlorantraniliprole 18.5SC",
          dosagePerAcre: "75ml Spinosad or 60ml Chlorantraniliprole / acre in 200L water",
          applicationMethod: "Foliar spray when leaf mines or fruit holes first appear",
          brandExamples: ["Tracer", "Coragen", "Delegate"]
        },
        organicAlternative: "Spray Bacillus thuringiensis (Bt) @ 2g/L or 5% NSKE",
        recoveryPlan: ["Manually pick and destroy bored fruits", "Clean fallen fruits from field floor"],
        highestRiskStage: "Fruiting picking phase (Day 60-120)"
      }
    ],
    growthPlan: [
      { stageName: "Nursery & Root Dip Transplanting", dayRange: "Day 1 - 25", activities: ["Grow seedlings under 40-mesh insect net", "Root dip in Pseudomonas"] },
      { stageName: "Staking & Drip Irrigation", dayRange: "Day 26 - 65", activities: ["Bamboo staking and twine tying", "Install pheromone traps", "Spray Amistar Top"], pestRiskWindow: "Blight & Whitefly Leaf Curl window (Day 35-65)" },
      { stageName: "Harvest Picking Phase", dayRange: "Day 66 - 140", activities: ["Pick fruits every 3 days at breaker stage", "Alternate Spinosad / Coragen for borer"], wildlifeProtection: "Netting to protect ripe fruits from birds/monkeys" }
    ]
  },
  {
    id: "chilli",
    name: "Chilli / Hot Pepper",
    category: "Vegetables",
    season: "Kharif/Rabi (Jul–Mar)",
    durationDays: 150,
    suitableSoilTypes: ["Red Soil", "Loamy Soil", "Black Cotton Soil"],
    expectedYieldPerAcre: "50 - 80 Quintals (Green Chilli)",
    waterRequirements: "Moderate (500-600 mm)",
    diseases: [
      {
        name: "Chilli Murda Complex (Mites & Thrips)",
        category: "insect",
        symptoms: "Leaf curling: Upward boat-shaped curling (Thrips) or Downward inverted cup curling with bronzing (Mites).",
        cause: "Scirtothrips dorsalis and Polyphagotarsonemus latus attacking growing shoot tips in dry hot weather.",
        prevention: ["Silver-black plastic mulch", "Pseudomonas seed treatment", "Blue & Yellow sticky traps @ 15 each/acre"],
        curativeTreatment: {
          product: "Spiromesifen 22.9SC + Fipronil 80WG",
          dosagePerAcre: "200ml Spiromesifen + 40g Fipronil / acre in 200L water",
          applicationMethod: "Foliar spray focusing on growing tips",
          brandExamples: ["Oberon", "Jump", "Keefun"]
        },
        organicAlternative: "Neem oil 10,000 ppm @ 3ml/L or Vermicompost wash spray",
        recoveryPlan: ["Prune curled terminal growing tips", "Spray micronutrient combination containing Boron and Zinc"],
        highestRiskStage: "Vegetative to Flowering (Day 30-80)"
      }
    ],
    growthPlan: [
      { stageName: "Nursery & Transplanting", dayRange: "Day 1 - 25", activities: ["Silver black plastic mulching", "Transplant 25 day seedlings"] },
      { stageName: "Vegetative & Murda Defense", dayRange: "Day 26 - 70", activities: ["Install blue & yellow sticky traps", "Spray Oberon + Jump for curling"], pestRiskWindow: "Murda Complex Thrips/Mites critical window (Day 30-70)" },
      { stageName: "Fruit Picking & Dieback Control", dayRange: "Day 71 - 150", activities: ["Pick green chillies every 5 days", "Spray Nativo for fruit rot / dieback"] }
    ]
  },
  {
    id: "onion_garlic",
    name: "Onion & Garlic",
    category: "Vegetables",
    season: "Rabi (Oct–Apr) or Kharif (Jun–Oct)",
    durationDays: 120,
    suitableSoilTypes: ["Loamy Soil", "Alluvial Soil", "Sandy Soil"],
    expectedYieldPerAcre: "100 - 140 Quintals",
    waterRequirements: "Moderate (400-500 mm)",
    diseases: [
      {
        name: "Purple Blotch & Stemphylium Blight",
        category: "fungal",
        symptoms: "Purplish oval lesions with yellow halos on leaves, turning brown and drying down from leaf tip.",
        cause: "Alternaria porri favored by warm humid weather and high dew.",
        prevention: ["Thiram bulb treatment @ 3g/kg", "Avoid over-irrigation"],
        curativeTreatment: {
          product: "Mancozeb 75WP + Hexaconazole 5%EC",
          dosagePerAcre: "600g Mancozeb + 250ml Hexaconazole / acre in 200L water",
          applicationMethod: "Foliar spray with sticker added to water",
          brandExamples: ["Indofil M-45", "Contaf", "Saaf"]
        },
        organicAlternative: "Trichoderma viride 10g/L spray with sticker",
        recoveryPlan: ["Add sticker (surfactant) to tank mix due to waxy onion leaf surface", "Stop irrigation 10 days pre-harvest"],
        highestRiskStage: "Bulbing stage (Day 50-90)"
      }
    ],
    growthPlan: [
      { stageName: "Bed Prep & Bulb/Seedling Planting", dayRange: "Day 1 - 15", activities: ["Thiram seed/bulb treatment", "Raised bed planting"] },
      { stageName: "Vegetative & Thrips Scouting", dayRange: "Day 16 - 55", activities: ["Weeding and light irrigation", "Spray Fipronil if thrips seen in leaf axils"], pestRiskWindow: "Thrips & Purple Blotch phase (Day 30-60)" },
      { stageName: "Bulbing & Harvest Drying", dayRange: "Day 56 - 120", activities: ["Bulbing expansion", "Stop water 10 days pre-harvest", "Neck fall stage harvesting"] }
    ]
  },
  {
    id: "brinjal",
    name: "Brinjal (Eggplant)",
    category: "Vegetables",
    season: "Year-round",
    durationDays: 140,
    suitableSoilTypes: ["Loamy Soil", "Alluvial Soil", "Red Soil"],
    expectedYieldPerAcre: "120 - 180 Quintals",
    waterRequirements: "Moderate to High (600-700 mm)",
    diseases: [
      {
        name: "Shoot & Fruit Borer (Leucinodes orbonalis)",
        category: "insect",
        symptoms: "Wilted dropping terminal shoots with small entry holes; bored holes filled with frass inside fruits.",
        cause: "Moth laying eggs on tender shoots and fruits.",
        prevention: ["Pheromone traps @ 10/acre", "Trichoderma seed treatment @ 10g/kg", "Clip wilted shoots daily"],
        curativeTreatment: {
          product: "Emamectin Benzoate 5SG or Chlorantraniliprole 18.5SC",
          dosagePerAcre: "80g Emamectin or 60ml Chlorantraniliprole / acre in 200L water",
          applicationMethod: "Alternate sprays every 15 days during fruiting",
          brandExamples: ["Proclaim", "Coragen", "Delegate"]
        },
        organicAlternative: "Neem oil 10,000 ppm @ 3ml/L or Bt spray @ 2g/L",
        recoveryPlan: ["Manually clip off wilted shoots and bury them", "Harvest clean fruits regularly"],
        highestRiskStage: "Fruiting stage (Day 40-120)"
      }
    ],
    growthPlan: [
      { stageName: "Nursery & Field Transplanting", dayRange: "Day 1 - 25", activities: ["Trichoderma seed treatment", "Transplant into ridges"] },
      { stageName: "Vegetative & Shoot Clipping", dayRange: "Day 26 - 60", activities: ["Clip wilted terminal shoots daily", "Install pheromone traps"], pestRiskWindow: "Shoot Borer onset (Day 30-55)" },
      { stageName: "Fruit Harvesting Phase", dayRange: "Day 61 - 140", activities: ["Harvest fruits every 4 days", "Alternate Proclaim and Coragen sprays"] }
    ]
  },
  {
    id: "cabbage_cucurbits",
    name: "Cabbage, Cauliflower & Cucurbits",
    category: "Vegetables",
    season: "Crucifers 90d (Rabi) / Cucurbits 100d (Kharif/Summer)",
    durationDays: 90,
    suitableSoilTypes: ["Loamy Soil", "Alluvial Soil", "Sandy Soil"],
    expectedYieldPerAcre: "100 - 150 Quintals",
    waterRequirements: "Moderate (400-500 mm)",
    diseases: [
      {
        name: "Diamondback Moth (Crucifers) / Downy Mildew (Cucurbits)",
        category: "insect",
        symptoms: "Window-pane leaf feeding (DBM in Cabbage) or yellow angular patches on upper leaf with gray downy growth underneath (Cucurbits).",
        cause: "Plutella xylostella caterpillar (Crucifers) or Pseudoperonospora cubensis (Cucurbits).",
        prevention: ["Cue-lure fruit fly traps @ 10/acre for cucurbits", "Mustard trap crop for DBM", "Trellis netting support"],
        curativeTreatment: {
          product: "Spinetoram 11.7SC (DBM) or Cymoxanil+Mancozeb (Downy)",
          dosagePerAcre: "100ml Spinetoram or 600g Cymoxanil+Mancozeb / acre in 200L water",
          applicationMethod: "Foliar spray targeting leaf underside at dawn",
          brandExamples: ["Delegate", "Curzate", "Karathane"]
        },
        organicAlternative: "Bt spray @ 2g/L for DBM or Trichoderma for Downy Mildew",
        recoveryPlan: ["Check lower leaf undersides at dawn for gray downy spores", "Maintain canopy aeration"],
        highestRiskStage: "Vegetative to Heading / Fruiting (Day 30-70)"
      }
    ],
    growthPlan: [
      { stageName: "Planting & Trellising", dayRange: "Day 1 - 25", activities: ["Install Cue-lure traps", "Trellis support for cucurbits"] },
      { stageName: "Vegetative & Pest Monitoring", dayRange: "Day 26 - 60", activities: ["Inspect leaf undersides at dawn for downy fuzz", "Spray Delegate for DBM"], pestRiskWindow: "DBM & Downy Mildew critical phase (Day 30-55)" },
      { stageName: "Head / Fruit Harvest", dayRange: "Day 61 - 90", activities: ["Harvest firm heads or tender cucurbit fruits"] }
    ]
  },

  // SECTION E — FLOWERS & PLANTATION CROPS
  {
    id: "rose",
    name: "Rose",
    category: "Flowers & Plantation Crops",
    season: "Perennial (Pruning Oct–Nov)",
    durationDays: 365,
    suitableSoilTypes: ["Loamy Soil", "Red Soil", "Alluvial Soil"],
    expectedYieldPerAcre: "80,000 - 120,000 Cut Flowers",
    waterRequirements: "Moderate (Drip irrigation daily)",
    diseases: [
      {
        name: "Black Spot & Thrips",
        category: "fungal",
        symptoms: "Fringed black circular spots on leaves with yellowing foliage; curled flower petals with brown edges.",
        cause: "Diplocarpon rosae fungus under wet leaves and Frankliniella thrips in tender buds.",
        prevention: ["Annual pruning in Oct-Nov keeping bush center open", "Avoid overhead sprinkler watering"],
        curativeTreatment: {
          product: "Hexaconazole 5%EC + Fipronil 5SC",
          dosagePerAcre: "250ml Hexaconazole + 250ml Fipronil / acre in 200L water",
          applicationMethod: "Foliar spray on new shoot flush and flower buds",
          brandExamples: ["Contaf", "Regent 5SC", "Amistar"]
        },
        organicAlternative: "Neem oil 3ml/L + Baking soda 2g/L spray",
        recoveryPlan: ["Prune black-spotted leaves and burn", "Apply rose mix micronutrient meal"],
        highestRiskStage: "New flush after pruning & Bud formation"
      }
    ],
    growthPlan: [
      { stageName: "Annual Pruning & Base Manuring", dayRange: "Oct - Nov", activities: ["Hard/medium pruning of older canes", "Apply farmyard manure + neem cake to basin"] },
      { stageName: "Flush Growth & Thrips Watch", dayRange: "Dec - Mar", activities: ["Inspect tender buds for thrips curling", "Spray Hexaconazole + Fipronil"], pestRiskWindow: "Thrips & Black spot flush window" },
      { stageName: "Flower Harvesting & Maintenance", dayRange: "Apr - Sep", activities: ["Harvest tight buds in morning", "Maintain open center canopy"] }
    ]
  },
  {
    id: "marigold",
    name: "Marigold",
    category: "Flowers & Plantation Crops",
    season: "90 days, Year-round",
    durationDays: 90,
    suitableSoilTypes: ["Loamy Soil", "Sandy Soil", "Red Soil"],
    expectedYieldPerAcre: "60 - 90 Quintals (Loose Flowers)",
    waterRequirements: "Low to Moderate",
    diseases: [
      {
        name: "Alternaria Blight & Red Spider Mites",
        category: "fungal",
        symptoms: "Brown necrotic leaf spots and webbed rusty leaves causing premature bloom wilting.",
        cause: "Alternaria zinniae and Tetranychus mites in hot dry spells.",
        prevention: ["Pinch terminal shoot tip at Day 30 to boost branching", "Good plant spacing"],
        curativeTreatment: {
          product: "Mancozeb 75WP + Spiromesifen 22.9SC",
          dosagePerAcre: "600g Mancozeb + 200ml Spiromesifen / acre in 200L water",
          applicationMethod: "Foliar spray covering upper and lower foliage",
          brandExamples: ["Indofil M-45", "Oberon", "Saaf"]
        },
        organicAlternative: "Wettable sulfur spray @ 3g/L",
        recoveryPlan: ["Water crop to eliminate mite heat stress", "Pick mature flowers every 3 days"],
        highestRiskStage: "Pinching to Peak blooming (Day 30-70)"
      }
    ],
    growthPlan: [
      { stageName: "Transplanting & Pinching", dayRange: "Day 1 - 30", activities: ["Transplant 20-day seedlings", "Pinch terminal growing tip at Day 30"] },
      { stageName: "Branching & Flower Picking", dayRange: "Day 31 - 90", activities: ["Pick flowers every 3 days", "Spray Oberon if red spider web spotted"], pestRiskWindow: "Red Spider Mite peak spell (Day 40-70)" }
    ]
  },
  {
    id: "jasmine",
    name: "Jasmine",
    category: "Flowers & Plantation Crops",
    season: "Perennial",
    durationDays: 365,
    suitableSoilTypes: ["Red Soil", "Loamy Soil", "Laterite Soil"],
    expectedYieldPerAcre: "30 - 45 Quintals",
    waterRequirements: "Moderate",
    diseases: [
      {
        name: "Bud Borer & Spider Mites",
        category: "insect",
        symptoms: "Bored holes in floral buds with pinkish discoloration; webbing on leaf undersides.",
        cause: "Hendecasis duplifascialis caterpillars entering flower buds.",
        prevention: ["Pruning in Jan-Feb", "Sanitation around plant basin"],
        curativeTreatment: {
          product: "Profenofos 50EC + Wettable Sulphur 80WP",
          dosagePerAcre: "350ml Profenofos + 1kg Wettable Sulphur / acre in 200L water",
          applicationMethod: "Foliar spray on new bud clusters",
          brandExamples: ["Curacron", "Thiovit", "Confidor"]
        },
        organicAlternative: "Neem oil 3% spray on bud clusters",
        recoveryPlan: ["Collect bored fallen buds", "Spray micronutrients"],
        highestRiskStage: "Peak flowering season (Mar-Aug)"
      }
    ],
    growthPlan: [
      { stageName: "Summer Pruning & Basin Fertilizer", dayRange: "Jan - Feb", activities: ["Prune past flowering shoots", "Apply FYM + Vermicompost"] },
      { stageName: "Bud Emergence & Picking", dayRange: "Mar - Oct", activities: ["Morning bud picking", "Spray Profenofos for Bud Borer"] }
    ]
  },
  {
    id: "chrysanthemum",
    name: "Chrysanthemum",
    category: "Flowers & Plantation Crops",
    season: "120 days, Rabi",
    durationDays: 120,
    suitableSoilTypes: ["Loamy Soil", "Red Soil"],
    expectedYieldPerAcre: "70 - 100 Quintals",
    waterRequirements: "Moderate",
    diseases: [
      {
        name: "Chrysanthemum Rust & Aphids",
        category: "fungal",
        symptoms: "Chocolate brown powdery pustules on underside of leaves; dense green aphid colonies on tender shoots.",
        cause: "Puccinia chrysanthemi fungus and aphid vectors in cool moist weather.",
        prevention: ["Select healthy suckers", "De-budding side buds for large blooms", "Staking"],
        curativeTreatment: {
          product: "Azoxystrobin 23SC + Imidacloprid 17.8SL",
          dosagePerAcre: "200ml Azoxystrobin + 50ml Imidacloprid / acre in 200L water",
          applicationMethod: "Foliar spray with leaf underside coverage",
          brandExamples: ["Amistar", "Confidor", "Saaf"]
        },
        organicAlternative: "Neem seed kernel extract 5% spray",
        recoveryPlan: ["Morning inspection of growing tips", "Apply potash spray"],
        highestRiskStage: "Bud formation & Bloom (Day 50-90)"
      }
    ],
    growthPlan: [
      { stageName: "Sucker Planting & Staking", dayRange: "Day 1 - 40", activities: ["Plant healthy root suckers", "Staking bamboo support"] },
      { stageName: "De-budding & Bloom Spray", dayRange: "Day 41 - 120", activities: ["De-bud side buds", "Spray Amistar + Confidor for rust/aphids"] }
    ]
  },
  {
    id: "tea",
    name: "Tea",
    category: "Flowers & Plantation Crops",
    season: "Perennial",
    durationDays: 365,
    suitableSoilTypes: ["Laterite Soil", "Acidic Red Soil"],
    expectedYieldPerAcre: "800 - 1200 kg Made Tea",
    waterRequirements: "High (1500-2000 mm, continuous humidity)",
    diseases: [
      {
        name: "Red Spider Mite & Tea Mosquito Bug",
        category: "insect",
        symptoms: "Bronze reddish leaf discoloration on upper surface; brownish translucent feeding spots on tender two-leaves-and-a-bud.",
        cause: "Oligonychus coffeae mites in dry hot spells & Helopeltis bugs in humid cloudy periods.",
        prevention: ["Shade tree management", "Clean plucking of flush leaves"],
        curativeTreatment: {
          product: "Propargite 57EC or Thiamethoxam 25WG",
          dosagePerAcre: "400ml Propargite or 40g Thiamethoxam / acre in 200L water",
          applicationMethod: "Foliar spray over plucking table canopy",
          brandExamples: ["Omite", "Actara", "Magister"]
        },
        organicAlternative: "Neem oil 3ml/L spray",
        recoveryPlan: ["Do not tank mix Propargite with strong alkaline mixes", "Maintain shade trees"],
        highestRiskStage: "Dry summer spell & Flush plucking season"
      }
    ],
    growthPlan: [
      { stageName: "Pruning & Skiffing", dayRange: "Dec - Jan", activities: ["Pruning plucking table", "Shade regulation"] },
      { stageName: "Flush Plucking & Mite Spray", dayRange: "Mar - Nov", activities: ["Pluck two leaves and a bud every 7 days", "Spray Omite if red spider spotted"] }
    ]
  },
  {
    id: "coffee",
    name: "Coffee",
    category: "Flowers & Plantation Crops",
    season: "Perennial, Harvest Nov–Feb",
    durationDays: 365,
    suitableSoilTypes: ["Laterite Soil", "Red Soil"],
    expectedYieldPerAcre: "400 - 600 kg Cleaned Beans",
    waterRequirements: "High (1500-2200 mm)",
    diseases: [
      {
        name: "Coffee Leaf Rust & Berry Borer",
        category: "fungal",
        symptoms: "Orange powdery spots on lower surface of leaves causing defoliation; tiny pinhole entry at tip of coffee berry.",
        cause: "Hemileia vastatrix fungus and Hypothenemus hampei borer beetles.",
        prevention: ["Shade tree regulation", "Clean harvest removing leftover gleanings (removes borer breeding sites)"],
        curativeTreatment: {
          product: "1% Bordeaux Mixture or Triadimefon 25WP",
          dosagePerAcre: "1% Fresh Bordeaux or 160g Triadimefon / acre in 200L water",
          applicationMethod: "Foliar spray covering underside of leaf canopy before monsoon",
          brandExamples: ["Bayleton", "Bordeaux Paste"]
        },
        organicAlternative: "1% Bordeaux spray pre-monsoon",
        recoveryPlan: ["Scan leaf undersides with hand lens for orange powdery spores", "Clean all leftover ground berries"],
        highestRiskStage: "Pre-monsoon & Berry filling stage (May-Sep)"
      }
    ],
    growthPlan: [
      { stageName: "Harvest & Gleaning Sanitation", dayRange: "Nov - Feb", activities: ["Harvest ripe red coffee cherries", "Clean all gleanings from floor"] },
      { stageName: "Pre-Monsoon Spray & Shade Trim", dayRange: "May - Oct", activities: ["Spray 1% Bordeaux mixture before monsoon rain", "Regulate shade trees"] }
    ]
  },
  {
    id: "rubber",
    name: "Rubber",
    category: "Flowers & Plantation Crops",
    season: "Perennial, Tapping Year-round",
    durationDays: 365,
    suitableSoilTypes: ["Laterite Soil", "Red Soil"],
    expectedYieldPerAcre: "600 - 900 kg Dry Rubber",
    waterRequirements: "Very High (2000-3000 mm)",
    diseases: [
      {
        name: "Abnormal Leaf Fall & Panel Dry",
        category: "fungal",
        symptoms: "Heavy green leaf drop during monsoon with dull lesion on petiole; tapping cut panel latex flow stoppage.",
        cause: "Phytophthora meadii fungus thriving in continuous monsoon rains.",
        prevention: ["Panel protection paste after tapping", "Prophylactic copper crown spray before monsoon"],
        curativeTreatment: {
          product: "Bordeaux Paste on cut panels / Wettable Sulphur 80WP",
          dosagePerAcre: "Apply paste on cut panel / 1kg Sulphur spray per acre",
          applicationMethod: "Paint paste on tapping cut panel; foliar spray before rain",
          brandExamples: ["Thiovit", "Bordeaux Paste"]
        },
        organicAlternative: "Apply Antagonistic Trichoderma paste on tapping panel",
        recoveryPlan: ["⚠️ DO NOT tank-mix Propargite or Bordeaux mixture with alkaline compounds or organophosphates", "Rest tapping panel"],
        highestRiskStage: "Monsoon onset (Jun-Aug)"
      }
    ],
    growthPlan: [
      { stageName: "Pre-Monsoon Crown Protection", dayRange: "May", activities: ["Aerial / high pressure copper spray on leaf crown", "Apply panel paste"] },
      { stageName: "Monsoon Tapping Rest & Care", dayRange: "Jun - Sep", activities: ["Use rain guards over tapping cut", "Rest panel if panel dry appears"] }
    ]
  },
  {
    id: "coconut",
    name: "Coconut",
    category: "Flowers & Plantation Crops",
    season: "Perennial",
    durationDays: 365,
    suitableSoilTypes: ["Alluvial Soil", "Sandy Coastal Soil", "Laterite Soil", "Peaty Soil"],
    expectedYieldPerAcre: "6000 - 9000 Nuts",
    waterRequirements: "High (1300-2000 mm)",
    diseases: [
      {
        name: "Rhinoceros Beetle & Red Palm Weevil",
        category: "insect",
        symptoms: "V-shaped geometric cuts on inner crown fronds; reddish brown liquid exudation and chewing sound inside trunk.",
        cause: "Oryctes rhinoceros boring crown & Rhynchophorus ferrugineus larvae tunneling trunk.",
        prevention: ["Bunch covering with polypropylene sleeves during month 9-13", "Keep leaf axils clean filled with sand+neem cake (1:1)"],
        curativeTreatment: {
          product: "Stem Injection / Root Feeding of Imidacloprid 17.8SL",
          dosagePerAcre: "10ml Imidacloprid + 10ml water root feeding per palm",
          applicationMethod: "Root feeding into healthy active pencil root",
          brandExamples: ["Confidor", "Regent"]
        },
        organicAlternative: "Place Ferrugineol pheromone traps @ 1 trap/2 acres & Metarhizium bio-agent",
        recoveryPlan: ["Inspect crown and leaf axils for entry holes and gum exudation", "Plug entry holes with sand + carbaryl"],
        highestRiskStage: "Bunch development (Month 9-13)"
      }
    ],
    growthPlan: [
      { stageName: "Axil Cleaning & Basin Manuring", dayRange: "May - Jun", activities: ["Clean leaf axils, apply sand+neem cake", "Apply 50kg compost per palm"] },
      { stageName: "Root Feeding & Harvest", dayRange: "Year-round", activities: ["Root feed Imidacloprid if Red Palm Weevil suspected", "Harvest mature nuts every 45 days"] }
    ]
  },

  // SECTION F — FRUIT CROPS (HORTICULTURE)
  {
    id: "banana",
    name: "Banana",
    category: "Fruit Crops (Horticulture)",
    season: "Year-round, 13 Months",
    durationDays: 390,
    suitableSoilTypes: ["Loamy Soil", "Alluvial Soil", "Clayey Soil"],
    expectedYieldPerAcre: "25 - 35 Tonnes",
    waterRequirements: "Very High (1800-2200 mm, heavy feeder)",
    diseases: [
      {
        name: "Sigatoka Leaf Spot & Panama Wilt",
        category: "fungal",
        symptoms: "Dark brown yellow-bordered leaf spots drying leaf area (Sigatoka) or yellowing of lower leaves moving up with internal vascular discoloration (Panama Wilt).",
        cause: "Mycosphaerella musicola (Sigatoka) or Fusarium oxysporum f. sp. cubense (Panama Wilt).",
        prevention: ["Use tissue-culture clean planting material", "Clear pseudostem traps for stem weevil", "Sanitize pruning knives"],
        curativeTreatment: {
          product: "Propiconazole 25EC + Mineral Oil",
          dosagePerAcre: "200ml Propiconazole + 1L Mineral Oil / acre in 200L water",
          applicationMethod: "Foliar spray covering leaf canopy during monsoon",
          brandExamples: ["Tilt", "Calixin", "Bavistin"]
        },
        organicAlternative: "Pseudomonas fluorescens 10g/L soil drench & spray",
        recoveryPlan: ["Panama Wilt has NO chemical cure once established; priority is removing infected mats to stop spread", "Sanitize cutting tools"],
        highestRiskStage: "Shooting to Bunch expansion (Month 5-9)"
      }
    ],
    growthPlan: [
      { stageName: "Tissue Culture Planting", dayRange: "Month 1 - 4", activities: ["Plant TC suckers in 60cm pit", "Apply 10kg FYM + bio-fertilizers per pit"] },
      { stageName: "Shooting & Sigatoka Defense", dayRange: "Month 5 - 8", activities: ["De-suckering leaving 1 follower sucker", "Prop plants with bamboo", "Spray Tilt for Sigatoka"], pestRiskWindow: "Sigatoka Leaf Spot critical window (Month 5-8)" },
      { stageName: "Bunch Expansion & Harvesting", dayRange: "Month 9 - 13", activities: ["Cover bunches with blue polypropylene sleeves", "Harvest at 3/4th fruit fullness"] }
    ]
  },
  {
    id: "mango",
    name: "Mango",
    category: "Fruit Crops (Horticulture)",
    season: "Perennial, Flowering Dec–Feb",
    durationDays: 365,
    suitableSoilTypes: ["Loamy Soil", "Alluvial Soil", "Red Soil"],
    expectedYieldPerAcre: "4 - 8 Tonnes",
    waterRequirements: "Moderate (WITHHOLD ALL IRRIGATION DURING BLOOMING)",
    diseases: [
      {
        name: "Anthracnose & Mango Hopper & Powdery Mildew",
        category: "fungal",
        symptoms: "Black sunken spots on leaves/fruits (Anthracnose); wedge-shaped insects shooting honeydew on panicles (Hopper); white floury growth on flowers (Mildew).",
        cause: "Colletotrichum gloeosporioides & Amritodus atkinsoni hoppers during blossom.",
        prevention: ["Center pruning of dead wood", "WITHHOLD ALL IRRIGATION during flowering to promote panicle set", "Hang Methyl Eugenol fruit fly traps"],
        curativeTreatment: {
          product: "Copper Oxychloride 50WP (Anthracnose) / Imidacloprid + Hexaconazole (Hopper/Mildew)",
          dosagePerAcre: "500g Copper Oxychloride / acre post-harvest OR 60ml Imidacloprid + 250ml Hexaconazole at panicle emergence",
          applicationMethod: "Foliar spray at panicle emergence BEFORE flower opening",
          brandExamples: ["Blitox 50", "Confidor", "Contaf"]
        },
        organicAlternative: "Wettable sulfur 3g/L for mildew; Neem oil 3ml/L for hopper",
        recoveryPlan: ["⚠️ NEVER SPRAY during peak bee activity at full bloom to protect pollinators and fruit set", "Hang fruit fly traps"],
        highestRiskStage: "Panicle emergence to Fruit set (Nov-Feb)"
      }
    ],
    growthPlan: [
      { stageName: "Post-Harvest Rest & Pruning", dayRange: "Jul - Oct", activities: ["Prune dead wood and center branches", "Spray Copper Oxychloride 500g/acre for Anthracnose"] },
      { stageName: "Pre-Bloom & Panicle Spray", dayRange: "Nov - Feb", activities: ["WITHHOLD ALL IRRIGATION", "Spray Confidor + Contaf at panicle emergence BEFORE open bloom"], pestRiskWindow: "Mango Hopper & Powdery Mildew bloom window (Dec-Feb)" },
      { stageName: "Fruit Growth & Harvest", dayRange: "Mar - Jun", activities: ["Resume light irrigation post fruit-set", "Hang Methyl Eugenol fruit fly traps", "Stop water 15 days pre-harvest"] }
    ]
  },
  {
    id: "citrus",
    name: "Citrus (Orange / Lemon)",
    category: "Fruit Crops (Horticulture)",
    season: "Perennial",
    durationDays: 365,
    suitableSoilTypes: ["Loamy Soil", "Black Cotton Soil", "Alluvial Soil"],
    expectedYieldPerAcre: "6 - 10 Tonnes",
    waterRequirements: "Moderate (Drip irrigation)",
    diseases: [
      {
        name: "Citrus Canker & Gummosis",
        category: "bacterial",
        symptoms: "Raised corky brown lesions surrounded by yellow halos on leaves and fruit (Canker); gum oozing from bark base (Gummosis).",
        cause: "Xanthomonas citri (Canker spread by rain splash) and Phytophthora collar rot (Gummosis).",
        prevention: ["Disease-free nursery stock", "Prune infected twigs before monsoon", "Improve trunk collar drainage"],
        curativeTreatment: {
          product: "Copper Oxychloride + Streptocycline (Canker) / Ridomil Gold paste (Gummosis)",
          dosagePerAcre: "500g Copper Oxychloride + 18g Streptocycline / acre in 200L water",
          applicationMethod: "Foliar spray for canker; scrape bark and apply Bordeaux paste for gummosis",
          brandExamples: ["Blitox", "Plantomycin", "Ridomil Gold"]
        },
        organicAlternative: "Bordeaux paste 10% applied on stem base",
        recoveryPlan: ["Improve drainage at stem base immediately (gummosis is a soil-moisture issue)", "Prune dead twigs"],
        highestRiskStage: "Monsoon flushing phase (Jun-Sep)"
      }
    ],
    growthPlan: [
      { stageName: "Bahar Treatment & Pruning", dayRange: "Jan - Feb", activities: ["Bahar water stress, prune canker twigs", "Apply Bordeaux paste to trunk"] },
      { stageName: "Flushing & Fruit Growth", dayRange: "Mar - Oct", activities: ["Spray Streptocycline + Copper Oxychloride for Canker", "Drip fertigation"] }
    ]
  },
  {
    id: "guava",
    name: "Guava",
    category: "Fruit Crops (Horticulture)",
    season: "Perennial (Mrig & Ambe Bahar)",
    durationDays: 365,
    suitableSoilTypes: ["Loamy Soil", "Alluvial Soil", "Red Soil"],
    expectedYieldPerAcre: "8 - 12 Tonnes",
    waterRequirements: "Moderate",
    diseases: [
      {
        name: "Guava Wilt & Fruit Fly",
        category: "fungal",
        symptoms: "Yellowing and sudden drooping of leaves starting from top branches; maggots inside soft rotting fruit.",
        cause: "Fusarium oxysporum soil wilt and Bactrocera dorsalis fruit fly.",
        prevention: ["Soil drench with Trichoderma viride", "Hang Methyl Eugenol traps @ 10/acre"],
        curativeTreatment: {
          product: "Carbendazim 50WP (Anthracnose) / Spinosad 45SC (Fruit Fly)",
          dosagePerAcre: "200g Carbendazim or 60ml Spinosad / acre in 200L water",
          applicationMethod: "Soil drench around basin for wilt; spray Spinosad for fruit fly",
          brandExamples: ["Bavistin", "Tracer", "Saaf"]
        },
        organicAlternative: "Trichoderma viride + Neem cake soil drenching",
        recoveryPlan: ["Uproot completely wilted trees and treat pit with lime", "Harvest fruits at color break stage"],
        highestRiskStage: "Fruiting to Harvesting stage"
      }
    ],
    growthPlan: [
      { stageName: "Bahar Regulation & Drenching", dayRange: "May - Jun", activities: ["Root drench Trichoderma viride", "Bahar pruning"] },
      { stageName: "Fruit Growth & Harvest", dayRange: "Jul - Dec", activities: ["Hang Methyl Eugenol traps", "Spray Tracer for fruit fly"] }
    ]
  },
  {
    id: "papaya",
    name: "Papaya",
    category: "Fruit Crops (Horticulture)",
    season: "Perennial, 10–12 Months",
    durationDays: 365,
    suitableSoilTypes: ["Loamy Soil", "Alluvial Soil"],
    expectedYieldPerAcre: "30 - 45 Tonnes",
    waterRequirements: "Moderate (STRICTLY AVOID WATERLOGGING AT COLLAR)",
    diseases: [
      {
        name: "Papaya Ring Spot Virus & Stem Foot Rot",
        category: "viral",
        symptoms: "Shoestring leaf distortion with dark green ring spots on fruit (Ring Spot); water-soaked rotting of stem base at soil line (Foot Rot).",
        cause: "Aphid-transmitted PRSV virus or Pythium aphanidermatum collar rot in waterlogged soil.",
        prevention: ["Raised bed planting with deep drainage", "Destroy vector weeds", "Rogue infected virus plants"],
        curativeTreatment: {
          product: "Metalaxyl 8% + Mancozeb 64%WP (Foot Rot drench) / Spiromesifen (Mites)",
          dosagePerAcre: "500g Metalaxyl+Mancozeb / acre soil drenching",
          applicationMethod: "Drench 250ml solution around collar of each plant",
          brandExamples: ["Ridomil Gold", "Oberon", "Confidor"]
        },
        organicAlternative: "Trichoderma viride soil drench + Neem oil vector spray",
        recoveryPlan: ["Ring Spot Virus has NO cure — remove and burn infected plants completely to protect orchard", "Drench collar with Ridomil"],
        highestRiskStage: "Vegetative & Early Fruiting (Month 3-7)"
      }
    ],
    growthPlan: [
      { stageName: "Raised Bed Planting", dayRange: "Month 1 - 3", activities: ["Plant on raised mounds", "Drench Ridomil Gold at collar base"] },
      { stageName: "Fruiting & Virus Scouting", dayRange: "Month 4 - 12", activities: ["Rogue ring spot virus plants", "Harvest mature green-yellow fruits"] }
    ]
  },
  {
    id: "grapes",
    name: "Grapes",
    category: "Fruit Crops (Horticulture)",
    season: "Perennial (Pruning Apr/Oct)",
    durationDays: 365,
    suitableSoilTypes: ["Loamy Soil", "Red Soil", "Black Cotton Soil"],
    expectedYieldPerAcre: "10 - 15 Tonnes",
    waterRequirements: "Moderate (Drip irrigated)",
    diseases: [
      {
        name: "Downy Mildew & Mealybugs",
        category: "fungal",
        symptoms: "Oily translucent spots on upper leaf with white dense downy growth on underside; cottony white mealybug masses on bunches.",
        cause: "Plasmopara viticola fungus under high humidity & Maconellicoccus mealybugs.",
        prevention: ["Canopy management & leaf stripping for ventilation", "Sulfur dusting at dormant stage"],
        curativeTreatment: {
          product: "Azoxystrobin 23SC (Downy) / Buprofezin 25SC (Mealybug)",
          dosagePerAcre: "200ml Azoxystrobin or 300ml Buprofezin / acre in 200L water",
          applicationMethod: "Foliar spray with thorough canopy coverage",
          brandExamples: ["Amistar", "Applaud", "Ridomil Gold"]
        },
        organicAlternative: "Trichoderma harzianum spray + Verticillium lecanii for mealybug",
        recoveryPlan: ["Prune dense inner canopy leaves", "Release Cryptolaemus ladybird predator beetles for mealybugs"],
        highestRiskStage: "Foundation & Forward pruning (Apr / Oct)"
      }
    ],
    growthPlan: [
      { stageName: "April Pruning (Foundation)", dayRange: "Apr - Sep", activities: ["Back pruning to single bud", "Canopy development & sulfur dusting"] },
      { stageName: "October Pruning (Forward)", dayRange: "Oct - Mar", activities: ["Fruit pruning, gibberellic acid dips for bunch lengthening", "Spray Amistar for Downy Mildew"] }
    ]
  },
  {
    id: "pomegranate",
    name: "Pomegranate",
    category: "Fruit Crops (Horticulture)",
    season: "Perennial (Hastha / Ambe Bahar)",
    durationDays: 365,
    suitableSoilTypes: ["Loamy Soil", "Black Cotton Soil", "Red Soil"],
    expectedYieldPerAcre: "6 - 10 Tonnes",
    waterRequirements: "Low to Moderate (Drip irrigation)",
    diseases: [
      {
        name: "Bacterial Oily Spot (Blight) & Fruit Borer",
        category: "bacterial",
        symptoms: "Water-soaked dark brown spots turning oily black on leaves, stems, and fruits with Y-cracks on infected fruit.",
        cause: "Xanthomonas axonopodis pv. punicae spread via rain splash and non-sterilized pruning tools.",
        prevention: ["Strict orchard sanitation", "Sanitize pruning secateurs between plants using 70% alcohol", "Bleaching powder soil application"],
        curativeTreatment: {
          product: "Streptocycline + Copper Hydroxide (Blight) / Spinetoram (Borer)",
          dosagePerAcre: "20g Streptocycline + 500g Copper Hydroxide / acre in 200L water",
          applicationMethod: "Foliar spray at 7-10 day intervals during rain spells",
          brandExamples: ["Plantomycin", "Kocide", "Delegate"]
        },
        organicAlternative: "Bordeaux mixture 0.5% spray + Bio-agent Pseudomonas",
        recoveryPlan: ["Collect and burn all fallen infected leaves and cracked fruit", "Sterilize secateurs continuously"],
        highestRiskStage: "Monsoon Hastha Bahar phase (Jul-Oct)"
      }
    ],
    growthPlan: [
      { stageName: "Bahar Regulation & Secateur Sterilization", dayRange: "May - Jun", activities: ["Prune using secateurs dipped in 70% alcohol", "Defoliation and resting stress"] },
      { stageName: "Fruit Set & Oily Spot Spray", dayRange: "Jul - Dec", activities: ["Spray Kocide + Streptocycline after every rain spell", "Harvest clean fruits"] }
    ]
  }
];

export const AGRI_STORES: AgriStore[] = [
  {
    id: "store_1",
    name: "Kisan Suvidha Agri Kendra",
    ownerName: "Ramesh Patel",
    phone: "+91 98765 43210",
    distanceKm: 1.8,
    village: "Ramnagar",
    district: "District Central",
    state: "State",
    latitude: 20.5937,
    longitude: 78.9629,
    stockedChemicals: [
      { productName: "Mancozeb 75WP", brandName: "Dithane M-45", pricePerUnit: "₹380 / kg", inStock: true },
      { productName: "Chlorantraniliprole 18.5SC", brandName: "Coragen", pricePerUnit: "₹1,450 / 60ml", inStock: true },
      { productName: "Imidacloprid 17.8SL", brandName: "Confidor", pricePerUnit: "₹290 / 100ml", inStock: true },
      { productName: "Carbendazim 50WP", brandName: "Bavistin", pricePerUnit: "₹320 / 500g", inStock: true },
      { productName: "Tricyclazole 75WP", brandName: "Beam", pricePerUnit: "₹490 / 120g", inStock: true }
    ]
  },
  {
    id: "store_2",
    name: "Green Field Agro Inputs",
    ownerName: "Suresh Kumar",
    phone: "+91 98123 45678",
    distanceKm: 3.4,
    village: "Shivpur",
    district: "District Central",
    state: "State",
    latitude: 20.612,
    longitude: 78.981,
    stockedChemicals: [
      { productName: "Cartap Hydrochloride 4G", brandName: "Padan 4G", pricePerUnit: "₹650 / 10kg", inStock: true },
      { productName: "Pymetrozine 50WG", brandName: "Chess", pricePerUnit: "₹580 / 120g", inStock: true },
      { productName: "Hexaconazole 5%EC", brandName: "Contaf Plus", pricePerUnit: "₹420 / 500ml", inStock: true },
      { productName: "Emamectin Benzoate 5SG", brandName: "Proclaim", pricePerUnit: "₹390 / 100g", inStock: true },
      { productName: "Azoxystrobin 23SC", brandName: "Amistar", pricePerUnit: "₹850 / 200ml", inStock: false }
    ]
  },
  {
    id: "store_3",
    name: "Mahaveer Crop Protection",
    ownerName: "Mahesh Sharma",
    phone: "+91 94140 11223",
    distanceKm: 5.2,
    village: "Adarsh Nagar",
    district: "District North",
    state: "State",
    latitude: 20.575,
    longitude: 78.945,
    stockedChemicals: [
      { productName: "Cymoxanil 8% + Mancozeb 64%WP", brandName: "Curzate", pricePerUnit: "₹720 / 600g", inStock: true },
      { productName: "Spinosad 45SC", brandName: "Tracer", pricePerUnit: "₹1,850 / 75ml", inStock: true },
      { productName: "Spiromesifen 22.9SC", brandName: "Oberon", pricePerUnit: "₹690 / 200ml", inStock: true },
      { productName: "Fipronil 5SC", brandName: "Regent 5SC", pricePerUnit: "₹460 / 500ml", inStock: true },
      { productName: "Propiconazole 25EC", brandName: "Tilt", pricePerUnit: "₹540 / 250ml", inStock: true }
    ]
  }
];

export const UNIVERSAL_PROTOCOLS = {
  walesSequence: [
    { step: 1, letter: "W", title: "Wettable Powders / Water Dispersible Granules (WP / WDG)", instruction: "Fill spray tank 50% with clean water first. Add dry powders (WP, WDG, DF) into tank while agitating until completely slurry dissolved." },
    { step: 2, letter: "A", title: "Agitate Continuously", instruction: "Maintain mechanical or hydraulic tank agitation throughout mixing and spraying process." },
    { step: 3, letter: "L", title: "Liquid Flowables / Suspension Concentrates (SC / FS)", instruction: "Premix liquid flowables with equal volume water, then slowly pour into agitated tank." },
    { step: 4, letter: "E", title: "Emulsifiable Concentrates (EC)", instruction: "Add Emulsifiable Concentrates (EC) while continuing tank agitation." },
    { step: 5, letter: "S", title: "Surfactants & Stickers", instruction: "Add adjuvants, stickers, and wetting agents LAST to prevent excessive foam buildup." }
  ],
  fieldJarTest: {
    title: "Field Jar Test (Compatibility Check)",
    steps: [
      "Half-fill a 1-Litre clean transparent glass jar with field spray water.",
      "Add proportional amounts of planned chemicals in exact WALES order.",
      "Invert jar 10 times and let stand undisturbed for 15 minutes.",
      "INSPECTION: If curdling, flaking, sludge precipitation, or oily layering occurs — DO NOT combine in spray tank."
    ]
  },
  incompatibilityRules: [
    "NEVER mix acidic insecticides or synthetic pyrethroids with strongly alkaline mixtures (Fresh Bordeaux mixture, Lime-Sulfur, Calcium Nitrate).",
    "NEVER mix Copper Hydroxide / Copper Oxychloride with EC oils or organophosphates — keep a mandatory 5-day gap between such sprays.",
    "Do not tank-mix Propargite or Bordeaux mixture with alkaline compounds.",
    "Sucking-pest damage (thrips/mites) is frequently misdiagnosed as viral infection — cross-check leaf curling direction (Upward = Thrips, Downward = Mites) before choosing treatment."
  ]
};
