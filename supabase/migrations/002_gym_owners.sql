-- Migration: 002_gym_owners.sql
-- Creates GYM_OWNERS table for gym management accounts

CREATE TABLE IF NOT EXISTS public.gym_owners (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  plan_type TEXT NOT NULL DEFAULT 'free', -- 'free' | 'premium'
  country TEXT NOT NULL DEFAULT 'India',
  currency TEXT NOT NULL DEFAULT 'INR',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.gym_owners ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Gym owners can view their own profile"
  ON public.gym_owners FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Gym owners can update their own profile"
  ON public.gym_owners FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Gym owners can insert their profile on signup"
  ON public.gym_owners FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public can view basic owner info"
  ON public.gym_owners FOR SELECT
  USING (true);
