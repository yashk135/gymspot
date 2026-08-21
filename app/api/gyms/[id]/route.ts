import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Fallback seed detail data for all 12 flagship gyms
const SEED_DETAILS: Record<string, any> = {
  // 1. Golds Gym Andheri West
  'g1111111-1111-1111-1111-111111111111': {
    id: 'g1111111-1111-1111-1111-111111111111',
    name: 'Golds Gym — Andheri West',
    tagline: 'Mumbai flagship fitness centre & strength hub',
    description:
      'Gold\'s Gym Andheri West is a world-class 15,000 sq.ft. fitness sanctuary featuring authentic Hammer Strength equipment, Olympic lifting platforms, a dedicated turf functional area, luxury steam & sauna rooms, and certified international personal trainers.',
    address: 'Veera Desai Road, Near Fun Republic, Andheri West, Mumbai, Maharashtra 400053',
    country: 'India',
    lat: 19.1363,
    lng: 72.8277,
    phone: '+912226730001',
    email: 'andheri@goldsgym.in',
    gym_type: 'General',
    gender_type: 'Co-ed',
    is_verified: true,
    is_featured: true,
    total_rating: 4.8,
    rating_count: 142,
    starting_price: 3500,
    currency: 'INR',
    cover_photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
    ],
    plans: [
      {
        id: 'p1',
        plan_name: 'Monthly General Pass',
        duration_days: 30,
        price: 3500,
        currency: 'INR',
        features: ['Gym Floor Access', 'Locker Room', 'Steam Room', 'Free Workout Consultation'],
        is_best_value: false,
      },
      {
        id: 'p2',
        plan_name: 'Annual VIP All-Access',
        duration_days: 365,
        price: 28000,
        currency: 'INR',
        features: [
          '24/7 Access',
          'Free Personal Trainer Session',
          'Nutritional Counseling',
          'Steam & Sauna Access',
          'Complimentary Guest Passes (2/mo)',
        ],
        is_best_value: true,
      },
    ],
    timings: [
      { day_of_week: 1, dayName: 'Monday', open_time: '06:00', close_time: '23:00', is_closed: false },
      { day_of_week: 2, dayName: 'Tuesday', open_time: '06:00', close_time: '23:00', is_closed: false },
      { day_of_week: 3, dayName: 'Wednesday', open_time: '06:00', close_time: '23:00', is_closed: false },
      { day_of_week: 4, dayName: 'Thursday', open_time: '06:00', close_time: '23:00', is_closed: false },
      { day_of_week: 5, dayName: 'Friday', open_time: '06:00', close_time: '23:00', is_closed: false },
      { day_of_week: 6, dayName: 'Saturday', open_time: '06:00', close_time: '22:00', is_closed: false },
      { day_of_week: 0, dayName: 'Sunday', open_time: '08:00', close_time: '20:00', is_closed: false },
    ],
    amenities: ['AC', 'Steam Room', 'Sauna', 'Parking', 'Shower', 'Locker Room', 'WiFi', 'Personal Training'],
    equipment: ['Hammer Strength Racks', 'Olympic Barbell & Bumper Plates', 'LifeFitness Treadmills', 'Dumbbells (up to 60kg)'],
    trainers: [
      {
        id: 't1',
        name: 'Vikram Singh',
        photo_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
        specialization: 'Bodybuilding & Hypertrophy',
        experience_years: 8,
        bio: 'Certified ACE personal trainer specializing in competition prep, posture correction, and heavy strength building.',
      },
    ],
    deals: [
      {
        id: 'deal1',
        title: 'Flat 30% OFF Annual VIP Pass',
        description: 'Exclusive time-limited deal on annual memberships booked through GymSpot.',
        discount_percent: 30,
        expires_at: new Date(Date.now() + 86400000 * 3).toISOString(),
      },
    ],
    reviews: [
      {
        id: 'r1',
        user_name: 'Karan Malhotra',
        rating: 5,
        comment: 'Best gym in Andheri West! Equipment is always clean and well maintained. Vikram sir is an incredible coach.',
      },
    ],
  },

  // 2. Cult Fit Bandra West
  'g2222222-2222-2222-2222-222222222222': {
    id: 'g2222222-2222-2222-2222-222222222222',
    name: 'Cult Fit — Bandra West',
    tagline: 'High energy group workouts & athlete conditioning',
    description:
      'Cult Fit Bandra West offers trainer-led group classes including Boxing, HRX, Dance Fitness, Yoga, and Strength Conditioning in a state-of-the-art acoustic facility.',
    address: 'Hill Road, Opp. St. Stanislaus High School, Bandra West, Mumbai, Maharashtra 400050',
    country: 'India',
    lat: 19.0596,
    lng: 72.8295,
    phone: '+912226400002',
    email: 'bandra@cultfit.in',
    gym_type: 'CrossFit',
    gender_type: 'Co-ed',
    is_verified: true,
    is_featured: true,
    total_rating: 4.9,
    rating_count: 210,
    starting_price: 3333,
    currency: 'INR',
    cover_photo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    ],
    plans: [
      {
        id: 'p201',
        plan_name: 'Cult Pass Elite (3 Months)',
        duration_days: 90,
        price: 9999,
        currency: 'INR',
        features: ['Unlimited Group Workouts', 'Free At-Home Workout App', 'Free Gym Transfers'],
        is_best_value: true,
      },
    ],
    timings: [
      { day_of_week: 1, dayName: 'Monday', open_time: '06:00', close_time: '22:00', is_closed: false },
      { day_of_week: 2, dayName: 'Tuesday', open_time: '06:00', close_time: '22:00', is_closed: false },
      { day_of_week: 3, dayName: 'Wednesday', open_time: '06:00', close_time: '22:00', is_closed: false },
      { day_of_week: 4, dayName: 'Thursday', open_time: '06:00', close_time: '22:00', is_closed: false },
      { day_of_week: 5, dayName: 'Friday', open_time: '06:00', close_time: '22:00', is_closed: false },
      { day_of_week: 6, dayName: 'Saturday', open_time: '07:00', close_time: '21:00', is_closed: false },
      { day_of_week: 0, dayName: 'Sunday', open_time: '07:00', close_time: '20:00', is_closed: false },
    ],
    amenities: ['AC', 'Group Classes', 'WiFi', 'Shower', 'Locker Room'],
    equipment: ['Kettlebells', 'Plyo Boxes', 'Medicine Balls', 'Boxing Bags'],
    trainers: [
      {
        id: 't201',
        name: 'Ananya Roy',
        photo_url: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=400&q=80',
        specialization: 'CrossFit & HRX Workout',
        experience_years: 5,
        bio: 'National athlete coaching high-intensity group classes and endurance training.',
      },
    ],
    deals: [],
    reviews: [
      {
        id: 'r201',
        user_name: 'Aakash Verma',
        rating: 5,
        comment: 'High energy atmosphere and brilliant trainers!',
      },
    ],
  },

  // 3. Powerhouse Gym Powai
  'g3333333-3333-3333-3333-333333333333': {
    id: 'g3333333-3333-3333-3333-333333333333',
    name: 'Powerhouse Gym — Powai',
    tagline: 'Hardcore strength & heavy lifting arena',
    description:
      'Powerhouse Gym Powai is a dedicated bodybuilding sanctuary featuring heavy dumbbells up to 70kg, deadlift platforms, squat racks, and zero fluff.',
    address: 'Central Avenue, Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076',
    country: 'India',
    lat: 19.1176,
    lng: 72.906,
    phone: '+912225700003',
    email: 'powai@powerhouse.in',
    gym_type: 'Powerlifting',
    gender_type: 'Co-ed',
    is_verified: false,
    is_featured: false,
    total_rating: 4.5,
    rating_count: 64,
    starting_price: 2000,
    currency: 'INR',
    cover_photo: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    ],
    plans: [
      {
        id: 'p301',
        plan_name: 'Monthly Power Pass',
        duration_days: 30,
        price: 2000,
        currency: 'INR',
        features: ['Heavy Weight Floor', 'Chalk Allowed', 'Locker Room Access'],
        is_best_value: true,
      },
    ],
    timings: [
      { day_of_week: 1, dayName: 'Monday', open_time: '05:30', close_time: '23:00', is_closed: false },
      { day_of_week: 2, dayName: 'Tuesday', open_time: '05:30', close_time: '23:00', is_closed: false },
      { day_of_week: 3, dayName: 'Wednesday', open_time: '05:30', close_time: '23:00', is_closed: false },
      { day_of_week: 4, dayName: 'Thursday', open_time: '05:30', close_time: '23:00', is_closed: false },
      { day_of_week: 5, dayName: 'Friday', open_time: '05:30', close_time: '23:00', is_closed: false },
      { day_of_week: 6, dayName: 'Saturday', open_time: '06:00', close_time: '22:00', is_closed: false },
      { day_of_week: 0, dayName: 'Sunday', open_time: '07:00', close_time: '14:00', is_closed: false },
    ],
    amenities: ['Free Weights', 'Cardio Zone', 'Parking', 'Locker Room'],
    equipment: ['Squat Racks', 'Deadlift Platforms', 'Dumbbells up to 70kg', 'Sled Track'],
    trainers: [],
    deals: [],
    reviews: [],
  },

  // 4. Nitrro Connaught Place Delhi
  'g6666666-6666-6666-6666-666666666666': {
    id: 'g6666666-6666-6666-6666-666666666666',
    name: 'Nitrro Wellness Fitness Hub — Connaught Place',
    tagline: 'Delhi ultra-luxury wellness & fitness club',
    description:
      'Nitrro Wellness Connaught Place is a 20,000 sq ft luxury fitness club featuring an indoor heated swimming pool, oxygen lounges, Eleiko lifting equipment, and luxury spa facilities.',
    address: 'Outer Circle, Connaught Place, New Delhi 110001',
    country: 'India',
    lat: 28.6315,
    lng: 77.2167,
    phone: '+911143500006',
    email: 'cp@nitrro.in',
    gym_type: 'General',
    gender_type: 'Co-ed',
    is_verified: true,
    is_featured: true,
    total_rating: 4.9,
    rating_count: 320,
    starting_price: 4500,
    currency: 'INR',
    cover_photo: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80',
    ],
    plans: [
      {
        id: 'p601',
        plan_name: 'Nitrro VIP Monthly',
        duration_days: 30,
        price: 4500,
        currency: 'INR',
        features: ['Pool Access', 'Eleiko Zone', 'Oxygen Lounge', 'Sauna & Steam'],
        is_best_value: true,
      },
    ],
    timings: [
      { day_of_week: 1, dayName: 'Monday', open_time: '06:00', close_time: '23:30', is_closed: false },
      { day_of_week: 2, dayName: 'Tuesday', open_time: '06:00', close_time: '23:30', is_closed: false },
      { day_of_week: 3, dayName: 'Wednesday', open_time: '06:00', close_time: '23:30', is_closed: false },
      { day_of_week: 4, dayName: 'Thursday', open_time: '06:00', close_time: '23:30', is_closed: false },
      { day_of_week: 5, dayName: 'Friday', open_time: '06:00', close_time: '23:30', is_closed: false },
      { day_of_week: 6, dayName: 'Saturday', open_time: '06:00', close_time: '23:00', is_closed: false },
      { day_of_week: 0, dayName: 'Sunday', open_time: '07:00', close_time: '21:00', is_closed: false },
    ],
    amenities: ['AC', 'Swimming Pool', 'Sauna', 'Valet Parking', 'Juice Bar', 'Shower'],
    equipment: ['Eleiko Competition Plates', 'Heated Lap Pool', 'Technogym Artis Treadmills'],
    trainers: [],
    deals: [],
    reviews: [],
  },

  // 5. Cult Fit Indiranagar Bangalore
  'g9999999-9999-9999-9999-999999999999': {
    id: 'g9999999-9999-9999-9999-999999999999',
    name: 'Cult Fit — Indiranagar',
    tagline: 'Bangalore flagship fitness & group training center',
    description:
      'Cult Fit Indiranagar is a flagship 10,000 sq ft fitness center with specialized arenas for HRX, Dance Fitness, Strength & Conditioning, and Yoga.',
    address: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
    country: 'India',
    lat: 12.9784,
    lng: 77.6408,
    phone: '+918045600009',
    email: 'indiranagar@cultfit.in',
    gym_type: 'CrossFit',
    gender_type: 'Co-ed',
    is_verified: true,
    is_featured: true,
    total_rating: 4.9,
    rating_count: 412,
    starting_price: 3500,
    currency: 'INR',
    cover_photo: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    ],
    plans: [
      {
        id: 'p901',
        plan_name: 'Cult Pass Indiranagar (Monthly)',
        duration_days: 30,
        price: 3500,
        currency: 'INR',
        features: ['All Group Workouts', 'HRX Training', 'Sauna Access'],
        is_best_value: true,
      },
    ],
    timings: [
      { day_of_week: 1, dayName: 'Monday', open_time: '06:00', close_time: '22:00', is_closed: false },
      { day_of_week: 2, dayName: 'Tuesday', open_time: '06:00', close_time: '22:00', is_closed: false },
      { day_of_week: 3, dayName: 'Wednesday', open_time: '06:00', close_time: '22:00', is_closed: false },
      { day_of_week: 4, dayName: 'Thursday', open_time: '06:00', close_time: '22:00', is_closed: false },
      { day_of_week: 5, dayName: 'Friday', open_time: '06:00', close_time: '22:00', is_closed: false },
      { day_of_week: 6, dayName: 'Saturday', open_time: '07:00', close_time: '21:00', is_closed: false },
      { day_of_week: 0, dayName: 'Sunday', open_time: '07:00', close_time: '20:00', is_closed: false },
    ],
    amenities: ['AC', 'Group Classes', 'Shower', 'Nutritional Cafe'],
    equipment: ['Battle Ropes', 'Kettlebells', 'Pull Up Rigs', 'Spin Bikes'],
    trainers: [],
    deals: [],
    reviews: [],
  },
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll() {},
        },
      }
    );

    const { data: gym, error } = await supabase.from('gyms').select('*').eq('id', id).single();

    if (!error && gym) {
      // Fetch related data
      const { data: photos } = await supabase.from('gym_photos').select('*').eq('gym_id', id);
      const { data: plans } = await supabase.from('membership_plans').select('*').eq('gym_id', id);
      const { data: timings } = await supabase.from('gym_timings').select('*').eq('gym_id', id);
      const { data: amenities } = await supabase.from('gym_amenities').select('*').eq('gym_id', id);
      const { data: trainers } = await supabase.from('trainers').select('*').eq('gym_id', id);
      const { data: reviews } = await supabase.from('reviews').select('*').eq('gym_id', id);
      const { data: deals } = await supabase.from('gym_deals').select('*').eq('gym_id', id);

      return NextResponse.json({
        gym: {
          ...gym,
          photos: photos?.map((p: any) => p.url) || [gym.cover_photo],
          plans: plans || [],
          timings: timings || [],
          amenities: amenities?.map((a: any) => a.amenity_name) || [],
          trainers: trainers || [],
          reviews: reviews || [],
          deals: deals || [],
        },
      });
    }
  } catch {
    // Fallback to seed details
  }

  const fallback = SEED_DETAILS[id] || SEED_DETAILS['g1111111-1111-1111-1111-111111111111'];
  return NextResponse.json({ gym: fallback });
}
