import { Router } from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { sendSMS } from "../services/smsService.js";

const router = Router();

const processToStage: Record<string, string> = {
  Ploughing: "ploughing",
  Seeding: "seeding",
  Irrigation: "vegetative",
  "None yet": "land_preparation",
  "none yet": "land_preparation",
  "": "land_preparation",
};

interface CropCareTemplateItem {
  name: string;
  category: "land_preparation" | "seeding" | "irrigation" | "fertilizer" | "pest_control" | "weed_management" | "harvest" | "other";
  days: number;
  priority: "low" | "medium" | "high" | "urgent";
  reasonWhy: string;
  suggestedAction: string;
  isPreventiveAlert?: boolean;
  alertType?: "weather_alert" | "irrigation_reminder" | "fertilizer_reminder" | "pest_alert" | "crop_task_due";
  alertTitle?: string;
  alertMessage?: string;
}

// ── Structured Crop Care & Preventive Risk Templates ─────────────────────
const CROP_CARE_TEMPLATES: Record<string, CropCareTemplateItem[]> = {
  paddy: [
    {
      name: "Nursery & Land Preparation",
      category: "land_preparation",
      days: -7,
      priority: "medium",
      reasonWhy: "Puddling creates an impervious hardpan to minimize water percolation and ensure optimal root anchor.",
      suggestedAction: "Puddle field twice with 5 cm standing water. Incorporate 10 tons/ha farmyard manure."
    },
    {
      name: "Transplanting / Direct Sowing",
      category: "seeding",
      days: 0,
      priority: "high",
      reasonWhy: "Optimum seedling age (18-22 days) gives maximum tillering capacity.",
      suggestedAction: "Transplant 2-3 seedlings per hill at 20x15 cm spacing. Maintain 2 cm water layer."
    },
    {
      name: "Early Vegetative Irrigation",
      category: "irrigation",
      days: 7,
      priority: "medium",
      reasonWhy: "Shallow water level (2-3 cm) encourages rapid root establishment without choking young shoots.",
      suggestedAction: "Maintain shallow standing water (2-3 cm). Avoid deep flooding during early tillering.",
      isPreventiveAlert: true,
      alertType: "irrigation_reminder",
      alertTitle: "Irrigation Due: Day 7 Paddy Establishment",
      alertMessage: "Maintain 2-3 cm shallow water level today. Soil moisture drops rapidly at this stage; avoid deep ponding to promote root aeration."
    },
    {
      name: "Basal Fertilizer Application",
      category: "fertilizer",
      days: 14,
      priority: "high",
      reasonWhy: "Phosphorus and zinc promote early vigorous tillering and strong root branching.",
      suggestedAction: "Apply 50 kg DAP + 25 kg MOP + 10 kg Zinc Sulphate per acre as basal top dressing."
    },
    {
      name: "Preventive Leaf Blast & Stem Borer Alert",
      category: "pest_control",
      days: 28,
      priority: "urgent",
      reasonWhy: "High humidity (>85%) and temperature drop (20-24°C) favor Pyricularia oryzae (Blast) spore germination.",
      suggestedAction: "Inspect leaf spindle for diamond-shaped spots with gray centers. Spray Tricyclazole 75% WP @ 0.6g/L preventively.",
      isPreventiveAlert: true,
      alertType: "pest_alert",
      alertTitle: "PREVENTIVE RISK ALERT: Leaf Blast & Stem Borer Warning",
      alertMessage: "High morning relative humidity detected. Day 25–35 is high-risk for Leaf Blast. Inspect lower leaf collars and spray Tricyclazole 75% WP @ 0.6g/L."
    },
    {
      name: "Active Tillering Weed & Water Management",
      category: "weed_management",
      days: 35,
      priority: "medium",
      reasonWhy: "Weed competition during maximum tillering reduces productive panicles by up to 35%.",
      suggestedAction: "Hand weed or run cono-weeder between rows. Re-establish 5 cm water layer immediately."
    },
    {
      name: "Panicle Initiation Fertilizer Booster",
      category: "fertilizer",
      days: 50,
      priority: "high",
      reasonWhy: "Nitrogen and potassium at panicle initiation directly determine grain count per panicle.",
      suggestedAction: "Broadcast 25 kg Urea + 15 kg MOP per acre when morning dew has dried.",
      isPreventiveAlert: true,
      alertType: "fertilizer_reminder",
      alertTitle: "Fertilizer Due: Panicle Initiation Booster",
      alertMessage: "Apply second split of Urea (25kg) + Potash (15kg) today for maximum grain filling."
    },
    {
      name: "Bacterial Leaf Blight & Sheath Blight Preventive Alert",
      category: "pest_control",
      days: 65,
      priority: "urgent",
      reasonWhy: "Dense canopy microclimate at booting stage creates conditions for Rhizoctonia solani (Sheath Blight).",
      suggestedAction: "Spray Hexaconazole 5% EC @ 2ml/L or Validamycin 3% L @ 2ml/L directed at stem bases.",
      isPreventiveAlert: true,
      alertType: "pest_alert",
      alertTitle: "PREVENTIVE RISK ALERT: Sheath Blight & Brown Plant Hopper",
      alertMessage: "Booting stage canopy density is high. Part the hills and check stem bases for sheath blight lesions and BPH nymphs."
    },
    {
      name: "Pre-Harvest Field Drainage",
      category: "irrigation",
      days: 100,
      priority: "high",
      reasonWhy: "Draining standing water 10-14 days before harvest promotes uniform grain ripening and hardens soil for harvester machinery.",
      suggestedAction: "Drain all standing water from field. Allow field to dry gradually."
    },
    {
      name: "Harvesting & Threshing",
      category: "harvest",
      days: 115,
      priority: "high",
      reasonWhy: "Harvesting at 20-22% grain moisture prevents grain shattering loss and milling breakage.",
      suggestedAction: "Harvest when 85% of panicles turn golden yellow. Thresh within 24 hours."
    }
  ],

  maize: [
    {
      name: "Deep Ploughing & Ridge Making",
      category: "land_preparation",
      days: -5,
      priority: "medium",
      reasonWhy: "Maize requires deep loose soil to develop anchor roots and avoid lodging.",
      suggestedAction: "Plough to 25 cm depth. Form ridges and furrows at 60 cm spacing."
    },
    {
      name: "Seed Sowing with DAP Basal",
      category: "seeding",
      days: 0,
      priority: "high",
      reasonWhy: "Optimum plant population (26,000 plants/acre) requires 60x20 cm spacing.",
      suggestedAction: "Dibble 1 seed per hill at 4 cm depth with basal DAP 50 kg + Potash 20 kg."
    },
    {
      name: "Fall Armyworm (FAW) Critical Preventive Alert",
      category: "pest_control",
      days: 15,
      priority: "urgent",
      reasonWhy: "Spodoptera frugiperda (Fall Armyworm) attacks whorls from Day 10-30, causing window-pane damage.",
      suggestedAction: "Scout central whorls. Apply Chlorantraniliprole 18.5% SC @ 0.4ml/L or Emamectin Benzoate 5% SG @ 0.4g/L directly into whorls.",
      isPreventiveAlert: true,
      alertType: "pest_alert",
      alertTitle: "URGENT PREVENTIVE ALERT: Fall Armyworm (FAW) Scouting",
      alertMessage: "Maize is in the 3-5 leaf stage — most vulnerable to Fall Armyworm whorl damage. Inspect 20 plants and whorl-drop Chlorantraniliprole if pinholes appear."
    },
    {
      name: "Knee-High Stage Top Dressing & Earthing Up",
      category: "fertilizer",
      days: 30,
      priority: "high",
      reasonWhy: "Earthing up covers brace roots and prevents lodging while incorporating top-dress nitrogen.",
      suggestedAction: "Apply 35 kg Urea per acre. Mound soil around base of stems.",
      isPreventiveAlert: true,
      alertType: "fertilizer_reminder",
      alertTitle: "Fertilizer Due: Knee-High Urea Top Dressing",
      alertMessage: "Apply 35 kg/acre Urea along ridges and earth up soil to anchor brace roots."
    },
    {
      name: "Tasseling & Silking Irrigation",
      category: "irrigation",
      days: 50,
      priority: "urgent",
      reasonWhy: "Moisture stress at silking causes pollen desiccation and poor kernel set (hollow cobs).",
      suggestedAction: "Ensure furrow irrigation reaches full saturation. Do not let soil crack.",
      isPreventiveAlert: true,
      alertType: "irrigation_reminder",
      alertTitle: "CRITICAL IRRIGATION: Tasseling & Silking Window",
      alertMessage: "Silking is the most moisture-critical stage for Maize. Irrigate thoroughly today to ensure complete cob pollination."
    },
    {
      name: "Cob Maturity & Harvest",
      category: "harvest",
      days: 95,
      priority: "high",
      reasonWhy: "Black layer formation at kernel base indicates physiological maturity.",
      suggestedAction: "Harvest when husk leaves turn straw colored and dry. Shell at 14% moisture."
    }
  ],

  tomato: [
    {
      name: "Raised Bed & Drip Lateral Setup",
      category: "land_preparation",
      days: -7,
      priority: "medium",
      reasonWhy: "Raised beds improve drainage and reduce Phytophthora damping-off risk.",
      suggestedAction: "Prepare 15 cm raised beds with drip lateral lines. Add Trichoderma enriched compost."
    },
    {
      name: "Transplanting & Staking Setup",
      category: "seeding",
      days: 0,
      priority: "high",
      reasonWhy: "Staking keeps fruit foliage off soil, preventing soil-borne early blight.",
      suggestedAction: "Transplant 25-day seedlings at 60x45 cm spacing. Install wooden stakes or trellis wire."
    },
    {
      name: "Early Blight & Sucking Pest Preventive Alert",
      category: "pest_control",
      days: 22,
      priority: "urgent",
      reasonWhy: "Vegetative canopy expansion under humid morning dew encourages Alternaria solani (Early Blight) spots.",
      suggestedAction: "Spray Mancozeb 75% WP @ 2g/L or Neem Oil 10,000 ppm @ 2ml/L preventively.",
      isPreventiveAlert: true,
      alertType: "pest_alert",
      alertTitle: "PREVENTIVE BLIGHT WARNING: Tomato Leaf Health",
      alertMessage: "Humid morning conditions combined with Day 20–30 vegetative growth increases Early Blight risk. Inspect lower leaves for concentric brown rings."
    },
    {
      name: "Flowering & Fruit Setting Nutrition",
      category: "fertilizer",
      days: 45,
      priority: "high",
      reasonWhy: "Boron and Calcium are essential to prevent Blossom End Rot and flower drop.",
      suggestedAction: "Foliar spray of Calcium Nitrate @ 2g/L + Boron 20% @ 1g/L at peak flowering.",
      isPreventiveAlert: true,
      alertType: "fertilizer_reminder",
      alertTitle: "Micronutrient Spray Due: Fruit Set Booster",
      alertMessage: "Flowering stage is active. Apply Calcium + Boron foliar spray to prevent blossom end rot and flower drop."
    },
    {
      name: "Staggered Fruit Picking",
      category: "harvest",
      days: 75,
      priority: "medium",
      reasonWhy: "Harvesting at breaker stage (pink blush) ensures maximum shelf life for transport.",
      suggestedAction: "Pick mature fruits every 3-4 days in morning hours. Grade according to size."
    }
  ],

  cotton: [
    {
      name: "Deep Summer Ploughing & Sowing",
      category: "seeding",
      days: 0,
      priority: "high",
      reasonWhy: "Proper seed depth (3-4 cm) in moist soil ensures 90%+ germination.",
      suggestedAction: "Dibble seeds at 90x60 cm spacing with basal DAP and Potash."
    },
    {
      name: "Square Formation & Sucking Pest Alert",
      category: "pest_control",
      days: 40,
      priority: "urgent",
      reasonWhy: "Aphids, Jassids, and Thrips suck cell sap causing leaf curling (hopper burn).",
      suggestedAction: "Install yellow sticky traps @ 10/acre. Spray Flonicamid 50% WG @ 0.3g/L if jassid count > 2/leaf.",
      isPreventiveAlert: true,
      alertType: "pest_alert",
      alertTitle: "SUCKING PEST & BOLLWORM ALERT: Square Formation",
      alertMessage: "Square formation stage (Day 40). Inspect 20 plants for jassid hopper burn and set up pheromone traps."
    },
    {
      name: "Peak Boll Development Nutrition",
      category: "fertilizer",
      days: 75,
      priority: "high",
      reasonWhy: "Potassium deficiency at boll filling causes premature leaf reddening (Lalya).",
      suggestedAction: "Foliar spray of 13-0-45 (Potassium Nitrate) @ 10g/L + Magnesium Sulphate @ 5g/L."
    },
    {
      name: "Clean Boll Picking",
      category: "harvest",
      days: 130,
      priority: "medium",
      reasonWhy: "Picking fully opened clean bolls prevents stained lint and maximizes market grade.",
      suggestedAction: "Pick clean seed cotton into cotton bags in dry sunlight. Avoid plastic bags."
    }
  ]
};

// Fallback generic template for any other crop
const DEFAULT_CROP_TEMPLATE: CropCareTemplateItem[] = [
  {
    name: "Field Preparation & Soil Conditioning",
    category: "land_preparation",
    days: -7,
    priority: "medium",
    reasonWhy: "Proper soil tilth and organic matter addition maximizes moisture retention.",
    suggestedAction: "Plough field to fine tilth. Incorporate compost or farmyard manure."
  },
  {
    name: "Sowing / Planting",
    category: "seeding",
    days: 0,
    priority: "high",
    reasonWhy: "Timely sowing ensures crop makes best use of seasonal temperature and sunlight.",
    suggestedAction: "Sow certified seeds at recommended spacing and depth."
  },
  {
    name: "Vegetative Irrigation & Moisture Check",
    category: "irrigation",
    days: 10,
    priority: "medium",
    reasonWhy: "Early root establishment requires consistent topsoil moisture.",
    suggestedAction: "Irrigate field to field capacity. Avoid waterlogging in low spots.",
    isPreventiveAlert: true,
    alertType: "irrigation_reminder",
    alertTitle: "Routine Care: Vegetative Irrigation",
    alertMessage: "Check field soil moisture today. Early vegetative root growth requires balanced hydration."
  },
  {
    name: "Pre-Emptive Pest Scouting",
    category: "pest_control",
    days: 25,
    priority: "urgent",
    reasonWhy: "Early detection of sucking insects or leaf spots allows organic or targeted control before economic threshold.",
    suggestedAction: "Walk in 'W' pattern across field. Check leaf undersides on 10 random plants.",
    isPreventiveAlert: true,
    alertType: "pest_alert",
    alertTitle: "PREVENTIVE RISK ALERT: Mid-Vegetative Scouting",
    alertMessage: "Your crop enters pest-sensitive growth stage (Day 25). Scout 10 random plants for sucking insects and leaf lesions today."
  },
  {
    name: "Nutrition & Booster Spray",
    category: "fertilizer",
    days: 40,
    priority: "high",
    reasonWhy: "Active vegetative canopy needs balanced macro and micro nutrients.",
    suggestedAction: "Apply recommended top dressing fertilizer based on soil type.",
    isPreventiveAlert: true,
    alertType: "fertilizer_reminder",
    alertTitle: "Fertilizer Due: Growth Booster",
    alertMessage: "Apply scheduled crop booster fertilizer to promote robust flowering and tillering branches."
  },
  {
    name: "Harvesting",
    category: "harvest",
    days: 90,
    priority: "high",
    reasonWhy: "Harvesting at peak maturity maximizes market quality and yield.",
    suggestedAction: "Harvest during dry weather. Grade and store in cool ventilated warehouse."
  }
];

// ── In-Memory Crop Store fallback when PostgreSQL is offline ────────────
interface StoredCropRegistration {
  id: string;
  farmerId: string;
  cropName: string;
  varietyName: string | null;
  landAreaAcres: number;
  sowingDate: string;
  farmingStage: string;
  status: string;
  fieldName: string;
  location: string;
  farmName: string;
  planId: string;
  planName: string;
  progress: number;
  createdAt: string;
}

interface StoredCropTask {
  id: string;
  cropPlanId: string;
  label: string;
  date: string;
  status: "done" | "upcoming";
  category: string;
  priority: string;
  notes?: string | null;
}

const inMemoryCrops: StoredCropRegistration[] = [];
const inMemoryTasks: StoredCropTask[] = [];

// GET /api/crops/catalog
router.get("/catalog", requireAuth, async (_req, res) => {
  try {
    const result = await query<{ id: string; name: string; category: string; season: string | null }>(
      "SELECT id, name, category, season FROM crops ORDER BY name",
    );
    if (result.rows.length > 0) {
      res.json(result.rows.map((row) => ({ id: row.id, name: row.name, category: row.category, season: row.season })));
      return;
    }
  } catch (error) {
    console.warn("Crops catalog DB query fallback:", error);
  }

  res.json([
    { id: "paddy", name: "Rice (Paddy)", category: "Cereals", season: "Kharif / Rabi" },
    { id: "maize", name: "Maize (Corn)", category: "Cereals", season: "Kharif / Rabi" },
    { id: "tomato", name: "Tomato", category: "Vegetables", season: "All Season" },
    { id: "cotton", name: "Cotton", category: "Commercial", season: "Kharif" },
    { id: "wheat", name: "Wheat", category: "Cereals", season: "Rabi" },
    { id: "chilli", name: "Chilli", category: "Vegetables", season: "Kharif / Rabi" },
  ]);
});

// GET /api/crops — List farmer's registered crops
router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await query<{
      id: string;
      crop_name: string;
      variety_name: string | null;
      land_area_acres: string;
      sowing_date: string;
      farming_stage: string;
      status: string;
      field_name: string;
      village_city: string;
      district: string;
      state: string;
      farm_name: string;
      plan_id: string | null;
      plan_name: string | null;
      progress: string | null;
    }>(
      `SELECT
         cr.id,
         c.name AS crop_name,
         cr.variety_name,
         cr.land_area_acres,
         cr.sowing_date,
         cr.farming_stage,
         cr.status,
         f.field_name,
         fm.village_city,
         fm.district,
         fm.state,
         fm.farm_name,
         cp.id AS plan_id,
         cp.plan_name,
         cp.overall_progress_percentage AS progress
       FROM crop_registrations cr
       JOIN fields f ON f.id = cr.field_id
       JOIN farms fm ON fm.id = f.farm_id
       JOIN crops c ON c.id = cr.crop_id
       LEFT JOIN crop_plans cp ON cp.crop_registration_id = cr.id
       WHERE fm.farmer_id = $1
       ORDER BY cr.created_at DESC`,
      [req.user!.id],
    );

    if (result.rows.length > 0) {
      res.json(
        result.rows.map((row) => ({
          id: row.id,
          cropName: row.crop_name,
          varietyName: row.variety_name,
          landAreaAcres: Number(row.land_area_acres),
          sowingDate: row.sowing_date,
          farmingStage: row.farming_stage,
          status: row.status,
          fieldName: row.field_name,
          location: `${row.village_city}, ${row.district}, ${row.state}`,
          farmName: row.farm_name,
          planId: row.plan_id,
          planName: row.plan_name,
          progress: row.progress ? Number(row.progress) : 0,
        })),
      );
      return;
    }
  } catch (error) {
    console.warn("List crops DB fallback:", error);
  }

  // Memory fallback
  const farmerCrops = inMemoryCrops.filter((c) => c.farmerId === req.user!.id);
  res.json(
    farmerCrops.map((c) => ({
      id: c.id,
      cropName: c.cropName,
      varietyName: c.varietyName,
      landAreaAcres: c.landAreaAcres,
      sowingDate: c.sowingDate,
      farmingStage: c.farmingStage,
      status: c.status,
      fieldName: c.fieldName,
      location: c.location,
      farmName: c.farmName,
      planId: c.planId,
      planName: c.planName,
      progress: c.progress,
    })),
  );
});

// ── Register New Crop + Auto-Generate Care Schedule & Preventive Alerts ──
router.post("/register", requireAuth, async (req, res) => {
  try {
    const {
      location,
      state,
      district,
      landArea,
      landUnit,
      startDate,
      cropName,
      variety,
      season,
      process,
      notes,
    } = req.body as {
      location?: string;
      state?: string;
      district?: string;
      landArea?: string | number;
      landUnit?: string;
      startDate?: string;
      cropName?: string;
      variety?: string;
      season?: string;
      process?: string;
      notes?: string;
    };

    console.log("[CROP-REGISTER] Received registration payload:", {
      location,
      state,
      district,
      landArea,
      landUnit,
      startDate,
      cropName,
      variety,
      season,
      process,
    });

    if (!location || !cropName) {
      res.status(400).json({ error: "Crop name and location are required." });
      return;
    }

    const resolvedLocation = location.trim();
    const resolvedState = state?.trim() || "Andhra Pradesh";
    const resolvedDistrict = district?.trim() || "Guntur";
    const resolvedStartDate = startDate?.trim() || new Date().toISOString().split("T")[0];
    const rawArea = Number(landArea) || 1.0;
    const { acres: area, unit: chosenUnit } = normalizeLandArea(rawArea, landUnit);

    const cropKey = cropName.toLowerCase().trim();
    const matchedTemplate =
      CROP_CARE_TEMPLATES[cropKey] ||
      (cropKey.includes("rice") || cropKey.includes("paddy") ? CROP_CARE_TEMPLATES.paddy : null) ||
      (cropKey.includes("corn") || cropKey.includes("maize") ? CROP_CARE_TEMPLATES.maize : null) ||
      (cropKey.includes("tomato") ? CROP_CARE_TEMPLATES.tomato : null) ||
      (cropKey.includes("cotton") ? CROP_CARE_TEMPLATES.cotton : null) ||
      DEFAULT_CROP_TEMPLATE;

    const farmingStage = processToStage[process || "None yet"] || processToStage["None yet"];

    let registrationId = `reg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    let planId = `plan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // 1. Try PostgreSQL Database if connected
    let dbSuccess = false;
    try {
      const pool = (await import("../db.js")).pool;
      const dbClient = await pool.connect();

      try {
        await dbClient.query("BEGIN");

        let farmResult = await dbClient.query<{ id: string }>(
          "SELECT id FROM farms WHERE farmer_id = $1 AND village_city = $2 AND district = $3 LIMIT 1",
          [req.user!.id, resolvedLocation, resolvedDistrict],
        );

        let farmId: string;
        if (farmResult.rows.length === 0) {
          const inserted = await dbClient.query<{ id: string }>(
            `INSERT INTO farms (farmer_id, farm_name, state, district, village_city, total_area_acres)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id`,
            [req.user!.id, `${resolvedLocation} Farm`, resolvedState, resolvedDistrict, resolvedLocation, area],
          );
          farmId = inserted.rows[0].id;
        } else {
          farmId = farmResult.rows[0].id;
        }

        const fieldResult = await dbClient.query<{ id: string }>(
          `INSERT INTO fields (farm_id, field_name, area_acres, irrigation_source)
           VALUES ($1, $2, $3, 'rainfed')
           RETURNING id`,
          [farmId, `${resolvedLocation} Field`, area],
        );
        const fieldId = fieldResult.rows[0].id;

        let cropResult = await dbClient.query<{ id: string }>(
          "SELECT id FROM crops WHERE LOWER(name) = LOWER($1) LIMIT 1",
          [cropName.trim()],
        );

        let cropId: string;
        if (cropResult.rows.length === 0) {
          const insertedCrop = await dbClient.query<{ id: string }>(
            `INSERT INTO crops (name, scientific_name, category, default_duration_days)
             VALUES ($1, $2, 'Cereals', 120)
             RETURNING id`,
            [cropName.trim(), `${cropName.trim()} sp.`],
          );
          cropId = insertedCrop.rows[0].id;
        } else {
          cropId = cropResult.rows[0].id;
        }

        const regResult = await dbClient.query<{ id: string }>(
          `INSERT INTO crop_registrations
             (field_id, crop_id, variety_name, land_area_acres, sowing_date, season, farming_stage, notes, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active')
           RETURNING id`,
          [
            fieldId,
            cropId,
            variety?.trim() || null,
            area,
            resolvedStartDate,
            season || "Kharif",
            farmingStage,
            notes?.trim() || null,
          ],
        );
        registrationId = regResult.rows[0].id;

        const planResult = await dbClient.query<{ id: string }>(
          `INSERT INTO crop_plans
             (crop_registration_id, plan_name, start_date, overall_progress_percentage, status)
           VALUES ($1, $2, $3, 0, 'in_progress')
           RETURNING id`,
          [registrationId, `${cropName.trim()} Crop Care Plan`, resolvedStartDate],
        );
        planId = planResult.rows[0].id;

        const baseDate = new Date(resolvedStartDate);
        for (let i = 0; i < matchedTemplate.length; i++) {
          const task = matchedTemplate[i];
          const taskDueDate = new Date(baseDate);
          taskDueDate.setDate(taskDueDate.getDate() + task.days);

          await dbClient.query(
            `INSERT INTO crop_tasks
               (crop_plan_id, task_name, description, due_date, sequence_order, category, priority, status, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8)`,
            [
              planId,
              task.name,
              task.suggestedAction,
              taskDueDate.toISOString().split("T")[0],
              i + 1,
              task.category,
              task.priority,
              task.reasonWhy,
            ],
          );

          if (task.isPreventiveAlert && task.alertTitle && task.alertMessage) {
            await dbClient.query(
              `INSERT INTO notifications
                 (user_id, crop_registration_id, type, title, message, priority, action_url)
               VALUES ($1, $2, $3, $4, $5, $6, '/my-crops')`,
              [
                req.user!.id,
                registrationId,
                task.alertType || "pest_alert",
                task.alertTitle,
                task.alertMessage,
                task.priority === "urgent" ? "urgent" : "high",
              ],
            );
          }
        }

        await dbClient.query("COMMIT");
        dbSuccess = true;
      } catch (innerErr) {
        await dbClient.query("ROLLBACK");
        console.warn("[CROP-REGISTER] DB transaction rolled back, falling back to memory store:", innerErr);
      } finally {
        dbClient.release();
      }
    } catch (poolErr) {
      console.warn("[CROP-REGISTER] DB connection failed, using in-memory crop registry fallback:", poolErr);
    }

    // Register in memory store
    const newCrop: StoredCropRegistration = {
      id: registrationId,
      farmerId: req.user!.id,
      cropName: cropName.trim(),
      varietyName: variety?.trim() || null,
      landAreaAcres: area,
      sowingDate: resolvedStartDate,
      farmingStage,
      status: "active",
      fieldName: `${resolvedLocation} Field`,
      location: `${resolvedLocation}, ${resolvedDistrict}, ${resolvedState}`,
      farmName: `${resolvedLocation} Farm`,
      planId,
      planName: `${cropName.trim()} Crop Care Plan`,
      progress: 0,
      createdAt: new Date().toISOString(),
    };

    inMemoryCrops.unshift(newCrop);

    // Populate structured tasks in memory
    const baseDate = new Date(resolvedStartDate);
    matchedTemplate.forEach((task, i) => {
      const taskDueDate = new Date(baseDate);
      taskDueDate.setDate(taskDueDate.getDate() + task.days);

      inMemoryTasks.push({
        id: `task_${Date.now()}_${i}`,
        cropPlanId: planId,
        label: task.name,
        date: taskDueDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        status: "upcoming",
        category: task.category,
        priority: task.priority,
        notes: `${task.reasonWhy} | Action: ${task.suggestedAction}`,
      });
    });

    // ── Send SMS to farmer for preventive care schedule activation ───────
    if (req.user?.phoneNumber) {
      const smsMessage = `AgroScan: Crop care plan activated for ${cropName.trim()} (${rawArea} ${chosenUnit}). Your personalized stage-by-stage schedule & weather alerts are now live in AgroScan.`;
      sendSMS(req.user.phoneNumber, smsMessage, "preventive_alert").catch((smsErr) => {
        console.warn("[CROP-SMS] SMS dispatch warning:", smsErr);
      });
    }

    console.log("[CROP-REGISTER] Crop registered successfully:", {
      registrationId,
      planId,
      cropName,
      landArea: rawArea,
      landUnit: chosenUnit,
      areaAcres: area,
      tasksGenerated: matchedTemplate.length,
      dbPersisted: dbSuccess,
    });

    res.status(201).json({
      success: true,
      registrationId,
      planId,
      cropName,
      landArea: rawArea,
      landUnit: chosenUnit,
      landAreaAcres: area,
      sowingDate: resolvedStartDate,
      location: resolvedLocation,
      message: "Crop registered successfully with stage-by-stage care schedule & preventive alerts.",
    });
  } catch (error: any) {
    console.error("[CROP-REGISTER] Unexpected error:", error);
    res.status(500).json({
      error: error?.message || "Failed to create crop care schedule. Please verify your details.",
    });
  }
});

// ── PATCH /api/crops/:id — Edit Crop Details & Recalculate Tasks ──────────
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      sowingDate,
      location,
      landArea,
      landUnit,
      variety,
      farmingStage,
    } = req.body as {
      sowingDate?: string;
      location?: string;
      landArea?: number | string;
      landUnit?: string;
      variety?: string;
      farmingStage?: string;
    };

    let targetCrop = inMemoryCrops.find((c) => c.id === id);

    let normAcres: number | undefined;
    if (landArea !== undefined) {
      normAcres = normalizeLandArea(Number(landArea), landUnit).acres;
    }

    // 1. Update in DB if present
    try {
      if (sowingDate || normAcres !== undefined || variety !== undefined || farmingStage !== undefined) {
        await query(
          `UPDATE crop_registrations
           SET sowing_date = COALESCE($1, sowing_date),
               land_area_acres = COALESCE($2, land_area_acres),
               variety_name = COALESCE($3, variety_name),
               farming_stage = COALESCE($4, farming_stage),
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $5`,
          [sowingDate || null, normAcres || null, variety || null, farmingStage || null, id],
        );
      }

      if (sowingDate) {
        // Recalculate task due dates in DB
        const planRes = await query<{ id: string }>("SELECT id FROM crop_plans WHERE crop_registration_id = $1 LIMIT 1", [id]);
        if (planRes.rows.length > 0) {
          const planId = planRes.rows[0].id;
          const tasksRes = await query<{ id: string; sequence_order: number }>(
            "SELECT id, sequence_order FROM crop_tasks WHERE crop_plan_id = $1 ORDER BY sequence_order",
            [planId],
          );
          const baseDate = new Date(sowingDate);
          for (const t of tasksRes.rows) {
            const newDate = new Date(baseDate);
            newDate.setDate(newDate.getDate() + (t.sequence_order - 1) * 12);
            await query("UPDATE crop_tasks SET due_date = $1 WHERE id = $2", [newDate.toISOString().split("T")[0], t.id]);
          }
        }
      }
    } catch (dbErr) {
      console.warn("[CROP-PATCH] DB update fallback:", dbErr);
    }

    // 2. Update memory store
    if (targetCrop) {
      if (sowingDate) targetCrop.sowingDate = sowingDate;
      if (normAcres !== undefined) targetCrop.landAreaAcres = normAcres;
      if (variety !== undefined) targetCrop.varietyName = variety;
      if (location) targetCrop.location = location;
      if (farmingStage) targetCrop.farmingStage = farmingStage;

      // Recalculate memory tasks
      if (sowingDate && targetCrop.planId) {
        const baseDate = new Date(sowingDate);
        inMemoryTasks
          .filter((t) => t.cropPlanId === targetCrop?.planId)
          .forEach((t, i) => {
            const nextDate = new Date(baseDate);
            nextDate.setDate(nextDate.getDate() + i * 12);
            t.date = nextDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
          });
      }
    }

    res.json({
      success: true,
      message: "Crop details updated and care schedule dates recalculated successfully.",
      crop: targetCrop,
    });
  } catch (error: any) {
    console.error("[CROP-PATCH] Error:", error);
    res.status(500).json({ error: error?.message || "Failed to update crop details" });
  }
});

// GET /api/crops/plans/:planId/tasks — Get tasks for a plan
router.get("/plans/:planId/tasks", requireAuth, async (req, res) => {
  const { planId } = req.params;

  try {
    const result = await query<{
      id: string;
      task_name: string;
      due_date: string;
      status: string;
      category: string;
      priority: string;
      notes: string | null;
    }>(
      `SELECT ct.id, ct.task_name, ct.due_date, ct.status, ct.category, ct.priority, ct.notes
       FROM crop_tasks ct
       JOIN crop_plans cp ON cp.id = ct.crop_plan_id
       JOIN crop_registrations cr ON cr.id = cp.crop_registration_id
       JOIN fields f ON f.id = cr.field_id
       JOIN farms fm ON fm.id = f.farm_id
       WHERE ct.crop_plan_id = $1 AND fm.farmer_id = $2
       ORDER BY ct.sequence_order`,
      [planId, req.user!.id],
    );

    if (result.rows.length > 0) {
      res.json(
        result.rows.map((row) => ({
          id: row.id,
          label: row.task_name,
          date: new Date(row.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
          status: row.status === "completed" ? "done" : "upcoming",
          category: row.category,
          priority: row.priority,
          notes: row.notes,
        })),
      );
      return;
    }
  } catch (error) {
    console.warn("Plan tasks DB fallback:", error);
  }

  // Memory fallback
  const tasks = inMemoryTasks.filter((t) => t.cropPlanId === planId);
  res.json(tasks);
});

// PATCH /api/crops/tasks/:taskId — Toggle task status
router.patch("/tasks/:taskId", requireAuth, async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body as { status?: "completed" | "pending" };
  const dbStatus = status === "completed" ? "completed" : "pending";

  try {
    await query(
      `UPDATE crop_tasks ct
       SET status = $1,
           completed_date = CASE WHEN $1 = 'completed' THEN CURRENT_DATE ELSE NULL END,
           updated_at = CURRENT_TIMESTAMP
       FROM crop_plans cp
       JOIN crop_registrations cr ON cr.id = cp.crop_registration_id
       JOIN fields f ON f.id = cr.field_id
       JOIN farms fm ON fm.id = f.farm_id
       WHERE ct.id = $2 AND ct.crop_plan_id = cp.id AND fm.farmer_id = $3`,
      [dbStatus, taskId, req.user!.id],
    );
  } catch (error) {
    console.warn("Update task DB fallback:", error);
  }

  const memTask = inMemoryTasks.find((t) => t.id === taskId);
  if (memTask) {
    memTask.status = status === "completed" ? "done" : "upcoming";
  }

  res.json({ success: true });
});

export default router;
