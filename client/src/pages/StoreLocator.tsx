import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Store,
  MapPin,
  PhoneCall,
  Navigation,
  Search,
  CheckCircle,
  XCircle,
  Tag,
  LocateFixed,
  RefreshCw,
  AlertTriangle,
  LoaderCircle,
  Building2,
  ExternalLink
} from "lucide-react";
import { useLocationContext } from "../contexts/LocationContext";
import { useLanguage } from "../contexts/LanguageContext";
import EditableFrame from "../components/EditableFrame";
import { MapView } from "../components/Map";

export interface AgriStoreItem {
  id: string;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  stockedChemicals: string[];
  isOpen: boolean;
  dealerType: string;
}

const STORE_PAGE_STRINGS: Record<string, Record<string, string>> = {
  eyebrow: {
    en: "Verified Agricultural Input Dealers",
    te: "ధృవీకరించబడిన స్థానిక ఎరువులు & పురుగుమందుల డీలర్లు",
    hi: "सत्यापित कृषि इनपुट व कीटनाशक डीलर",
    ta: "சரிபார்க்கப்பட்ட வேளாண் உள்ளீட்டு விநியோகஸ்தர்கள்",
    kn: "ದೃಢೀಕರಿಸಿದ ಕೃಷಿ ಪರಿಕರಗಳ ವಿತರಕರು",
    mr: "सत्यापित कृषी केंद्र व खत विक्रेते",
    pa: "ਤਸਦੀਕਸ਼ੁਦਾ ਖੇਤੀਬਾੜੀ ਡੀਲਰ",
    bn: "যাচাইকৃত কৃষি সার ও কীটনাশক বিক্রেতা",
    gu: "ચકાસાયેલ કૃષિ ડીલરો",
    ml: "പരിശോധിച്ചുറപ്പിച്ച കാർഷിക ഡീലർമാർ",
  },
  main_heading: {
    en: "Nearby Fertilizer & Pesticide Stores",
    te: "దగ్గరలోని ఎరువులు, విత్తనాలు & రసాయనాల కేంద్రాలు",
    hi: "नजदीकी खाद, बीज और कीटनाशक केंद्र",
    ta: "அருகிலுள்ள உரம், விதை மற்றும் பூச்சிக்கொல்லி கடைகள்",
    kn: "ಹತ್ತಿರದ ಗೊಬ್ಬರ, ಬೀಜ ಮತ್ತು ಕೀಟನಾಶಕ ಮಳಿಗೆಗಳು",
    mr: "जवळपासची खत, बी-बियाणे आणि कीटकनाशक दुकाने",
    pa: "ਨੇੜਲੀਆਂ ਖਾਦ, ਬੀਜ ਅਤੇ ਕੀਟਨਾਸ਼ਕਾਂ ਦੀਆਂ ਦੁਕਾਨਾਂ",
    bn: "নিকটবর্তী সার, বীজ এবং কীটনাশকের দোকান",
    gu: "નજીકની ખાતર, બિયારણ અને જંતુનાશકની દુકાનો",
    ml: "അടുത്തുള്ള വളം, വിത്ത്, കീടനാശിനി കടകൾ",
  },
  stocked_label: {
    en: "Chemicals & Inputs Stocked",
    te: "అందుబాటులో ఉన్న ఎరువులు & మందులు",
    hi: "स्टॉक में उपलब्ध दवाइयां व खाद",
    ta: "இருப்பில் உள்ள உள்ளீடுகள்",
    kn: "ದಾಸ್ತಾನಿನಲ್ಲಿರುವ ಔಷಧಗಳು",
    mr: "उपलब्ध कृषी औषधे व खते",
    pa: "ਸਟਾਕ ਵਿੱਚ ਉਪਲਬਧ ਦਵਾਈਆਂ",
    bn: "স্টকে উপলব্ধ সার ও কীটনাশক",
    gu: "સ્ટોકમાં ઉપલબ્ધ ખાતર-દવાઓ",
    ml: "ലഭ്യമായ വളങ്ങളും മരുന്നുകളും",
  },
};

export default function StoreLocator() {
  const { location, requestGpsLocation, isGeocoding } = useLocationContext();
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [stores, setStores] = useState<AgriStoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);

  const str = (key: keyof typeof STORE_PAGE_STRINGS): string => {
    return STORE_PAGE_STRINGS[key]?.[language] || STORE_PAGE_STRINGS[key]?.en || "";
  };

  const fetchNearbyStores = async () => {
    setLoading(true);
    try {
      const lat = location.latitude || 16.3067;
      const lng = location.longitude || 80.4365;

      const res = await fetch(`/api/stores/nearby?lat=${lat}&lng=${lng}&radius=25000`);
      if (res.ok) {
        const data = await res.json();
        setStores(data.stores || []);
        setFallbackMessage(data.fallbackMessage || null);
      }
    } catch (err) {
      console.warn("Stores fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyStores();
  }, [location.latitude, location.longitude]);

  const filteredStores = stores.filter((store) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      store.name.toLowerCase().includes(q) ||
      store.address.toLowerCase().includes(q) ||
      store.dealerType.toLowerCase().includes(q) ||
      store.stockedChemicals.some((c) => c.toLowerCase().includes(q))
    );
  });

  return (
    <main className="workspace-page min-h-screen bg-[#f7f8f4] text-[#1c3827]">
      {/* Top Header */}
      <header className="workspace-topbar sticky top-0 z-40 bg-[#f7f8f4]/90 backdrop-blur border-b border-[#e1e6d7] px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="workspace-back inline-flex items-center gap-2 text-sm font-bold text-[#2f6b45] no-underline hover:underline">
          <ArrowLeft size={17} /> <span>{t("back_to_dashboard")}</span>
        </Link>
        <div className="flex items-center gap-2 font-display text-lg font-bold text-[#20402e]">
          <EditableFrame id="store_header_icon" className="h-8 w-8 rounded-xl bg-[#2f6b45] text-white">
            <Store size={18} />
          </EditableFrame>
          <span>{t("stores_near_me")}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            requestGpsLocation();
            fetchNearbyStores();
          }}
          disabled={isGeocoding}
          className="rounded-full bg-white border border-[#cbd8bf] px-4 py-1.5 text-xs font-bold text-[#2f6b45] hover:bg-[#eef4e7] flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <RefreshCw size={13} className={isGeocoding ? "animate-spin" : ""} />
          <span>Update GPS</span>
        </button>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Title */}
        <EditableFrame id="store_page_heading" isTextOnly>
          <div className="space-y-1">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#2f6b45]">
              {str("eyebrow")}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#193625]">
              {str("main_heading")}
            </h1>
            <p className="text-sm text-[#4d6957]">
              Real agricultural shops and Rythu Bharosa Kendra (RBK) depots near <strong>{location.villageCity || "Gowdapalem"}</strong>, <strong>{location.district || "Guntur"}</strong>.
            </p>
          </div>
        </EditableFrame>

        {/* Honest Fallback Alert (if remote area) */}
        {fallbackMessage && (
          <div className="rounded-2xl bg-amber-50 border border-amber-300 p-4 text-xs text-amber-900 flex items-center gap-3">
            <AlertTriangle size={18} className="text-amber-700 shrink-0" />
            <span>{fallbackMessage}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a7b66]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by store name, chemical (e.g. Coragen, Urea, Mancozeb), or town…"
              className="w-full rounded-2xl border border-[#cbd8bf] bg-white pl-10 pr-4 py-3 text-xs font-bold text-[#1b3b27] focus:outline-none focus:ring-2 focus:ring-[#2f6b45]/30 shadow-sm"
            />
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="rounded-2xl bg-white border border-[#cbd8bf] px-4 py-3 text-xs font-bold text-[#456b52] hover:bg-[#edf4e6] cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Stores Grid */}
        {loading ? (
          <div className="rounded-3xl border border-[#d8e0cc] bg-white p-12 text-center space-y-3">
            <LoaderCircle size={36} className="animate-spin text-[#2f6b45] mx-auto" />
            <p className="text-xs font-bold text-[#456b52]">Querying nearby registered agri input centers…</p>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="rounded-3xl border border-[#d8e0cc] bg-white p-12 text-center space-y-2">
            <Store size={36} className="text-[#648471] mx-auto" />
            <h4 className="font-display text-base font-bold text-[#183624]">No stores found matching your query</h4>
            <p className="text-xs text-[#52705d]">Try searching for a generic input like "Urea" or clear the search filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <EditableFrame
                key={store.id}
                id={`store_card_${store.id}`}
                className="rounded-3xl border border-[#d8e0cc] bg-white p-6 shadow-md flex flex-col justify-between hover:shadow-xl hover:border-[#2f6b45] transition-all space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="rounded-full bg-[#e5eddc] px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-[#2f6b45]">
                      {store.dealerType}
                    </span>
                    {store.distanceKm !== undefined && (
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 px-2.5 py-0.5 text-xs font-extrabold flex items-center gap-1">
                        <Navigation size={11} className="text-emerald-700" /> {store.distanceKm} km
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-lg font-bold text-[#183624] leading-snug">
                    {store.name}
                  </h3>

                  <div className="flex items-start gap-1.5 text-xs text-[#52705d] mt-2">
                    <MapPin size={14} className="shrink-0 text-[#2f6b45] mt-0.5" />
                    <span>{store.address}</span>
                  </div>

                  {/* Stocked Chemicals Tags */}
                  <div className="mt-4 pt-3 border-t border-[#e5edd8] space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2f6b45] block">
                      {str("stocked_label")}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {store.stockedChemicals.map((chem, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg bg-[#f4f7ee] border border-[#d6e3cb] px-2 py-0.5 text-[11px] font-semibold text-[#294c36]"
                        >
                          {chem}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Call & Google Maps Navigation */}
                <div className="pt-3 border-t border-[#e5edd8] flex items-center justify-between gap-2 text-xs">
                  <a
                    href={`tel:${store.phone.replace(/\s+/g, "")}`}
                    className="rounded-xl border border-[#cbd8bf] bg-white px-3.5 py-2 font-bold text-[#1c3827] hover:bg-[#f3f7ee] flex items-center gap-1.5 no-underline"
                  >
                    <PhoneCall size={13} className="text-[#2f6b45]" /> Call Shop
                  </a>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-[#2f6b45] px-3.5 py-2 font-bold text-white hover:bg-[#20492f] flex items-center gap-1.5 no-underline shadow-sm"
                  >
                    <Navigation size={13} /> Get Directions
                  </a>
                </div>
              </EditableFrame>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
