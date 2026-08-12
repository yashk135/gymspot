export type UserRole = 'user' | 'owner' | 'admin';

export type PlanType = 'free' | 'premium';

export type GymType = 'General' | 'CrossFit' | 'Powerlifting' | 'MMA' | 'Yoga' | 'Zumba' | 'Mixed';

export type GenderPolicy = 'Co-ed' | 'Ladies Only' | 'Men Only';

export type TrialStatus = 'pending' | 'accepted' | 'declined' | 'completed';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profile_pic?: string;
  city?: string;
  lat?: number;
  lng?: number;
  created_at: string;
}

export interface GymOwner {
  id: string;
  name: string;
  email: string;
  phone?: string;
  is_verified: boolean;
  plan_type: PlanType;
  country: string;
  currency: string;
  created_at: string;
}

export interface Gym {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  address: string;
  country: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  gym_type: GymType;
  gender_type: GenderPolicy;
  is_verified: boolean;
  is_featured: boolean;
  total_rating: number;
  rating_count: number;
  status: 'pending' | 'active' | 'rejected';
  created_at: string;
}
