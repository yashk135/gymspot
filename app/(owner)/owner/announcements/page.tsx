'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Megaphone, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const SAMPLE_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'Gym Closure Notice — Sunday Maintenance',
    content: 'Please note that the gym will remain closed on Sunday, August 17th for annual equipment servicing and deep cleaning.',
    createdAt: '2026-08-05',
  },
  {
    id: 'ann-2',
    title: 'New HIIT & Boxing Trainer Joining Monday',
    content: 'Excited to announce Coach Vikram joining our team next week! Book your spot for Monday 7 AM HIIT masterclass.',
    createdAt: '2026-08-01',
  },
];

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(SAMPLE_ANNOUNCEMENTS);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error('Title and message content are required');
      return;
    }

    const newAnn: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      title,
      content,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setAnnouncements([newAnn, ...announcements]);
    setTitle('');
    setContent('');
    toast.success('Announcement published to gym notice board!');
  };

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
    toast('Announcement removed');
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col selection:bg-[#FF5722] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 space-y-8">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <Link href="/owner/dashboard">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-syne font-bold text-white flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-[#FF5722]" /> Gym Notice Board
            </h1>
            <p className="text-sm text-gray-400">Post announcements and updates to your public gym detail page</p>
          </div>
        </div>

        <Card className="bg-[#161626] border-white/10 text-white">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-base font-bold font-syne text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#FF5722]" /> Post New Announcement
            </h3>

            <form onSubmit={handlePost} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-gray-300">Notice Title *</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Special Holiday Hours / New Class Schedule"
                  className="h-11 bg-white/5 border-white/10 text-white text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-300">Notice Message *</Label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  placeholder="Type your notice update for members and prospective trial visitors..."
                  className="w-full rounded-md bg-white/5 border border-white/10 text-white text-xs p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                />
              </div>

              <Button type="submit" className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold h-10 px-6 text-xs">
                Publish Announcement
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h3 className="text-base font-bold font-syne text-white">Live Gym Notices ({announcements.length})</h3>

          {announcements.map((ann) => (
            <div key={ann.id} className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2 relative">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-white text-base font-syne">{ann.title}</h4>
                <button onClick={() => handleDelete(ann.id)} className="text-gray-400 hover:text-red-400 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{ann.content}</p>
              <span className="text-[10px] text-gray-500 block pt-1">Posted on {ann.createdAt}</span>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
