-- ============================================================================
-- AgroScan Database Schema
-- Project: AgroScan - AI-Powered Agriculture Platform for Farmers
-- Technology: PostgreSQL (13+)
-- File: database/schema.sql
-- ============================================================================

-- Enable pgcrypto extension for cryptographic functions and UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 0. UTILITY TRIGGER FUNCTION FOR UPDATED_AT TIMESTAMPS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 1. USERS TABLE
-- Stores farmer profiles, agronomists, store sellers, admins, and support agents
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255), -- Nullable if external OAuth/SMS OTP auth is used
    preferred_language VARCHAR(10) DEFAULT 'en' NOT NULL,
    terms_accepted BOOLEAN DEFAULT FALSE NOT NULL,
    terms_accepted_at TIMESTAMPTZ,
    role VARCHAR(20) DEFAULT 'farmer' NOT NULL CHECK (role IN ('farmer', 'agronomist', 'seller', 'admin', 'support')),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE users IS 'User accounts including farmers, agronomists, store sellers, and support staff';
COMMENT ON COLUMN users.phone_number IS 'Primary mobile login identifier for farmers';
COMMENT ON COLUMN users.preferred_language IS 'ISO 639-1 language code (e.g., en, te, hi, ta, kn, mr)';

-- ============================================================================
-- 2. FARMS TABLE
-- Geographic holdings/properties owned or operated by a farmer
-- ============================================================================

CREATE TABLE farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farm_name VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    sub_district VARCHAR(100), -- Taluk / Mandal / Block
    village_city VARCHAR(100) NOT NULL,
    pincode VARCHAR(10),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    total_area_acres NUMERIC(8, 2) CHECK (total_area_acres > 0),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER trg_farms_updated_at
BEFORE UPDATE ON farms
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE farms IS 'Physical agricultural farm properties owned by farmers';

-- ============================================================================
-- 3. FIELDS TABLE
-- Specific parcels or plots of land within a farm holding
-- ============================================================================

CREATE TABLE fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    area_acres NUMERIC(8, 2) NOT NULL CHECK (area_acres > 0),
    soil_type VARCHAR(50), -- e.g., 'black_cotton', 'red_loam', 'alluvial', 'sandy', 'clay'
    irrigation_source VARCHAR(50), -- e.g., 'borewell', 'canal', 'drip', 'sprinkler', 'rainfed'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER trg_fields_updated_at
BEFORE UPDATE ON fields
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE fields IS 'Specific plots/parcels within a farm having distinct soil and irrigation features';

-- ============================================================================
-- 4. CROPS TABLE (Master Botanical Catalog)
-- Standard catalog of crop types supported across the AgroScan platform
-- ============================================================================

CREATE TABLE crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    botanical_name VARCHAR(150),
    category VARCHAR(50) NOT NULL, -- e.g., 'Cereal', 'Pulse', 'Vegetable', 'Fruit', 'Cash Crop', 'Oilseed'
    season VARCHAR(30), -- e.g., 'Kharif', 'Rabi', 'Zaid', 'Perennial'
    optimal_temp_min_c NUMERIC(4, 1),
    optimal_temp_max_c NUMERIC(4, 1),
    crop_image_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE crops IS 'Standard catalog of agricultural crops';

-- ============================================================================
-- 5. CROP REGISTRATIONS TABLE ("My Crops")
-- Tracks specific crop planting cycles planted by a farmer on a field
-- ============================================================================

CREATE TABLE crop_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field_id UUID NOT NULL REFERENCES fields(id) ON DELETE CASCADE,
    crop_id UUID NOT NULL REFERENCES crops(id) ON DELETE RESTRICT,
    variety_name VARCHAR(100),
    land_area_acres NUMERIC(8, 2) NOT NULL CHECK (land_area_acres > 0),
    sowing_date DATE NOT NULL,
    expected_harvest_date DATE,
    actual_harvest_date DATE,
    plant_count INTEGER CHECK (plant_count >= 0),
    farming_stage VARCHAR(50) DEFAULT 'land_preparation' NOT NULL CHECK (farming_stage IN (
        'land_preparation', 'ploughing', 'seeding', 'vegetative', 
        'flowering', 'fruiting', 'ripening', 'harvesting', 'completed'
    )),
    status VARCHAR(30) DEFAULT 'active' NOT NULL CHECK (status IN ('planned', 'active', 'harvested', 'abandoned')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER trg_crop_registrations_updated_at
BEFORE UPDATE ON crop_registrations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE crop_registrations IS 'Farmer crop planting instances and lifecycle progress';

-- ============================================================================
-- 6. CROP PLANS TABLE
-- High-level checklist plan and progress tracker for a registered crop
-- ============================================================================

CREATE TABLE crop_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_registration_id UUID NOT NULL REFERENCES crop_registrations(id) ON DELETE CASCADE,
    plan_name VARCHAR(150) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    overall_progress_percentage NUMERIC(5, 2) DEFAULT 0.00 CHECK (overall_progress_percentage BETWEEN 0 AND 100),
    status VARCHAR(30) DEFAULT 'in_progress' NOT NULL CHECK (status IN ('draft', 'in_progress', 'completed', 'archived')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER trg_crop_plans_updated_at
BEFORE UPDATE ON crop_plans
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE crop_plans IS 'Master schedule and overall progress tracking for a crop cycle';

-- ============================================================================
-- 7. CROP TASKS TABLE
-- Actionable discrete tasks belonging to a crop management plan
-- ============================================================================

CREATE TABLE crop_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_plan_id UUID NOT NULL REFERENCES crop_plans(id) ON DELETE CASCADE,
    task_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'land_preparation', 'ploughing', 'seeding', 'irrigation', 
        'fertilizer', 'pest_control', 'weed_management', 'harvest', 'other'
    )),
    description TEXT,
    sequence_order INTEGER NOT NULL DEFAULT 1,
    due_date DATE NOT NULL,
    completed_date DATE,
    status VARCHAR(30) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped', 'overdue')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER trg_crop_tasks_updated_at
BEFORE UPDATE ON crop_tasks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE crop_tasks IS 'Granular scheduled tasks (irrigation, fertilizer, weeding, etc.) within a crop plan';

-- ============================================================================
-- 8. DISEASES & PESTS TABLE (Master Knowledge Base)
-- Botanical database of crop diseases, pests, deficiencies, and healthy conditions
-- ============================================================================

CREATE TABLE diseases_pests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    scientific_name VARCHAR(150),
    type VARCHAR(30) NOT NULL CHECK (type IN ('disease', 'pest', 'deficiency', 'healthy', 'weed')),
    target_crop_id UUID REFERENCES crops(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    symptoms TEXT NOT NULL,
    cause TEXT,
    severity_level VARCHAR(20) DEFAULT 'medium' CHECK (severity_level IN ('low', 'medium', 'high', 'critical')),
    reference_image_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER trg_diseases_pests_updated_at
BEFORE UPDATE ON diseases_pests
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE diseases_pests IS 'Master knowledge base of crop diseases, pests, and physiological disorders';

-- ============================================================================
-- 9. CROP IMAGES TABLE
-- Stores uploaded/camera-captured crop image metadata (URIs, not binary blobs)
-- ============================================================================

CREATE TABLE crop_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop_registration_id UUID REFERENCES crop_registrations(id) ON DELETE SET NULL,
    image_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    storage_provider VARCHAR(50) DEFAULT 's3',
    capture_source VARCHAR(30) DEFAULT 'upload' CHECK (capture_source IN ('camera_capture', 'upload', 'drone')),
    file_size_bytes INTEGER,
    mime_type VARCHAR(50),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    captured_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE crop_images IS 'Metadata and remote storage URLs for farmer uploaded/captured crop photos';
COMMENT ON COLUMN crop_images.image_url IS 'External HTTPS URI / storage path to the image file';

-- ============================================================================
-- 10. AI DETECTION RESULTS TABLE
-- Machine learning model inference results for disease & pest detection
-- ============================================================================

CREATE TABLE ai_detection_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_id UUID NOT NULL REFERENCES crop_images(id) ON DELETE CASCADE,
    disease_pest_id UUID REFERENCES diseases_pests(id) ON DELETE SET NULL,
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    confidence_score NUMERIC(5, 4) NOT NULL CHECK (confidence_score BETWEEN 0.0000 AND 1.0000),
    severity_assessed VARCHAR(20) CHECK (severity_assessed IN ('healthy', 'low', 'moderate', 'severe', 'critical')),
    bounding_box_data JSONB, -- Stores coordinates [{x, y, width, height, label}]
    raw_model_output JSONB, -- Stores complete top-k predictions & diagnostic metadata
    status VARCHAR(30) DEFAULT 'completed' NOT NULL CHECK (status IN ('processing', 'completed', 'failed', 'flagged_for_review')),
    detected_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE ai_detection_results IS 'AI/ML vision model detection outputs, scores, and diagnosis links';

-- ============================================================================
-- 11. ADVISORIES & TREATMENTS TABLE
-- Database-backed organic, chemical, and preventive treatment guidelines
-- ============================================================================

CREATE TABLE advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    disease_pest_id UUID NOT NULL REFERENCES diseases_pests(id) ON DELETE CASCADE,
    severity_level VARCHAR(20) NOT NULL CHECK (severity_level IN ('all', 'low', 'moderate', 'severe', 'critical')),
    organic_treatment TEXT,
    chemical_treatment TEXT,
    preventive_measures TEXT NOT NULL,
    recommended_actions TEXT NOT NULL,
    dosage_instructions TEXT,
    safety_guidelines TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER trg_advisories_updated_at
BEFORE UPDATE ON advisories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE advisories IS 'Structured agricultural recommendations and treatments mapped to diseases/pests';

-- ============================================================================
-- 12. WEATHER RECORDS TABLE
-- Historical and forecast weather observations per farm location
-- ============================================================================

CREATE TABLE weather_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL,
    temperature_c NUMERIC(5, 2) NOT NULL,
    feels_like_c NUMERIC(5, 2),
    humidity_percentage NUMERIC(5, 2) NOT NULL CHECK (humidity_percentage BETWEEN 0 AND 100),
    wind_speed_kmh NUMERIC(5, 2),
    wind_direction_deg NUMERIC(5, 2),
    rainfall_mm NUMERIC(6, 2) DEFAULT 0.00,
    weather_condition VARCHAR(50) NOT NULL, -- e.g., 'Sunny', 'Partly Cloudy', 'Heavy Rain', 'Drought Risk'
    uv_index NUMERIC(4, 2),
    source_provider VARCHAR(50), -- e.g., 'OpenWeatherMap', 'IMD', 'LocalSensor'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE weather_records IS 'Weather metrics recorded for farms to assist advisory and alert systems';

-- ============================================================================
-- 13. NOTIFICATIONS TABLE
-- Real-time alerts (weather warnings, task reminders, pest advisories)
-- ============================================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop_registration_id UUID REFERENCES crop_registrations(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'weather_alert', 'irrigation_reminder', 'fertilizer_reminder', 
        'pest_alert', 'crop_task_due', 'general_announcement'
    )),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    read_at TIMESTAMPTZ,
    action_url VARCHAR(500),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE notifications IS 'User notification queue for timely agricultural alerts and reminders';

-- ============================================================================
-- 14. AI CONVERSATIONS TABLE
-- Consultation sessions between farmer and AI Farming Assistant
-- ============================================================================

CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop_registration_id UUID REFERENCES crop_registrations(id) ON DELETE SET NULL,
    title VARCHAR(150) DEFAULT 'New Consultation' NOT NULL,
    session_language VARCHAR(10) DEFAULT 'en' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER trg_ai_conversations_updated_at
BEFORE UPDATE ON ai_conversations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE ai_conversations IS 'Dialogue sessions with the AI farming advisor';

-- ============================================================================
-- 15. AI MESSAGES TABLE
-- Turn-by-turn messages within an AI conversation
-- ============================================================================

CREATE TABLE ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'assistant', 'system')),
    message_content TEXT NOT NULL,
    language_code VARCHAR(10) DEFAULT 'en',
    tokens_used INTEGER,
    metadata JSONB, -- Stores intent, referenced entities, or audio transcription info
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE ai_messages IS 'Message history and context logs for AI assistant sessions';

-- ============================================================================
-- 16. MARKETPLACE STORES TABLE
-- Verified stores, FPOs, and agricultural retail outlets
-- ============================================================================

CREATE TABLE marketplace_stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_name VARCHAR(150) NOT NULL,
    business_type VARCHAR(50), -- e.g., 'Retailer', 'Distributor', 'FPO', 'Cooperative'
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(255),
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER trg_marketplace_stores_updated_at
BEFORE UPDATE ON marketplace_stores
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE marketplace_stores IS 'Stores and sellers supplying certified seeds, fertilizers, and equipment';

-- ============================================================================
-- 17. MARKETPLACE PRODUCTS TABLE
-- Catalog of agricultural items sold by registered stores
-- ============================================================================

CREATE TABLE marketplace_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES marketplace_stores(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'seeds', 'fertilizers', 'bio_pesticides', 'equipment', 
        'tools', 'irrigation_supplies', 'organic_manure', 'other'
    )),
    product_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    unit VARCHAR(30) NOT NULL, -- e.g., 'kg', 'liter', 'packet', 'bag', 'unit'
    stock_quantity INTEGER DEFAULT 0 NOT NULL CHECK (stock_quantity >= 0),
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    product_image_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER trg_marketplace_products_updated_at
BEFORE UPDATE ON marketplace_products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE marketplace_products IS 'Products listed in the marketplace store';

-- ============================================================================
-- 18. SUPPORT TICKETS TABLE
-- Help desk requests submitted by farmers
-- ============================================================================

CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL, -- Agronomist / Support agent
    crop_registration_id UUID REFERENCES crop_registrations(id) ON DELETE SET NULL,
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general' CHECK (category IN (
        'disease_inquiry', 'weather_issue', 'app_technical_support', 
        'market_store', 'crop_advisory', 'general'
    )),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(30) DEFAULT 'open' NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER trg_support_tickets_updated_at
BEFORE UPDATE ON support_tickets
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE support_tickets IS 'Farmer help desk tickets for expert agronomist and technical assistance';

-- ============================================================================
-- 19. SUPPORT TICKET MESSAGES TABLE
-- Threaded conversation and updates on a support ticket
-- ============================================================================

CREATE TABLE support_ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    attachment_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE support_ticket_messages IS 'Threaded discussion logs for help desk support tickets';

-- ============================================================================
-- 20. APP TRANSLATIONS TABLE (Scalable Multilingual Localization)
-- Centralized key-value translation matrix for multilingual support
-- ============================================================================

CREATE TABLE app_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language_code VARCHAR(10) NOT NULL, -- e.g., 'en', 'te', 'hi', 'ta', 'kn', 'mr'
    translation_key VARCHAR(150) NOT NULL, -- e.g., 'crop.tomato', 'advisory.treatment.organic'
    translated_text TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'ui',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_lang_key UNIQUE(language_code, translation_key)
);

CREATE TRIGGER trg_app_translations_updated_at
BEFORE UPDATE ON app_translations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE app_translations IS 'Scalable localization key-value pairs for dynamic multilingual translation';

-- ============================================================================
-- INDEXES FOR COMMONLY QUERIED COLUMNS & HIGH-PERFORMANCE ACCESS
-- ============================================================================

-- Users Indexes
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Farms & Fields Indexes
CREATE INDEX idx_farms_farmer_id ON farms(farmer_id);
CREATE INDEX idx_farms_location ON farms(state, district);
CREATE INDEX idx_fields_farm_id ON fields(farm_id);

-- Crops & Crop Registrations Indexes
CREATE INDEX idx_crops_category ON crops(category);
CREATE INDEX idx_crop_reg_field_id ON crop_registrations(field_id);
CREATE INDEX idx_crop_reg_crop_id ON crop_registrations(crop_id);
CREATE INDEX idx_crop_reg_status ON crop_registrations(status);
CREATE INDEX idx_crop_reg_stage ON crop_registrations(farming_stage);

-- Plans & Tasks Indexes
CREATE INDEX idx_crop_plans_reg_id ON crop_plans(crop_registration_id);
CREATE INDEX idx_crop_tasks_plan_id ON crop_tasks(crop_plan_id);
CREATE INDEX idx_crop_tasks_status ON crop_tasks(status, due_date);
CREATE INDEX idx_crop_tasks_due_date ON crop_tasks(due_date);

-- Diseases & Detection Indexes
CREATE INDEX idx_diseases_type ON diseases_pests(type);
CREATE INDEX idx_diseases_target_crop ON diseases_pests(target_crop_id);
CREATE INDEX idx_crop_images_farmer ON crop_images(farmer_id);
CREATE INDEX idx_crop_images_reg_id ON crop_images(crop_registration_id);
CREATE INDEX idx_crop_images_captured ON crop_images(captured_at DESC);
CREATE INDEX idx_ai_detection_image_id ON ai_detection_results(image_id);
CREATE INDEX idx_ai_detection_disease_id ON ai_detection_results(disease_pest_id);
CREATE INDEX idx_ai_detection_status ON ai_detection_results(status);

-- Advisories Indexes
CREATE INDEX idx_advisories_disease_id ON advisories(disease_pest_id);
CREATE INDEX idx_advisories_severity ON advisories(disease_pest_id, severity_level);

-- Weather Records Indexes
CREATE INDEX idx_weather_farm_date ON weather_records(farm_id, recorded_at DESC);

-- Notifications Indexes
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);

-- AI Assistant Indexes
CREATE INDEX idx_ai_conv_farmer_id ON ai_conversations(farmer_id);
CREATE INDEX idx_ai_messages_conv_id ON ai_messages(conversation_id, created_at ASC);

-- Marketplace Indexes
CREATE INDEX idx_market_stores_owner ON marketplace_stores(owner_id);
CREATE INDEX idx_market_stores_location ON marketplace_stores(state, district);
CREATE INDEX idx_market_products_store ON marketplace_products(store_id);
CREATE INDEX idx_market_products_cat_avail ON marketplace_products(category, is_available);

-- Support Tickets Indexes
CREATE INDEX idx_support_tickets_farmer ON support_tickets(farmer_id, status);
CREATE INDEX idx_support_tickets_assigned ON support_tickets(assigned_to, status);
CREATE INDEX idx_support_ticket_messages_ticket ON support_ticket_messages(ticket_id, created_at ASC);

-- Localization Indexes
CREATE INDEX idx_app_translations_lang ON app_translations(language_code, translation_key);
