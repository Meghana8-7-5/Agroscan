import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { checkDbConnection } from "./db.js";
import authRoutes from "./routes/auth.js";
import cropsRoutes from "./routes/crops.js";
import weatherRoutes from "./routes/weather.js";
import notificationsRoutes from "./routes/notifications.js";
import detectionsRoutes from "./routes/detections.js";
import dashboardRoutes from "./routes/dashboard.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import uiConfigRoutes from "./routes/uiConfig.js";
import aiAssistantRoutes from "./routes/aiAssistant.js";
import supportRoutes from "./routes/support.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "10mb" }));

  app.get("/api/health", async (_req, res) => {
    const dbConnected = await checkDbConnection();
    res.status(dbConnected ? 200 : 503).json({
      status: dbConnected ? "ok" : "degraded",
      database: dbConnected ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/crops", cropsRoutes);
  app.use("/api/weather", weatherRoutes);
  app.use("/api/notifications", notificationsRoutes);
  app.use("/api/detections", detectionsRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/ui-config", uiConfigRoutes);
  app.use("/api/ai", aiAssistantRoutes);
  app.use("/api/support", supportRoutes);

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      next();
      return;
    }
    res.sendFile(path.join(staticPath, "index.html"), (err) => {
      if (err) next();
    });
  });

  return app;
}

async function startServer() {
  const app = createApp();
  const server = createServer(app);
  const port = Number(process.env.PORT || 3001);

  server.listen(port, () => {
    console.log(`AgroScan API running on http://localhost:${port}/`);
    console.log(`Health check: http://localhost:${port}/api/health`);
  });
}

// Start server if run directly (e.g. `node server/index.js` or `tsx server/index.ts`)
const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith("server/index.ts") ||
  process.argv[1].endsWith("server/index.js") ||
  process.argv[1].endsWith("server\\index.ts") ||
  process.argv[1].endsWith("server\\index.js")
);

if (isDirectRun || process.env.AUTO_START_SERVER === "true") {
  startServer().catch(console.error);
}
