-- VLOCKSTER Database Schema
-- Version: 1.0.0
-- Description: Schema base para VLOCKSTER - Plataforma de streaming + crowdfunding + comunidad

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create schema for better organization
CREATE SCHEMA IF NOT EXISTS vlockster;

-- Set search path
SET search_path TO vlockster, public;

-- Comments
COMMENT ON SCHEMA vlockster IS 'Schema principal de VLOCKSTER - Netflix + Kickstarter + Skool para cine indie';
