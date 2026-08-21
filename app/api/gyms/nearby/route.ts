import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { calculateDistanceKm } from '@/lib/geo';

// Rich fallback seed gyms across Mumbai, Delhi, Bangalore, Dubai, and London
const SAMPLE_GYMS = [
  // --- MUMBAI GYMS ---
  {
    id: 'g1111111-1111-1111-1111-111111111111',
    name: 'Golds Gym — Andheri West',
    description: 'Premium flagship fitness centre equipped with Hammer Strength machinery, Olympic lifting platforms, steam rooms, and certified personal trainers.',
    address: 'Veera Desai Road, Near Fun Republic, Andheri West, Mumbai, Maharashtra',
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
    address: 'Hill Road, Opp. St. Stanislaus High School, Bandra West, Mumbai, Maharashtra',
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
    address: 'Central Avenue, Hiranandani Gardens, Powai, Mumbai, Maharashtra',
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
    address: 'Juhu Tara Road, Opp. Hotel Horizon, Juhu, Mumbai, Maharashtra',
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
    address: 'Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra',
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

  // --- DELHI GYMS ---
  {
    id: 'g6666666-6666-6666-6666-666666666666',
    name: 'Nitrro Wellness Fitness Hub — Connaught Place',
    description: 'Ultra-luxury fitness club in central Delhi with Italian Eleiko weights, indoor swimming pool, and oxygen-infused cardio zones.',
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
    amenities: ['AC', 'Swimming Pool', 'Sauna', 'Valet Parking', 'Juice Bar'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'g7777777-7777-7777-7777-777777777777',
    name: 'Anytime Fitness — Hauz Khas',
    description: '24/7 keycard access gym featuring Precor cardio ellipticals, Matrix pin-loaded equipment, and functional turf tracks.',
    address: 'Aurobindo Marg, Hauz Khas Enclave, New Delhi 110016',
    country: 'India',
    lat: 28.5494,
    lng: 77.2001,
    phone: '+911141600007',
    email: 'hauzkhas@anytimefitness.in',
    gym_type: 'General',
    gender_type: 'Co-ed',
    is_verified: true,
    is_featured: false,
    total_rating: 4.6,
    rating_count: 189,
    starting_price: 3000,
    currency: 'INR',
    cover_photo: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=1200&q=80',
    amenities: ['24/7 Access', 'AC', 'WiFi', 'Private Showers'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'g8888888-8888-8888-8888-888888888888',
    name: 'UFC Gym — Vasant Kunj',
    description: 'Official UFC combat training facility with full cage, Kickboxing, Muay Thai, and Strength conditioning.',
    address: 'Nelson Mandela Marg, Vasant Kunj, New Delhi 110070',
    country: 'India',
    lat: 28.5293,
    lng: 77.1554,
    phone: '+911149800008',
    email: 'vasantkunj@ufcgym.in',
    gym_type: 'MMA',
    gender_type: 'Co-ed',
    is_verified: true,
    is_featured: true,
    total_rating: 4.9,
    rating_count: 245,
    starting_price: 6000,
    currency: 'INR',
    cover_photo: 'https://images.unsplash.com/photo-1517931524326-bdd55a541177?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Octagon Cage', 'AC', 'Sauna', 'Cryotherapy', 'Locker Room'],
    created_at: new Date().toISOString(),
  },

  // --- BANGALORE GYMS ---
  {
    id: 'g9999999-9999-9999-9999-999999999999',
    name: 'Cult Fit — Indiranagar',
    description: 'Flagship 10,000 sq ft fitness center with specialized arenas for HRX, Dance Fitness, Strength & Conditioning, and Yoga.',
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
    amenities: ['AC', 'Group Classes', 'Shower', 'Nutritional Cafe'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'g1010101-1010-1010-1010-101010101010',
    name: 'Golds Gym — Koramangala',
    description: 'Equipped with Technogym smart consoles, TRX suspension gear, spin studio, and certified physiotherapy consultations.',
    address: '80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034',
    country: 'India',
    lat: 12.9352,
    lng: 77.6245,
    phone: '+918041200010',
    email: 'koramangala@goldsgym.in',
    gym_type: 'General',
    gender_type: 'Co-ed',
    is_verified: true,
    is_featured: false,
    total_rating: 4.7,
    rating_count: 278,
    starting_price: 3200,
    currency: 'INR',
    cover_photo: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80',
    amenities: ['AC', 'Steam Room', 'Physiotherapy', 'Parking'],
    created_at: new Date().toISOString(),
  },

  // --- DUBAI GYMS ---
  {
    id: 'g1110111-1111-1111-1111-111111111111',
    name: 'GymNation — Downtown Dubai',
    description: "UAE's largest 24/7 fitness facility with over 500 pieces of matrix equipment, Les Mills classes, and dedicated ladies-only area.",
    address: 'Financial Center Road, Downtown Dubai, United Arab Emirates',
    country: 'UAE',
    lat: 25.1972,
    lng: 55.2744,
    phone: '+97148000011',
    email: 'downtown@gymnation.ae',
    gym_type: 'General',
    gender_type: 'Co-ed',
    is_verified: true,
    is_featured: true,
    total_rating: 4.9,
    rating_count: 512,
    starting_price: 4999,
    currency: 'INR',
    cover_photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    amenities: ['24/7 Access', 'AC', 'Ladies Only Gym Zone', 'Spinning Studio'],
    created_at: new Date().toISOString(),
  },

  // --- LONDON GYMS ---
  {
    id: 'g1212121-1212-1212-1212-121212121212',
    name: 'PureGym — Soho London',
    description: 'Central London 24/7 fitness club featuring Rogue fitness rigs, Wattbikes, free weights up to 50kg, and virtual cycling studio.',
    address: 'Dean Street, Soho, London W1D 3BF, United Kingdom',
    country: 'United Kingdom',
    lat: 51.5136,
    lng: -0.1332,
    phone: '+442079460012',
    email: 'soho@puregym.co.uk',
    gym_type: 'General',
    gender_type: 'Co-ed',
    is_verified: true,
    is_featured: true,
    total_rating: 4.8,
    rating_count: 389,
    starting_price: 3800,
    currency: 'INR',
    cover_photo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    amenities: ['24/7 Access', 'AC', 'Rogue Rigs', 'Shower Cubicles'],
    created_at: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const userLat = parseFloat(searchParams.get('lat') || '19.076');
  const userLng = parseFloat(searchParams.get('lng') || '72.8777');
  const radiusKm = parseFloat(searchParams.get('radiusKm') || '50');
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
        cover_photo: g.cover_photo || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
        starting_price: g.starting_price || 2500,
        currency: g.currency || 'INR',
        amenities: g.amenities || ['AC', 'Locker Room', 'Shower'],
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
    // Allow up to 100km or city-wide matches if search query is provided
    if (!query && g.distance_km > radiusKm) return false;
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
