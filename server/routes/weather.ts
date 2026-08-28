import { Router } from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function weatherTone(condition: string): string {
  const lower = condition.toLowerCase();
  if (lower.includes("rain")) return "sky";
  if (lower.includes("sun") || lower.includes("clear")) return "oat";
  return "green";
}

function weatherNote(condition: string): string {
  const lower = condition.toLowerCase();
  if (lower.includes("rain")) return "Hold off on spraying until leaves are dry.";
  if (lower.includes("sun") || lower.includes("clear")) return "Keep a little extra water ready today.";
  return "Good window for a morning field walk.";
}

router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await query<{
      farm_id: string;
      farm_name: string;
      village_city: string;
      district: string;
      temperature_c: string;
      humidity_percentage: string;
      wind_speed_kmh: string | null;
      weather_condition: string;
      recorded_at: string;
    }>(
      `SELECT DISTINCT ON (fm.id)
         fm.id AS farm_id,
         fm.farm_name,
         fm.village_city,
         fm.district,
         wr.temperature_c,
         wr.humidity_percentage,
         wr.wind_speed_kmh,
         wr.weather_condition,
         wr.recorded_at
       FROM farms fm
       LEFT JOIN weather_records wr ON wr.farm_id = fm.id
       WHERE fm.farmer_id = $1
       ORDER BY fm.id, wr.recorded_at DESC NULLS LAST`,
      [req.user!.id],
    );

    const locations = result.rows.map((row, index) => {
      const temp = row.temperature_c ? Math.round(Number(row.temperature_c)) : 28;
      const humidity = row.humidity_percentage ? `${Math.round(Number(row.humidity_percentage))}%` : "—";
      const wind = row.wind_speed_kmh ? `${Math.round(Number(row.wind_speed_kmh))} km/h` : "—";
      const condition = row.weather_condition || "Partly Cloudy";
      const rainfallPct = condition.toLowerCase().includes("rain") ? "62%" : condition.toLowerCase().includes("sun") ? "18%" : "34%";

      return {
        id: row.farm_id,
        name: index === 0 ? "My Farm" : row.farm_name,
        field: row.village_city,
        district: row.district,
        temp: `${temp}°`,
        condition,
        humidity,
        wind,
        rainfall: rainfallPct,
        tone: weatherTone(condition),
        note: weatherNote(condition),
        updatedAt: row.recorded_at,
      };
    });

    res.json({ locations });
  } catch (error) {
    console.error("Weather error:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

router.get("/dashboard", requireAuth, async (req, res) => {
  try {
    const result = await query<{
      temperature_c: string;
      humidity_percentage: string;
      wind_speed_kmh: string | null;
      weather_condition: string;
      village_city: string;
    }>(
      `SELECT wr.temperature_c, wr.humidity_percentage, wr.wind_speed_kmh, wr.weather_condition, fm.village_city
       FROM weather_records wr
       JOIN farms fm ON fm.id = wr.farm_id
       WHERE fm.farmer_id = $1
       ORDER BY wr.recorded_at DESC
       LIMIT 1`,
      [req.user!.id],
    );

    const row = result.rows[0];
    if (!row) {
      res.json({
        temperature: 28,
        condition: "Partly cloudy",
        humidity: 67,
        wind: 12,
        location: "My farm",
      });
      return;
    }

    res.json({
      temperature: Math.round(Number(row.temperature_c)),
      condition: row.weather_condition,
      humidity: Math.round(Number(row.humidity_percentage)),
      wind: row.wind_speed_kmh ? Math.round(Number(row.wind_speed_kmh)) : 12,
      location: row.village_city,
    });
  } catch (error) {
    console.error("Dashboard weather error:", error);
    res.status(500).json({ error: "Failed to fetch weather summary" });
  }
});

export default router;
