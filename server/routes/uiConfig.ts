import { Router } from "express";
import { query } from "../db.js";

const router = Router();

const DEFAULT_UI_CONFIG = {
  gridOrder: [
    "tool_scan",
    "tool_stores",
    "tool_weather",
    "tool_soil",
    "tool_kb",
    "tool_plan",
    "tool_reg",
    "tool_notif",
    "tool_voice",
    "tool_help",
    "tool_lang"
  ],
  cardCustomizations: {}
};

// Memory fallback store if database table does not exist or DB connection fails
let inMemoryUiConfig: any = { ...DEFAULT_UI_CONFIG };

async function ensureUiConfigTable() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS ui_configs (
        id VARCHAR(100) PRIMARY KEY DEFAULT 'default',
        config_data JSONB NOT NULL DEFAULT '{}'::jsonb,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);
  } catch (err) {
    console.warn("Could not create ui_configs table, using memory store fallback:", err);
  }
}

ensureUiConfigTable();

// GET /api/ui-config
router.get("/", async (_req, res) => {
  try {
    const result = await query<{ config_data: any }>(
      "SELECT config_data FROM ui_configs WHERE id = 'default'",
    );
    if (result.rows.length > 0 && result.rows[0].config_data) {
      res.json(result.rows[0].config_data);
      return;
    }
  } catch (err) {
    console.warn("Error fetching ui_config from DB, returning in-memory config:", err);
  }
  res.json(inMemoryUiConfig);
});

// PUT /api/ui-config
router.put("/", async (req, res) => {
  try {
    const newConfig = req.body || {};
    inMemoryUiConfig = { ...inMemoryUiConfig, ...newConfig };

    try {
      await query(
        `INSERT INTO ui_configs (id, config_data, updated_at)
         VALUES ('default', $1, CURRENT_TIMESTAMP)
         ON CONFLICT (id) DO UPDATE
         SET config_data = $1, updated_at = CURRENT_TIMESTAMP`,
        [JSON.stringify(inMemoryUiConfig)]
      );
    } catch (dbErr) {
      console.warn("Failed to persist ui_config to DB, saved to memory:", dbErr);
    }

    res.json({ success: true, config: inMemoryUiConfig });
  } catch (error) {
    console.error("Save ui-config error:", error);
    res.status(500).json({ error: "Failed to save UI configuration" });
  }
});

// POST /api/ui-config/reset
router.post("/reset", async (_req, res) => {
  try {
    inMemoryUiConfig = { ...DEFAULT_UI_CONFIG };
    try {
      await query(
        `INSERT INTO ui_configs (id, config_data, updated_at)
         VALUES ('default', $1, CURRENT_TIMESTAMP)
         ON CONFLICT (id) DO UPDATE
         SET config_data = $1, updated_at = CURRENT_TIMESTAMP`,
        [JSON.stringify(DEFAULT_UI_CONFIG)]
      );
    } catch (dbErr) {
      console.warn("Failed to reset DB ui_config, reset memory store:", dbErr);
    }

    res.json({ success: true, config: DEFAULT_UI_CONFIG });
  } catch (error) {
    console.error("Reset ui-config error:", error);
    res.status(500).json({ error: "Failed to reset UI configuration" });
  }
});

// POST /api/ui-config/upload-image
router.post("/upload-image", async (req, res) => {
  try {
    const { imageData } = req.body as { imageData?: string };
    if (!imageData) {
      res.status(400).json({ error: "No image data provided" });
      return;
    }
    // Return base64 or stored URL
    res.json({ success: true, url: imageData });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ error: "Failed to process uploaded image" });
  }
});

export default router;
