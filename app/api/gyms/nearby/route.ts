import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { calculateDistanceKm } from '@/lib/geo';

// Fallback seed gyms for demonstration
const SAMPLE_GYMS = [
  {
    id: 'g1111111-1111-1111-1111-111111111111',
    name: 'Golds Gym — Andheri West',
    description: 'Premium flagship fitness centre equipped with Hammer Strength machinery, Olympic lifting platforms, steam rooms, and certified personal trainers.',
    address: 'Veera Desai Road, Near Fun Republic, Andheri West, Mumbai',
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
    amenities: ['AC', 'Steam Room', 'Parking', 'Shower', 'Locker Room'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'g2222222-2222-2222-2222-222222222222',
    name: 'Cult Fit — Bandra West',
    description: 'High-energy group workouts including Boxing, HRX, Yoga, and Strength Conditioning with top-tier athlete trainers.',
    address: 'Hill Road, Opp. St. Stanislaus High School, Bandra West, Mumbai',
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
    amenities: ['AC', 'Group Classes', 'WiFi', 'Shower'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'g3333333-3333-3333-3333-333333333333',
    name: 'Powerhouse Gym — Powai',
    description: 'Hardcore bodybuilding gym featuring heavy free weights, squat racks, turf zone, and dedicated powerlifting platforms.',
    address: 'Central Avenue, Hiranandani Gardens, Powai, Mumbai',
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
    amenities: ['Free Weights', 'Cardio Zone', 'Parking'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'g4444444-4444-4444-4444-444444444444',
    name: 'Zenith Yoga & Pilates Studio — Juhu',
    description: 'Serene wellness sanctuary providing Hot Yoga, Reformer Pilates, Meditation, and Ashtanga yoga masterclasses.',
    address: 'Juhu Tara Road, Opp. Hotel Horizon, Juhu, Mumbai',
    country: 'India',
    lat: 19.0988,
    lng: 72.8264,
    phone: '+912226100004',
    email: 'info@zenithjuhu.in',
    gym_type: 'Yoga',
    gender_type: 'Ladies Only',
    is_verified: true,
    is_featured: false,
    total_rating: 4.7,
    rating_count: 88,
    starting_price: 5000,
    currency: 'INR',
    cover_photo: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
    amenities: ['AC', 'WiFi', 'Shower', 'Personal Training'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'g5555555-5555-5555-5555-555555555555',
    name: 'Iron Paradise MMA & Fitness — Lower Parel',
    description: 'Combat sports facility with full octagonal cage, heavy bags, Jiu-Jitsu mats, and cardio conditioning equipment.',
    address: 'Senapati Bapat Marg, Lower Parel, Mumbai',
    country: 'India',
    lat: 18.9986,
    lng: 72.8278,
    phone: '+912224900005',
    email: 'contact@ironparadise.in',
    gym_type: 'MMA',
    gender_type: 'Co-ed',
    is_verified: true,
    is_featured: true,
    total_rating: 4.9,
    rating_count: 175,
    starting_price: 4000,
    currency: 'INR',
    cover_photo: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&q=80',
    amenities: ['AC', 'Group Classes', 'Shower', 'Sauna'],
    created_at: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const userLat = parseFloat(searchParams.get('lat') || '19.076');
  const userLng = parseFloat(searchParams.get('lng') || '72.8777');
  const radiusKm = parseFloat(searchParams.get('radiusKm') || '20');
  const query = searchParams.get('query')?.toLowerCase() || '';
  const gymType = searchParams.get('gymType') || '';
  const genderPolicy = searchParams.get('genderPolicy') || '';
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '100000');
  const sortBy = searchParams.get('sortBy') || 'distance';

  let results: any[] = [];

  // Try Supabase query first
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

    const { data: dbGyms, error } = await supabase.from('gyms').select('*');

    if (!error && dbGyms && dbGyms.length > 0) {
      results = dbGyms.map((g: any) => ({
        ...g,
        distance_km: calculateDistanceKm(userLat, userLng, g.lat, g.lng),
        cover_photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
        starting_price: 2500,
        currency: 'INR',
        amenities: ['AC', 'Locker Room', 'Shower'],
      }));
    } else {
      results = SAMPLE_GYMS.map((g) => ({
        ...g,
        distance_km: calculateDistanceKm(userLat, userLng, g.lat, g.lng),
      }));
    }
  } catch {
    results = SAMPLE_GYMS.map((g) => ({
      ...g,
      distance_km: calculateDistanceKm(userLat, userLng, g.lat, g.lng),
    }));
  }

  // Filter results
  results = results.filter((g) => {
    if (g.distance_km > radiusKm) return false;
    if (query && !g.name.toLowerCase().includes(query) && !g.address.toLowerCase().includes(query)) {
      return false;
    }
    if (gymType && gymType !== 'All' && g.gym_type !== gymType) return false;
    if (genderPolicy && genderPolicy !== 'All' && g.gender_type !== genderPolicy) return false;
    if (g.starting_price > maxPrice) return false;
    return true;
  });

  // Sort results
  if (sortBy === 'distance') {
    results.sort((a, b) => a.distance_km - b.distance_km);
  } else if (sortBy === 'price_low') {
    results.sort((a, b) => a.starting_price - b.starting_price);
  } else if (sortBy === 'rating') {
    results.sort((a, b) => b.total_rating - a.total_rating);
  }

  return NextResponse.json({
    gyms: results,
    total: results.length,
    userLocation: { lat: userLat, lng: userLng },
  });
}
