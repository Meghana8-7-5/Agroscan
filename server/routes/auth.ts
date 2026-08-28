import { Router } from "express";
import bcrypt from "bcryptjs";
import { query } from "../db.js";
import { requireAuth, signToken } from "../middleware/auth.js";

const router = Router();

const ADMIN_EMAILS = [
  "vganesh1603m@gmail.com",
  "meghanakotaru07@gmail.com",
  "saiveena073@gmail.com",
  "vedaamrutha.t6@gmail.com",
  "akashpuli4851@gmail.com",
  "yarragandlasaikishore@gmail.com"
];

const ADMIN_PASSWORD = "GMVKAA@123";

const languageMap: Record<string, string> = {
  English: "en",
  "తెలుగు": "te",
  "हिन्दी": "hi",
  "தமிழ்": "ta",
  "ಕನ್ನಡ": "kn",
  "मराठी": "mr",
  "ਪੰਜਾਬੀ": "pa",
  "বাংলা": "bn",
  "ગુજરાતી": "gu",
  "മലയാളം": "ml",
  en: "en",
  te: "te",
  hi: "hi",
  ta: "ta",
  kn: "kn",
  mr: "mr",
  pa: "pa",
  bn: "bn",
  gu: "gu",
  ml: "ml",
};

interface StoredUser {
  id: string;
  full_name: string;
  phone_number: string;
  email: string | null;
  password_hash: string;
  preferred_language: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

// In-memory user store fallback when PostgreSQL is offline
const inMemoryUsers: StoredUser[] = [];

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.startsWith("91") && digits.length === 12) return `+${digits}`;
  if (raw.startsWith("+")) return raw.trim();
  return `+91${digits}`;
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { fullName, mobile, email, password, language, agree, role } = req.body as {
      fullName?: string;
      mobile?: string;
      email?: string;
      password?: string;
      language?: string;
      agree?: boolean;
      role?: string;
    };

    console.log("[AUTH-REGISTER] Request payload received:", {
      fullName,
      mobile,
      email,
      role: role || "farmer",
      language,
      agree: Boolean(agree),
    });

    // 1. Detailed field validations with specific user-friendly error messages
    if (!fullName || !fullName.trim()) {
      res.status(400).json({ error: "Please enter your full name." });
      return;
    }

    if (!mobile || !mobile.trim()) {
      res.status(400).json({ error: "Please enter your mobile number." });
      return;
    }

    const digitsOnly = mobile.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      res.status(400).json({ error: "Mobile number must be at least 10 digits." });
      return;
    }

    if (!email || !email.trim()) {
      res.status(400).json({ error: "Please enter your email address." });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      res.status(400).json({ error: "Please enter a valid email address (e.g., name@domain.com)." });
      return;
    }

    if (!password || password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters." });
      return;
    }

    if (!agree) {
      res.status(400).json({ error: "Please accept the Terms & Conditions to create an account." });
      return;
    }

    const phoneNumber = normalizePhone(mobile);
    const preferredLanguage = languageMap[language || "English"] || "en";
    const passwordHash = await bcrypt.hash(password, 10);
    const lowerEmail = email.trim().toLowerCase();
    const assignedRole = role === "admin" || ADMIN_EMAILS.some((a) => a.toLowerCase() === lowerEmail) ? "admin" : "farmer";

    let createdUser: {
      id: string;
      full_name: string;
      phone_number: string;
      email: string | null;
      role: string;
      preferred_language: string;
    } | null = null;

    // 2. Try PostgreSQL database first
    try {
      const existing = await query(
        "SELECT id, phone_number, email FROM users WHERE phone_number = $1 OR LOWER(email) = $2",
        [phoneNumber, lowerEmail],
      );

      if (existing.rows.length > 0) {
        const match = existing.rows[0];
        if (match.email && match.email.toLowerCase() === lowerEmail) {
          res.status(409).json({ error: "An account with this email address already exists. Please log in." });
          return;
        }
        res.status(409).json({ error: "An account with this mobile number already exists. Please log in." });
        return;
      }

      const result = await query<{
        id: string;
        full_name: string;
        phone_number: string;
        email: string | null;
        role: string;
        preferred_language: string;
      }>(
        `INSERT INTO users (full_name, phone_number, email, password_hash, preferred_language, terms_accepted, terms_accepted_at, role)
         VALUES ($1, $2, $3, $4, $5, TRUE, CURRENT_TIMESTAMP, $6)
         RETURNING id, full_name, phone_number, email, role, preferred_language`,
        [fullName.trim(), phoneNumber, lowerEmail, passwordHash, preferredLanguage, assignedRole],
      );

      createdUser = result.rows[0];

      // Auto-create initial farm record for farmer
      try {
        await query(
          `INSERT INTO farms (farmer_id, farm_name, state, district, village_city, total_area_acres)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [createdUser.id, "My Farm", "Andhra Pradesh", "Guntur", "Gowdapalem", 5.0],
        );
      } catch (farmErr) {
        console.warn("[AUTH-REGISTER] Could not auto-create farm:", farmErr);
      }
    } catch (dbErr) {
      console.warn("[AUTH-REGISTER] Database unavailable, using in-memory user registry fallback:", dbErr);

      // Check duplicate in memory store
      const existingMem = inMemoryUsers.find(
        (u) => u.phone_number === phoneNumber || (u.email && u.email.toLowerCase() === lowerEmail),
      );

      if (existingMem) {
        if (existingMem.email && existingMem.email.toLowerCase() === lowerEmail) {
          res.status(409).json({ error: "An account with this email address already exists. Please log in." });
          return;
        }
        res.status(409).json({ error: "An account with this mobile number already exists. Please log in." });
        return;
      }

      const memUser: StoredUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        full_name: fullName.trim(),
        phone_number: phoneNumber,
        email: lowerEmail,
        password_hash: passwordHash,
        preferred_language: preferredLanguage,
        role: assignedRole,
        is_active: true,
        created_at: new Date().toISOString(),
      };

      inMemoryUsers.push(memUser);
      createdUser = {
        id: memUser.id,
        full_name: memUser.full_name,
        phone_number: memUser.phone_number,
        email: memUser.email,
        role: memUser.role,
        preferred_language: memUser.preferred_language,
      };
    }

    if (!createdUser) {
      res.status(500).json({ error: "Unable to create account. Please try again." });
      return;
    }

    const token = signToken({
      id: createdUser.id,
      fullName: createdUser.full_name,
      phoneNumber: createdUser.phone_number,
      email: createdUser.email,
      role: createdUser.role,
      preferredLanguage: createdUser.preferred_language,
    });

    console.log("[AUTH-REGISTER] Registration successful for:", createdUser.id, createdUser.full_name, createdUser.role);

    res.status(201).json({
      token,
      user: {
        id: createdUser.id,
        fullName: createdUser.full_name,
        phoneNumber: createdUser.phone_number,
        email: createdUser.email,
        role: createdUser.role,
        preferredLanguage: createdUser.preferred_language,
      },
    });
  } catch (error: any) {
    console.error("[AUTH-REGISTER] Unexpected error during registration:", error);
    res.status(500).json({
      error: error?.message || "Registration failed due to a server error. Please try again.",
    });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body as { identifier?: string; password?: string };

    if (!identifier?.trim() || !password) {
      res.status(400).json({ error: "Please enter your mobile/email and password." });
      return;
    }

    const trimmed = identifier.trim().toLowerCase();
    const isAdminEmail = ADMIN_EMAILS.some((a) => a.toLowerCase() === trimmed);

    // Hardcoded auth for designated admin emails
    if (isAdminEmail && password === ADMIN_PASSWORD) {
      const adminToken = signToken({
        id: `admin_${trimmed.split("@")[0]}`,
        fullName: `Admin ${trimmed.split("@")[0]}`,
        phoneNumber: "+919999999999",
        email: trimmed,
        role: "admin",
        preferredLanguage: "en",
      });

      res.json({
        token: adminToken,
        user: {
          id: `admin_${trimmed.split("@")[0]}`,
          fullName: `Admin ${trimmed.split("@")[0]}`,
          phoneNumber: "+919999999999",
          email: trimmed,
          role: "admin",
          preferredLanguage: "en",
        },
      });
      return;
    }

    const isEmail = trimmed.includes("@");
    const phoneNumber = isEmail ? null : normalizePhone(trimmed);

    // 1. Try DB login
    try {
      const result = await query<{
        id: string;
        full_name: string;
        phone_number: string;
        email: string | null;
        password_hash: string | null;
        role: string;
        preferred_language: string;
        is_active: boolean;
      }>(
        isEmail
          ? "SELECT * FROM users WHERE LOWER(email) = LOWER($1)"
          : "SELECT * FROM users WHERE phone_number = $1",
        [isEmail ? trimmed : phoneNumber],
      );

      const dbUser = result.rows[0];
      if (dbUser && dbUser.is_active && dbUser.password_hash) {
        const valid = await bcrypt.compare(password, dbUser.password_hash);
        if (valid) {
          const token = signToken({
            id: dbUser.id,
            fullName: dbUser.full_name,
            phoneNumber: dbUser.phone_number,
            email: dbUser.email,
            role: dbUser.role,
            preferredLanguage: dbUser.preferred_language,
          });

          res.json({
            token,
            user: {
              id: dbUser.id,
              fullName: dbUser.full_name,
              phoneNumber: dbUser.phone_number,
              email: dbUser.email,
              role: dbUser.role,
              preferredLanguage: dbUser.preferred_language,
            },
          });
          return;
        }
      }
    } catch (dbErr) {
      console.warn("[AUTH-LOGIN] Database lookup error, checking in-memory store:", dbErr);
    }

    // 2. Check in-memory store
    const memUser = inMemoryUsers.find(
      (u) =>
        (isEmail && u.email && u.email.toLowerCase() === trimmed) ||
        (!isEmail && (u.phone_number === phoneNumber || u.phone_number === trimmed)),
    );

    if (memUser && memUser.is_active) {
      const valid = await bcrypt.compare(password, memUser.password_hash);
      if (valid) {
        const token = signToken({
          id: memUser.id,
          fullName: memUser.full_name,
          phoneNumber: memUser.phone_number,
          email: memUser.email,
          role: memUser.role,
          preferredLanguage: memUser.preferred_language,
        });

        res.json({
          token,
          user: {
            id: memUser.id,
            fullName: memUser.full_name,
            phoneNumber: memUser.phone_number,
            email: memUser.email,
            role: memUser.role,
            preferredLanguage: memUser.preferred_language,
          },
        });
        return;
      }
    }

    res.status(401).json({ error: "Invalid login credentials. Please check your details and try again." });
  } catch (error: any) {
    console.error("[AUTH-LOGIN] Login error:", error);
    res.status(500).json({ error: "Login failed due to a server error. Please try again." });
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    if (req.user?.email && ADMIN_EMAILS.some((a) => a.toLowerCase() === req.user?.email?.toLowerCase())) {
      res.json({
        id: req.user.id,
        fullName: req.user.fullName,
        phoneNumber: req.user.phoneNumber,
        email: req.user.email,
        role: "admin",
        preferredLanguage: req.user.preferredLanguage,
      });
      return;
    }

    try {
      const result = await query<{
        id: string;
        full_name: string;
        phone_number: string;
        email: string | null;
        role: string;
        preferred_language: string;
      }>(
        "SELECT id, full_name, phone_number, email, role, preferred_language FROM users WHERE id = $1 AND is_active = TRUE",
        [req.user!.id],
      );

      const user = result.rows[0];
      if (user) {
        res.json({
          id: user.id,
          fullName: user.full_name,
          phoneNumber: user.phone_number,
          email: user.email,
          role: user.role,
          preferredLanguage: user.preferred_language,
        });
        return;
      }
    } catch (dbErr) {
      console.warn("[AUTH-ME] Database query failed, checking memory store:", dbErr);
    }

    const memUser = inMemoryUsers.find((u) => u.id === req.user!.id);
    if (memUser) {
      res.json({
        id: memUser.id,
        fullName: memUser.full_name,
        phoneNumber: memUser.phone_number,
        email: memUser.email,
        role: memUser.role,
        preferredLanguage: memUser.preferred_language,
      });
      return;
    }

    // Fallback to token payload
    res.json({
      id: req.user!.id,
      fullName: req.user!.fullName,
      phoneNumber: req.user!.phoneNumber,
      email: req.user!.email,
      role: req.user!.role,
      preferredLanguage: req.user!.preferredLanguage,
    });
  } catch (error) {
    console.error("[AUTH-ME] Error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// PATCH /api/auth/language — sync farmer's preferred language
router.patch("/language", requireAuth, async (req, res) => {
  try {
    const { language } = req.body as { language?: string };
    if (!language || typeof language !== "string") {
      res.status(400).json({ error: "Language code is required" });
      return;
    }

    if (!req.user!.id.startsWith("admin_")) {
      try {
        await query("UPDATE users SET preferred_language = $1 WHERE id = $2", [language, req.user!.id]);
      } catch {
        const mem = inMemoryUsers.find((u) => u.id === req.user!.id);
        if (mem) mem.preferred_language = language;
      }
    }

    res.json({ success: true, language });
  } catch (error) {
    console.error("[AUTH-LANG] Error:", error);
    res.status(500).json({ error: "Failed to update language preference" });
  }
});

// PATCH /api/auth/location — persist resolved GPS/manual location
router.patch("/location", requireAuth, async (req, res) => {
  try {
    const { latitude, longitude, villageCity, district, state } = req.body as {
      latitude?: number;
      longitude?: number;
      villageCity?: string;
      district?: string;
      state?: string;
    };

    if (!villageCity || !district) {
      res.status(400).json({ error: "villageCity and district are required" });
      return;
    }

    if (!req.user!.id.startsWith("admin_")) {
      try {
        const existing = await query(
          "SELECT id FROM farms WHERE farmer_id = $1 ORDER BY created_at ASC LIMIT 1",
          [req.user!.id],
        );

        if (existing.rows.length > 0) {
          await query(
            `UPDATE farms SET latitude = $1, longitude = $2, village_city = $3, district = $4, state = $5
             WHERE id = $6`,
            [latitude || null, longitude || null, villageCity, district, state || "", existing.rows[0].id],
          );
        } else {
          await query(
            `INSERT INTO farms (farmer_id, farm_name, state, district, village_city, latitude, longitude)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [req.user!.id, "My Farm", state || "", district, villageCity, latitude || null, longitude || null],
          );
        }
      } catch (err) {
        console.warn("[AUTH-LOC] DB update skipped:", err);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("[AUTH-LOC] Error:", error);
    res.status(500).json({ error: "Failed to update location" });
  }
});

export default router;
