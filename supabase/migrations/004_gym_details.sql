-- Migration: 004_gym_details.sql
-- Creates GYM_PHOTOS, GYM_TIMINGS, GYM_AMENITIES, GYM_EQUIPMENT tables

-- GYM_PHOTOS
CREATE TABLE IF NOT EXISTS public.gym_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_video BOOLEAN NOT NULL DEFAULT FALSE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GYM_TIMINGS
CREATE TABLE IF NOT EXISTS public.gym_timings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 1=Mon, ..., 6=Sat
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN NOT NULL DEFAULT FALSE,
  is_24x7 BOOLEAN NOT NULL DEFAULT FALSE
);

-- GYM_AMENITIES
CREATE TABLE IF NOT EXISTS public.gym_amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
  amenity_name TEXT NOT NULL
);

-- GYM_EQUIPMENT
CREATE TABLE IF NOT EXISTS public.gym_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
  equipment_name TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE public.gym_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_timings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_equipment ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read gym photos" ON public.gym_photos FOR SELECT USING (true);
CREATE POLICY "Public read gym timings" ON public.gym_timings FOR SELECT USING (true);
CREATE POLICY "Public read gym amenities" ON public.gym_amenities FOR SELECT USING (true);
CREATE POLICY "Public read gym equipment" ON public.gym_equipment FOR SELECT USING (true);

-- Owner write policies
CREATE POLICY "Owner write gym photos" ON public.gym_photos FOR ALL
  USING (EXISTS (SELECT 1 FROM public.gyms WHERE id = gym_id AND owner_id = auth.uid()));

CREATE POLICY "Owner write gym timings" ON public.gym_timings FOR ALL
  USING (EXISTS (SELECT 1 FROM public.gyms WHERE id = gym_id AND owner_id = auth.uid()));

CREATE POLICY "Owner write gym amenities" ON public.gym_amenities FOR ALL
  USING (EXISTS (SELECT 1 FROM public.gyms WHERE id = gym_id AND owner_id = auth.uid()));

CREATE POLICY "Owner write gym equipment" ON public.gym_equipment FOR ALL
  USING (EXISTS (SELECT 1 FROM public.gyms WHERE id = gym_id AND owner_id = auth.uid()));
