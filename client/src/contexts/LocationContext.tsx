import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi } from "../lib/api";

export interface UserLocation {
  latitude: number | null;
  longitude: number | null;
  villageCity: string;
  district: string;
  state: string;
  isGps: boolean;
  status: "idle" | "requesting" | "granted" | "denied" | "unsupported";
  lastUpdated: string;
  errorMessage?: string;
}

interface LocationContextType {
  location: UserLocation;
  requestGpsLocation: () => void;
  setManualLocation: (villageCity: string, district: string, state: string, lat?: number, lng?: number) => void;
  geocodeAddress: (query: string) => Promise<boolean>;
  showLocationModal: boolean;
  setShowLocationModal: (show: boolean) => void;
  isGeocoding: boolean;
}

const defaultLocation: UserLocation = {
  latitude: 16.3067,
  longitude: 80.4365,
  villageCity: "Guntur",
  district: "Guntur District",
  state: "Andhra Pradesh",
  isGps: false,
  status: "idle",
  lastUpdated: new Date().toISOString(),
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<UserLocation>(() => {
    const saved = localStorage.getItem("agroscan_user_location");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return defaultLocation;
  });

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    localStorage.setItem("agroscan_user_location", JSON.stringify(location));
  }, [location]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`,
        { headers: { "User-Agent": "AgroScanApp/1.0" } }
      );
      if (res.ok) {
        const data = await res.json();
        const address = data.address || {};
        const villageCity =
          address.village || address.town || address.city || address.suburb || address.county || "Farm Plot";
        const district = address.state_district || address.county || address.district || "Regional District";
        const state = address.state || "Andhra Pradesh / Telangana";

        const newLoc: UserLocation = {
          latitude: lat,
          longitude: lng,
          villageCity,
          district,
          state,
          isGps: true,
          status: "granted",
          lastUpdated: new Date().toISOString(),
        };
        setLocation(newLoc);
        // Persist to backend profile
        authApi.syncLocation({ latitude: lat, longitude: lng, villageCity, district, state });
        return;
      }
    } catch (e) {
      console.warn("Nominatim reverse geocode error:", e);
    }

    // Fallback if reverse geocode service fails
    setLocation({
      latitude: lat,
      longitude: lng,
      villageCity: "Farm Location",
      district: "Guntur / Warangal",
      state: "Andhra Pradesh / Telangana",
      isGps: true,
      status: "granted",
      lastUpdated: new Date().toISOString(),
    });
  };

  const requestGpsLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocation((prev) => ({
        ...prev,
        status: "unsupported",
        isGps: false,
        errorMessage: "Browser does not support GPS Geolocation.",
      }));
      setShowLocationModal(true);
      return;
    }

    setLocation((prev) => ({ ...prev, status: "requesting", errorMessage: undefined }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        reverseGeocode(lat, lng);
      },
      (error) => {
        console.warn("High accuracy geolocation access denied or error:", error);
        let msg = "GPS Location unavailable. Please search your village manually.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location permission was denied by browser.";
        } else if (error.code === error.TIMEOUT) {
          msg = "GPS request timed out. Retrying with manual location.";
        }
        setLocation((prev) => ({
          ...prev,
          status: "denied",
          isGps: false,
          errorMessage: msg,
        }));
        setShowLocationModal(true);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const geocodeAddress = async (searchQuery: string): Promise<boolean> => {
    if (!searchQuery.trim()) return false;
    setIsGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&countrycodes=in&limit=1`,
        { headers: { "User-Agent": "AgroScanApp/1.0" } }
      );
      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          const item = results[0];
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);
          const displayNameParts = (item.display_name || "").split(",");
          const villageCity = displayNameParts[0] || searchQuery;
          const district = displayNameParts[1] || "District Central";
          const state = displayNameParts[2] || "Andhra Pradesh";

          const geoLoc = {
            latitude: lat,
            longitude: lng,
            villageCity: villageCity.trim(),
            district: district.trim(),
            state: state.trim(),
            isGps: false,
            status: "granted" as const,
            lastUpdated: new Date().toISOString(),
          };
          setLocation(geoLoc);
          // Persist to backend profile
          authApi.syncLocation({ latitude: lat, longitude: lng, villageCity: geoLoc.villageCity, district: geoLoc.district, state: geoLoc.state });
          setIsGeocoding(false);
          setShowLocationModal(false);
          return true;
        }
      }
    } catch (e) {
      console.warn("Geocoding failed:", e);
    }
    setIsGeocoding(false);
    return false;
  };

  const setManualLocation = (
    villageCity: string,
    district: string,
    state: string,
    lat?: number,
    lng?: number
  ) => {
    const manualLoc: UserLocation = {
      latitude: lat || 16.3067,
      longitude: lng || 80.4365,
      villageCity,
      district,
      state,
      isGps: false,
      status: "granted",
      lastUpdated: new Date().toISOString(),
    };
    setLocation(manualLoc);
    // Persist to backend profile
    authApi.syncLocation({ latitude: manualLoc.latitude, longitude: manualLoc.longitude, villageCity, district, state });
    setShowLocationModal(false);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        requestGpsLocation,
        setManualLocation,
        geocodeAddress,
        showLocationModal,
        setShowLocationModal,
        isGeocoding,
      }}
    >
      {children}

      {/* High Accuracy Location Modal */}
      {showLocationModal && (
        <LocationModal
          current={location}
          isGeocoding={isGeocoding}
          onClose={() => setShowLocationModal(false)}
          onSave={setManualLocation}
          onGeocode={geocodeAddress}
          onRequestGps={requestGpsLocation}
        />
      )}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocationContext must be used within a LocationProvider");
  }
  return context;
}

function LocationModal({
  current,
  isGeocoding,
  onClose,
  onSave,
  onGeocode,
  onRequestGps,
}: {
  current: UserLocation;
  isGeocoding: boolean;
  onClose: () => void;
  onSave: (village: string, district: string, state: string) => void;
  onGeocode: (query: string) => Promise<boolean>;
  onRequestGps: () => void;
}) {
  const [searchInput, setSearchInput] = useState("");
  const [village, setVillage] = useState(current.villageCity);
  const [district, setDistrict] = useState(current.district);
  const [state, setState] = useState(current.state);
  const [searchError, setSearchError] = useState("");

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    const success = await onGeocode(searchInput);
    if (!success) {
      setSearchError(`Could not find "${searchInput}". Please check spelling or use manual fields below.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-[#d8e0cc] bg-[#fafaf7] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#e2e8d7] pb-3">
          <h3 className="font-display text-xl font-bold text-[#1a3826]">Set Farm GPS Location</h3>
          <button type="button" onClick={onClose} className="text-[#567360] hover:text-[#1a3826]">
            ✕
          </button>
        </div>

        {current.errorMessage && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-700">
            {current.errorMessage}
          </div>
        )}

        <button
          type="button"
          onClick={onRequestGps}
          disabled={current.status === "requesting"}
          className="w-full rounded-2xl bg-[#2f6b45] py-3 text-xs font-bold text-white shadow hover:bg-[#225033] flex items-center justify-center gap-2"
        >
          {current.status === "requesting" ? (
            <span>📍 Requesting High-Accuracy GPS (10s timeout)...</span>
          ) : (
            <span>📍 Detect Live High-Accuracy Browser GPS</span>
          )}
        </button>

        {/* Geocoding Search Box */}
        <form onSubmit={handleSearchSubmit} className="space-y-2">
          <label className="font-bold text-[#20402e] block text-xs">Search Village / City Name (Geocoding)</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g. Guntur, Tenali, Warangal, Khanna..."
              className="flex-1 rounded-xl border border-[#d5ded0] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#1c3827]"
            />
            <button
              type="submit"
              disabled={isGeocoding || !searchInput.trim()}
              className="rounded-xl bg-[#2f6b45] px-4 py-2 text-xs font-bold text-white hover:bg-[#225033]"
            >
              {isGeocoding ? "Searching..." : "Search"}
            </button>
          </div>
          {searchError && <p className="text-[11px] font-bold text-rose-600">{searchError}</p>}
        </form>

        <div className="relative flex items-center justify-center text-xs text-[#52705d] font-bold uppercase my-2">
          <span className="bg-[#fafaf7] px-2 relative z-10">Or Manual Entry</span>
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#d8e0cc]" /></div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-[#20402e] block mb-1">Village / City Name</label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full rounded-xl border border-[#d5ded0] bg-white px-3.5 py-2.5 font-semibold text-[#1c3827]"
            />
          </div>
          <div>
            <label className="font-bold text-[#20402e] block mb-1">District</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full rounded-xl border border-[#d5ded0] bg-white px-3.5 py-2.5 font-semibold text-[#1c3827]"
            />
          </div>
          <div>
            <label className="font-bold text-[#20402e] block mb-1">State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-xl border border-[#d5ded0] bg-white px-3.5 py-2.5 font-semibold text-[#1c3827]"
            >
              <option>Andhra Pradesh</option>
              <option>Telangana</option>
              <option>Karnataka</option>
              <option>Maharashtra</option>
              <option>Punjab</option>
              <option>Gujarat</option>
              <option>Tamil Nadu</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#c4d6b6] bg-white px-4 py-2 text-xs font-bold text-[#244b33]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(village, district, state)}
            className="rounded-xl bg-[#2f6b45] px-5 py-2 text-xs font-bold text-white shadow hover:bg-[#20492f]"
          >
            Save Location
          </button>
        </div>
      </div>
    </div>
  );
}
