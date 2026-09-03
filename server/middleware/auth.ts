import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export type AuthUser = {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  role: string;
  preferredLanguage: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

function getJwtSecret(): string {
  return process.env.JWT_SECRET || "agroscan-fallback-jwt-secret-key-2026-production";
}

export function signToken(user: AuthUser): string {
  return jwt.sign(
    {
      sub: user.id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
    },
    getJwtSecret(),
    { expiresIn: "7d" },
  );
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    const payload = jwt.verify(header.slice(7), getJwtSecret()) as jwt.JwtPayload;
    req.user = {
      id: String(payload.sub),
      fullName: String(payload.fullName),
      phoneNumber: String(payload.phoneNumber),
      email: payload.email ? String(payload.email) : null,
      role: String(payload.role),
      preferredLanguage: String(payload.preferredLanguage || "en"),
    };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
