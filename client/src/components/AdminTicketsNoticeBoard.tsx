import { useState, useEffect } from "react";
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  Building2,
  RefreshCw,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Wheat,
  AlertTriangle,
  LoaderCircle,
  ExternalLink
} from "lucide-react";
import { supportApi, type SupportTicket } from "@/lib/api";

export default function AdminTicketsNoticeBoard() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "New" | "In Progress" | "Resolved" | "gov">("all");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [resolutionInput, setResolutionInput] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await supportApi.getTickets();
      setTickets(res.tickets || []);
    } catch (err) {
      console.warn("Failed to fetch admin tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdateStatus = async (ticketId: string, newStatus: "New" | "In Progress" | "Resolved") => {
    setUpdatingId(ticketId);
    try {
      await supportApi.updateTicketStatus(ticketId, newStatus, resolutionInput.trim() || undefined);
      await fetchTickets();
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket((prev) => prev ? { ...prev, status: newStatus, resolutionNotes: resolutionInput.trim() || prev.resolutionNotes } : null);
      }
      setResolutionInput("");
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const newCount = tickets.filter((t) => t.status === "New").length;
  const inProgressCount = tickets.filter((t) => t.status === "In Progress").length;
  const resolvedCount = tickets.filter((t) => t.status === "Resolved").length;

  const filteredTickets = tickets.filter((t) => {
    if (filter === "all") return true;
    if (filter === "gov") return t.isGovernmentReferral;
    return t.status === filter;
  });

  return (
    <div className="rounded-3xl border border-[#d8e2cf] bg-white p-6 sm:p-8 shadow-xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e2ebd7] pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-md">
            <ShieldAlert size={22} />
          </span>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#173825]">
              Farmer Reported Problems &amp; Support Notice Board
            </h2>
            <p className="text-xs text-[#52705d]">
              Review incoming farmer issues, update progress, and assign extension resolutions
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchTickets}
          className="flex items-center gap-1.5 rounded-xl border border-[#cddbc3] bg-[#f8faf5] px-3.5 py-2 text-xs font-bold text-[#1f402c] hover:bg-[#e9f2e3] cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Tickets
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setFilter("New")}
          className={`cursor-pointer rounded-2xl p-4 border transition-all ${
            filter === "New" ? "bg-rose-50 border-rose-400 ring-2 ring-rose-300" : "bg-[#fbfcf9] border-[#d8e2cf] hover:bg-rose-50/50"
          }`}
        >
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700">New Reports</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-rose-800">{newCount}</span>
            {newCount > 0 && <span className="text-[10px] text-rose-600 font-bold animate-pulse">Action required</span>}
          </div>
        </div>

        <div
          onClick={() => setFilter("In Progress")}
          className={`cursor-pointer rounded-2xl p-4 border transition-all ${
            filter === "In Progress" ? "bg-amber-50 border-amber-400 ring-2 ring-amber-300" : "bg-[#fbfcf9] border-[#d8e2cf] hover:bg-amber-50/50"
          }`}
        >
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">In Progress</span>
          <div className="mt-1">
            <span className="font-display text-2xl font-extrabold text-amber-800">{inProgressCount}</span>
          </div>
        </div>

        <div
          onClick={() => setFilter("Resolved")}
          className={`cursor-pointer rounded-2xl p-4 border transition-all ${
            filter === "Resolved" ? "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300" : "bg-[#fbfcf9] border-[#d8e2cf] hover:bg-emerald-50/50"
          }`}
        >
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Resolved</span>
          <div className="mt-1">
            <span className="font-display text-2xl font-extrabold text-emerald-800">{resolvedCount}</span>
          </div>
        </div>

        <div
          onClick={() => setFilter("all")}
          className={`cursor-pointer rounded-2xl p-4 border transition-all ${
            filter === "all" ? "bg-[#20402e] text-white border-[#20402e]" : "bg-[#fbfcf9] border-[#d8e2cf] hover:bg-[#ebf2e4]"
          }`}
        >
          <span className={`text-[10px] font-extrabold uppercase tracking-wider ${filter === "all" ? "text-emerald-200" : "text-[#52705d]"}`}>
            Total Tickets
          </span>
          <div className="mt-1">
            <span className={`font-display text-2xl font-extrabold ${filter === "all" ? "text-white" : "text-[#183624]"}`}>
              {tickets.length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pt-2">
        {(["all", "New", "In Progress", "Resolved", "gov"] as const).map((tabKey) => (
          <button
            key={tabKey}
            type="button"
            onClick={() => setFilter(tabKey)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              filter === tabKey
                ? "bg-[#2f6b45] text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tabKey === "all"
              ? "All Tickets"
              : tabKey === "gov"
              ? "🏛️ Government Referrals"
              : tabKey}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="py-12 flex justify-center items-center gap-2 text-xs font-bold text-[#2f6b45]">
          <LoaderCircle size={20} className="animate-spin" /> Loading ticket notice board...
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#52705d]">
          <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-600" />
          <p className="font-bold text-[#183624]">No tickets in this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((t) => (
            <div
              key={t.id}
              className={`rounded-2xl border p-4 sm:p-5 transition-all space-y-3 ${
                t.status === "New"
                  ? "border-rose-300 bg-rose-50/40 shadow-sm"
                  : t.status === "In Progress"
                  ? "border-amber-300 bg-amber-50/30"
                  : "border-[#d8e2cf] bg-[#fafcf7]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-[#20402e] bg-white border border-[#ccd8bf] px-2.5 py-0.5 rounded-lg">
                    #{t.ticketNumber}
                  </span>
                  {t.isGovernmentReferral ? (
                    <span className="rounded-full bg-amber-200 text-amber-900 px-2.5 py-0.5 text-[10px] font-extrabold">
                      🏛️ Govt Sachivalayam Referral
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-100 text-emerald-900 px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
                      {t.category.replace("_", " ")}
                    </span>
                  )}
                  <span className="text-[11px] text-[#6d8a77]">
                    {new Date(t.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-extrabold uppercase ${
                      t.status === "Resolved"
                        ? "bg-emerald-600 text-white"
                        : t.status === "In Progress"
                        ? "bg-amber-500 text-gray-950 font-bold"
                        : "bg-rose-600 text-white animate-pulse"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h4 className="font-display font-bold text-sm sm:text-base text-[#183624]">{t.title}</h4>
                <p className="mt-1 text-xs text-[#395744] leading-relaxed whitespace-pre-line">{t.description}</p>
              </div>

              {/* Farmer Info Pill */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#4b6a57] bg-white/80 p-2.5 rounded-xl border border-[#d8e2cf]">
                <span className="font-bold text-[#183624]">Farmer: {t.farmerName}</span>
                {t.phoneNumber && (
                  <a href={`tel:${t.phoneNumber}`} className="flex items-center gap-1 text-[#2f6b45] hover:underline">
                    <Phone size={12} /> {t.phoneNumber}
                  </a>
                )}
                {t.email && (
                  <a href={`mailto:${t.email}`} className="flex items-center gap-1 text-[#2f6b45] hover:underline">
                    <Mail size={12} /> {t.email}
                  </a>
                )}
                {t.location && (
                  <span className="flex items-center gap-1 text-[#456952]">
                    <MapPin size={12} /> {t.location}
                  </span>
                )}
                {t.cropName && (
                  <span className="flex items-center gap-1 text-[#456952] font-semibold">
                    <Wheat size={12} /> Crop: {t.cropName}
                  </span>
                )}
              </div>

              {/* AI response context if any */}
              {t.aiResponseContext && (
                <div className="text-[11px] bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200 text-emerald-950">
                  <strong className="block text-emerald-900">AI Initial Context:</strong>
                  <span>{t.aiResponseContext}</span>
                </div>
              )}

              {/* Existing Resolution Notes */}
              {t.resolutionNotes && (
                <div className="text-xs bg-[#f4f7ef] p-3 rounded-xl border border-[#ccd8bf] text-[#193625]">
                  <strong className="block text-[#173624]">Admin / Extension Resolution Notes:</strong>
                  <span>{t.resolutionNotes}</span>
                </div>
              )}

              {/* Admin Action Bar */}
              <div className="pt-2 border-t border-[#e2ebd7] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#506e5b]">Set Status:</span>
                  <button
                    type="button"
                    disabled={updatingId === t.id}
                    onClick={() => handleUpdateStatus(t.id, "New")}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                      t.status === "New" ? "bg-rose-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    New
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === t.id}
                    onClick={() => handleUpdateStatus(t.id, "In Progress")}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                      t.status === "In Progress" ? "bg-amber-500 text-gray-950" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === t.id}
                    onClick={() => handleUpdateStatus(t.id, "Resolved")}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                      t.status === "Resolved" ? "bg-emerald-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Resolved
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTicket(selectedTicket?.id === t.id ? null : t)}
                  className="text-xs font-bold text-[#2f6b45] hover:underline cursor-pointer"
                >
                  {selectedTicket?.id === t.id ? "Close Resolution Form" : "Add Resolution Notes →"}
                </button>
              </div>

              {/* Expandable Resolution Form */}
              {selectedTicket?.id === t.id && (
                <div className="mt-3 p-3.5 bg-white rounded-2xl border border-[#2f6b45]/30 space-y-2 animate-in fade-in">
                  <label className="block text-xs font-bold text-[#183624]">
                    Add Extension Officer / Admin Resolution Notes
                  </label>
                  <textarea
                    rows={2}
                    value={resolutionInput}
                    onChange={(e) => setResolutionInput(e.target.value)}
                    placeholder="Enter actionable advice or note (e.g., 'Officer visited field. Recommended Copper Oxychloride 3g/L. Issue resolved.')..."
                    className="w-full rounded-xl border border-[#cbd8c2] bg-[#f8faf5] p-2.5 text-xs text-[#193625]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(t.id, "Resolved")}
                      className="rounded-xl bg-emerald-700 text-white px-4 py-1.5 text-xs font-bold hover:bg-emerald-800 cursor-pointer"
                    >
                      Save Notes &amp; Mark Resolved
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
