import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { Database } from '@/supabase/types';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Protect /owner/* routes
  if (path.startsWith('/owner')) {
    if (!user) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    // Check if user exists in gym_owners
    const { data: owner } = await supabase
      .from('gym_owners')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!owner) {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // Protect /admin/* routes
  if (path.startsWith('/admin')) {
    if (!user) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    // Admin role check via metadata or user email fallback
    const isAdmin = user.app_metadata?.role === 'admin' || user.email === 'admin@gymspot.com';
    if (!isAdmin) {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
