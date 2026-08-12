-- Migration: 003_gyms.sql
-- Enables PostGIS and creates GYMS table + PostGIS proximity search function

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS public.gyms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.gym_owners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  gym_type TEXT NOT NULL DEFAULT 'General', -- General, CrossFit, Powerlifting, MMA, Yoga, Zumba, Mixed
  gender_type TEXT NOT NULL DEFAULT 'Co-ed', -- Co-ed, Ladies Only, Men Only
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  total_rating NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
  rating_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, active, rejected
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for PostGIS spatial queries
CREATE INDEX IF NOT EXISTS idx_gyms_location ON public.gyms USING GIST (location);

-- Automatically set geography location from lat & lng on INSERT or UPDATE
CREATE OR REPLACE FUNCTION update_gym_location()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_gym_location
  BEFORE INSERT OR UPDATE OF lat, lng ON public.gyms
  FOR EACH ROW EXECUTE FUNCTION update_gym_location();

-- Supabase Geo Search Function: gyms_within_radius
CREATE OR REPLACE FUNCTION gyms_within_radius(
  user_lat FLOAT,
  user_lng FLOAT,
  radius_km FLOAT
)
RETURNS TABLE (
  id UUID,
  owner_id UUID,
  name TEXT,
  description TEXT,
  address TEXT,
  country TEXT,
  lat FLOAT,
  lng FLOAT,
  phone TEXT,
  email TEXT,
  gym_type TEXT,
  gender_type TEXT,
  is_verified BOOLEAN,
  is_featured BOOLEAN,
  total_rating NUMERIC,
  rating_count INTEGER,
  status TEXT,
  created_at TIMESTAMPTZ,
  distance_km FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    g.id,
    g.owner_id,
    g.name,
    g.description,
    g.address,
    g.country,
    g.lat,
    g.lng,
    g.phone,
    g.email,
    g.gym_type,
    g.gender_type,
    g.is_verified,
    g.is_featured,
    g.total_rating,
    g.rating_count,
    g.status,
    g.created_at,
    (ST_Distance(g.location, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography) / 1000.0)::FLOAT AS distance_km
  FROM public.gyms g
  WHERE ST_DWithin(g.location, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography, radius_km * 1000)
    AND g.status = 'active'
  ORDER BY distance_km ASC;
END;
$$;

-- Enable Row Level Security
ALTER TABLE public.gyms ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active gyms"
  ON public.gyms FOR SELECT
  USING (status = 'active' OR auth.uid() = owner_id);

CREATE POLICY "Owners can create listings"
  ON public.gyms FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own listings"
  ON public.gyms FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own listings"
  ON public.gyms FOR DELETE
  USING (auth.uid() = owner_id);
