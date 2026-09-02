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
import storesRoutes from "./routes/stores.js";

export function createApp() {
  const app = express();

  const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
    : true;

  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "10mb" }));

  app.get("/api/health", async (_req, res) => {
    const dbConnected = await checkDbConnection();
    res.status(200).json({
      status: "ok",
      database: dbConnected ? "connected" : "fallback_ready",
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
  app.use("/api/stores", storesRoutes);

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
  const defaultPort = process.env.NODE_ENV === "production" ? 5000 : 3001;
  const port = Number(process.env.PORT || defaultPort);

  server.listen(port, "0.0.0.0", () => {
    console.log(`AgroScan server running on http://0.0.0.0:${port}/ (NODE_ENV=${process.env.NODE_ENV || "development"})`);
    console.log(`Health check: http://localhost:${port}/api/health`);
  });
}

// Start standalone HTTP listener if run directly (Render / Docker / local), but not in Vercel serverless mode
const isMainModule =
  process.argv[1] &&
  !process.env.VERCEL &&
  (
    process.argv[1].endsWith("dist/index.js") ||
    process.argv[1].endsWith("dist\\index.js") ||
    process.argv[1].endsWith("server/index.ts") ||
    process.argv[1].endsWith("server\\index.ts") ||
    process.argv[1].endsWith("server/index.js") ||
    process.argv[1].endsWith("server\\index.js")
  );

if (isMainModule || process.env.AUTO_START_SERVER === "true") {
  startServer().catch((err) => {
    console.error("Fatal AgroScan server startup error:", err);
    process.exit(1);
  });
}
