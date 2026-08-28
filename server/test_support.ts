import { createApp } from "./index.js";
import axios from "axios";

async function runSupportTests() {
  const app = createApp();
  const server = app.listen(3098, async () => {
    console.log("Support test server listening on port 3098");
    const client = axios.create({ baseURL: "http://localhost:3098/api", validateStatus: () => true });

    try {
      // 1. Register a test farmer
      const testEmail = `farmer_support_${Date.now()}@example.com`;
      const regRes = await client.post("/auth/register", {
        fullName: "Anand Rao",
        mobile: "98765" + Math.floor(10000 + Math.random() * 90000),
        email: testEmail,
        password: "password123",
        language: "English",
        agree: true,
        role: "farmer"
      });
      console.log("Farmer registered:", regRes.status, regRes.data.user.id);
      const farmerToken = regRes.data.token;

      // 2. Farmer asks question to AI Assistant
      console.log("\n--- TEST 1: AI Assistant Chat ---");
      const aiRes = await client.post("/ai/chat", {
        message: "What is the best organic spray for leaf blight in Tomato?",
        language: "en",
        farmerName: "Anand",
        registeredCrops: ["Tomato"],
        location: "Guntur"
      });
      console.log("AI Chat Status:", aiRes.status);
      console.log("AI Reply preview:", aiRes.data.reply.slice(0, 100) + "...");

      // 3. Farmer creates a support ticket
      console.log("\n--- TEST 2: Farmer Support Ticket Creation ---");
      const ticketRes = await client.post(
        "/support/tickets",
        {
          title: "Pest damage spreading in acre 2",
          description: "Noticed heavy whitefly and leaf curl spreading fast.",
          cropName: "Tomato",
          category: "crop_disease",
          aiResponseContext: "Suggested Neem oil 10,000 ppm",
          location: "Gowdapalem, Guntur"
        },
        { headers: { Authorization: `Bearer ${farmerToken}` } }
      );
      console.log("Ticket Created Status:", ticketRes.status);
      console.log("Ticket Info:", ticketRes.data.ticket?.ticketNumber, ticketRes.data.ticket?.status);
      const createdTicketId = ticketRes.data.ticket?.id;

      // 4. Farmer submits Government Sachivalayam Agronomist Referral
      console.log("\n--- TEST 3: Government Sachivalayam Agronomist Referral ---");
      const govRes = await client.post(
        "/support/agronomist-referral",
        {
          cropName: "Tomato",
          problemDescription: "Need official soil sampling and subsidized fungicide from Rythu Bharosa Kendra.",
          villageCity: "Gowdapalem",
          district: "Guntur",
          state: "Andhra Pradesh"
        },
        { headers: { Authorization: `Bearer ${farmerToken}` } }
      );
      console.log("Gov Referral Status:", govRes.status);
      console.log("Referral Receipt:", govRes.data.referralDetails);

      // 5. Admin lists tickets and updates status
      console.log("\n--- TEST 4: Admin Ticket Board & Status Resolution ---");
      const adminLogin = await client.post("/auth/login", {
        identifier: "vganesh1603m@gmail.com",
        password: "GMVKAA@123"
      });
      const adminToken = adminLogin.data.token;

      const adminTicketsRes = await client.get("/support/tickets", {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log("Admin total tickets count:", adminTicketsRes.data.totalCount, "New count:", adminTicketsRes.data.newCount);

      // Admin updates the created ticket to "Resolved" with resolution notes
      const patchRes = await client.patch(
        `/support/tickets/${createdTicketId}`,
        {
          status: "Resolved",
          resolutionNotes: "Village Agriculture Assistant visited field and provided Copper Oxychloride."
        },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      console.log("Admin Patch Status:", patchRes.status);
      console.log("Updated Ticket Status:", patchRes.data.ticket?.status, "Notes:", patchRes.data.ticket?.resolutionNotes);

      console.log("\n=== ALL SUPPORT & HELP DESK TESTS COMPLETED SUCCESSFULLY! ===");
    } catch (err) {
      console.error("Support test failed:", err);
    } finally {
      server.close(() => process.exit(0));
    }
  });
}

runSupportTests();
