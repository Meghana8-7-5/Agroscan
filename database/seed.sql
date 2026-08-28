-- ============================================================================
-- AgroScan Database Seed Script
-- Project: AgroScan - AI-Powered Agriculture Platform for Farmers
-- File: database/seed.sql
-- Description: Realistic, safe development/testing seed data
-- ============================================================================

-- Wrap in a transaction
BEGIN;

-- Clean existing data in reverse dependency order if re-seeding
TRUNCATE TABLE 
    support_ticket_messages,
    support_tickets,
    marketplace_products,
    marketplace_stores,
    ai_messages,
    ai_conversations,
    notifications,
    weather_records,
    advisories,
    ai_detection_results,
    crop_images,
    crop_tasks,
    crop_plans,
    crop_registrations,
    fields,
    farms,
    diseases_pests,
    crops,
    app_translations,
    users
CASCADE;

-- ============================================================================
-- 1. USERS (Farmers, Agronomist, Seller, Admin)
-- Passwords are safe mock hashes (e.g. bcrypt of 'AgroScan@2026')
-- ============================================================================

INSERT INTO users (id, full_name, phone_number, email, password_hash, preferred_language, terms_accepted, terms_accepted_at, role, is_active)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Ramesh Patel', '+919876543210', 'ramesh.farmer@example.com', '$2b$12$eX4mP1eH4sHNotRealP4ssw0rdForD3moOnly000000000000000000', 'en', TRUE, CURRENT_TIMESTAMP - INTERVAL '30 days', 'farmer', TRUE),
    ('a0000000-0000-0000-0000-000000000002', 'Venkata Rao', '+919876543211', 'venkat.farmer@example.com', '$2b$12$eX4mP1eH4sHNotRealP4ssw0rdForD3moOnly000000000000000000', 'te', TRUE, CURRENT_TIMESTAMP - INTERVAL '20 days', 'farmer', TRUE),
    ('a0000000-0000-0000-0000-000000000003', 'Dr. Sunita Sharma', '+919876543212', 'dr.sunita@agroscan.org', '$2b$12$eX4mP1eH4sHNotRealP4ssw0rdForD3moOnly000000000000000000', 'hi', TRUE, CURRENT_TIMESTAMP - INTERVAL '60 days', 'agronomist', TRUE),
    ('a0000000-0000-0000-0000-000000000004', 'Kisan Seva Kendra Admin', '+919876543213', 'store@kisanseva.com', '$2b$12$eX4mP1eH4sHNotRealP4ssw0rdForD3moOnly000000000000000000', 'en', TRUE, CURRENT_TIMESTAMP - INTERVAL '45 days', 'seller', TRUE),
    ('a0000000-0000-0000-0000-000000000005', 'AgroScan System Admin', '+919876543214', 'admin@agroscan.org', '$2b$12$eX4mP1eH4sHNotRealP4ssw0rdForD3moOnly000000000000000000', 'en', TRUE, CURRENT_TIMESTAMP - INTERVAL '90 days', 'admin', TRUE);

-- ============================================================================
-- 2. FARMS
-- ============================================================================

INSERT INTO farms (id, farmer_id, farm_name, state, district, sub_district, village_city, pincode, latitude, longitude, total_area_acres)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Patel Green Farms', 'Maharashtra', 'Nashik', 'Niphad', 'Pimpalgaon', '422209', 20.1662000, 73.9875000, 12.50),
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'Sri Venkateswara Krishi Farm', 'Andhra Pradesh', 'Guntur', 'Tenali', 'Angalakuduru', '522211', 16.2437000, 80.6406000, 8.00);

-- ============================================================================
-- 3. FIELDS
-- ============================================================================

INSERT INTO fields (id, farm_id, field_name, area_acres, soil_type, irrigation_source)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'North Plot - Red Soil', 5.00, 'red_loam', 'drip'),
    ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Riverbank Plot', 7.50, 'alluvial', 'sprinkler'),
    ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'Main Canal Field', 5.00, 'black_cotton', 'canal'),
    ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', 'Borewell Plot 2', 3.00, 'black_cotton', 'borewell');

-- ============================================================================
-- 4. CROPS (Master Botanical Catalog)
-- ============================================================================

INSERT INTO crops (id, name, botanical_name, category, season, optimal_temp_min_c, optimal_temp_max_c, crop_image_url)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'Tomato', 'Solanum lycopersicum', 'Vegetable', 'Rabi', 18.0, 27.0, 'https://cdn.agroscan.org/crops/tomato.jpg'),
    ('d0000000-0000-0000-0000-000000000002', 'Rice (Paddy)', 'Oryza sativa', 'Cereal', 'Kharif', 20.0, 35.0, 'https://cdn.agroscan.org/crops/rice.jpg'),
    ('d0000000-0000-0000-0000-000000000003', 'Cotton', 'Gossypium hirsutum', 'Cash Crop', 'Kharif', 21.0, 32.0, 'https://cdn.agroscan.org/crops/cotton.jpg'),
    ('d0000000-0000-0000-0000-000000000004', 'Chilli', 'Capsicum annuum', 'Vegetable', 'Kharif', 20.0, 30.0, 'https://cdn.agroscan.org/crops/chilli.jpg'),
    ('d0000000-0000-0000-0000-000000000005', 'Wheat', 'Triticum aestivum', 'Cereal', 'Rabi', 12.0, 25.0, 'https://cdn.agroscan.org/crops/wheat.jpg'),
    ('d0000000-0000-0000-0000-000000000006', 'Maize (Corn)', 'Zea mays', 'Cereal', 'Kharif', 18.0, 32.0, 'https://cdn.agroscan.org/crops/maize.jpg');

-- ============================================================================
-- 5. CROP REGISTRATIONS ("My Crops")
-- ============================================================================

INSERT INTO crop_registrations (id, field_id, crop_id, variety_name, land_area_acres, sowing_date, expected_harvest_date, plant_count, farming_stage, status, notes)
VALUES
    ('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'US 440 Hybrid', 4.50, CURRENT_DATE - INTERVAL '35 days', CURRENT_DATE + INTERVAL '55 days', 18000, 'vegetative', 'active', 'High yield variety planted with mulching sheet.'),
    ('e0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000002', 'BPT 5204 (Samba Mahsuri)', 5.00, CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '105 days', 250000, 'seeding', 'active', 'Transplanted healthy seedlings from nursery.'),
    ('e0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000004', 'Guntur Sannam (S4)', 3.00, CURRENT_DATE - INTERVAL '50 days', CURRENT_DATE + INTERVAL '40 days', 30000, 'flowering', 'active', 'Flower initiation stage observed; monitoring for thrips.');

-- ============================================================================
-- 6. CROP PLANS
-- ============================================================================

INSERT INTO crop_plans (id, crop_registration_id, plan_name, start_date, end_date, overall_progress_percentage, status)
VALUES
    ('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Tomato 90-Day Intensive Crop Plan', CURRENT_DATE - INTERVAL '35 days', CURRENT_DATE + INTERVAL '55 days', 42.50, 'in_progress'),
    ('f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000002', 'Paddy Standard Kharif Plan', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '105 days', 18.00, 'in_progress');

-- ============================================================================
-- 7. CROP TASKS (Checklist)
-- ============================================================================

INSERT INTO crop_tasks (id, crop_plan_id, task_name, category, description, sequence_order, due_date, completed_date, status, priority, notes)
VALUES
    -- Tomato Plan Tasks
    ('10000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'Deep Ploughing & Soil Solarization', 'land_preparation', 'Plough field to 25cm depth and incorporate FYM.', 1, CURRENT_DATE - INTERVAL '40 days', CURRENT_DATE - INTERVAL '38 days', 'completed', 'high', 'Applied 10 tonnes of organic compost.'),
    ('10000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', 'Seedling Transplantation & Mulching', 'seeding', 'Plant seedlings at 60cm x 45cm spacing with silver-black mulch.', 2, CURRENT_DATE - INTERVAL '35 days', CURRENT_DATE - INTERVAL '35 days', 'completed', 'urgent', '100% transplanting completed smoothly.'),
    ('10000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', 'First Drip Fertigation (19:19:19 NPK)', 'fertilizer', 'Apply water soluble 19:19:19 @ 3kg/acre via fertigation unit.', 3, CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '20 days', 'completed', 'high', 'Done along with humic acid.'),
    ('10000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', 'Preventive Foliar Neem Oil Spray', 'pest_control', 'Foliar spray of 10,000 ppm cold-pressed neem oil @ 3ml/L.', 4, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '4 days', 'completed', 'medium', 'Covered lower leaf surfaces thoroughly.'),
    ('10000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000001', 'Secondary Staking & Trellising', 'other', 'Tie growing vines to support wires using jute twine.', 5, CURRENT_DATE + INTERVAL '2 days', NULL, 'pending', 'high', 'Bamboo poles already erected.'),
    ('10000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000001', 'Flowering Stage Micronutrient Spray', 'fertilizer', 'Foliar application of Calcium Nitrate + Boron.', 6, CURRENT_DATE + INTERVAL '10 days', NULL, 'pending', 'medium', 'To prevent blossom end rot.');

-- ============================================================================
-- 8. DISEASES & PESTS (Master Knowledge Base)
-- ============================================================================

INSERT INTO diseases_pests (id, name, scientific_name, type, target_crop_id, description, symptoms, cause, severity_level, reference_image_url)
VALUES
    ('20000000-0000-0000-0000-000000000001', 'Tomato Early Blight', 'Alternaria solani', 'disease', 'd0000000-0000-0000-0000-000000000001', 'A devastating fungal disease that affects tomato leaves, stems, and fruits.', 'Circular brown spots with concentric target-board rings on older leaves, surrounded by yellow chlorotic halos.', 'Alternaria solani fungus thriving in warm humid conditions (24-29°C).', 'high', 'https://cdn.agroscan.org/diseases/tomato_early_blight.jpg'),
    ('20000000-0000-0000-0000-000000000002', 'Tomato Late Blight', 'Phytophthora infestans', 'disease', 'd0000000-0000-0000-0000-000000000001', 'Rapidly spreading water-mold infection capable of destroying entire crops within days.', 'Large, irregular water-soaked dark lesions with white moldy fungal growth on the underside during humid weather.', 'Oomycete pathogen Phytophthora infestans favored by cool wet weather.', 'critical', 'https://cdn.agroscan.org/diseases/tomato_late_blight.jpg'),
    ('20000000-0000-0000-0000-000000000003', 'Rice Blast', 'Magnaporthe oryzae', 'disease', 'd0000000-0000-0000-0000-000000000002', 'One of the most destructive fungal diseases of rice worldwide.', 'Spindle or diamond-shaped lesions with gray/white centers and dark brown or reddish borders.', 'Fungus Magnaporthe oryzae triggered by high nitrogen fertilizer and cloudy, drizzly weather.', 'high', 'https://cdn.agroscan.org/diseases/rice_blast.jpg'),
    ('20000000-0000-0000-0000-000000000004', 'Cotton Pink Bollworm', 'Pectinophora gossypiella', 'pest', 'd0000000-0000-0000-0000-000000000003', 'Invasive caterpillar pest damaging cotton squares and bolls, causing yield loss and lint staining.', 'Rosetted flowers, bored holes on bolls sealed with excreta, damaged immature lint and seeds.', 'Larvae of the moth Pectinophora gossypiella.', 'critical', 'https://cdn.agroscan.org/diseases/cotton_pink_bollworm.jpg'),
    ('20000000-0000-0000-0000-000000000005', 'Chilli Leaf Curl Virus', 'Begomovirus', 'disease', 'd0000000-0000-0000-0000-000000000004', 'Viral disease transmitted by whiteflies leading to stunted bush growth and poor fruit set.', 'Upward curling of leaf margins, vein clearing, thickening of veins, and severe stunting of plants.', 'Begomovirus transmitted primarily by Bemisia tabaci (whitefly vector).', 'high', 'https://cdn.agroscan.org/diseases/chilli_leaf_curl.jpg'),
    ('20000000-0000-0000-0000-000000000006', 'Healthy Crop / No Disease', 'N/A', 'healthy', NULL, 'The analyzed leaf/plant shows robust physiological health with no identifiable disease or pest symptoms.', 'Vibrant uniform green coloration, no necrotic spots, healthy vascular structures.', 'Optimal environmental conditions and agronomic care.', 'low', 'https://cdn.agroscan.org/diseases/healthy_plant.jpg');

-- ============================================================================
-- 9. ADVISORIES & TREATMENTS
-- ============================================================================

INSERT INTO advisories (id, disease_pest_id, severity_level, organic_treatment, chemical_treatment, preventive_measures, recommended_actions, dosage_instructions, safety_guidelines)
VALUES
    ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'high', 
     '1. Spray Trichoderma viride or Bacillus subtilis bio-fungicide @ 5g/L.\n2. Apply Copper Hydroxide (certified organic formulations) or Panchagavya foliar spray.',
     'Spray Mancozeb 75% WP @ 2.5g/L or Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1ml/L water.',
     '1. Maintain minimum 60cm row spacing for good air circulation.\n2. Avoid overhead sprinkler irrigation; use drip to keep leaves dry.\n3. Prune bottom leaves touching soil.',
     'Immediately remove and safely destroy heavily infected lower leaves. Spray recommended fungicide in the early morning.',
     'Mancozeb 75% WP: 500g in 200 Liters of water per acre. Repeat after 10-12 days if wet weather persists.',
     'Wear protective mask and gloves while spraying. Observe a 7-day pre-harvest interval (PHI) after chemical application.'),

    ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', 'high',
     'Apply Pseudomonas fluorescens @ 10g/L or fermented cow dung-urine filtrate slurry (Bijamrita) on foliage.',
     'Spray Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane 40% EC @ 1.5ml/L.',
     '1. Avoid excessive urea/nitrogen application.\n2. Plant blast-resistant certified cultivars.\n3. Keep water level regulated in the paddy field.',
     'Initiate chemical spray immediately upon seeing diamond-shaped lesions on top 3 leaves.',
     'Tricyclazole 75% WP: 120g per acre in 200 Liters of water.',
     'Ensure calm wind conditions during spraying to prevent spray drift into water bodies.'),

    ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000004', 'critical',
     '1. Install pheromone traps with Gossyplure @ 5 traps/acre for mass monitoring.\n2. Release Trichogramma bactrae egg parasitoids @ 60,000/acre at weekly intervals.',
     'Foliar spray of Chlorantraniliprole 18.5% SC @ 0.3ml/L or Emamectin Benzoate 5% SG @ 0.5g/L.',
     '1. Avoid extending cotton crop into ratoon stage.\n2. Deep summer ploughing to expose hibernating pupae to birds and sunlight.\n3. Plant refuge non-Bt border rows.',
     'Scout 20 green bolls per acre weekly. If >10% bolls show larval entry holes or larvae, execute targeted chemical spray.',
     'Emamectin Benzoate 5% SG: 100g per acre mixed with 200 Liters of clean water.',
     'Do not spray during peak honeybee activity hours (10 AM - 3 PM). Use PPE.'),

    ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000005', 'high',
     '1. Install yellow sticky traps @ 15 traps/acre to trap whitefly vectors.\n2. Spray Neem oil (10,000 ppm) @ 3ml/L with soap solution.',
     'Spray Diafenthiuron 50% WP @ 1.25g/L or Acetamiprid 20% SP @ 0.2g/L to control the vector population.',
     '1. Grow border crops of maize or sorghum (barrier crops) 2-3 rows around chilli field.\n2. Rouge and burn viral infected plants immediately.',
     'Control vector insects before disease spreads to adjacent healthy plots.',
     'Diafenthiuron 50% WP: 250g in 200 Liters of water per acre.',
     'Alternate chemical modes of action to prevent insecticide resistance in whiteflies.');

-- ============================================================================
-- 10. CROP IMAGES & AI DETECTION RESULTS
-- ============================================================================

INSERT INTO crop_images (id, farmer_id, crop_registration_id, image_url, thumbnail_url, storage_provider, capture_source, file_size_bytes, mime_type, latitude, longitude, captured_at)
VALUES
    ('40000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'https://storage.agroscan.org/uploads/2026/08/farmer_1_tomato_leaf_01.jpg', 'https://storage.agroscan.org/uploads/2026/08/farmer_1_tomato_leaf_01_thumb.jpg', 's3', 'camera_capture', 1845200, 'image/jpeg', 20.1662500, 73.9875200, CURRENT_TIMESTAMP - INTERVAL '2 days'),
    ('40000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000002', 'https://storage.agroscan.org/uploads/2026/08/farmer_2_paddy_blast_01.jpg', 'https://storage.agroscan.org/uploads/2026/08/farmer_2_paddy_blast_01_thumb.jpg', 's3', 'upload', 2154000, 'image/jpeg', 16.2437800, 80.6406500, CURRENT_TIMESTAMP - INTERVAL '1 day');

INSERT INTO ai_detection_results (id, image_id, disease_pest_id, model_name, model_version, confidence_score, severity_assessed, bounding_box_data, raw_model_output, status, detected_at)
VALUES
    ('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'AgroScan-Vision-YOLOv8', 'v2.1.0', 0.9485, 'high', 
     '[{"x": 120, "y": 145, "width": 210, "height": 180, "confidence": 0.95, "label": "Early Blight Lesion"}]'::jsonb,
     '{"predictions": [{"class": "Tomato Early Blight", "score": 0.9485}, {"class": "Tomato Septoria Leaf Spot", "score": 0.0381}, {"class": "Healthy", "score": 0.0134}], "inference_time_ms": 142}'::jsonb,
     'completed', CURRENT_TIMESTAMP - INTERVAL '2 days'),

    ('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', 'AgroScan-Vision-YOLOv8', 'v2.1.0', 0.9120, 'moderate',
     '[{"x": 85, "y": 90, "width": 310, "height": 120, "confidence": 0.91, "label": "Rice Blast Spindle"}]'::jsonb,
     '{"predictions": [{"class": "Rice Blast", "score": 0.9120}, {"class": "Brown Spot", "score": 0.0620}, {"class": "Healthy", "score": 0.0260}], "inference_time_ms": 138}'::jsonb,
     'completed', CURRENT_TIMESTAMP - INTERVAL '1 day');

-- ============================================================================
-- 11. WEATHER RECORDS
-- ============================================================================

INSERT INTO weather_records (id, farm_id, recorded_at, temperature_c, feels_like_c, humidity_percentage, wind_speed_kmh, wind_direction_deg, rainfall_mm, weather_condition, uv_index, source_provider)
VALUES
    ('60000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP - INTERVAL '1 day', 28.5, 29.2, 74.0, 14.5, 220.0, 0.00, 'Partly Cloudy', 6.5, 'OpenWeatherMap'),
    ('60000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP, 27.0, 28.0, 82.0, 18.2, 235.0, 4.20, 'Light Rain', 4.0, 'OpenWeatherMap'),
    ('60000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', CURRENT_TIMESTAMP - INTERVAL '1 day', 32.0, 36.5, 68.0, 10.0, 180.0, 0.00, 'Sunny', 8.2, 'OpenWeatherMap'),
    ('60000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', CURRENT_TIMESTAMP, 33.5, 38.0, 65.0, 12.5, 190.0, 0.00, 'Clear Sky', 8.9, 'OpenWeatherMap');

-- ============================================================================
-- 12. NOTIFICATIONS
-- ============================================================================

INSERT INTO notifications (id, user_id, crop_registration_id, type, title, message, priority, is_read, read_at, action_url, metadata)
VALUES
    ('70000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 
     'pest_alert', 'Early Blight Detected on Tomato Crop', 'AI scan detected Tomato Early Blight with 94.8% confidence. Tap here to view treatment advisory.', 
     'urgent', FALSE, NULL, '/detections/50000000-0000-0000-0000-000000000001', '{"disease_id": "20000000-0000-0000-0000-000000000001", "confidence": 0.9485}'::jsonb),

    ('70000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001',
     'crop_task_due', 'Task Due: Secondary Staking & Trellising', 'Scheduled staking task for your Tomato crop is due in 2 days.',
     'high', FALSE, NULL, '/crop-plans/f0000000-0000-0000-0000-000000000001/tasks', '{"task_id": "10000000-0000-0000-0000-000000000005"}'::jsonb),

    ('70000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000002',
     'weather_alert', 'Weather Warning: High Heat Index Expected', 'Temperatures over 34°C forecasted for Guntur. Ensure adequate irrigation in Paddy field.',
     'normal', TRUE, CURRENT_TIMESTAMP - INTERVAL '10 hours', '/weather', '{"temp_max": 34.5}'::jsonb);

-- ============================================================================
-- 13. AI ASSISTANT CONVERSATIONS & MESSAGES
-- ============================================================================

INSERT INTO ai_conversations (id, farmer_id, crop_registration_id, title, session_language, is_active)
VALUES
    ('80000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Tomato Disease Query & Organic Solution', 'en', TRUE),
    ('80000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000002', 'వరి పంటలో తెగుళ్ల నివారణ సలహా (Paddy Pest Query)', 'te', TRUE);

INSERT INTO ai_messages (id, conversation_id, sender_type, message_content, language_code, tokens_used, metadata)
VALUES
    ('90000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000001', 'user', 'My tomato crop has brown circular spots on bottom leaves. What should I spray organically?', 'en', 24, '{"intent": "disease_treatment_query"}'::jsonb),
    ('90000000-0000-0000-0000-000000000002', '80000000-0000-0000-0000-000000000001', 'assistant', 'Based on your description, this resembles Tomato Early Blight (Alternaria solani). For organic management:\n1. Spray Trichoderma viride bio-fungicide @ 5g per liter of water.\n2. Prune off affected bottom leaves to stop fungal spores from splashing upward.\n3. Avoid overhead watering. Drip fertigation is strongly recommended.', 'en', 82, '{"disease_identified": "Tomato Early Blight"}'::jsonb),
    ('90000000-0000-0000-0000-000000000003', '80000000-0000-0000-0000-000000000002', 'user', 'వరి ఆకుల మీద కంటి ఆకారంలో మచ్చలు కనిపిస్తున్నాయి. ఏమి చేయాలి?', 'te', 28, '{"intent": "disease_treatment_query"}'::jsonb),
    ('90000000-0000-0000-0000-000000000004', '80000000-0000-0000-0000-000000000002', 'assistant', 'మీ వరి పంటలో కనిపించే లక్షణాలు అగ్గితెగులు (Rice Blast) గా కనిపిస్తున్నాయి. నివారణ చర్యలు:\n1. ఎకరానికి ట్రైసైక్లాజోల్ 75% WP 120 గ్రాములు 200 లీటర్ల నీటిలో కలిపి పిచికారీ చేయండి.\n2. నత్రజని (యూరియా) ఎరువుల వాడకాన్ని తగ్గించండి.\n3. సూడోమోనాస్ ఫ్లోరోసెన్స్ 10 గ్రాములు లీటరు నీటికి కలిపి కూడా పిచికారీ చేయవచ్చు.', 'te', 95, '{"disease_identified": "Rice Blast"}'::jsonb);

-- ============================================================================
-- 14. MARKETPLACE STORES & PRODUCTS
-- ============================================================================

INSERT INTO marketplace_stores (id, owner_id, store_name, business_type, contact_phone, contact_email, state, district, address, is_verified)
VALUES
    ('a1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004', 'Kisan Seva Agri Hub', 'Retailer', '+919876543213', 'sales@kisanseva.com', 'Maharashtra', 'Nashik', 'Main APMC Market Yard, Shop No 14, Niphad, Nashik', TRUE),
    ('a1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004', 'Sri Rama Rythu Seva Kendram', 'FPO', '+919876543215', 'tenali.fpo@agroscan.org', 'Andhra Pradesh', 'Guntur', 'Near RTC Bus Stand, Tenali, Guntur', TRUE);

INSERT INTO marketplace_products (id, store_id, category, product_name, description, price, unit, stock_quantity, is_available, product_image_url)
VALUES
    ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'bio_pesticides', 'Cold-Pressed Pure Neem Oil 10,000 PPM', 'High azadirachtin cold-pressed organic bio-pesticide for insect pest management.', 450.00, 'liter', 150, TRUE, 'https://cdn.agroscan.org/products/neem_oil_1L.jpg'),
    ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'fertilizers', 'Water Soluble NPK 19:19:19 Fertigation Grade', '100% water-soluble balanced plant nutrient formulation for drip systems.', 180.00, 'kg', 500, TRUE, 'https://cdn.agroscan.org/products/npk_19_19_19.jpg'),
    ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'seeds', 'US 440 Hybrid Tomato Seeds', 'High disease tolerance and uniform firm fruits suitable for long transport.', 920.00, 'packet', 85, TRUE, 'https://cdn.agroscan.org/products/us440_tomato_seeds.jpg'),
    ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 'bio_pesticides', 'Trichoderma Viride Bio-Fungicide Powder', 'Antagonistic beneficial fungus for soil-borne root rot and early blight management.', 220.00, 'kg', 200, TRUE, 'https://cdn.agroscan.org/products/trichoderma_1kg.jpg'),
    ('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'equipment', 'Pressure Compensating Drip Emitter Kit (500 pcs)', 'Precision 4 LPH clog-resistant inline drippers for vegetable irrigation.', 1250.00, 'unit', 40, TRUE, 'https://cdn.agroscan.org/products/drip_kit.jpg');

-- ============================================================================
-- 15. SUPPORT TICKETS & MESSAGES
-- ============================================================================

INSERT INTO support_tickets (id, farmer_id, assigned_to, crop_registration_id, subject, description, category, priority, status, resolution_notes)
VALUES
    ('c1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 
     'Need confirmation on Early Blight fungicide dosage', 
     'I uploaded my tomato leaf picture and the AI detected Early Blight. Can an agronomist verify if Mancozeb dosage of 2.5g/L is safe for 35-day-old plants?', 
     'disease_inquiry', 'medium', 'resolved', 
     'Verified by Dr. Sunita: 2.5g/L dosage is completely safe at 35 days post-transplantation. Spray in early morning.');

INSERT INTO support_ticket_messages (id, ticket_id, sender_id, message, attachment_url)
VALUES
    ('d1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Hello Dr. Sunita, please review the leaf picture attached to my detection record.', NULL),
    ('d1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'Hello Ramesh Ji. I reviewed the AI detection and image. The diagnosis of Early Blight is accurate. 2.5g/L Mancozeb is safe. Ensure you spray lower leaf surfaces and repeat in 10 days if humid weather continues.', NULL);

-- ============================================================================
-- 16. APP TRANSLATIONS (Multilingual Key-Value Storage)
-- ============================================================================

INSERT INTO app_translations (id, language_code, translation_key, translated_text, category)
VALUES
    -- English (en)
    ('e1000000-0000-0000-0000-000000000001', 'en', 'dashboard.welcome', 'Welcome back, Farmer', 'ui'),
    ('e1000000-0000-0000-0000-000000000002', 'en', 'dashboard.my_crops', 'My Registered Crops', 'ui'),
    ('e1000000-0000-0000-0000-000000000003', 'en', 'crop.tomato', 'Tomato', 'crop_name'),
    ('e1000000-0000-0000-0000-000000000004', 'en', 'crop.rice', 'Rice (Paddy)', 'crop_name'),
    ('e1000000-0000-0000-0000-000000000005', 'en', 'detection.status.healthy', 'Healthy Plant', 'ui'),
    ('e1000000-0000-0000-0000-000000000006', 'en', 'advisory.treatment.organic', 'Organic Treatment', 'ui'),
    ('e1000000-0000-0000-0000-000000000007', 'en', 'advisory.treatment.chemical', 'Chemical Treatment', 'ui'),

    -- Telugu (te)
    ('e1000000-0000-0000-0000-000000000008', 'te', 'dashboard.welcome', 'స్వాగతం, రైతు మిత్రమా', 'ui'),
    ('e1000000-0000-0000-0000-000000000009', 'te', 'dashboard.my_crops', 'నా పంటలు', 'ui'),
    ('e1000000-0000-0000-0000-000000000010', 'te', 'crop.tomato', 'టమాటా', 'crop_name'),
    ('e1000000-0000-0000-0000-000000000011', 'te', 'crop.rice', 'వరి', 'crop_name'),
    ('e1000000-0000-0000-0000-000000000012', 'te', 'detection.status.healthy', 'ఆరోగ్యకరమైన మొక్క', 'ui'),
    ('e1000000-0000-0000-0000-000000000013', 'te', 'advisory.treatment.organic', 'సేంద్రీయ చికిత్స', 'ui'),
    ('e1000000-0000-0000-0000-000000000014', 'te', 'advisory.treatment.chemical', 'రసాయన చికిత్స', 'ui'),

    -- Hindi (hi)
    ('e1000000-0000-0000-0000-000000000015', 'hi', 'dashboard.welcome', 'स्वागत है, किसान भाई', 'ui'),
    ('e1000000-0000-0000-0000-000000000016', 'hi', 'dashboard.my_crops', 'मेरी फसलें', 'ui'),
    ('e1000000-0000-0000-0000-000000000017', 'hi', 'crop.tomato', 'टमाटर', 'crop_name'),
    ('e1000000-0000-0000-0000-000000000018', 'hi', 'crop.rice', 'धान (चावल)', 'crop_name'),
    ('e1000000-0000-0000-0000-000000000019', 'hi', 'detection.status.healthy', 'स्वस्थ पौधा', 'ui'),
    ('e1000000-0000-0000-0000-000000000020', 'hi', 'advisory.treatment.organic', 'जैविक उपचार', 'ui'),
    ('e1000000-0000-0000-0000-000000000021', 'hi', 'advisory.treatment.chemical', 'रासायनिक उपचार', 'ui');

COMMIT;
