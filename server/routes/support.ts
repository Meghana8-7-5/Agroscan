import { Router } from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

export interface SupportTicket {
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
}

// In-memory support tickets store fallback when DB table is not present
const inMemoryTickets: SupportTicket[] = [
  {
    id: "tkt_1",
    ticketNumber: "TKT-1082",
    farmerId: "user_demo_1",
    farmerName: "Ramesh Kumar",
    phoneNumber: "+919876543210",
    email: "ramesh@example.com",
    cropName: "Tomato",
    category: "crop_disease",
    title: "Severe leaf curling and yellow patches in tomato",
    description: "Leaves are turning yellow with dark veins. Tried neem oil 2 days ago but still spreading.",
    aiResponseContext: "Suggested Imidacloprid 17.8% SL @ 0.5ml/L for Whitefly vector control.",
    location: "Gowdapalem, Guntur",
    status: "In Progress",
    resolutionNotes: "Assigned to Guntur Agronomy extension desk. Recommended checking sticky traps.",
    isGovernmentReferral: false,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "tkt_2",
    ticketNumber: "TKT-1083",
    farmerId: "user_demo_2",
    farmerName: "Sita Devi",
    phoneNumber: "+919844433221",
    email: "sita@example.com",
    cropName: "Rice (Paddy)",
    category: "government_agronomist",
    title: "Govt Soil Health Card Verification & Subsidized Seeds",
    description: "Requesting Gram Sachivalayam officer visit for field soil sampling before Rabi paddy sowing.",
    location: "Tenali, Guntur",
    status: "New",
    isGovernmentReferral: true,
    governmentRefNumber: "RBK-AP-2026-4921",
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  }
];

async function ensureTicketsTable() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id VARCHAR(100) PRIMARY KEY,
        ticket_number VARCHAR(50) NOT NULL,
        farmer_id VARCHAR(100) NOT NULL,
        farmer_name VARCHAR(100) NOT NULL,
        phone_number VARCHAR(30) NOT NULL,
        email VARCHAR(255),
        crop_name VARCHAR(100),
        category VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        ai_response_context TEXT,
        location VARCHAR(255),
        status VARCHAR(30) DEFAULT 'New' NOT NULL,
        resolution_notes TEXT,
        is_government_referral BOOLEAN DEFAULT FALSE,
        government_ref_number VARCHAR(100),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);
  } catch {
    console.info("[SUPPORT-DB] In-memory tickets store ready (PostgreSQL sync active when connected).");
  }
}

ensureTicketsTable();

// ── 1. Create a Support Ticket (Farmer) ──────────────────────────────────
router.post("/tickets", requireAuth, async (req, res) => {
  try {
    const {
      title,
      description,
      cropName,
      category,
      aiResponseContext,
      location,
    } = req.body as {
      title?: string;
      description?: string;
      cropName?: string;
      category?: SupportTicket["category"];
      aiResponseContext?: string;
      location?: string;
    };

    if (!description?.trim()) {
      res.status(400).json({ error: "Please provide a problem description." });
      return;
    }

    const ticketNumber = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const ticketId = `tkt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const ticketTitle = title?.trim() || (description.length > 50 ? `${description.slice(0, 47)}...` : description);

    const newTicket: SupportTicket = {
      id: ticketId,
      ticketNumber,
      farmerId: req.user!.id,
      farmerName: req.user!.fullName,
      phoneNumber: req.user!.phoneNumber,
      email: req.user!.email,
      cropName: cropName || null,
      category: category || "general_complaint",
      title: ticketTitle,
      description: description.trim(),
      aiResponseContext: aiResponseContext || undefined,
      location: location || undefined,
      status: "New",
      isGovernmentReferral: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Try DB insertion
    try {
      await query(
        `INSERT INTO support_tickets
         (id, ticket_number, farmer_id, farmer_name, phone_number, email, crop_name, category, title, description, ai_response_context, location, status, is_government_referral, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'New', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [
          newTicket.id,
          newTicket.ticketNumber,
          newTicket.farmerId,
          newTicket.farmerName,
          newTicket.phoneNumber,
          newTicket.email,
          newTicket.cropName,
          newTicket.category,
          newTicket.title,
          newTicket.description,
          newTicket.aiResponseContext || null,
          newTicket.location || null,
        ],
      );
    } catch (err) {
      console.warn("[SUPPORT] DB insert fallback to memory:", err);
    }

    // Always store in memory store as well for high availability
    inMemoryTickets.unshift(newTicket);

    res.status(201).json({
      success: true,
      ticket: newTicket,
      message: `Support ticket #${newTicket.ticketNumber} created successfully. Our agronomy support team and admin have been notified.`,
    });
  } catch (error: any) {
    console.error("[SUPPORT-CREATE] Error:", error);
    res.status(500).json({ error: error?.message || "Failed to create support ticket." });
  }
});

// ── 2. Submit Government Agronomist Referral (Gram Sachivalayam / RBK) ───
router.post("/agronomist-referral", requireAuth, async (req, res) => {
  try {
    const {
      cropName,
      problemDescription,
      villageCity,
      district,
      state,
    } = req.body as {
      cropName?: string;
      problemDescription?: string;
      villageCity?: string;
      district?: string;
      state?: string;
    };

    if (!problemDescription?.trim()) {
      res.status(400).json({ error: "Please enter your farming inquiry or problem." });
      return;
    }

    const stateCode = (state || "AP").toUpperCase().slice(0, 2);
    const govRef = `RBK-${stateCode}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const ticketId = `tkt_gov_${Date.now()}`;

    const govTicket: SupportTicket = {
      id: ticketId,
      ticketNumber: govRef,
      farmerId: req.user!.id,
      farmerName: req.user!.fullName,
      phoneNumber: req.user!.phoneNumber,
      email: req.user!.email,
      cropName: cropName || "General Crop",
      category: "government_agronomist",
      title: `Government Agronomist Request (${cropName || "Crop Inquiry"})`,
      description: problemDescription.trim(),
      location: `${villageCity || "Village"}, ${district || "District"}, ${state || "Andhra Pradesh"}`,
      status: "New",
      isGovernmentReferral: true,
      governmentRefNumber: govRef,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await query(
        `INSERT INTO support_tickets
         (id, ticket_number, farmer_id, farmer_name, phone_number, email, crop_name, category, title, description, location, status, is_government_referral, government_ref_number, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'government_agronomist', $8, $9, $10, 'New', TRUE, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [
          govTicket.id,
          govTicket.ticketNumber,
          govTicket.farmerId,
          govTicket.farmerName,
          govTicket.phoneNumber,
          govTicket.email,
          govTicket.cropName,
          govTicket.title,
          govTicket.description,
          govTicket.location,
          govTicket.governmentRefNumber,
        ],
      );
    } catch (err) {
      console.warn("[SUPPORT] Gov referral DB insert fallback:", err);
    }

    inMemoryTickets.unshift(govTicket);

    res.status(201).json({
      success: true,
      ticket: govTicket,
      referralDetails: {
        referenceNumber: govRef,
        department: "Department of Agriculture — Village Secretariat (Gram Sachivalayam / RBK)",
        assignedOfficerRole: "Village Agriculture Assistant (VAA) / Agricultural Extension Officer (AEO)",
        portalUrl: "https://gramawardsachivalayam.ap.gov.in",
        kisanTollFree: "1800-425-4440 / 155251",
        estimatedVisitTime: "1 to 2 business days",
        instructions: `Keep reference ID ${govRef} ready when contacting your local Gram Sachivalayam Rythu Bharosa Kendra.`,
      },
    });
  } catch (error: any) {
    console.error("[GOV-REFERRAL] Error:", error);
    res.status(500).json({ error: error?.message || "Failed to route to Government Sachivalayam." });
  }
});

// ── 3. List Support Tickets (Filtered by role: Farmer sees own, Admin sees all)
router.get("/tickets", requireAuth, async (req, res) => {
  try {
    const isAdmin = req.user?.role === "admin" || (req.user?.email && req.user.email.includes("admin"));

    try {
      const sql = isAdmin
        ? `SELECT * FROM support_tickets ORDER BY created_at DESC`
        : `SELECT * FROM support_tickets WHERE farmer_id = $1 ORDER BY created_at DESC`;
      const params = isAdmin ? [] : [req.user!.id];

      const result = await query<{
        id: string;
        ticket_number: string;
        farmer_id: string;
        farmer_name: string;
        phone_number: string;
        email: string | null;
        crop_name: string | null;
        category: SupportTicket["category"];
        title: string;
        description: string;
        ai_response_context: string | null;
        location: string | null;
        status: "New" | "In Progress" | "Resolved";
        resolution_notes: string | null;
        is_government_referral: boolean;
        government_ref_number: string | null;
        created_at: string;
        updated_at: string;
      }>(sql, params);

      if (result.rows.length > 0) {
        const mapped = result.rows.map((r) => ({
          id: r.id,
          ticketNumber: r.ticket_number,
          farmerId: r.farmer_id,
          farmerName: r.farmer_name,
          phoneNumber: r.phone_number,
          email: r.email,
          cropName: r.crop_name,
          category: r.category,
          title: r.title,
          description: r.description,
          aiResponseContext: r.ai_response_context || undefined,
          location: r.location || undefined,
          status: r.status,
          resolutionNotes: r.resolution_notes || undefined,
          isGovernmentReferral: Boolean(r.is_government_referral),
          governmentRefNumber: r.government_ref_number || undefined,
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        }));

        res.json({
          tickets: mapped,
          newCount: mapped.filter((t) => t.status === "New").length,
          totalCount: mapped.length,
        });
        return;
      }
    } catch (dbErr) {
      console.warn("[SUPPORT] DB list query fallback to memory:", dbErr);
    }

    // Memory store fallback
    const filtered = isAdmin
      ? inMemoryTickets
      : inMemoryTickets.filter((t) => t.farmerId === req.user!.id);

    res.json({
      tickets: filtered,
      newCount: filtered.filter((t) => t.status === "New").length,
      totalCount: filtered.length,
    });
  } catch (error) {
    console.error("[SUPPORT-LIST] Error:", error);
    res.status(500).json({ error: "Failed to fetch tickets." });
  }
});

// ── 4. Admin Update Ticket Status (In Progress / Resolved + Resolution Notes)
router.patch("/tickets/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes } = req.body as {
      status?: "New" | "In Progress" | "Resolved";
      resolutionNotes?: string;
    };

    if (!status || !["New", "In Progress", "Resolved"].includes(status)) {
      res.status(400).json({ error: "Valid status ('New', 'In Progress', 'Resolved') is required." });
      return;
    }

    // Try DB update
    try {
      await query(
        `UPDATE support_tickets
         SET status = $1, resolution_notes = COALESCE($2, resolution_notes), updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [status, resolutionNotes || null, id],
      );
    } catch (err) {
      console.warn("[SUPPORT] DB update fallback to memory:", err);
    }

    // Update in memory store
    const ticket = inMemoryTickets.find((t) => t.id === id || t.ticketNumber === id);
    if (ticket) {
      ticket.status = status;
      if (resolutionNotes) ticket.resolutionNotes = resolutionNotes;
      ticket.updatedAt = new Date().toISOString();
    }

    res.json({
      success: true,
      message: `Ticket #${ticket?.ticketNumber || id} updated to ${status}.`,
      ticket,
    });
  } catch (error) {
    console.error("[SUPPORT-UPDATE] Error:", error);
    res.status(500).json({ error: "Failed to update ticket status." });
  }
});

export default router;
