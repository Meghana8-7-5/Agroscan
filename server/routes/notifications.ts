import { Router } from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const typeMap: Record<string, string> = {
  weather_alert: "Weather",
  irrigation_reminder: "Crop care",
  fertilizer_reminder: "Crop care",
  pest_alert: "Detection",
  crop_task_due: "Plan",
  general_announcement: "Plan",
};

const toneMap: Record<string, string> = {
  low: "quiet",
  normal: "quiet",
  high: "medium",
  urgent: "high",
};

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);

  if (diffMins < 60) return `${Math.max(1, diffMins)} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await query<{
      id: string;
      type: string;
      title: string;
      message: string;
      priority: string;
      is_read: boolean;
      created_at: string;
      action_url: string | null;
    }>(
      `SELECT id, type, title, message, priority, is_read, created_at, action_url
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user!.id],
    );

    res.json(
      result.rows.map((row) => ({
        id: row.id,
        type: typeMap[row.type] || "Plan",
        tone: toneMap[row.priority] || "medium",
        title: row.title,
        copy: row.message,
        time: formatTimeAgo(row.created_at),
        unread: !row.is_read,
        actionUrl: row.action_url,
      })),
    );
  } catch (error) {
    console.warn("Notifications DB fallback:", error);
    res.json([]);
  }
});

router.patch("/read-all", requireAuth, async (req, res) => {
  try {
    await query(
      `UPDATE notifications
       SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
       WHERE user_id = $1 AND is_read = FALSE`,
      [req.user!.id],
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Mark all read error:", error);
    res.status(500).json({ error: "Failed to mark all as read" });
  }
});

router.patch("/:id/read", requireAuth, async (req, res) => {
  try {
    const result = await query(
      `UPDATE notifications
       SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [req.params.id, req.user!.id],
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
});

export default router;
