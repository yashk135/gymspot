import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { Database } from '@/supabase/types';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const type = searchParams.get('type'); // 'owner' or undefined (user)
  const country = searchParams.get('country') || 'India';
  const currency = searchParams.get('currency') || 'INR';

  if (code) {
    const response = NextResponse.redirect(`${origin}/`);

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const user = data.user;

      if (type === 'owner') {
        // Upsert gym owner profile
        await (supabase.from('gym_owners') as any).upsert({
          id: user.id,
          name: user.user_metadata?.name || user.user_metadata?.full_name || 'Gym Owner',
          email: user.email || '',
          country,
          currency,
        });
        return NextResponse.redirect(`${origin}/owner/dashboard`);
      } else {
        // Upsert regular user profile
        await (supabase.from('users') as any).upsert({
          id: user.id,
          name: user.user_metadata?.name || user.user_metadata?.full_name || 'User',
          email: user.email || '',
        });
        return NextResponse.redirect(`${origin}/`);
      }
    }
  }

  // Fallback: redirect home on error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
