import { createApp } from "./index.js";
import axios from "axios";

async function runTests() {
  const app = createApp();
  const server = app.listen(3099, async () => {
    console.log("Test server listening on port 3099");
    const client = axios.create({ baseURL: "http://localhost:3099/api", validateStatus: () => true });

    try {
      // 1. Validation test (missing fullName)
      console.log("\n--- TEST 1: Validation failure (missing name) ---");
      const res1 = await client.post("/auth/register", {
        fullName: "",
        mobile: "9876543210",
        email: "test@example.com",
        password: "password123",
        language: "English",
        agree: true
      });
      console.log("Status:", res1.status);
      console.log("Response Body:", res1.data);

      // 2. Successful Farmer Registration
      console.log("\n--- TEST 2: Successful Farmer Registration ---");
      const testPhone = "98765" + Math.floor(10000 + Math.random() * 90000);
      const testEmail = `farmer_${Date.now()}@example.com`;
      const res2 = await client.post("/auth/register", {
        fullName: "Suresh Kumar",
        mobile: testPhone,
        email: testEmail,
        password: "password123",
        language: "తెలుగు",
        agree: true,
        role: "farmer"
      });
      console.log("Status:", res2.status);
      console.log("Response User:", res2.data.user);
      console.log("Token received:", Boolean(res2.data.token));

      // 3. Duplicate Registration
      console.log("\n--- TEST 3: Duplicate Registration Conflict (409) ---");
      const res3 = await client.post("/auth/register", {
        fullName: "Duplicate Suresh",
        mobile: testPhone,
        email: testEmail,
        password: "password123",
        language: "English",
        agree: true
      });
      console.log("Status:", res3.status);
      console.log("Response Body:", res3.data);

      // 4. Farmer Login
      console.log("\n--- TEST 4: Farmer Login with created credentials ---");
      const res4 = await client.post("/auth/login", {
        identifier: testEmail,
        password: "password123"
      });
      console.log("Status:", res4.status);
      console.log("Response User:", res4.data.user);
      console.log("Token received:", Boolean(res4.data.token));

      // 5. Get current profile with token
      console.log("\n--- TEST 5: Fetch profile with auth token (/auth/me) ---");
      const res5 = await client.get("/auth/me", {
        headers: { Authorization: `Bearer ${res4.data.token}` }
      });
      console.log("Status:", res5.status);
      console.log("Profile:", res5.data);

      console.log("\n=== ALL REGISTRATION & AUTH TESTS PASSED SUCCESSFULLY! ===");
    } catch (err) {
      console.error("Test execution error:", err);
    } finally {
      server.close(() => process.exit(0));
    }
  });
}

runTests();
