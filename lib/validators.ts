import { z } from 'zod';

export const gymSearchSchema = z.object({
  query: z.string().optional(),
  city: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  radiusKm: z.number().default(5),
});

// Step 1: Basic Info Schema
export const step1BasicInfoSchema = z.object({
  name: z.string().min(2, 'Gym name must be at least 2 characters'),
  tagline: z.string().optional(),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  country: z.string().min(1, 'Country is required'),
  address: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  phone: z.string().min(6, 'Valid phone number is required'),
  email: z.string().email('Valid email address is required'),
  website: z.string().url('Must be a valid URL (https://...)').or(z.literal('')).optional(),
  gymType: z.enum(['General', 'CrossFit', 'Powerlifting', 'MMA', 'Yoga', 'Zumba', 'Mixed']),
  genderType: z.enum(['Co-ed', 'Ladies Only', 'Men Only']),
});

// Step 2: Location Schema
export const step2LocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  address: z.string().optional(),
});

// Step 3: Photos Schema
export const step3PhotosSchema = z.object({
  photos: z.array(z.string().url()).min(1, 'At least 1 photo is required').max(5, 'Free tier allows max 5 photos'),
  coverPhotoIndex: z.number().default(0),
});

// Step 4: Membership Plan item
export const membershipPlanSchema = z.object({
  planName: z.string().min(2, 'Plan name is required'),
  durationDays: z.number().min(1),
  price: z.number().min(0, 'Price must be positive'),
  currency: z.string().default('INR'),
  features: z.array(z.string()).min(1, 'Add at least one feature/included benefit'),
  studentDiscount: z.boolean().default(false),
  couplesPlan: z.boolean().default(false),
  personalTrainingAvailable: z.boolean().default(false),
});

// Step 4: Timing Item
export const timingItemSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  dayName: z.string(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  isClosed: z.boolean().default(false),
});

// Step 4: Full Details Schema
export const step4DetailsSchema = z.object({
  plans: z.array(membershipPlanSchema).min(1, 'At least one membership plan is required'),
  is24x7: z.boolean().default(false),
  timings: z.array(timingItemSchema),
  amenities: z.array(z.string()).min(1, 'Select at least one amenity'),
  equipment: z.array(z.string()).optional(),
});

// Step 5: Trainer Item
export const trainerItemSchema = z.object({
  name: z.string().min(2, 'Trainer name is required'),
  photoUrl: z.string().optional(),
  specialization: z.string().min(2, 'Specialization is required'),
  experienceYears: z.number().min(0),
  bio: z.string().optional(),
});

// Step 5: Trainers Schema
export const step5TrainersSchema = z.object({
  trainers: z.array(trainerItemSchema).optional(),
});

// Master Full Listing Schema
export const fullListingSchema = z.object({
  basicInfo: step1BasicInfoSchema,
  location: step2LocationSchema,
  photos: step3PhotosSchema,
  details: step4DetailsSchema,
  trainers: step5TrainersSchema,
});

export type Step1BasicInfo = z.infer<typeof step1BasicInfoSchema>;
export type Step2Location = z.infer<typeof step2LocationSchema>;
export type Step3Photos = z.infer<typeof step3PhotosSchema>;
export type MembershipPlan = z.infer<typeof membershipPlanSchema>;
export type TimingItem = z.infer<typeof timingItemSchema>;
export type Step4Details = z.infer<typeof step4DetailsSchema>;
export type TrainerItem = z.infer<typeof trainerItemSchema>;
export type Step5Trainers = z.infer<typeof step5TrainersSchema>;
export type FullListing = z.infer<typeof fullListingSchema>;
