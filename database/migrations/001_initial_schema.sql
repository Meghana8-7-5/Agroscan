-- ============================================================================
-- Migration: 001_initial_schema.sql
-- Description: Create initial tables, relationships, constraints, and indexes
-- Author: AgroScan Database Team
-- Date: 2026-08-28
-- ============================================================================

BEGIN;

-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Trigger function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    preferred_language VARCHAR(10) DEFAULT 'en' NOT NULL,
    terms_accepted BOOLEAN DEFAULT FALSE NOT NULL,
    terms_accepted_at TIMESTAMPTZ,
    role VARCHAR(20) DEFAULT 'farmer' NOT NULL CHECK (role IN ('farmer', 'agronomist', 'seller', 'admin', 'support')),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. FARMS TABLE
CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farm_name VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    sub_district VARCHAR(100),
    village_city VARCHAR(100) NOT NULL,
    pincode VARCHAR(10),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    total_area_acres NUMERIC(8, 2) CHECK (total_area_acres > 0),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

DROP TRIGGER IF EXISTS trg_farms_updated_at ON farms;
CREATE TRIGGER trg_farms_updated_at
BEFORE UPDATE ON farms
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. FIELDS TABLE
CREATE TABLE IF NOT EXISTS fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    area_acres NUMERIC(8, 2) NOT NULL CHECK (area_acres > 0),
    soil_type VARCHAR(50),
    irrigation_source VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

DROP TRIGGER IF EXISTS trg_fields_updated_at ON fields;
CREATE TRIGGER trg_fields_updated_at
BEFORE UPDATE ON fields
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. CROPS TABLE
CREATE TABLE IF NOT EXISTS crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    botanical_name VARCHAR(150),
    category VARCHAR(50) NOT NULL,
    season VARCHAR(30),
    optimal_temp_min_c NUMERIC(4, 1),
    optimal_temp_max_c NUMERIC(4, 1),
    crop_image_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. CROP REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS crop_registrations (
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

DROP TRIGGER IF EXISTS trg_crop_registrations_updated_at ON crop_registrations;
CREATE TRIGGER trg_crop_registrations_updated_at
BEFORE UPDATE ON crop_registrations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. CROP PLANS TABLE
CREATE TABLE IF NOT EXISTS crop_plans (
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

DROP TRIGGER IF EXISTS trg_crop_plans_updated_at ON crop_plans;
CREATE TRIGGER trg_crop_plans_updated_at
BEFORE UPDATE ON crop_plans
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. CROP TASKS TABLE
CREATE TABLE IF NOT EXISTS crop_tasks (
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

DROP TRIGGER IF EXISTS trg_crop_tasks_updated_at ON crop_tasks;
CREATE TRIGGER trg_crop_tasks_updated_at
BEFORE UPDATE ON crop_tasks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. DISEASES & PESTS TABLE
CREATE TABLE IF NOT EXISTS diseases_pests (
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

DROP TRIGGER IF EXISTS trg_diseases_pests_updated_at ON diseases_pests;
CREATE TRIGGER trg_diseases_pests_updated_at
BEFORE UPDATE ON diseases_pests
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. CROP IMAGES TABLE
CREATE TABLE IF NOT EXISTS crop_images (
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

-- 10. AI DETECTION RESULTS TABLE
CREATE TABLE IF NOT EXISTS ai_detection_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_id UUID NOT NULL REFERENCES crop_images(id) ON DELETE CASCADE,
    disease_pest_id UUID REFERENCES diseases_pests(id) ON DELETE SET NULL,
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    confidence_score NUMERIC(5, 4) NOT NULL CHECK (confidence_score BETWEEN 0.0000 AND 1.0000),
    severity_assessed VARCHAR(20) CHECK (severity_assessed IN ('healthy', 'low', 'moderate', 'severe', 'critical')),
    bounding_box_data JSONB,
    raw_model_output JSONB,
    status VARCHAR(30) DEFAULT 'completed' NOT NULL CHECK (status IN ('processing', 'completed', 'failed', 'flagged_for_review')),
    detected_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 11. ADVISORIES TABLE
CREATE TABLE IF NOT EXISTS advisories (
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

DROP TRIGGER IF EXISTS trg_advisories_updated_at ON advisories;
CREATE TRIGGER trg_advisories_updated_at
BEFORE UPDATE ON advisories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 12. WEATHER RECORDS TABLE
CREATE TABLE IF NOT EXISTS weather_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL,
    temperature_c NUMERIC(5, 2) NOT NULL,
    feels_like_c NUMERIC(5, 2),
    humidity_percentage NUMERIC(5, 2) NOT NULL CHECK (humidity_percentage BETWEEN 0 AND 100),
    wind_speed_kmh NUMERIC(5, 2),
    wind_direction_deg NUMERIC(5, 2),
    rainfall_mm NUMERIC(6, 2) DEFAULT 0.00,
    weather_condition VARCHAR(50) NOT NULL,
    uv_index NUMERIC(4, 2),
    source_provider VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 13. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
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

-- 14. AI CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop_registration_id UUID REFERENCES crop_registrations(id) ON DELETE SET NULL,
    title VARCHAR(150) DEFAULT 'New Consultation' NOT NULL,
    session_language VARCHAR(10) DEFAULT 'en' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

DROP TRIGGER IF EXISTS trg_ai_conversations_updated_at ON ai_conversations;
CREATE TRIGGER trg_ai_conversations_updated_at
BEFORE UPDATE ON ai_conversations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 15. AI MESSAGES TABLE
CREATE TABLE IF NOT EXISTS ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'assistant', 'system')),
    message_content TEXT NOT NULL,
    language_code VARCHAR(10) DEFAULT 'en',
    tokens_used INTEGER,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 16. MARKETPLACE STORES TABLE
CREATE TABLE IF NOT EXISTS marketplace_stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_name VARCHAR(150) NOT NULL,
    business_type VARCHAR(50),
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(255),
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

DROP TRIGGER IF EXISTS trg_marketplace_stores_updated_at ON marketplace_stores;
CREATE TRIGGER trg_marketplace_stores_updated_at
BEFORE UPDATE ON marketplace_stores
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 17. MARKETPLACE PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS marketplace_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES marketplace_stores(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'seeds', 'fertilizers', 'bio_pesticides', 'equipment', 
        'tools', 'irrigation_supplies', 'organic_manure', 'other'
    )),
    product_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    unit VARCHAR(30) NOT NULL,
    stock_quantity INTEGER DEFAULT 0 NOT NULL CHECK (stock_quantity >= 0),
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    product_image_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

DROP TRIGGER IF EXISTS trg_marketplace_products_updated_at ON marketplace_products;
CREATE TRIGGER trg_marketplace_products_updated_at
BEFORE UPDATE ON marketplace_products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 18. SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
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

DROP TRIGGER IF EXISTS trg_support_tickets_updated_at ON support_tickets;
CREATE TRIGGER trg_support_tickets_updated_at
BEFORE UPDATE ON support_tickets
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 19. SUPPORT TICKET MESSAGES TABLE
CREATE TABLE IF NOT EXISTS support_ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    attachment_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 20. APP TRANSLATIONS TABLE
CREATE TABLE IF NOT EXISTS app_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language_code VARCHAR(10) NOT NULL,
    translation_key VARCHAR(150) NOT NULL,
    translated_text TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'ui',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_lang_key UNIQUE(language_code, translation_key)
);

DROP TRIGGER IF EXISTS trg_app_translations_updated_at ON app_translations;
CREATE TRIGGER trg_app_translations_updated_at
BEFORE UPDATE ON app_translations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_farms_farmer_id ON farms(farmer_id);
CREATE INDEX IF NOT EXISTS idx_farms_location ON farms(state, district);
CREATE INDEX IF NOT EXISTS idx_fields_farm_id ON fields(farm_id);
CREATE INDEX IF NOT EXISTS idx_crops_category ON crops(category);
CREATE INDEX IF NOT EXISTS idx_crop_reg_field_id ON crop_registrations(field_id);
CREATE INDEX IF NOT EXISTS idx_crop_reg_crop_id ON crop_registrations(crop_id);
CREATE INDEX IF NOT EXISTS idx_crop_reg_status ON crop_registrations(status);
CREATE INDEX IF NOT EXISTS idx_crop_reg_stage ON crop_registrations(farming_stage);
CREATE INDEX IF NOT EXISTS idx_crop_plans_reg_id ON crop_plans(crop_registration_id);
CREATE INDEX IF NOT EXISTS idx_crop_tasks_plan_id ON crop_tasks(crop_plan_id);
CREATE INDEX IF NOT EXISTS idx_crop_tasks_status ON crop_tasks(status, due_date);
CREATE INDEX IF NOT EXISTS idx_crop_tasks_due_date ON crop_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_diseases_type ON diseases_pests(type);
CREATE INDEX IF NOT EXISTS idx_diseases_target_crop ON diseases_pests(target_crop_id);
CREATE INDEX IF NOT EXISTS idx_crop_images_farmer ON crop_images(farmer_id);
CREATE INDEX IF NOT EXISTS idx_crop_images_reg_id ON crop_images(crop_registration_id);
CREATE INDEX IF NOT EXISTS idx_crop_images_captured ON crop_images(captured_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_detection_image_id ON ai_detection_results(image_id);
CREATE INDEX IF NOT EXISTS idx_ai_detection_disease_id ON ai_detection_results(disease_pest_id);
CREATE INDEX IF NOT EXISTS idx_ai_detection_status ON ai_detection_results(status);
CREATE INDEX IF NOT EXISTS idx_advisories_disease_id ON advisories(disease_pest_id);
CREATE INDEX IF NOT EXISTS idx_advisories_severity ON advisories(disease_pest_id, severity_level);
CREATE INDEX IF NOT EXISTS idx_weather_farm_date ON weather_records(farm_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_ai_conv_farmer_id ON ai_conversations(farmer_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conv_id ON ai_messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_market_stores_owner ON marketplace_stores(owner_id);
CREATE INDEX IF NOT EXISTS idx_market_stores_location ON marketplace_stores(state, district);
CREATE INDEX IF NOT EXISTS idx_market_products_store ON marketplace_products(store_id);
CREATE INDEX IF NOT EXISTS idx_market_products_cat_avail ON marketplace_products(category, is_available);
CREATE INDEX IF NOT EXISTS idx_support_tickets_farmer ON support_tickets(farmer_id, status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned ON support_tickets(assigned_to, status);
CREATE INDEX IF NOT EXISTS idx_support_ticket_messages_ticket ON support_ticket_messages(ticket_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_app_translations_lang ON app_translations(language_code, translation_key);

COMMIT;
