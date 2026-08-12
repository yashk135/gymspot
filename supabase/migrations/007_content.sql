-- Migration: 007_content.sql
-- Creates ANNOUNCEMENTS and GYM_DEALS tables

-- ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GYM_DEALS
CREATE TABLE IF NOT EXISTS public.gym_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  discount_percent INTEGER NOT NULL CHECK (discount_percent BETWEEN 1 AND 100),
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_deals ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read announcements" ON public.announcements FOR SELECT
  USING (expires_at IS NULL OR expires_at > NOW());

CREATE POLICY "Public read active deals" ON public.gym_deals FOR SELECT
  USING (is_active = true AND expires_at > NOW());

-- Owner write policies
CREATE POLICY "Owners manage announcements" ON public.announcements FOR ALL
  USING (EXISTS (SELECT 1 FROM public.gyms WHERE id = gym_id AND owner_id = auth.uid()));

CREATE POLICY "Owners manage deals" ON public.gym_deals FOR ALL
  USING (EXISTS (SELECT 1 FROM public.gyms WHERE id = gym_id AND owner_id = auth.uid()));
