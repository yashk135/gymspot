'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Ticket, Calendar, Clock, CheckCircle2, Loader2, Dumbbell } from 'lucide-react';
import { toast } from 'sonner';

interface FreeTrialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gymId: string;
  gymName: string;
}

const SLOTS = ['Morning (06:00 - 10:00)', 'Afternoon (12:00 - 16:00)', 'Evening (17:00 - 21:00)'];

export function FreeTrialModal({ open, onOpenChange, gymId, gymName }: FreeTrialModalProps) {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [date, setDate] = useState<string>(tomorrow);
  const [slot, setSlot] = useState<string>(SLOTS[0]);
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast.error('Please select your preferred trial date');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/trials/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gymId,
          preferredDate: date,
          timeSlot: slot,
          note,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit trial request');

      setLoading(false);
      setSuccess(true);
      toast.success('Free Trial Request Sent!');
    } catch (err: any) {
      setLoading(false);
      toast.error(err.message || 'Error booking trial');
    }
  };

  const handleClose = () => {
    setSuccess(false);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="bg-[#161626] border-white/10 text-white w-full sm:max-w-md p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <SheetHeader className="text-left space-y-2 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#FF5722]/10 text-[#FF5722] rounded-xl">
                <Ticket className="w-5 h-5" />
              </div>
              <Badge className="bg-[#FF5722] text-white border-none font-bold text-[10px] uppercase">
                1-Click Free Trial Pass
              </Badge>
            </div>
            <SheetTitle className="text-2xl font-syne font-bold text-white">Book Free Gym Trial</SheetTitle>
            <SheetDescription className="text-gray-400 text-xs">
              Request a free day pass for <span className="text-[#FF5722] font-semibold">{gymName}</span>
            </SheetDescription>
          </SheetHeader>

          {success ? (
            <div className="py-12 text-center space-y-4">
              <div className="mx-auto p-4 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full w-fit">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-white">Free Trial Pass Requested!</h3>
              <p className="text-xs text-gray-300 max-w-xs mx-auto leading-relaxed">
                The gym owner at <span className="text-[#FF5722] font-semibold">{gymName}</span> has been notified via instant push message and email. They will confirm your pass within 24 hours.
              </p>
              <Button onClick={handleClose} className="w-full bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-semibold">
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Date Selection */}
              <div className="space-y-2">
                <Label className="text-gray-300 text-xs flex items-center gap-1.5 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-[#FF5722]" /> Preferred Visit Date *
                </Label>
                <Input
                  type="date"
                  min={tomorrow}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-11 bg-white/5 border-white/10 text-white"
                />
              </div>

              {/* Time Slot Selection */}
              <div className="space-y-2">
                <Label className="text-gray-300 text-xs flex items-center gap-1.5 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-[#FF5722]" /> Preferred Time Slot
                </Label>
                <div className="space-y-2">
                  {SLOTS.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setSlot(s)}
                      className={`w-full p-3 rounded-xl text-xs font-medium text-left border transition-all ${
                        slot === s
                          ? 'bg-[#FF5722]/20 border-[#FF5722] text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Note */}
              <div className="space-y-2">
                <Label className="text-gray-300 text-xs font-semibold">Note to Gym (Optional)</Label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="e.g. Interested in personal training and sauna facilities..."
                  className="w-full rounded-md bg-white/5 border border-white/10 text-white text-xs p-3 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold text-sm shadow-lg shadow-[#FF5722]/30 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting Request...
                  </>
                ) : (
                  <>
                    <Ticket className="w-4 h-4" /> Request Free Day Pass
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
