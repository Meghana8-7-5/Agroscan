import { Router } from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/summary", requireAuth, async (req, res) => {
  try {
    const [crops, notifications, primaryCrop] = await Promise.all([
      query<{ count: string }>(
        `SELECT COUNT(*) AS count
         FROM crop_registrations cr
         JOIN fields f ON f.id = cr.field_id
         JOIN farms fm ON fm.id = f.farm_id
         WHERE fm.farmer_id = $1 AND cr.status = 'active'`,
        [req.user!.id],
      ).catch(() => ({ rows: [{ count: "0" }] })),
      query<{ count: string }>(
        "SELECT COUNT(*) AS count FROM notifications WHERE user_id = $1 AND is_read = FALSE",
        [req.user!.id],
      ).catch(() => ({ rows: [{ count: "0" }] })),
      query<{
        crop_name: string;
        variety_name: string | null;
        village_city: string;
        district: string;
        land_area_acres: string;
        sowing_date: string;
        plan_id: string | null;
      }>(
        `SELECT c.name AS crop_name, cr.variety_name, fm.village_city, fm.district,
                cr.land_area_acres, cr.sowing_date, cp.id AS plan_id
         FROM crop_registrations cr
         JOIN crops c ON c.id = cr.crop_id
         JOIN fields f ON f.id = cr.field_id
         JOIN farms fm ON fm.id = f.farm_id
         LEFT JOIN crop_plans cp ON cp.crop_registration_id = cr.id
         WHERE fm.farmer_id = $1 AND cr.status = 'active'
         ORDER BY cr.created_at DESC
         LIMIT 1`,
        [req.user!.id],
      ).catch(() => ({ rows: [] })),
    ]);

    const primary = primaryCrop.rows[0];

    res.json({
      activeCrops: Number(crops.rows[0]?.count || 0),
      unreadNotifications: Number(notifications.rows[0]?.count || 0),
      primaryCrop: primary
        ? {
            name: primary.crop_name,
            variety: primary.variety_name,
            location: `${primary.village_city}, ${primary.district}`,
            area: Number(primary.land_area_acres),
            sowingDate: primary.sowing_date,
            planId: primary.plan_id,
          }
        : null,
      userName: (req.user?.fullName || "Farmer").split(" ")[0],
    });
  } catch (error) {
    console.error("Dashboard summary fallback:", error);
    res.json({
      activeCrops: 0,
      unreadNotifications: 0,
      primaryCrop: null,
      userName: (req.user?.fullName || "Farmer").split(" ")[0],
    });
  }
});

export default router;
