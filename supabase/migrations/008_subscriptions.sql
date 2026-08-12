-- Migration: 008_subscriptions.sql
-- Creates OWNER_SUBSCRIPTIONS and VERIFICATIONS tables

-- OWNER_SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.owner_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.gym_owners(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL DEFAULT 'premium', -- 'premium', 'boost'
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,
  payment_id TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'active', -- active, expired, cancelled
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- VERIFICATIONS
CREATE TABLE IF NOT EXISTS public.verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.gym_owners(id) ON DELETE CASCADE,
  gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
  document_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.owner_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

-- Owner read policies
CREATE POLICY "Owners view own subscriptions" ON public.owner_subscriptions FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owners view own verifications" ON public.verifications FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owners submit verifications" ON public.verifications FOR INSERT WITH CHECK (auth.uid() = owner_id);
