import { Router } from "express";
import bcrypt from "bcryptjs";
import { query } from "../db.js";
import { requireAuth, signToken } from "../middleware/auth.js";
import {
  generateAndSendOtp,
  verifyOtp,
  normalizePhoneNumber,
} from "../services/smsService.js";

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
  password_hash?: string;
  preferred_language: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

// In-memory user store fallback when PostgreSQL is offline
const inMemoryUsers: StoredUser[] = [];

// ── 1. POST /api/auth/send-otp (Farmer Mobile OTP Request) ───────────────
router.post("/send-otp", async (req, res) => {
  try {
    const { mobile, language = "en" } = req.body as { mobile?: string; language?: string };

    if (!mobile || !mobile.trim()) {
      res.status(400).json({ error: "Please enter your 10-digit mobile number." });
      return;
    }

    const digitsOnly = mobile.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      res.status(400).json({ error: "Mobile number must be at least 10 digits." });
      return;
    }

    const normalizedLang = languageMap[language] || language || "en";
    const result = await generateAndSendOtp(mobile, normalizedLang);

    if (!result.success) {
      res.status(429).json({ error: result.message, cooldownSeconds: result.cooldownSeconds });
      return;
    }

    res.json(result);
  } catch (error: any) {
    console.error("[AUTH-SEND-OTP] Error:", error);
    res.status(500).json({ error: error?.message || "Failed to send OTP. Please try again." });
  }
});

// ── 2. POST /api/auth/verify-otp (Farmer OTP Verification & Auto-Login) ──
router.post("/verify-otp", async (req, res) => {
  try {
    const { mobile, otp } = req.body as { mobile?: string; otp?: string };

    if (!mobile || !mobile.trim()) {
      res.status(400).json({ error: "Mobile number is required." });
      return;
    }
    if (!otp || !otp.trim()) {
      res.status(400).json({ error: "Please enter the 6-digit OTP sent to your phone." });
      return;
    }

    const verification = verifyOtp(mobile.trim(), otp.trim());
    if (!verification.success) {
      res.status(400).json({ error: verification.error || "Invalid OTP code." });
      return;
    }

    const phoneNumber = normalizePhoneNumber(mobile.trim());
    const digits = mobile.replace(/\D/g, "");

    let existingUser: {
      id: string;
      full_name: string;
      phone_number: string;
      email: string | null;
      role: string;
      preferred_language: string;
    } | null = null;
    let isNewUser = false;

    // 1. Try DB lookup
    try {
      const result = await query<{
        id: string;
        full_name: string;
        phone_number: string;
        email: string | null;
        role: string;
        preferred_language: string;
      }>(
        `SELECT id, full_name, phone_number, email, role, preferred_language
         FROM users
         WHERE phone_number = $1 OR RIGHT(REGEXP_REPLACE(phone_number, '[^0-9]', '', 'g'), 10) = $2
         LIMIT 1`,
        [phoneNumber, digits.slice(-10)],
      );

      if (result.rows.length > 0) {
        existingUser = result.rows[0];
      } else {
        // Create new user in DB
        const defaultName = `Farmer ${digits.slice(-4)}`;
        const insertRes = await query<{
          id: string;
          full_name: string;
          phone_number: string;
          email: string | null;
          role: string;
          preferred_language: string;
        }>(
          `INSERT INTO users (full_name, phone_number, preferred_language, terms_accepted, role)
           VALUES ($1, $2, 'en', TRUE, 'farmer')
           RETURNING id, full_name, phone_number, email, role, preferred_language`,
          [defaultName, phoneNumber],
        );
        existingUser = insertRes.rows[0];
        isNewUser = true;

        // Auto-seed default farm for new farmer
        try {
          await query(
            `INSERT INTO farms (farmer_id, farm_name, state, district, village_city, total_area_acres)
             VALUES ($1, $2, 'Andhra Pradesh', 'Guntur', 'My Village', 2.5)`,
            [existingUser.id, "My Farm"],
          );
        } catch {}
      }
    } catch (dbErr) {
      console.warn("[AUTH-VERIFY-OTP] Database lookup/insert fallback to in-memory:", dbErr);
    }

    // 2. Fallback to in-memory store if DB was unreachable
    if (!existingUser) {
      const memMatch = inMemoryUsers.find((u) => {
        const uDigits = u.phone_number.replace(/\D/g, "");
        return u.phone_number === phoneNumber || (digits.length >= 10 && uDigits.endsWith(digits.slice(-10)));
      });

      if (memMatch) {
        existingUser = {
          id: memMatch.id,
          full_name: memMatch.full_name,
          phone_number: memMatch.phone_number,
          email: memMatch.email,
          role: memMatch.role,
          preferred_language: memMatch.preferred_language,
        };
      } else {
        const newMemUser: StoredUser = {
          id: `farmer_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          full_name: `Farmer ${digits.slice(-4)}`,
          phone_number: phoneNumber,
          email: null,
          preferred_language: "en",
          role: "farmer",
          is_active: true,
          created_at: new Date().toISOString(),
        };
        inMemoryUsers.push(newMemUser);
        existingUser = {
          id: newMemUser.id,
          full_name: newMemUser.full_name,
          phone_number: newMemUser.phone_number,
          email: newMemUser.email,
          role: newMemUser.role,
          preferred_language: newMemUser.preferred_language,
        };
        isNewUser = true;
      }
    }

    const token = signToken({
      id: existingUser.id,
      fullName: existingUser.full_name,
      phoneNumber: existingUser.phone_number,
      email: existingUser.email,
      role: existingUser.role,
      preferredLanguage: existingUser.preferred_language,
    });

    console.log(`[AUTH-VERIFY-OTP] Verified farmer: ${existingUser.phone_number} (isNewUser=${isNewUser})`);

    res.json({
      success: true,
      token,
      isNewUser,
      user: {
        id: existingUser.id,
        fullName: existingUser.full_name,
        phoneNumber: existingUser.phone_number,
        email: existingUser.email,
        role: existingUser.role,
        preferredLanguage: existingUser.preferred_language,
      },
    });
  } catch (error: any) {
    console.error("[AUTH-VERIFY-OTP] Error:", error);
    res.status(500).json({ error: error?.message || "OTP verification failed. Please try again." });
  }
});

// ── 3. POST /api/auth/complete-profile (Minimal One-Time Setup for New Farmers)
router.post("/complete-profile", requireAuth, async (req, res) => {
  try {
    const { fullName, language, villageCity, district, state } = req.body as {
      fullName?: string;
      language?: string;
      villageCity?: string;
      district?: string;
      state?: string;
    };

    if (!fullName || !fullName.trim()) {
      res.status(400).json({ error: "Please enter your name." });
      return;
    }

    const prefLang = languageMap[language || "English"] || language || "en";
    const name = fullName.trim();

    // 1. Update DB user
    try {
      await query(
        `UPDATE users
         SET full_name = $1, preferred_language = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [name, prefLang, req.user!.id],
      );

      if (villageCity || district) {
        const farmRes = await query("SELECT id FROM farms WHERE farmer_id = $1 LIMIT 1", [req.user!.id]);
        if (farmRes.rows.length > 0) {
          await query(
            `UPDATE farms SET village_city = COALESCE($1, village_city), district = COALESCE($2, district), state = COALESCE($3, state)
             WHERE id = $4`,
            [villageCity || null, district || null, state || null, farmRes.rows[0].id],
          );
        } else {
          await query(
            `INSERT INTO farms (farmer_id, farm_name, state, district, village_city, total_area_acres)
             VALUES ($1, 'My Farm', $2, $3, $4, 2.5)`,
            [req.user!.id, state || "Andhra Pradesh", district || "Guntur", villageCity || "My Village"],
          );
        }
      }
    } catch (dbErr) {
      console.warn("[AUTH-COMPLETE-PROFILE] DB update skipped:", dbErr);
    }

    // 2. Update memory store
    const memUser = inMemoryUsers.find((u) => u.id === req.user!.id);
    if (memUser) {
      memUser.full_name = name;
      memUser.preferred_language = prefLang;
    }

    const updatedUser = {
      id: req.user!.id,
      fullName: name,
      phoneNumber: req.user!.phoneNumber,
      email: req.user!.email,
      role: req.user!.role,
      preferredLanguage: prefLang,
    };

    const token = signToken(updatedUser);

    res.json({
      success: true,
      token,
      user: updatedUser,
      message: "Profile updated successfully.",
    });
  } catch (error: any) {
    console.error("[AUTH-COMPLETE-PROFILE] Error:", error);
    res.status(500).json({ error: error?.message || "Failed to save profile." });
  }
});

// ── 4. POST /api/auth/login (Preserved for Admin Login with Password) ────
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body as { identifier?: string; password?: string };

    if (!identifier?.trim() || !password) {
      res.status(400).json({ error: "Please enter your credentials." });
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
    const phoneNumber = isEmail ? null : normalizePhoneNumber(trimmed);

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
          : "SELECT * FROM users WHERE phone_number = $1 OR phone_number = $2 OR RIGHT(REGEXP_REPLACE(phone_number, '[^0-9]', '', 'g'), 10) = $3",
        [isEmail ? trimmed : phoneNumber, trimmed, trimmed.replace(/\D/g, "").slice(-10)],
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
    const digits = trimmed.replace(/\D/g, "");
    const memUser = inMemoryUsers.find((u) => {
      if (isEmail) return u.email && u.email.toLowerCase() === trimmed;
      const uDigits = (u.phone_number || "").replace(/\D/g, "");
      return (
        u.phone_number === phoneNumber ||
        u.phone_number === trimmed ||
        (digits.length >= 10 && uDigits.endsWith(digits.slice(-10)))
      );
    });

    if (memUser && memUser.is_active && memUser.password_hash) {
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

// ── 5. POST /api/auth/register (Full registration backward compatibility)
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

    if (!mobile || !mobile.trim()) {
      res.status(400).json({ error: "Please enter your mobile number." });
      return;
    }

    const phoneNumber = normalizePhoneNumber(mobile);
    const prefLang = languageMap[language || "English"] || "en";
    const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
    const lowerEmail = email ? email.trim().toLowerCase() : null;
    const assignedRole = role === "admin" || (lowerEmail && ADMIN_EMAILS.some((a) => a.toLowerCase() === lowerEmail)) ? "admin" : "farmer";
    const name = (fullName || `Farmer ${mobile.slice(-4)}`).trim();

    let createdUser: {
      id: string;
      full_name: string;
      phone_number: string;
      email: string | null;
      role: string;
      preferred_language: string;
    } | null = null;

    try {
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
         ON CONFLICT (phone_number) DO UPDATE
         SET full_name = EXCLUDED.full_name, preferred_language = EXCLUDED.preferred_language
         RETURNING id, full_name, phone_number, email, role, preferred_language`,
        [name, phoneNumber, lowerEmail, passwordHash || null, prefLang, assignedRole],
      );
      createdUser = result.rows[0];
    } catch (dbErr) {
      console.warn("[AUTH-REGISTER] DB fallback:", dbErr);
      const memUser: StoredUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        full_name: name,
        phone_number: phoneNumber,
        email: lowerEmail,
        password_hash: passwordHash,
        preferred_language: prefLang,
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

    const token = signToken({
      id: createdUser.id,
      fullName: createdUser.full_name,
      phoneNumber: createdUser.phone_number,
      email: createdUser.email,
      role: createdUser.role,
      preferredLanguage: createdUser.preferred_language,
    });

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
    console.error("[AUTH-REGISTER] Error:", error);
    res.status(500).json({ error: error?.message || "Registration failed. Please try again." });
  }
});

// ── 6. GET /api/auth/me ─────────────────────────────────────────────────
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

// ── 7. PATCH /api/auth/language ─────────────────────────────────────────
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

// ── 8. PATCH /api/auth/location ─────────────────────────────────────────
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
