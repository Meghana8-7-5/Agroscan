import { useState } from "react";
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
  AlertTriangle
} from "lucide-react";
import { AGRI_STORES, AgriStore } from "../data/cropsDatabase";
import { useLocationContext } from "../contexts/LocationContext";
import { useLanguage } from "../contexts/LanguageContext";
import EditableFrame from "../components/EditableFrame";
import { MapView } from "../components/Map";

type StoreWithDistance = AgriStore & { computedDistanceKm: number };

function calculateHaversineDistanceKm(
  lat1: number | null,
  lon1: number | null,
  lat2: number,
  lon2: number
): number {
  if (!lat1 || !lon1) return 5.0; // default estimate
  const R = 6371; // Radius of earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return Math.round(dist * 10) / 10;
}

const STORE_PAGE_STRINGS: Record<string, Record<string, string>> = {
  eyebrow: {
    en: "Nearby Inputs & Stock Availability",
    te: "దగ్గరలోని ఎరువుల దుకాణాలు & స్టాక్ లభ్యత",
    hi: "नजदीकी कृषि दुकानें और स्टॉक उपलब्धता",
    ta: "அருகிலுள்ள வேளாண் கடைகள் மற்றும் இருப்பு",
    kn: "ಹತ್ತಿರದ ಕೃಷಿ ಮಳಿಗೆಗಳು ಮತ್ತು ದಾಸ್ತಾನು",
    mr: "जवळपासची कृषी दुकाने आणि साठा उपलब्धता",
    pa: "ਨੇੜਲੀਆਂ ਖੇਤੀ ਦੁਕਾਨਾਂ ਅਤੇ ਸਟਾਕ",
    bn: "নিকটবর্তী কৃষি দোকান এবং স্টক",
    gu: "નજીકની કૃષિ દુકાનો અને સ્ટોક ઉપલબ્ધતા",
    ml: "അടുത്തുള്ള കാർഷിക കടകളും സ്റ്റോക്കും",
  },
  main_heading: {
    en: "Find Chemicals & Fertilizer Stores",
    te: "పురుగుమందులు & ఎరువుల దుకాణాలను కనుగొనండి",
    hi: "रासायनिक दवाइयां और खाद की दुकानें खोजें",
    ta: "உரங்கள் மற்றும் பூச்சிக்கொல்லி கடைகளைக் கண்டறியவும்",
    kn: "ರಾಸಾಯನಿಕ ಮತ್ತು ಗೊಬ್ಬರ ಮಳಿಗೆಗಳನ್ನು ಹುಡುಕಿ",
    mr: "रासायनिक व खतांची दुकाने शोधा",
    pa: "ਦਵਾਈਆਂ ਅਤੇ ਖਾਦ ਦੀਆਂ ਦੁਕਾਨਾਂ ਲੱਭੋ",
    bn: "কীটনাশক এবং সারের দোকান খুঁজুন",
    gu: "જંતુનાશક અને ખાતરની દુકાનો શોધો",
    ml: "വളവും കീടനാശിനിയും വിൽക്കുന്ന കടകൾ കണ്ടെത്തുക",
  },
  stocked_label: {
    en: "Chemicals Stocked",
    te: "మందులు అందుబాటులో ఉన్నాయి",
    hi: "दवाइयां स्टॉक में हैं",
    ta: "மருந்துகள் இருப்பில் உள்ளன",
    kn: "ಔಷಧಗಳು ದಾಸ್ತಾನಿನಲ್ಲಿವೆ",
    mr: "औषधे साठ्यात उपलब्ध",
    pa: "ਦਵਾਈਆਂ ਸਟਾਕ ਵਿੱਚ ਹਨ",
    bn: "ওষুধ স্টকে আছে",
    gu: "દવાઓ સ્ટોકમાં છે",
    ml: "മരുന്നുകൾ സ്റ്റോക്കുണ്ട്",
  },
  live_stock_title: {
    en: "Live Chemical & Brand Stock",
    te: "ప్రత్యక్ష రసాయన & బ్రాండ్ స్టాక్ వివరాలు",
    hi: "लाइव दवाइयां और ब्रांड स्टॉक विवरण",
    ta: "நேரடி ரசாயன மற்றும் பிராண்ட் இருப்பு",
    kn: "ನೇರ ರಾಸಾಯನಿಕ ಮತ್ತು ಬ್ರಾಂಡ್ ದಾಸ್ತಾನು",
    mr: "थेट रासायनिक आणि ब्रँड साठा",
    pa: "ਲਾਈਵ ਕੈਮੀਕਲ ਅਤੇ ਬ੍ਰਾਂਡ ਸਟਾਕ",
    bn: "লাইভ রাসায়নিক ও ব্র্যান্ড স্টক",
    gu: "લાઇવ રાસાયણિક અને બ્રાન્ડ સ્ટોક",
    ml: "തത്സമയ രാസ-ബ്രാൻഡ് സ്റ്റോക്ക്",
  }
};

export default function StoreLocator() {
  const { location, requestGpsLocation, setShowLocationModal } = useLocationContext();
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [radiusFilter, setRadiusFilter] = useState<number>(10);
  const [selectedStore, setSelectedStore] = useState<StoreWithDistance | null>(null);

  const str = (key: keyof typeof STORE_PAGE_STRINGS): string => {
    return STORE_PAGE_STRINGS[key]?.[language] || STORE_PAGE_STRINGS[key]?.en || "";
  };

  // Compute live distance in km for all stores from single source of truth location
  const storesWithDistance = AGRI_STORES.map((store) => {
    const dist = calculateHaversineDistanceKm(
      location.latitude,
      location.longitude,
      store.latitude,
      store.longitude
    );
    return { ...store, computedDistanceKm: dist };
  }).sort((a, b) => a.computedDistanceKm - b.computedDistanceKm);

  // Filter stores by radius and search query
  const filteredStores = storesWithDistance.filter((store) => {
    const matchesRadius = store.computedDistanceKm <= radiusFilter;
    const matchesName =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.village.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChemical = store.stockedChemicals.some(
      (c) =>
        c.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.brandName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesRadius && (matchesName || matchesChemical);
  });

  const activeStore = filteredStores.find((s) => selectedStore && s.id === selectedStore.id) || filteredStores[0] || storesWithDistance[0];

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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={requestGpsLocation}
            className="text-xs font-extrabold uppercase tracking-wider text-[#2f6b45] bg-[#e5eddc] px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-[#d5e4c8] cursor-pointer"
            title="Refresh GPS Location"
          >
            <RefreshCw size={13} /> {t("refresh_location")}
          </button>
          <button
            type="button"
            onClick={() => setShowLocationModal(true)}
            className="text-xs font-extrabold uppercase tracking-wider text-white bg-[#2f6b45] px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-[#225033] cursor-pointer"
          >
            <LocateFixed size={13} /> {location.villageCity}, {location.district}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Location Status / Error Banner */}
        {!location.isGps && (
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs font-semibold text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" />
              <span>
                {t("location_unavailable")}: <strong>{location.villageCity}, {location.district}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={requestGpsLocation}
              className="rounded-xl bg-amber-600 px-3 py-1 text-xs font-bold text-white shadow hover:bg-amber-700 cursor-pointer"
            >
              {t("enable_gps")}
            </button>
          </div>
        )}

        {/* Title */}
        <div className="mb-8">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#2f6b45]">{str("eyebrow")}</p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold text-[#193625]">{str("main_heading")}</h1>
          <p className="mt-2 text-sm text-[#4d6957]">
            {location.villageCity}, {location.district}
          </p>
        </div>

        {/* Search & Radius Filter Controls */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-2xl">
            <Search size={20} className="absolute left-4 top-3.5 text-[#5e7867]" />
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-[#d5ded0] bg-white pl-12 pr-4 py-3.5 text-sm font-medium text-[#1c3827] placeholder:text-[#8aa091] focus:border-[#2f6b45] focus:outline-none focus:ring-2 focus:ring-[#2f6b45]/20 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#20402e]">{t("search_radius")}:</span>
            <div className="flex items-center rounded-xl bg-white p-1 border border-[#d5ded0] shadow-sm">
              {[10, 25, 50].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRadiusFilter(r)}
                  className={`rounded-lg px-3 py-1 text-xs font-extrabold transition-all cursor-pointer ${
                    radiusFilter === r ? "bg-[#2f6b45] text-white shadow" : "text-[#34543e] hover:bg-[#eef4e6]"
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid: Left Store List, Right Store Details & Interactive Map */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Store List */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#2f6b45] flex items-center justify-between">
              <span className="flex items-center gap-1"><MapPin size={15} /> {t("nearby_dealers")} ({filteredStores.length})</span>
              <span>{t("sorted_by_distance")}</span>
            </h2>

            {filteredStores.length === 0 ? (
              <div className="rounded-2xl border border-[#d5ded0] bg-white p-6 text-center text-xs text-[#52705d]">
                {t("no_stores_found", { radius: String(radiusFilter) })}
              </div>
            ) : (
              <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
                {filteredStores.map((store) => (
                  <button
                    key={store.id}
                    type="button"
                    onClick={() => setSelectedStore(store)}
                    className={`w-full text-left rounded-2xl border p-5 transition-all cursor-pointer ${
                      activeStore.id === store.id
                        ? "border-[#2f6b45] bg-[#eef4e8] shadow-md ring-2 ring-[#2f6b45]/20"
                        : "border-[#d8e0cc] bg-white hover:bg-[#f3f7ee] hover:border-[#b8c9a9]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-base font-bold text-[#1a3826] flex items-center gap-2">
                        <EditableFrame id={`store_list_icon_${store.id}`} className="h-6 w-6 rounded-lg bg-emerald-100 text-[#2f6b45]">
                          <Store size={14} />
                        </EditableFrame>
                        {store.name}
                      </h3>
                      <span className="rounded-full bg-[#2f6b45] text-white px-2.5 py-0.5 text-xs font-bold shadow-sm">
                        {store.computedDistanceKm} km
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-[#52705d]">
                      {store.ownerName} · {store.village}, {store.district}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-xs font-bold text-[#2e523b]">
                      <Tag size={13} /> {store.stockedChemicals.length} {str("stocked_label")}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Store Details & Map */}
          <div className="lg:col-span-7 space-y-6">
            {activeStore && (
              <div className="rounded-3xl border border-[#d8e0cc] bg-white p-6 shadow-xl sm:p-8">
                <div className="border-b border-[#e1e8d7] pb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#2f6b45] bg-[#e5eddc] px-3 py-1 rounded-full">
                      {t("distance_km", { dist: String(activeStore.computedDistanceKm) })}
                    </span>
                    <h2 className="mt-2 font-display text-2xl font-bold text-[#163322]">{activeStore.name}</h2>
                    <p className="mt-1 text-xs text-[#4b6957] font-semibold">
                      {activeStore.ownerName} · {activeStore.village}, {activeStore.district}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${activeStore.phone}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#2f6b45] px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-[#235334] no-underline"
                    >
                      <PhoneCall size={15} /> {t("call_store")}
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${activeStore.latitude},${activeStore.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-[#b9cbab] bg-[#f0f6ea] px-4 py-2.5 text-xs font-bold text-[#274934] hover:bg-[#e4eedb] no-underline"
                    >
                      <Navigation size={15} /> {t("directions")}
                    </a>
                  </div>
                </div>

                {/* Interactive Map Preview */}
                <div className="mt-6 overflow-hidden rounded-2xl border border-[#dce5d2] shadow-inner">
                  <MapView
                    className="w-full h-[280px]"
                    initialCenter={{ lat: activeStore.latitude, lng: activeStore.longitude }}
                    initialZoom={14}
                  />
                </div>

                {/* Stock Inventory Table */}
                <div className="mt-6">
                  <h3 className="font-display text-lg font-bold text-[#183624] mb-3 flex items-center gap-2">
                    <Tag size={18} className="text-[#2f6b45]" /> {str("live_stock_title")}
                  </h3>

                  <div className="overflow-x-auto rounded-2xl border border-[#e1e8d7]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f0f5eb] text-[#284935] font-extrabold uppercase border-b border-[#e1e8d7]">
                        <tr>
                          <th className="px-4 py-3">{t("product_chemical")}</th>
                          <th className="px-4 py-3">{t("brand_name")}</th>
                          <th className="px-4 py-3">{t("price_per_unit")}</th>
                          <th className="px-4 py-3">{t("stock_status")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e6edd9] bg-white font-medium text-[#213f2c]">
                        {activeStore.stockedChemicals.map((item, idx) => (
                          <tr key={idx} className="hover:bg-[#f9faf7]">
                            <td className="px-4 py-3 font-bold">{item.productName}</td>
                            <td className="px-4 py-3">
                              <span className="rounded-lg bg-[#e3eed9] px-2.5 py-0.5 font-bold text-[#274b34]">
                                {item.brandName}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-bold text-[#1e3b29]">{item.pricePerUnit}</td>
                            <td className="px-4 py-3">
                              {item.inStock ? (
                                <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                                  <CheckCircle size={14} /> {t("in_stock")}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 font-bold text-rose-600">
                                  <XCircle size={14} /> {t("out_of_stock")}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
