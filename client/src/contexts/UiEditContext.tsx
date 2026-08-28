import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { uiConfigApi } from "../lib/api";

export interface FrameCustomization {
  id: string;
  horizontalAlign?: "flex-start" | "center" | "flex-end";
  verticalAlign?: "flex-start" | "center" | "flex-end";
  bgColor?: string;
  borderColor?: string;
  iconColor?: string;
  textColor?: string;
  customImageUrl?: string;
  imageOpacity?: number; // 0 to 1
  overlayDarkness?: number; // 0 to 1
  textPosition?: "top" | "center" | "bottom" | "left" | "right";
  title?: string;
  subtitle?: string;
  badgeText?: string;
  buttonText?: string;
  placeholder?: string;
  colSpan?: number;
  hideElement?: boolean;
}

export const ADMIN_EMAILS = [
  "vganesh1603m@gmail.com",
  "meghanakotaru07@gmail.com",
  "saiveena073@gmail.com",
  "vedaamrutha.t6@gmail.com",
  "akashpuli4851@gmail.com",
  "yarragandlasaikishore@gmail.com"
];

export const REQUIRED_ADMIN_PASSWORD = "GMVKAA@123";

export const BASELINE_GRID_ORDER = [
  "tool_scan",
  "tool_stores",
  "tool_weather",
  "tool_soil",
  "tool_kb",
  "tool_plan",
  "tool_reg",
  "tool_notif",
  "tool_help"
];

interface UiEditContextType {
  isAdminAuthenticated: boolean;
  adminEmail: string | null;
  loginAdmin: (email: string, pass: string) => { success: boolean; message?: string };
  logoutAdmin: () => void;
  isEditMode: boolean;
  setIsEditMode: (edit: boolean | ((prev: boolean) => boolean)) => void;
  requestExitEditMode: () => void;
  confirmExitEditMode: (saveFirst?: boolean) => Promise<void>;
  cancelExitEditMode: () => void;
  showExitConfirmModal: boolean;
  hasUnsavedChanges: boolean;
  isPreviewAsFarmer: boolean;
  setIsPreviewAsFarmer: (preview: boolean | ((prev: boolean) => boolean)) => void;
  customizations: Record<string, FrameCustomization>;
  gridOrder: string[];
  setGridOrder: (order: string[]) => void;
  getCustomization: (id: string) => FrameCustomization | undefined;
  updateCustomization: (id: string, updates: Partial<FrameCustomization>) => void;
  resetCustomization: (id: string) => void;
  resetToDefaultLayout: () => Promise<void>;
  saveAllChanges: () => Promise<void>;
  activeEditingId: string | null;
  setActiveEditingId: (id: string | null) => void;
  showAdminAuthModal: boolean;
  setShowAdminAuthModal: (show: boolean) => void;
  showRoleSelectModal: boolean;
  setShowRoleSelectModal: (show: boolean) => void;
  showProfileSettingsModal: boolean;
  setShowProfileSettingsModal: (show: boolean) => void;
  requestLogout: () => void;
  activeViewRole: "admin" | "user";
  setActiveViewRole: (role: "admin" | "user") => void;
}

const UiEditContext = createContext<UiEditContextType | undefined>(undefined);

export function UiEditProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  // Stored admin session
  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    return localStorage.getItem("agroscan_auth_admin_email");
  });

  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [showRoleSelectModal, setShowRoleSelectModal] = useState(false);
  const [showProfileSettingsModal, setShowProfileSettingsModal] = useState(false);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [activeViewRole, setActiveViewRole] = useState<"admin" | "user">("admin");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPreviewAsFarmer, setIsPreviewAsFarmer] = useState(false);
  const [activeEditingId, setActiveEditingId] = useState<string | null>(null);

  const [gridOrder, setGridOrderState] = useState<string[]>(BASELINE_GRID_ORDER);
  const [customizations, setCustomizations] = useState<Record<string, FrameCustomization>>({});
  const [persistedCustomizations, setPersistedCustomizations] = useState<Record<string, FrameCustomization>>({});

  // Check if current user or stored admin session is authenticated
  const userEmailLower = (user?.email || "").toLowerCase().trim();
  const storedAdminLower = (adminEmail || "").toLowerCase().trim();

  const isAdminAuthenticated =
    user?.role === "admin" ||
    ADMIN_EMAILS.some((a) => a.toLowerCase() === userEmailLower) ||
    ADMIN_EMAILS.some((a) => a.toLowerCase() === storedAdminLower);

  const effectiveAdminEmail =
    user?.email ||
    adminEmail ||
    (isAdminAuthenticated ? "admin@agroscan.com" : null);

  // Load saved UI Config from backend DB on mount
  useEffect(() => {
    uiConfigApi.get()
      .then((data) => {
        if (data.gridOrder && Array.isArray(data.gridOrder) && data.gridOrder.length > 0) {
          const filtered = data.gridOrder.filter((id) => id !== "tool_voice" && id !== "tool_lang");
          setGridOrderState(filtered.length > 0 ? filtered : BASELINE_GRID_ORDER);
        }
        if (data.cardCustomizations) {
          setCustomizations(data.cardCustomizations);
          setPersistedCustomizations(data.cardCustomizations);
        }
      })
      .catch((err) => {
        console.warn("Failed to load ui-config from backend:", err);
      });
  }, []);

  useEffect(() => {
    if (adminEmail) {
      localStorage.setItem("agroscan_auth_admin_email", adminEmail);
    } else {
      localStorage.removeItem("agroscan_auth_admin_email");
    }
  }, [adminEmail]);

  // Turn off edit mode if not authenticated as admin
  useEffect(() => {
    if (!isAdminAuthenticated && isEditMode) {
      setIsEditMode(false);
      setActiveEditingId(null);
    }
  }, [isAdminAuthenticated, isEditMode]);

  const saveToBackend = async (newOrder?: string[], newCustoms?: Record<string, FrameCustomization>) => {
    const orderToSave = newOrder || gridOrder;
    const customsToSave = newCustoms || customizations;
    try {
      await uiConfigApi.save({
        gridOrder: orderToSave,
        cardCustomizations: customsToSave,
      });
      setPersistedCustomizations(customsToSave);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.warn("Could not save ui config to backend:", err);
    }
  };

  const saveAllChanges = async () => {
    await saveToBackend(gridOrder, customizations);
  };

  const setGridOrder = (newOrder: string[]) => {
    setGridOrderState(newOrder);
    setHasUnsavedChanges(true);
    saveToBackend(newOrder, customizations);
  };

  // Login Admin handler
  const loginAdmin = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const isValidAdminEmail = ADMIN_EMAILS.some((a) => a.toLowerCase() === cleanEmail);

    if (!isValidAdminEmail) {
      return { success: false, message: "Email is not in the authorized admin list." };
    }

    if (pass !== REQUIRED_ADMIN_PASSWORD) {
      return { success: false, message: "Incorrect admin password." };
    }

    const matchedEmail = ADMIN_EMAILS.find((a) => a.toLowerCase() === cleanEmail) || email;
    setAdminEmail(matchedEmail);
    setShowAdminAuthModal(false);
    setShowRoleSelectModal(false);
    setIsEditMode(true);
    setIsPreviewAsFarmer(false);
    setActiveViewRole("admin");
    return { success: true };
  };

  const logoutAdmin = () => {
    setAdminEmail(null);
    setIsEditMode(false);
    setIsPreviewAsFarmer(false);
    setActiveEditingId(null);
    setShowExitConfirmModal(false);
    setShowProfileSettingsModal(false);
    setActiveViewRole("user");
    localStorage.removeItem("agroscan_auth_admin_email");
    localStorage.removeItem("agroscan_token");
    localStorage.removeItem("agroscan_user");
    sessionStorage.clear();
    window.location.href = "/";
  };

  // General Logout action for both roles
  const requestLogout = () => {
    setShowProfileSettingsModal(false);
    // If admin is actively in edit mode with unsaved modifications, prompt confirmation
    if (isAdminAuthenticated && isEditMode && hasUnsavedChanges) {
      setShowExitConfirmModal(true);
    } else {
      // Immediate logout for farmers or admins without unsaved changes
      logoutAdmin();
    }
  };

  // Trigger Exit confirmation dialog (for leaving edit mode / admin session)
  const requestExitEditMode = () => {
    setShowExitConfirmModal(true);
  };

  const confirmExitEditMode = async (saveFirst = false) => {
    if (saveFirst) {
      await saveAllChanges();
    } else {
      // Revert to last persisted state
      setCustomizations(persistedCustomizations);
      setHasUnsavedChanges(false);
    }
    setIsEditMode(false);
    setIsPreviewAsFarmer(false);
    setActiveEditingId(null);
    setShowExitConfirmModal(false);
    setShowProfileSettingsModal(false);
    // End session completely and return to the root landing page (Get Started screen)
    localStorage.removeItem("agroscan_auth_admin_email");
    localStorage.removeItem("agroscan_token");
    localStorage.removeItem("agroscan_user");
    sessionStorage.clear();
    window.location.href = "/";
  };

  const cancelExitEditMode = () => {
    setShowExitConfirmModal(false);
  };

  // Saved customizations apply to all users (both admin and farmer)
  const getCustomization = (id: string): FrameCustomization | undefined => {
    return customizations[id];
  };

  const updateCustomization = (id: string, updates: Partial<FrameCustomization>) => {
    if (!isAdminAuthenticated) return;
    setHasUnsavedChanges(true);
    setCustomizations((prev) => {
      const next = {
        ...prev,
        [id]: {
          id,
          horizontalAlign: prev[id]?.horizontalAlign || "center",
          verticalAlign: prev[id]?.verticalAlign || "center",
          bgColor: prev[id]?.bgColor,
          borderColor: prev[id]?.borderColor,
          iconColor: prev[id]?.iconColor,
          textColor: prev[id]?.textColor,
          customImageUrl: prev[id]?.customImageUrl,
          imageOpacity: prev[id]?.imageOpacity !== undefined ? prev[id].imageOpacity : 1,
          overlayDarkness: prev[id]?.overlayDarkness !== undefined ? prev[id].overlayDarkness : 0.4,
          textPosition: prev[id]?.textPosition || "center",
          title: prev[id]?.title,
          subtitle: prev[id]?.subtitle,
          badgeText: prev[id]?.badgeText,
          buttonText: prev[id]?.buttonText,
          placeholder: prev[id]?.placeholder,
          colSpan: prev[id]?.colSpan || 1,
          hideElement: prev[id]?.hideElement || false,
          ...updates,
        },
      };
      saveToBackend(gridOrder, next);
      return next;
    });
  };

  const resetCustomization = (id: string) => {
    if (!isAdminAuthenticated) return;
    setCustomizations((prev) => {
      const copy = { ...prev };
      delete copy[id];
      saveToBackend(gridOrder, copy);
      return copy;
    });
  };

  const resetToDefaultLayout = async () => {
    setGridOrderState(BASELINE_GRID_ORDER);
    setCustomizations({});
    setPersistedCustomizations({});
    setHasUnsavedChanges(false);
    try {
      await uiConfigApi.reset();
    } catch (err) {
      console.warn("Failed to reset backend ui config:", err);
    }
  };

  return (
    <UiEditContext.Provider
      value={{
        isAdminAuthenticated,
        adminEmail: effectiveAdminEmail,
        loginAdmin,
        logoutAdmin,
        isEditMode,
        setIsEditMode,
        requestExitEditMode,
        confirmExitEditMode,
        cancelExitEditMode,
        showExitConfirmModal,
        hasUnsavedChanges,
        isPreviewAsFarmer,
        setIsPreviewAsFarmer,
        customizations,
        gridOrder,
        setGridOrder,
        getCustomization,
        updateCustomization,
        resetCustomization,
        resetToDefaultLayout,
        saveAllChanges,
        activeEditingId,
        setActiveEditingId,
        showAdminAuthModal,
        setShowAdminAuthModal,
        showRoleSelectModal,
        setShowRoleSelectModal,
        showProfileSettingsModal,
        setShowProfileSettingsModal,
        requestLogout,
        activeViewRole,
        setActiveViewRole,
      }}
    >
      {children}
    </UiEditContext.Provider>
  );
}

export function useUiEditContext() {
  const context = useContext(UiEditContext);
  if (!context) {
    throw new Error("useUiEditContext must be used within a UiEditProvider");
  }
  return context;
}
