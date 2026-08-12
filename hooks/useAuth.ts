'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export type UserRole = 'user' | 'owner' | 'admin' | null;

interface AuthState {
  user: User | null;
  role: UserRole;
  loading: boolean;
  isLoggedIn: boolean;
}

export function useAuth() {
  const router = useRouter();
  const supabase = createClient();
  const [state, setState] = useState<AuthState>({
    user: null,
    role: null,
    loading: true,
    isLoggedIn: false,
  });

  const detectRole = useCallback(async (user: User): Promise<UserRole> => {
    // Check admin first
    if (user.app_metadata?.role === 'admin' || user.email === 'admin@gymspot.com') {
      return 'admin';
    }

    // Check if gym owner
    const { data: owner } = await supabase
      .from('gym_owners')
      .select('id')
      .eq('id', user.id)
      .single();

    if (owner) return 'owner';

    return 'user';
  }, [supabase]);

  const fetchUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const role = await detectRole(user);
      setState({ user, role, loading: false, isLoggedIn: true });
    } else {
      setState({ user: null, role: null, loading: false, isLoggedIn: false });
    }
  }, [supabase, detectRole]);

  useEffect(() => {
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        detectRole(session.user).then((role) => {
          setState({ user: session.user, role, loading: false, isLoggedIn: true });
        });
      } else {
        setState({ user: null, role: null, loading: false, isLoggedIn: false });
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, fetchUser, detectRole]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setState({ user: null, role: null, loading: false, isLoggedIn: false });
    router.push('/login');
    router.refresh();
  };

  const getCurrentUser = () => state.user;
  const getUserRole = () => state.role;
  const isLoggedIn = () => state.isLoggedIn;

  return {
    ...state,
    signOut,
    getCurrentUser,
    getUserRole,
    isLoggedIn: state.isLoggedIn,
  };
}
