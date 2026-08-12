-- Migration: 006_interactions.sql
-- Creates REVIEWS, SAVED_GYMS, and TRIAL_REQUESTS tables

-- REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  cleanliness_rating INTEGER CHECK (cleanliness_rating BETWEEN 1 AND 5),
  equipment_rating INTEGER CHECK (equipment_rating BETWEEN 1 AND 5),
  staff_rating INTEGER CHECK (staff_rating BETWEEN 1 AND 5),
  value_rating INTEGER CHECK (value_rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SAVED_GYMS
CREATE TABLE IF NOT EXISTS public.saved_gyms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, gym_id)
);

-- TRIAL_REQUESTS
CREATE TABLE IF NOT EXISTS public.trial_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
  preferred_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, declined, completed
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_requests ENABLE ROW LEVEL SECURITY;

-- Public read reviews
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);

-- User manage reviews
CREATE POLICY "Users insert own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User manage saved gyms
CREATE POLICY "Users manage saved gyms" ON public.saved_gyms FOR ALL USING (auth.uid() = user_id);

-- User & Owner manage trial requests
CREATE POLICY "Users view own trial requests" ON public.trial_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create trial requests" ON public.trial_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners view trial requests for their gyms" ON public.trial_requests FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.gyms WHERE id = gym_id AND owner_id = auth.uid()));

CREATE POLICY "Owners update trial requests status" ON public.trial_requests FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.gyms WHERE id = gym_id AND owner_id = auth.uid()));
