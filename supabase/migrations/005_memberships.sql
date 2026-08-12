-- Migration: 005_memberships.sql
-- Creates MEMBERSHIP_PLANS and TRAINERS tables

-- MEMBERSHIP_PLANS
CREATE TABLE IF NOT EXISTS public.membership_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 30,
  price NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  features TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TRAINERS
CREATE TABLE IF NOT EXISTS public.trainers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  photo_url TEXT,
  specialization TEXT NOT NULL,
  experience_years INTEGER NOT NULL DEFAULT 1,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read membership plans" ON public.membership_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Public read trainers" ON public.trainers FOR SELECT USING (true);

-- Owner write policies
CREATE POLICY "Owner manage membership plans" ON public.membership_plans FOR ALL
  USING (EXISTS (SELECT 1 FROM public.gyms WHERE id = gym_id AND owner_id = auth.uid()));

CREATE POLICY "Owner manage trainers" ON public.trainers FOR ALL
  USING (EXISTS (SELECT 1 FROM public.gyms WHERE id = gym_id AND owner_id = auth.uid()));
