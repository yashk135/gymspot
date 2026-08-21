-- Seed SQL: 5 Gym Owners, 12 Gyms across Mumbai, Delhi, Bangalore, Dubai, and London with GPS coordinates, plans, photos, and trainers

-- 1. Insert 5 Sample Gym Owners
INSERT INTO public.gym_owners (id, name, email, phone, is_verified, plan_type, country, currency)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Rahul Sharma', 'rahul@goldgymandheri.com', '+919876543210', TRUE, 'premium', 'India', 'INR'),
  ('a2222222-2222-2222-2222-222222222222', 'Priya Mehta', 'priya@cultfitbandra.com', '+919876543211', TRUE, 'premium', 'India', 'INR'),
  ('a3333333-3333-3333-3333-333333333333', 'Amit Patel', 'amit@powerhousepowai.com', '+919876543212', FALSE, 'free', 'India', 'INR'),
  ('a4444444-4444-4444-4444-444444444444', 'Karan Johar', 'karan@nitrro.in', '+919876543213', TRUE, 'premium', 'India', 'INR'),
  ('a5555555-5555-5555-5555-555555555555', 'Sarah Jenkins', 'sarah@puregym.co.uk', '+442079460012', TRUE, 'premium', 'United Kingdom', 'GBP')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert 12 Sample Gyms across Cities
INSERT INTO public.gyms (id, owner_id, name, description, address, country, lat, lng, phone, email, gym_type, gender_type, is_verified, is_featured, total_rating, rating_count, status)
VALUES
  (
    'g1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    'Golds Gym — Andheri West',
    'Premium flagship fitness centre equipped with Hammer Strength machinery, Olympic lifting platforms, steam rooms, and certified personal trainers.',
    'Veera Desai Road, Near Fun Republic, Andheri West, Mumbai, Maharashtra 400053',
    'India',
    19.1363,
    72.8277,
    '+912226730001',
    'andheri@goldsgym.in',
    'General',
    'Co-ed',
    TRUE,
    TRUE,
    4.8,
    142,
    'active'
  ),
  (
    'g2222222-2222-2222-2222-222222222222',
    'a2222222-2222-2222-2222-222222222222',
    'Cult Fit — Bandra West',
    'High-energy group workouts including Boxing, HRX, Yoga, and Strength Conditioning with top-tier athlete trainers.',
    'Hill Road, Opp. St. Stanislaus High School, Bandra West, Mumbai, Maharashtra 400050',
    'India',
    19.0596,
    72.8295,
    '+912226400002',
    'bandra@cultfit.in',
    'CrossFit',
    'Co-ed',
    TRUE,
    TRUE,
    4.9,
    210,
    'active'
  ),
  (
    'g3333333-3333-3333-3333-333333333333',
    'a3333333-3333-3333-3333-333333333333',
    'Powerhouse Gym — Powai',
    'Hardcore bodybuilding gym featuring heavy free weights, squat racks, turf zone, and dedicated powerlifting platforms.',
    'Central Avenue, Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076',
    'India',
    19.1176,
    72.9060,
    '+912225700003',
    'powai@powerhouse.in',
    'Powerlifting',
    'Co-ed',
    FALSE,
    FALSE,
    4.5,
    64,
    'active'
  ),
  (
    'g4444444-4444-4444-4444-444444444444',
    'a1111111-1111-1111-1111-111111111111',
    'Zenith Yoga & Pilates Studio — Juhu',
    'Serene wellness sanctuary providing Hot Yoga, Reformer Pilates, Meditation, and Ashtanga yoga masterclasses.',
    'Juhu Tara Road, Opp. Hotel Horizon, Juhu, Mumbai, Maharashtra 400049',
    'India',
    19.0988,
    72.8264,
    '+912226100004',
    'info@zenithjuhu.in',
    'Yoga',
    'Ladies Only',
    TRUE,
    FALSE,
    4.7,
    88,
    'active'
  ),
  (
    'g5555555-5555-5555-5555-555555555555',
    'a2222222-2222-2222-2222-222222222222',
    'Iron Paradise MMA & Fitness — Lower Parel',
    'Combat sports facility with full octagonal cage, heavy bags, Jiu-Jitsu mats, and cardio conditioning equipment.',
    'Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013',
    'India',
    18.9986,
    72.8278,
    '+912224900005',
    'contact@ironparadise.in',
    'MMA',
    'Co-ed',
    TRUE,
    TRUE,
    4.9,
    175,
    'active'
  ),
  (
    'g6666666-6666-6666-6666-666666666666',
    'a4444444-4444-4444-4444-444444444444',
    'Nitrro Wellness Fitness Hub — Connaught Place',
    'Ultra-luxury fitness club in central Delhi with Italian Eleiko weights, indoor swimming pool, and oxygen-infused cardio zones.',
    'Outer Circle, Connaught Place, New Delhi 110001',
    'India',
    28.6315,
    77.2167,
    '+911143500006',
    'cp@nitrro.in',
    'General',
    'Co-ed',
    TRUE,
    TRUE,
    4.9,
    320,
    'active'
  ),
  (
    'g7777777-7777-7777-7777-777777777777',
    'a4444444-4444-4444-4444-444444444444',
    'Anytime Fitness — Hauz Khas',
    '24/7 keycard access gym featuring Precor cardio ellipticals, Matrix pin-loaded equipment, and functional turf tracks.',
    'Aurobindo Marg, Hauz Khas Enclave, New Delhi 110016',
    'India',
    28.5494,
    77.2001,
    '+911141600007',
    'hauzkhas@anytimefitness.in',
    'General',
    'Co-ed',
    TRUE,
    FALSE,
    4.6,
    189,
    'active'
  ),
  (
    'g8888888-8888-8888-8888-888888888888',
    'a4444444-4444-4444-4444-444444444444',
    'UFC Gym — Vasant Kunj',
    'Official UFC combat training facility with full cage, Kickboxing, Muay Thai, and Strength conditioning.',
    'Nelson Mandela Marg, Vasant Kunj, New Delhi 110070',
    'India',
    28.5293,
    77.1554,
    '+911149800008',
    'vasantkunj@ufcgym.in',
    'MMA',
    'Co-ed',
    TRUE,
    TRUE,
    4.9,
    245,
    'active'
  ),
  (
    'g9999999-9999-9999-9999-999999999999',
    'a2222222-2222-2222-2222-222222222222',
    'Cult Fit — Indiranagar',
    'Flagship 10,000 sq ft fitness center with specialized arenas for HRX, Dance Fitness, Strength & Conditioning, and Yoga.',
    '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
    'India',
    12.9784,
    77.6408,
    '+918045600009',
    'indiranagar@cultfit.in',
    'CrossFit',
    'Co-ed',
    TRUE,
    TRUE,
    4.9,
    412,
    'active'
  ),
  (
    'g1010101-1010-1010-1010-101010101010',
    'a1111111-1111-1111-1111-111111111111',
    'Golds Gym — Koramangala',
    'Equipped with Technogym smart consoles, TRX suspension gear, spin studio, and certified physiotherapy consultations.',
    '80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034',
    'India',
    12.9352,
    77.6245,
    '+918041200010',
    'koramangala@goldsgym.in',
    'General',
    'Co-ed',
    TRUE,
    FALSE,
    4.7,
    278,
    'active'
  ),
  (
    'g1110111-1111-1111-1111-111111111111',
    'a5555555-5555-5555-5555-555555555555',
    'GymNation — Downtown Dubai',
    'UAEs largest 24/7 fitness facility with over 500 pieces of matrix equipment, Les Mills classes, and dedicated ladies-only area.',
    'Financial Center Road, Downtown Dubai, United Arab Emirates',
    'UAE',
    25.1972,
    55.2744,
    '+97148000011',
    'downtown@gymnation.ae',
    'General',
    'Co-ed',
    TRUE,
    TRUE,
    4.9,
    512,
    'active'
  ),
  (
    'g1212121-1212-1212-1212-121212121212',
    'a5555555-5555-5555-5555-555555555555',
    'PureGym — Soho London',
    'Central London 24/7 fitness club featuring Rogue fitness rigs, Wattbikes, free weights up to 50kg, and virtual cycling studio.',
    'Dean Street, Soho, London W1D 3BF, United Kingdom',
    'United Kingdom',
    51.5136,
    -0.1332,
    '+442079460012',
    'soho@puregym.co.uk',
    'General',
    'Co-ed',
    TRUE,
    TRUE,
    4.8,
    389,
    'active'
  )
ON CONFLICT (id) DO NOTHING;

-- 3. Membership Plans
INSERT INTO public.membership_plans (gym_id, plan_name, duration_days, price, currency, features)
VALUES
  ('g1111111-1111-1111-1111-111111111111', 'Monthly Basic', 30, 3500.00, 'INR', ARRAY['Gym Floor Access', 'Locker Room', 'Steam Room']),
  ('g1111111-1111-1111-1111-111111111111', 'Annual VIP', 365, 28000.00, 'INR', ARRAY['24/7 Access', 'Free Personal Trainer Session', 'Nutritional Counseling', 'Steam & Sauna']),
  ('g2222222-2222-2222-2222-222222222222', 'Cult Pass Elite (3 Months)', 90, 9999.00, 'INR', ARRAY['Unlimited Group Classes', 'At-home Workouts App', 'Free Gym Transfers']),
  ('g3333333-3333-3333-3333-333333333333', 'Power Monthly', 30, 2000.00, 'INR', ARRAY['Heavy Weight Floor', 'Chalk Allowed', 'Locker Room']),
  ('g4444444-4444-4444-4444-444444444444', 'Yoga & Reformer Monthly', 30, 5000.00, 'INR', ARRAY['Reformer Pilates', 'Mat Yoga', 'Green Tea Bar']),
  ('g5555555-5555-5555-5555-555555555555', 'MMA Pro Quarterly', 90, 12000.00, 'INR', ARRAY['Octagon Cage Access', 'BJJ Mat Sessions', 'Striking Classes']),
  ('g6666666-6666-6666-6666-666666666666', 'Nitrro Monthly VIP', 30, 4500.00, 'INR', ARRAY['Pool Access', 'Eleiko Area', 'Oxygen Lounge']),
  ('g9999999-9999-9999-9999-999999999999', 'Cult Pass Indiranagar (Monthly)', 30, 3500.00, 'INR', ARRAY['All Group Classes', 'HRX Training', 'Sauna']);

-- 4. Sample Gym Photos
INSERT INTO public.gym_photos (gym_id, url, is_video, order_index)
VALUES
  ('g1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80', FALSE, 1),
  ('g2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80', FALSE, 1),
  ('g3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80', FALSE, 1),
  ('g4444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80', FALSE, 1),
  ('g5555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&q=80', FALSE, 1),
  ('g6666666-6666-6666-6666-666666666666', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80', FALSE, 1),
  ('g9999999-9999-9999-9999-999999999999', 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1200&q=80', FALSE, 1);

-- 5. Sample Amenities
INSERT INTO public.gym_amenities (gym_id, amenity_name)
VALUES
  ('g1111111-1111-1111-1111-111111111111', 'AC'),
  ('g1111111-1111-1111-1111-111111111111', 'Steam Room'),
  ('g1111111-1111-1111-1111-111111111111', 'Parking'),
  ('g1111111-1111-1111-1111-111111111111', 'Shower'),
  ('g2222222-2222-2222-2222-222222222222', 'AC'),
  ('g2222222-2222-2222-2222-222222222222', 'Group Classes'),
  ('g2222222-2222-2222-2222-222222222222', 'WiFi'),
  ('g6666666-6666-6666-6666-666666666666', 'AC'),
  ('g6666666-6666-6666-6666-666666666666', 'Swimming Pool'),
  ('g6666666-6666-6666-6666-666666666666', 'Sauna');

-- 6. Sample Trainers
INSERT INTO public.trainers (gym_id, name, specialization, experience_years, bio)
VALUES
  ('g1111111-1111-1111-1111-111111111111', 'Vikram Singh', 'Bodybuilding & Hypertrophy', 8, 'Certified ACE trainer specializing in contest prep and strength gains.'),
  ('g2222222-2222-2222-2222-222222222222', 'Ananya Roy', 'CrossFit & Functional Training', 5, 'National level athlete coaching high-intensity endurance workouts.'),
  ('g6666666-6666-6666-6666-666666666666', 'Kabir Malhotra', 'Powerlifting & Rehab', 10, 'Former national powerlifter and sports rehabilitation specialist.');
