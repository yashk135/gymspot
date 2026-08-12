'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Dumbbell, Heart, User, LayoutDashboard, LogOut, Menu, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const { user, role, isLoggedIn, signOut, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userInitial = user?.user_metadata?.name?.[0] || user?.email?.[0] || 'U';

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

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none focus:ring-2 focus:ring-[#FF5722] rounded-full">
                <Avatar className="w-9 h-9 border border-white/20">
                  <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                  <AvatarFallback className="bg-[#FF5722] text-white font-bold text-sm">
                    {userInitial.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#161626] border-white/10 text-white">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">
                      {user?.user_metadata?.name || 'Account'}
                    </p>
                    <p className="text-xs leading-none text-gray-400 truncate">
                      {user?.email || user?.phone}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />

                {role === 'owner' ? (
                  <>
                    <DropdownMenuItem>
                      <Link href="/owner/dashboard" className="flex items-center gap-2 w-full text-gray-200 hover:text-white">
                        <LayoutDashboard className="w-4 h-4 text-[#FF5722]" /> Owner Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/owner/listing/create" className="flex items-center gap-2 w-full text-gray-200 hover:text-white">
                        <Building2 className="w-4 h-4 text-[#FF5722]" /> Add New Listing
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem>
                      <Link href="/profile" className="flex items-center gap-2 w-full text-gray-200 hover:text-white">
                        <User className="w-4 h-4 text-[#FF5722]" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/saved" className="flex items-center gap-2 w-full text-gray-200 hover:text-white">
                        <Heart className="w-4 h-4 text-[#FF5722]" /> Saved Gyms
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                {role === 'admin' && (
                  <DropdownMenuItem>
                    <Link href="/admin/verifications" className="flex items-center gap-2 w-full text-[#FF5722]">
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={signOut}
                  className="flex items-center gap-2 cursor-pointer text-red-400 hover:text-red-300 focus:text-red-300"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className="text-white p-2">
            <Menu className="w-6 h-6" />
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#161626] border-white/10 text-white w-72 p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 font-syne font-bold text-lg">
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
                    <Avatar className="w-10 h-10 border border-white/20">
                      <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                      <AvatarFallback className="bg-[#FF5722] text-white font-bold">
                        {userInitial.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="truncate">
                      <p className="font-semibold text-sm text-white">{user?.user_metadata?.name || 'User'}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email || user?.phone}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    {role === 'owner' ? (
                      <>
                        <Link href="/owner/dashboard" onClick={() => setMobileOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start gap-2 text-gray-200">
                            <LayoutDashboard className="w-4 h-4 text-[#FF5722]" /> Dashboard
                          </Button>
                        </Link>
                        <Link href="/owner/listing/create" onClick={() => setMobileOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start gap-2 text-gray-200">
                            <Building2 className="w-4 h-4 text-[#FF5722]" /> Add Listing
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href="/profile" onClick={() => setMobileOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start gap-2 text-gray-200">
                            <User className="w-4 h-4 text-[#FF5722]" /> Profile
                          </Button>
                        </Link>
                        <Link href="/saved" onClick={() => setMobileOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start gap-2 text-gray-200">
                            <Heart className="w-4 h-4 text-[#FF5722]" /> Saved Gyms
                          </Button>
                        </Link>
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
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
