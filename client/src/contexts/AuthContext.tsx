import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { authApi, type ApiUser } from "@/lib/api";

type AuthContextValue = {
  user: ApiUser | null;
  token: string | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: {
    fullName: string;
    mobile: string;
    email: string;
    password: string;
    language: string;
    agree: boolean;
    role?: "admin" | "farmer";
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "agroscan_token";
const USER_KEY = "agroscan_user";

const protectedRoutes = [
  "/dashboard",
  "/crop-registration",
  "/my-crops",
  "/pest-detection",
  "/weather",
  "/notifications",
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<ApiUser | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? (JSON.parse(stored) as ApiUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  const persistAuth = useCallback((nextToken: string, nextUser: ApiUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("agroscan_auth_admin_email");
    sessionStorage.clear();
    setToken(null);
    setUser(null);
    window.location.href = "/";
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const me = await authApi.me();
        if (!cancelled && me && me.id) {
          setUser(me);
          localStorage.setItem(USER_KEY, JSON.stringify(me));
        }
      } catch {
        if (!cancelled) {
          const stored = localStorage.getItem(USER_KEY);
          if (stored && stored !== "undefined") {
            try {
              const parsed = JSON.parse(stored);
              if (parsed && parsed.id) {
                setUser(parsed);
              } else {
                logout();
              }
            } catch {
              logout();
            }
          } else {
            logout();
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [token, logout]);

  useEffect(() => {
    const path = window.location.pathname;
    if (!loading && !token && protectedRoutes.some((route) => path.startsWith(route))) {
      setLocation("/login");
    }
  }, [loading, token, setLocation]);

  const login = useCallback(
    async (identifier: string, password: string) => {
      const trimmed = identifier.trim().toLowerCase();
      const digits = trimmed.replace(/\D/g, "");

      // 1. Try server API login first
      try {
        const response = await authApi.login(identifier, password);
        persistAuth(response.token, response.user);
        return;
      } catch (err: any) {
        console.warn("[AUTH] Server login attempt returned error, checking local registry:", err?.message || err);

        // 2. Check local fallback registry for registered farmer accounts
        const localAccountsRaw = localStorage.getItem("agroscan_registered_farmers");
        const localAccounts: Array<{
          fullName: string;
          mobile: string;
          email: string;
          password: string;
          language: string;
          role: string;
          id: string;
        }> = localAccountsRaw ? JSON.parse(localAccountsRaw) : [];

        const matched = localAccounts.find((acc) => {
          const accEmail = (acc.email || "").trim().toLowerCase();
          const accMobile = (acc.mobile || "").replace(/\D/g, "");
          const isEmailMatch = trimmed.includes("@") && accEmail === trimmed;
          const isPhoneMatch = digits.length >= 10 && (accMobile === digits || accMobile.endsWith(digits) || digits.endsWith(accMobile));
          return isEmailMatch || isPhoneMatch;
        });

        if (matched) {
          if (matched.password === password) {
            const fallbackUser: ApiUser = {
              id: matched.id,
              fullName: matched.fullName,
              phoneNumber: matched.mobile.startsWith("+") ? matched.mobile : `+91${matched.mobile.replace(/\D/g, "")}`,
              email: matched.email || null,
              role: (matched.role as any) || "farmer",
              preferredLanguage: matched.language || "en",
            };
            const fallbackToken = `token_local_${matched.id}_${Date.now()}`;
            persistAuth(fallbackToken, fallbackUser);
            return;
          } else {
            throw new Error("Invalid password. Please check your password and try again.");
          }
        }

        // If not found in server or local registry, throw user-friendly error
        const errMsg = err?.response?.data?.error || err?.message || "Account not found. Please register or check your login details.";
        throw new Error(errMsg);
      }
    },
    [persistAuth],
  );

  const register = useCallback(
    async (data: {
      fullName: string;
      mobile: string;
      email: string;
      password: string;
      language: string;
      agree: boolean;
      role?: "admin" | "farmer";
    }) => {
      const newId = `farmer_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const normalizedMobile = data.mobile.startsWith("+") ? data.mobile : `+91${data.mobile.replace(/\D/g, "")}`;

      // Save to local registry so account is ALWAYS available across sessions
      try {
        const localAccountsRaw = localStorage.getItem("agroscan_registered_farmers");
        const localAccounts: Array<any> = localAccountsRaw ? JSON.parse(localAccountsRaw) : [];
        const existingIdx = localAccounts.findIndex(
          (a) =>
            (data.email && a.email?.toLowerCase() === data.email.toLowerCase()) ||
            a.mobile?.replace(/\D/g, "") === data.mobile.replace(/\D/g, ""),
        );

        const newAccountRecord = {
          id: newId,
          fullName: data.fullName.trim(),
          mobile: normalizedMobile,
          email: data.email.trim().toLowerCase(),
          password: data.password,
          language: data.language,
          role: data.role || "farmer",
          createdAt: new Date().toISOString(),
        };

        if (existingIdx >= 0) {
          localAccounts[existingIdx] = newAccountRecord;
        } else {
          localAccounts.push(newAccountRecord);
        }
        localStorage.setItem("agroscan_registered_farmers", JSON.stringify(localAccounts));
      } catch (saveErr) {
        console.warn("[AUTH] Could not cache farmer account locally:", saveErr);
      }

      // Try server registration
      try {
        const response = await authApi.register(data);
        persistAuth(response.token, response.user);
      } catch (err: any) {
        console.warn("[AUTH] Server registration unavailable, using local active session fallback:", err?.message || err);
        const fallbackUser: ApiUser = {
          id: newId,
          fullName: data.fullName.trim(),
          phoneNumber: normalizedMobile,
          email: data.email.trim().toLowerCase(),
          role: data.role || "farmer",
          preferredLanguage: data.language || "en",
        };
        const fallbackToken = `token_local_${newId}_${Date.now()}`;
        persistAuth(fallbackToken, fallbackUser);
      }
    },
    [persistAuth],
  );

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAuthenticated: Boolean(token && user),
    }),
    [user, token, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
