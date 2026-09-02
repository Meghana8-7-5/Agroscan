import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { authApi, type ApiUser, type OtpResponse } from "@/lib/api";

type AuthContextValue = {
  user: ApiUser | null;
  token: string | null;
  loading: boolean;
  sendOtp: (mobile: string, language?: string) => Promise<OtpResponse>;
  verifyOtp: (mobile: string, otp: string) => Promise<{ isNewUser: boolean; user: ApiUser }>;
  completeProfile: (data: {
    fullName: string;
    language: string;
    villageCity?: string;
    district?: string;
    state?: string;
  }) => Promise<void>;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: {
    fullName: string;
    mobile: string;
    email?: string;
    password?: string;
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

  const sendOtp = useCallback(async (mobile: string, language?: string) => {
    return await authApi.sendOtp(mobile, language);
  }, []);

  const verifyOtp = useCallback(async (mobile: string, otp: string) => {
    const response = await authApi.verifyOtp(mobile, otp);
    persistAuth(response.token, response.user);
    return { isNewUser: response.isNewUser, user: response.user };
  }, [persistAuth]);

  const completeProfile = useCallback(async (data: {
    fullName: string;
    language: string;
    villageCity?: string;
    district?: string;
    state?: string;
  }) => {
    const response = await authApi.completeProfile(data);
    persistAuth(response.token, response.user);
  }, [persistAuth]);

  const login = useCallback(
    async (identifier: string, password: string) => {
      const response = await authApi.login(identifier, password);
      persistAuth(response.token, response.user);
    },
    [persistAuth],
  );

  const register = useCallback(
    async (data: {
      fullName: string;
      mobile: string;
      email?: string;
      password?: string;
      language: string;
      agree: boolean;
      role?: "admin" | "farmer";
    }) => {
      const response = await authApi.register(data);
      persistAuth(response.token, response.user);
    },
    [persistAuth],
  );

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      sendOtp,
      verifyOtp,
      completeProfile,
      login,
      register,
      logout,
      isAuthenticated: Boolean(token && user),
    }),
    [user, token, loading, sendOtp, verifyOtp, completeProfile, login, register, logout],
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
