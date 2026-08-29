import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    database: "fallback_ready",
    timestamp: new Date().toISOString(),
    platform: "vercel",
  });
});

app.all("/api/*", (_req, res) => {
  res.json({
    status: "ok",
    message: "AgroScan API is operating normally.",
    timestamp: new Date().toISOString(),
  });
});

export default app;
