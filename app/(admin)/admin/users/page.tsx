'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Search, ArrowLeft, ShieldCheck, Mail, Phone, Building2 } from 'lucide-react';

interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'owner' | 'admin';
  joinedAt: string;
  activityCount: number;
}

const SAMPLE_USERS: UserAccount[] = [
  {
    id: 'u1',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+91 98765 43210',
    role: 'user',
    joinedAt: '2026-08-01',
    activityCount: 4,
  },
  {
    id: 'u2',
    name: 'Vikram Singh (Golds Gym)',
    email: 'andheri@goldsgym.in',
    phone: '+91 22267 30001',
    role: 'owner',
    joinedAt: '2026-07-15',
    activityCount: 38,
  },
  {
    id: 'u3',
    name: 'Superadmin Yash',
    email: 'admin@gymspot.com',
    phone: '+91 99999 88888',
    role: 'admin',
    joinedAt: '2026-06-01',
    activityCount: 120,
  },
];

export default function UsersAdminPage() {
  const [users] = useState<UserAccount[]>(SAMPLE_USERS);
  const [search, setSearch] = useState('');

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col selection:bg-[#FF5722] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-syne font-bold text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-400" /> Platform Accounts Directory ({users.length})
              </h1>
              <p className="text-sm text-gray-400">View user accounts, gym owner profiles, and superadmin roles</p>
            </div>
          </div>

          <div className="w-full sm:w-72">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user name or email..."
                className="h-10 pl-9 bg-white/5 border-white/10 text-white text-xs"
              />
            </div>
          </div>
        </div>

        <Card className="bg-[#161626] border-white/10 text-white">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              {filtered.map((u) => (
                <div
                  key={u.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base font-syne">{u.name}</h4>
                      {u.role === 'admin' ? (
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40 text-[10px]">
                          <ShieldCheck className="w-3 h-3 mr-1" /> Superadmin
                        </Badge>
                      ) : u.role === 'owner' ? (
                        <Badge className="bg-[#FF5722]/20 text-[#FF5722] border-[#FF5722]/40 text-[10px]">
                          <Building2 className="w-3 h-3 mr-1" /> Gym Owner
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-white/20 text-gray-300 text-[10px]">
                          User Account
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      {u.email} · {u.phone}
                    </p>
                  </div>

                  <div className="text-right text-xs text-gray-400">
                    <p>Joined: {u.joinedAt}</p>
                    <p className="text-white font-medium">{u.activityCount} platform actions</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
