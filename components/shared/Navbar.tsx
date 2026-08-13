'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dumbbell, Heart, User, LayoutDashboard, LogOut, Menu, Building2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const router = useRouter();
  const { user, role, isLoggedIn, signOut, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const userInitial = user?.user_metadata?.name?.[0] || user?.email?.[0] || 'U';

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path: string) => {
    setProfileOpen(false);
    setMobileOpen(false);
    router.push(path);
  };

  return (
    <nav className="w-full h-16 border-b border-white/10 bg-[#1A1A2E]/90 backdrop-blur-md px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-2 font-syne font-extrabold text-xl text-white">
        <div className="p-1.5 bg-[#FF5722] rounded-lg">
          <Dumbbell className="w-5 h-5 text-white" />
        </div>
        Gym<span className="text-[#FF5722]">Spot</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4">
        {loading ? (
          <div className="w-24 h-9 bg-white/5 rounded-md animate-pulse" />
        ) : !isLoggedIn ? (
          <>
            <Link href="/login">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/5">
                Login
              </Button>
            </Link>
            <Link href="/owner/signup">
              <Button className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-medium flex items-center gap-1.5">
                <Building2 className="w-4 h-4" /> List Your Gym
              </Button>
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-3">
            {role === 'owner' ? (
              <Link href="/owner/dashboard">
                <Button variant="outline" className="border-[#FF5722]/40 text-[#FF5722] hover:bg-[#FF5722]/10 gap-2">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/saved">
                <Button variant="ghost" className="text-gray-300 hover:text-white gap-2">
                  <Heart className="w-4 h-4 text-[#FF5722]" /> Saved
                </Button>
              </Link>
            )}

            {/* Profile Dropdown - Custom Implementation */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 rounded-full border border-white/20 hover:border-[#FF5722] transition-colors cursor-pointer bg-[#FF5722] text-white font-bold text-sm flex items-center justify-center outline-none focus:ring-2 focus:ring-[#FF5722]"
              >
                {userInitial.toUpperCase()}
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-56 bg-[#161626] border border-white/10 rounded-xl shadow-2xl shadow-black/50 py-2 z-[100] animate-in fade-in-0 zoom-in-95 duration-150">
                  {/* User Info */}
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.user_metadata?.name || 'Account'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user?.email || user?.phone}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    {role === 'owner' ? (
                      <>
                        <button
                          onClick={() => handleNavigation('/owner/dashboard')}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#FF5722]" /> Owner Dashboard
                        </button>
                        <button
                          onClick={() => handleNavigation('/owner/listing/create')}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <Building2 className="w-4 h-4 text-[#FF5722]" /> Add New Listing
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleNavigation('/profile')}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <User className="w-4 h-4 text-[#FF5722]" /> Profile & Edit Details
                        </button>
                        <button
                          onClick={() => handleNavigation('/saved')}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <Heart className="w-4 h-4 text-[#FF5722]" /> Saved Gyms
                        </button>
                      </>
                    )}

                    {role === 'admin' && (
                      <button
                        onClick={() => handleNavigation('/admin/verifications')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#FF5722] hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        Admin Panel
                      </button>
                    )}
                  </div>

                  {/* Sign Out */}
                  <div className="border-t border-white/10 pt-1">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer font-medium"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out / Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white p-2"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 top-16 bg-[#161626] z-40 p-6 flex flex-col justify-between md:hidden animate-in slide-in-from-right duration-200">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 font-syne font-bold text-lg text-white">
                <Dumbbell className="w-5 h-5 text-[#FF5722]" /> GymSpot
              </Link>
            </div>

            {!isLoggedIn ? (
              <div className="flex flex-col gap-3">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
                    Login
                  </Button>
                </Link>
                <Link href="/owner/signup" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-medium">
                    List Your Gym
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-[#FF5722] text-white font-bold flex items-center justify-center border border-white/20">
                    {userInitial.toUpperCase()}
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-sm text-white">{user?.user_metadata?.name || 'User'}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email || user?.phone}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  {role === 'owner' ? (
                    <>
                      <button onClick={() => handleNavigation('/owner/dashboard')} className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-200 hover:bg-white/5">
                        <LayoutDashboard className="w-4 h-4 text-[#FF5722]" /> Dashboard
                      </button>
                      <button onClick={() => handleNavigation('/owner/listing/create')} className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-200 hover:bg-white/5">
                        <Building2 className="w-4 h-4 text-[#FF5722]" /> Add Listing
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleNavigation('/profile')} className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-200 hover:bg-white/5">
                        <User className="w-4 h-4 text-[#FF5722]" /> Profile
                      </button>
                      <button onClick={() => handleNavigation('/saved')} className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-200 hover:bg-white/5">
                        <Heart className="w-4 h-4 text-[#FF5722]" /> Saved Gyms
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {isLoggedIn && (
            <Button
              variant="outline"
              onClick={() => {
                setMobileOpen(false);
                signOut();
              }}
              className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          )}
        </div>
      )}
    </nav>
  );
}
