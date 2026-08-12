import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Fallback seed detail data
const SEED_DETAILS: Record<string, any> = {
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
      {
        id: 'p3',
        plan_name: 'Quarterly Strength Pass',
        duration_days: 90,
        price: 9000,
        currency: 'INR',
        features: ['Gym Floor Access', 'Locker Room', 'Steam Room', 'Group Classes'],
        is_best_value: false,
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
    amenities: [
      'AC',
      'Steam Room',
      'Sauna',
      'Parking',
      'Shower',
      'Locker Room',
      'WiFi',
      'Cafeteria',
      'Free Weights',
      'Cardio Zone',
      'Personal Training',
      'Group Classes',
    ],
    equipment: [
      'Hammer Strength Power Racks',
      'Olympic Barbell & Bumper Plates',
      'LifeFitness Treadmills',
      'Dumbbells (up to 60kg)',
      'Cable Crossover & Lat Pulldown',
      'Turf Sled & Kettlebell Zone',
    ],
    trainers: [
      {
        id: 't1',
        name: 'Vikram Singh',
        photo_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
        specialization: 'Bodybuilding & Hypertrophy',
        experience_years: 8,
        bio: 'Certified ACE personal trainer specializing in competition prep, posture correction, and heavy strength building.',
      },
      {
        id: 't2',
        name: 'Pooja Hegde',
        photo_url: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=400&q=80',
        specialization: 'Functional Fitness & Weight Loss',
        experience_years: 5,
        bio: 'CrossFit Level 1 certified coach focused on fat loss, mobility conditioning, and functional movement.',
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
        cleanliness_rating: 5,
        equipment_rating: 5,
        staff_rating: 5,
        value_rating: 4,
        comment: 'Best gym in Andheri West! Equipment is always clean and well maintained. Vikram sir is an incredible coach.',
        created_at: '2026-07-28T10:00:00Z',
      },
      {
        id: 'r2',
        user_name: 'Simran Kaur',
        rating: 4,
        cleanliness_rating: 5,
        equipment_rating: 4,
        staff_rating: 5,
        value_rating: 4,
        comment: 'Great ambience and helpful staff. Steam room is super relaxing after heavy leg sessions.',
        created_at: '2026-07-20T14:30:00Z',
      },
    ],
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
