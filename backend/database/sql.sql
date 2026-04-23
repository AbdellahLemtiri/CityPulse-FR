-- ==============================================================================
-- PROJET: SafiPulse / CityPulse - SQL Schema
-- ==============================================================================

-- 1. CITIES (Table indépendante)
CREATE TABLE cities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

-- 2. SECTORS (Dépend de cities)
CREATE TABLE sectors (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NULL,
    status BOOLEAN DEFAULT TRUE NOT NULL,
    boundaries JSON NULL,
    city_id BIGINT NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT fk_sectors_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
);

-- 3. USERS (Dépend de sectors et cities)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255) NOT NULL,
    cin VARCHAR(255) NOT NULL UNIQUE,
    adresse TEXT NULL,
    password VARCHAR(255) NOT NULL,
    preferences JSON NULL,
    xp_points INT DEFAULT 0 NOT NULL,
    is_banned BOOLEAN DEFAULT FALSE NOT NULL,
    sector_id BIGINT NOT NULL,
    email_verified_at TIMESTAMP NULL,
    city_id BIGINT NOT NULL,
    city_changed_at TIMESTAMP NULL,
    password_changed_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    CONSTRAINT fk_users_sector FOREIGN KEY (sector_id) REFERENCES sectors(id) ON DELETE CASCADE,
    CONSTRAINT fk_users_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
);

-- 4. PASSWORD_RESET_TOKENS (Indépendante)
CREATE TABLE password_reset_tokens (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL
);

-- 5. SESSIONS (Dépend de users)
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload TEXT NOT NULL,
    last_activity INT NOT NULL,
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX sessions_user_id_index ON sessions (user_id);
CREATE INDEX sessions_last_activity_index ON sessions (last_activity);

-- 6. PARTNERS (Dépend de cities)
CREATE TABLE partners (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_fix VARCHAR(255) NULL,
    whatsapp VARCHAR(255) NULL,
    sla_hours INT DEFAULT 48 NOT NULL,
    city_id BIGINT NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT fk_partners_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
);

-- 7. CATEGORY_INCIDENTS (Dépend de partners)
CREATE TABLE category_incidents (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NULL,
    partner_id BIGINT NULL,
    icon VARCHAR(255) NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    sla_hours INT DEFAULT 24 NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT fk_category_incidents_partner FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE SET NULL
);

-- 8. CATEGORY_PARTNER (Table pivot)
CREATE TABLE category_partner (
    id BIGSERIAL PRIMARY KEY,
    category_incident_id BIGINT NOT NULL,
    partner_id BIGINT NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT fk_pivot_category FOREIGN KEY (category_incident_id) REFERENCES category_incidents(id) ON DELETE CASCADE,
    CONSTRAINT fk_pivot_partner FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE
);

-- 9. INCIDENTS (Dépend de users, sectors, category_incidents, partners)
CREATE TABLE incidents (
    id BIGSERIAL PRIMARY KEY,
    ref_num VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'validated', 'rejected', 'in_progress', 'resolved')),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address VARCHAR(255) NULL,
    rejection_reason TEXT NULL,
    resolved_at TIMESTAMP NULL,
    user_id BIGINT NOT NULL,
    sector_id BIGINT NOT NULL,
    category_id BIGINT NULL,
    partner_id BIGINT NULL,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT fk_incidents_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_incidents_sector FOREIGN KEY (sector_id) REFERENCES sectors(id) ON DELETE CASCADE,
    CONSTRAINT fk_incidents_category FOREIGN KEY (category_id) REFERENCES category_incidents(id) ON DELETE SET NULL,
    CONSTRAINT fk_incidents_partner FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE SET NULL
);

-- 10. MEDIA (Table Polymorphique)
CREATE TABLE media (
    id BIGSERIAL PRIMARY KEY,
    model_type VARCHAR(255) NOT NULL,
    model_id BIGINT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(255) NULL,
    is_public BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
CREATE INDEX media_model_type_model_id_index ON media (model_type, model_id);

-- 11. COMMENTS (Table Polymorphique + Auto-référencée)
CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    commentable_type VARCHAR(255) NOT NULL,
    commentable_id BIGINT NOT NULL,
    body TEXT NOT NULL,
    parent_id BIGINT NULL,
    is_flagged BOOLEAN DEFAULT FALSE NOT NULL,
    user_id BIGINT NOT NULL,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT fk_comments_parent FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX comments_commentable_type_commentable_id_index ON comments (commentable_type, commentable_id);

-- 12. LIKES (Table Polymorphique)
CREATE TABLE likes (
    id BIGSERIAL PRIMARY KEY,
    likeable_type VARCHAR(255) NOT NULL,
    likeable_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT fk_likes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX likes_likeable_type_likeable_id_index ON likes (likeable_type, likeable_id);

-- 13. STRIKES (Dépend de users)
CREATE TABLE strikes (
    id BIGSERIAL PRIMARY KEY,
    reason TEXT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT fk_strikes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 14. ARTICLES (Dépend de users, cities, sectors)
CREATE TABLE articles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    scope VARCHAR(50) NOT NULL CHECK (scope IN ('global', 'local')),
    sector_id BIGINT NULL,
    city_id BIGINT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('draft', 'published')),
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT fk_articles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_articles_sector FOREIGN KEY (sector_id) REFERENCES sectors(id) ON DELETE CASCADE,
    CONSTRAINT fk_articles_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
);

-- 15. NOTIFICATIONS (Table Polymorphique avec UUID)
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    notifiable_type VARCHAR(255) NOT NULL,
    notifiable_id BIGINT NOT NULL,
    data TEXT NOT NULL,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
CREATE INDEX notifications_notifiable_type_notifiable_id_index ON notifications (notifiable_type, notifiable_id);

 CREATE TABLE duty_pharmacies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(255) NOT NULL,
    location_url VARCHAR(255) NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    city_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT fk_pharmacies_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
    CONSTRAINT fk_pharmacies_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);