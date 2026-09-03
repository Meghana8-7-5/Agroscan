import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";

// Custom pin icons to prevent broken asset paths in bundled production builds
const createCustomIcon = (isPrimary: boolean = false) => {
  const color = isPrimary ? "#1b4d2e" : "#2f6b45";
  const ringColor = isPrimary ? "#10b981" : "#ffffff";
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="
        width: 30px;
        height: 30px;
        background: ${color};
        border: 2.5px solid ${ringColor};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 9px;
          height: 9px;
          background: #ffffff;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -32],
  });
};

export interface MapMarker {
  lat: number;
  lng: number;
  title?: string;
  popupHtml?: string;
  isPrimary?: boolean;
}

export interface MapViewProps {
  className?: string;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  markers?: MapMarker[];
  onMapReady?: (map: L.Map) => void;
}

export function MapView({
  className,
  initialCenter = { lat: 16.3067, lng: 80.4365 },
  initialZoom = 13,
  markers = [],
  onMapReady,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Destroy existing instance before creating a new one
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    try {
      const map = L.map(mapContainer.current, {
        center: [initialCenter.lat, initialCenter.lng],
        zoom: initialZoom,
        zoomControl: true,
        attributionControl: true,
      });

      // Add clean OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add center marker
      const primaryMarker = L.marker([initialCenter.lat, initialCenter.lng], {
        icon: createCustomIcon(true),
        title: "Your Location",
      }).addTo(map);
      primaryMarker.bindPopup("<strong>Your Farm Location</strong>");

      // Add additional markers if provided
      markers.forEach((m) => {
        if (!m.lat || !m.lng) return;
        const marker = L.marker([m.lat, m.lng], {
          icon: createCustomIcon(m.isPrimary),
          title: m.title || "Agri Location",
        }).addTo(map);

        if (m.popupHtml || m.title) {
          marker.bindPopup(m.popupHtml || `<strong>${m.title}</strong>`);
        }
      });

      // If multiple markers exist, fit map bounds nicely
      if (markers.length > 0) {
        const group = L.featureGroup([
          primaryMarker,
          ...markers.map((m) => L.marker([m.lat, m.lng])),
        ]);
        map.fitBounds(group.getBounds().pad(0.15));
      }

      mapInstance.current = map;

      if (onMapReady) {
        onMapReady(map);
      }

      // Handle container resize
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    } catch (err) {
      console.warn("Leaflet map initialization warning:", err);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [initialCenter.lat, initialCenter.lng, initialZoom, markers.length]);

  return (
    <div
      ref={mapContainer}
      className={cn("w-full h-[400px] rounded-3xl overflow-hidden shadow-inner border border-[#d8e0cc]", className)}
      style={{ minHeight: "350px", position: "relative", zIndex: 1 }}
    />
  );
}

export default MapView;
