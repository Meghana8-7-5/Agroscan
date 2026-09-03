import express from "express";
import http from "http";
import authRouter from "../server/routes/auth.js";
import detectionsRouter from "../server/routes/detections.js";
import aiAssistantRouter from "../server/routes/aiAssistant.js";
import storesRouter from "../server/routes/stores.js";
import weatherRouter from "../server/routes/weather.js";
import cropsRouter from "../server/routes/crops.js";
import uiConfigRouter from "../server/routes/uiConfig.js";
import { generateAndSendOtp, verifyOtp } from "../server/services/smsService.js";

async function runVerification() {
  console.log("=== STARTING AGROSCAN P0 & P1 COMPREHENSIVE VERIFICATION ===");

  const app = express();
  app.use(express.json());

  // Mount API endpoints
  app.use("/api/auth", authRouter);
  app.use("/auth", authRouter);
  app.use("/api/detections", detectionsRouter);
  app.use("/api/ai", aiAssistantRouter);
  app.use("/api/stores", storesRouter);
  app.use("/api/weather", weatherRouter);
  app.use("/api/crops", cropsRouter);
  app.use("/api/ui-config", uiConfigRouter);

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = (server.address() as any).port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Test server running on ${baseUrl}`);

  // Test 1: SMS OTP Provider Inspection
  console.log("\n[TEST 1] SMS Provider Diagnostics & OTP Dispatch");
  const testPhone = "9876543210";
  const otpRes = await generateAndSendOtp(testPhone, "te");
  console.log("-> generateAndSendOtp response:", otpRes);
  if (!otpRes.devOtp) throw new Error("Missing devOtp in response payload");
  const verified = verifyOtp(testPhone, otpRes.devOtp);
  console.log("-> verifyOtp with generated code result:", verified);
  if (!verified) throw new Error("OTP verification failed");

  // Test 2: Plant & Disease Vision Diagnostics (5 scenarios)
  console.log("\n[TEST 2] Plant & Disease Vision Diagnostic Verification");

  // Scenario A: Non-Plant / Face Rejection
  const faceScan = await fetch(`${baseUrl}/api/detections/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sampleHint: "non_plant_face" }),
  }).then((r) => r.json());
  console.log("-> [Scenario A] Non-Plant Face Scan Result:", {
    verdict: faceScan.verdict,
    cropName: faceScan.cropName,
    headline: faceScan.verdictHeadline,
    confidence: faceScan.confidence,
  });
  if (faceScan.verdict !== "Uncertain / Needs a clearer photo") {
    throw new Error("Expected non-plant photo to be rejected with Uncertain status");
  }

  // Scenario B: Healthy Wheat Leaf
  const wheatScan = await fetch(`${baseUrl}/api/detections/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sampleHint: "healthy_wheat", targetCrop: "Wheat" }),
  }).then((r) => r.json());
  console.log("-> [Scenario B] Healthy Wheat Scan Result:", {
    verdict: wheatScan.verdict,
    cropName: wheatScan.cropName,
    headline: wheatScan.verdictHeadline,
    confidence: wheatScan.confidence,
  });
  if (wheatScan.cropName !== "Wheat" || wheatScan.verdict !== "Healthy") {
    throw new Error("Expected Healthy Wheat diagnosis");
  }

  // Scenario C: Rice Leaf Blast
  const riceScan = await fetch(`${baseUrl}/api/detections/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sampleHint: "rice_blast", targetCrop: "Rice (Paddy)" }),
  }).then((r) => r.json());
  console.log("-> [Scenario C] Rice Leaf Blast Result:", {
    verdict: riceScan.verdict,
    cropName: riceScan.cropName,
    disease: riceScan.diseaseName,
    organicCount: riceScan.organicTreatment.length,
    chemicalCount: riceScan.chemicalTreatment.length,
  });
  if (!riceScan.diseaseName?.includes("Blast")) {
    throw new Error("Expected Rice Blast diagnosis");
  }

  // Scenario D: Tomato Early Blight
  const tomatoScan = await fetch(`${baseUrl}/api/detections/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sampleHint: "tomato_blight", targetCrop: "Tomato" }),
  }).then((r) => r.json());
  console.log("-> [Scenario D] Tomato Blight Result:", {
    verdict: tomatoScan.verdict,
    cropName: tomatoScan.cropName,
    disease: tomatoScan.diseaseName,
  });
  if (!tomatoScan.diseaseName?.includes("Blight")) {
    throw new Error("Expected Tomato Early Blight diagnosis");
  }

  // Scenario E: Chilli / Cotton Pests
  const pestScan = await fetch(`${baseUrl}/api/detections/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sampleHint: "pests_chilli_cotton", targetCrop: "Chilli" }),
  }).then((r) => r.json());
  console.log("-> [Scenario E] Pests Scan Result:", {
    verdict: pestScan.verdict,
    cropName: pestScan.cropName,
    disease: pestScan.diseaseName,
  });

  // Test 3: Multilingual AI Advisory Engine
  console.log("\n[TEST 3] Multilingual AI Assistant Verification");
  const teluguQuery = await fetch(`${baseUrl}/api/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "వరిలో ఆకుమచ్చ తెగులు నివారణ ఎలా?",
      language: "te",
      farmerName: "Ramesh",
    }),
  }).then((r) => r.json());
  console.log("-> Telugu Advisory Response:", teluguQuery.reply?.slice(0, 100) + "...");
  if (!teluguQuery.reply) throw new Error("Missing Telugu reply");

  const hindiQuery = await fetch(`${baseUrl}/api/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "गेहूं में यूरिया कब डालना चाहिए?",
      language: "hi",
      farmerName: "Suresh",
    }),
  }).then((r) => r.json());
  console.log("-> Hindi Advisory Response:", hindiQuery.reply?.slice(0, 100) + "...");
  if (!hindiQuery.reply) throw new Error("Missing Hindi reply");

  // Test 4: Nearby Agri Stores for Leaflet Map
  console.log("\n[TEST 4] Nearby Agri Stores Endpoint");
  const storesRes = await fetch(`${baseUrl}/api/stores/nearby?lat=16.3067&lng=80.4365`).then((r) => r.json());
  const storeList = storesRes.stores || storesRes;
  console.log(`-> Returned ${storeList.length} stores for coordinates (16.3067, 80.4365)`);
  if (!Array.isArray(storeList) || storeList.length === 0) throw new Error("No stores returned");

  server.close();
  console.log("\n✅ ALL COMPREHENSIVE VERIFICATIONS PASSED CLEANLY!");
}

runVerification().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
