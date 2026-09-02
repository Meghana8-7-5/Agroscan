import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("agroscan_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type ApiUser = {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  role: string;
  preferredLanguage: string;
};

export type AuthResponse = {
  token: string;
  user: ApiUser;
};

export type CropRegistration = {
  id: string;
  cropName: string;
  varietyName: string | null;
  landAreaAcres: number;
  sowingDate: string;
  farmingStage: string;
  status: string;
  fieldName: string;
  location: string;
  farmName: string;
  planId: string | null;
  planName: string | null;
  progress: number;
};

export type CropTask = {
  id: string;
  label: string;
  date: string;
  status: "done" | "upcoming";
  category: string;
  notes?: string | null;
  priority?: string;
};

export type WeatherLocation = {
  id: string;
  name: string;
  field: string;
  district: string;
  temp: string;
  condition: string;
  humidity: string;
  wind: string;
  rainfall: string;
  tone: string;
  note: string;
  updatedAt?: string;
};

export type ApiNotification = {
  id: string;
  type: string;
  tone: string;
  title: string;
  copy: string;
  time: string;
  unread: boolean;
  actionUrl?: string | null;
};

export type DetectionResult = {
  id: string;
  verdict?: "Healthy" | "Disease detected" | "Pest detected" | "Uncertain" | string;
  verdictHeadline?: string;
  verdictSummary?: string;
  diseaseName?: string | null;
  cropName?: string;
  disease?: string;
  crop?: string;
  confidence: number;
  severity: "None" | "Low" | "Moderate" | "High" | string;
  symptomsObserved?: string;
  rootCause?: string;
  organicTreatment?: string[];
  chemicalTreatment?: string[];
  preventiveMeasures?: string[];
  organic?: string[];
  chemical?: string[];
  preventive?: string[];
  scannedAt?: string;
  imageUrl?: string;
};

export type RecentDetection = {
  id: string;
  name: string;
  crop: string;
  date: string;
  confidence: string;
  imageUrl: string | null;
};

export type DashboardSummary = {
  activeCrops: number;
  unreadNotifications: number;
  primaryCrop: {
    name: string;
    variety: string | null;
    location: string;
    area: number;
    sowingDate: string;
    planId: string | null;
  } | null;
  userName: string;
};

export type DashboardWeather = {
  temperature: number;
  condition: string;
  humidity: number;
  wind: number;
  location: string;
};

export type OtpResponse = {
  success: boolean;
  message: string;
  cooldownSeconds: number;
  devOtp?: string;
};

export type VerifyOtpResponse = {
  success: boolean;
  token: string;
  isNewUser: boolean;
  user: ApiUser;
};

export const authApi = {
  sendOtp: (mobile: string, language?: string) =>
    api.post<OtpResponse>("/auth/send-otp", { mobile, language }).then((r) => r.data),

  verifyOtp: (mobile: string, otp: string) =>
    api.post<VerifyOtpResponse>("/auth/verify-otp", { mobile, otp }).then((r) => r.data),

  completeProfile: (data: {
    fullName: string;
    language: string;
    villageCity?: string;
    district?: string;
    state?: string;
  }) => api.post<{ success: boolean; token: string; user: ApiUser }>("/auth/complete-profile", data).then((r) => r.data),

  register: (data: {
    fullName: string;
    mobile: string;
    email?: string;
    password?: string;
    language: string;
    agree: boolean;
    role?: string;
  }) => api.post<AuthResponse>("/auth/register", data).then((r) => r.data),

  login: (identifier: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { identifier, password }).then((r) => r.data),

  me: () => api.get<ApiUser>("/auth/me").then((r) => r.data),

  syncLanguage: (language: string) =>
    api.patch("/auth/language", { language }).then((r) => r.data).catch(() => {}),

  syncLocation: (data: {
    latitude?: number | null;
    longitude?: number | null;
    villageCity: string;
    district: string;
    state: string;
  }) => api.patch("/auth/location", data).then((r) => r.data).catch(() => {}),
};

export const cropsApi = {
  list: () => api.get<CropRegistration[]>("/crops").then((r) => r.data),
  register: (data: Record<string, unknown>) => api.post("/crops/register", data).then((r) => r.data),
  updateCrop: (id: string, data: Record<string, unknown>) =>
    api.patch<{ success: boolean; message: string; crop: CropRegistration }>(`/crops/${id}`, data).then((r) => r.data),
  getTasks: (planId: string) => api.get<CropTask[]>(`/crops/plans/${planId}/tasks`).then((r) => r.data),
  updateTask: (taskId: string, status: "completed" | "pending") =>
    api.patch(`/crops/tasks/${taskId}`, { status }).then((r) => r.data),
};

export const weatherApi = {
  list: () => api.get<{ locations: WeatherLocation[] }>("/weather").then((r) => r.data),
  dashboard: () => api.get<DashboardWeather>("/weather/dashboard").then((r) => r.data),
};

export const notificationsApi = {
  list: () => api.get<ApiNotification[]>("/notifications").then((r) => r.data),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () => api.patch("/notifications/read-all").then((r) => r.data),
};

export const detectionsApi = {
  analyze: (payload?: string | { imageDataUrl?: string; cropRegistrationId?: string }, cropRegistrationId?: string) => {
    const body =
      typeof payload === "string"
        ? { imageDataUrl: payload, cropRegistrationId }
        : payload || {};
    return api.post<DetectionResult>("/detections/analyze", body).then((r) => r.data);
  },
  recent: () => api.get<RecentDetection[]>("/detections/recent").then((r) => r.data),
};

export const dashboardApi = {
  summary: () => api.get<DashboardSummary>("/dashboard/summary").then((r) => r.data),
};

export const uiConfigApi = {
  get: () => api.get<{ gridOrder: string[]; cardCustomizations: Record<string, any> }>("/ui-config").then((r) => r.data),
  save: (data: { gridOrder?: string[]; cardCustomizations?: Record<string, any> }) =>
    api.put("/ui-config", data).then((r) => r.data),
  reset: () => api.post("/ui-config/reset").then((r) => r.data),
  uploadImage: (imageData: string) =>
    api.post<{ success: boolean; url: string }>("/ui-config/upload-image", { imageData }).then((r) => r.data),
};

export const aiAssistantApi = {
  ask: (data: {
    message: string;
    language?: string;
    farmerName?: string;
    crops?: string[];
    location?: string;
  }) => api.post<{ answer: string; detectedLanguage: string; timestamp: string }>("/ai/ask", data).then((r) => r.data),
  chat: (data: {
    message: string;
    language?: string;
    farmerName?: string;
    registeredCrops?: string[];
    location?: string;
  }) => api.post<{ success: boolean; reply: string; language: string }>("/ai/chat", data).then((r) => r.data),
};

export type SupportTicket = {
  id: string;
  ticketNumber: string;
  farmerId: string;
  farmerName: string;
  phoneNumber: string;
  email: string | null;
  cropName: string | null;
  category: "app_bug" | "crop_disease" | "account_issue" | "general_complaint" | "government_agronomist";
  title: string;
  description: string;
  aiResponseContext?: string;
  location?: string;
  status: "New" | "In Progress" | "Resolved";
  resolutionNotes?: string;
  isGovernmentReferral: boolean;
  governmentRefNumber?: string;
  createdAt: string;
  updatedAt: string;
};

export const supportApi = {
  getTickets: () =>
    api.get<{ tickets: SupportTicket[]; newCount: number; totalCount: number }>("/support/tickets").then((r) => r.data),

  createTicket: (data: {
    title?: string;
    description: string;
    cropName?: string;
    category?: SupportTicket["category"];
    aiResponseContext?: string;
    location?: string;
  }) => api.post<{ success: boolean; ticket: SupportTicket; message: string }>("/support/tickets", data).then((r) => r.data),

  createAgronomistReferral: (data: {
    cropName?: string;
    problemDescription: string;
    villageCity?: string;
    district?: string;
    state?: string;
  }) =>
    api
      .post<{
        success: boolean;
        ticket: SupportTicket;
        referralDetails: {
          referenceNumber: string;
          department: string;
          assignedOfficerRole: string;
          portalUrl: string;
          kisanTollFree: string;
          estimatedVisitTime: string;
          instructions: string;
        };
      }>("/support/agronomist-referral", data)
      .then((r) => r.data),

  updateTicketStatus: (id: string, status: "New" | "In Progress" | "Resolved", resolutionNotes?: string) =>
    api.patch<{ success: boolean; message: string; ticket: SupportTicket }>(`/support/tickets/${id}`, {
      status,
      resolutionNotes,
    }).then((r) => r.data),
};

export const healthApi = {
  check: () => api.get<{ status: string; database: string }>("/health").then((r) => r.data),
};

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    console.error("[API ERROR DIAGNOSIS]:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    const backendError =
      (error.response?.data as { error?: string; message?: string })?.error ||
      (error.response?.data as { error?: string; message?: string })?.message;

    if (backendError && typeof backendError === "string") {
      return backendError;
    }

    if (error.response?.status === 409) {
      return "An account with this email or mobile number already exists. Please log in.";
    }
    if (error.response?.status === 400) {
      return "Please verify that all required fields are filled in correctly.";
    }
    if (error.response?.status === 500) {
      return "Server error occurred. Please try again in a moment.";
    }
    if (error.code === "ERR_NETWORK" || !error.response) {
      return "Unable to reach AgroScan server. Please check your connection.";
    }
    return error.message || "Request failed.";
  }
  return (error as Error)?.message || "Something went wrong. Please try again.";
}
