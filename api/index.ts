import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// In-memory user store for Vercel serverless environment
interface ServerlessUser {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  role: string;
  preferredLanguage: string;
  password?: string;
}

const serverlessUsers: ServerlessUser[] = [
  {
    id: "user_farmer_demo",
    fullName: "Ramesh Patel",
    phoneNumber: "+919876543210",
    email: "ramesh@agroscan.io",
    role: "farmer",
    preferredLanguage: "en",
    password: "Password@123",
  },
];

const mockCrops = [
  {
    id: "crop-1",
    cropName: "Paddy (Rice)",
    varietyName: "BPT 5204 (Samba Mahsuri)",
    landAreaAcres: 3.5,
    sowingDate: "2025-01-15",
    farmingStage: "Vegetative Stage (Day 45)",
    status: "healthy",
    fieldName: "North Field Block A",
    location: "Guntur, Andhra Pradesh",
    farmName: "Sunrise Green Acres",
    planId: "plan-paddy-01",
    planName: "Paddy Kharif Protocol",
    progress: 42,
  },
  {
    id: "crop-2",
    cropName: "Cotton",
    varietyName: "Bt Cotton Hybrid",
    landAreaAcres: 2.0,
    sowingDate: "2025-02-01",
    farmingStage: "Flowering & Boll Formation",
    status: "monitoring",
    fieldName: "East Slope",
    location: "Guntur, Andhra Pradesh",
    farmName: "Sunrise Green Acres",
    planId: "plan-cotton-02",
    planName: "Cotton High-Yield Plan",
    progress: 60,
  },
];

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    database: "fallback_ready",
    timestamp: new Date().toISOString(),
    platform: "vercel",
  });
});

// POST /api/auth/register
app.post("/api/auth/register", (req, res) => {
  try {
    const { fullName, mobile, email, password, language, role } = req.body || {};

    if (!fullName || !fullName.trim()) {
      res.status(400).json({ error: "Please enter your full name." });
      return;
    }
    if (!mobile || !mobile.trim()) {
      res.status(400).json({ error: "Please enter your mobile number." });
      return;
    }
    if (!email || !email.trim()) {
      res.status(400).json({ error: "Please enter your email address." });
      return;
    }
    if (!password || password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters." });
      return;
    }

    const digits = mobile.replace(/\D/g, "");
    const normalizedMobile = digits.length === 10 ? `+91${digits}` : mobile.trim();
    const cleanEmail = email.trim().toLowerCase();
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newUser: ServerlessUser = {
      id: userId,
      fullName: fullName.trim(),
      phoneNumber: normalizedMobile,
      email: cleanEmail,
      role: role || "farmer",
      preferredLanguage: language || "en",
      password: password,
    };

    serverlessUsers.push(newUser);

    const token = `token_live_${userId}_${Date.now()}`;

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        phoneNumber: newUser.phoneNumber,
        email: newUser.email,
        role: newUser.role,
        preferredLanguage: newUser.preferredLanguage,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Registration failed. Please try again." });
  }
});

// POST /api/auth/login
app.post("/api/auth/login", (req, res) => {
  try {
    const { identifier, password } = req.body || {};
    if (!identifier?.trim() || !password) {
      res.status(400).json({ error: "Please enter your mobile/email and password." });
      return;
    }

    const trimmed = identifier.trim().toLowerCase();
    const digits = trimmed.replace(/\D/g, "");

    const matched = serverlessUsers.find((u) => {
      const emailMatch = u.email && u.email.toLowerCase() === trimmed;
      const uDigits = (u.phoneNumber || "").replace(/\D/g, "");
      const phoneMatch =
        u.phoneNumber === trimmed ||
        (digits.length >= 10 && uDigits.endsWith(digits.slice(-10)));
      return emailMatch || phoneMatch;
    });

    if (matched) {
      if (matched.password && matched.password !== password) {
        res.status(401).json({ error: "Invalid password. Please check your credentials." });
        return;
      }

      const token = `token_live_${matched.id}_${Date.now()}`;
      res.json({
        token,
        user: {
          id: matched.id,
          fullName: matched.fullName,
          phoneNumber: matched.phoneNumber,
          email: matched.email,
          role: matched.role,
          preferredLanguage: matched.preferredLanguage,
        },
      });
      return;
    }

    // Default dynamic login for valid-looking inputs
    const fallbackId = `user_${Date.now()}`;
    res.json({
      token: `token_live_${fallbackId}`,
      user: {
        id: fallbackId,
        fullName: trimmed.includes("@") ? trimmed.split("@")[0] : "Farmer User",
        phoneNumber: digits.length >= 10 ? `+91${digits.slice(-10)}` : "+919876543210",
        email: trimmed.includes("@") ? trimmed : "farmer@agroscan.io",
        role: "farmer",
        preferredLanguage: "en",
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Login failed. Please try again." });
  }
});

// GET /api/auth/me
app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (token) {
    res.json({
      id: "user_current",
      fullName: "AgroScan Farmer",
      phoneNumber: "+919876543210",
      email: "farmer@agroscan.io",
      role: "farmer",
      preferredLanguage: "en",
    });
    return;
  }
  res.status(401).json({ error: "Not authenticated" });
});

// GET /api/crops
app.get("/api/crops", (_req, res) => {
  res.json(mockCrops);
});

// POST /api/crops/register
app.post("/api/crops/register", (req, res) => {
  const newCrop = {
    id: `crop-${Date.now()}`,
    cropName: req.body.cropName || "Paddy",
    varietyName: req.body.varietyName || null,
    landAreaAcres: Number(req.body.landAreaAcres) || 1,
    sowingDate: req.body.sowingDate || new Date().toISOString().split("T")[0],
    farmingStage: req.body.farmingStage || "Early Growth",
    status: "healthy",
    fieldName: req.body.fieldName || "Main Field",
    location: req.body.location || "Guntur, Andhra Pradesh",
    farmName: req.body.farmName || "My Farm",
    planId: "plan-auto",
    planName: `${req.body.cropName || "Crop"} Growth Protocol`,
    progress: 10,
  };
  mockCrops.push(newCrop);
  res.status(201).json(newCrop);
});

// Generic catch-all for other /api routes
app.all("/api/*", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

export default app;
