'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ticket, Calendar, Clock, MapPin, CheckCircle2, ShieldCheck, Copy, Download, QrCode } from 'lucide-react';
import { toast } from 'sonner';

export interface QrPassData {
  id: string;
  passCode: string;
  gymName: string;
  gymAddress?: string;
  userName: string;
  userPhone?: string;
  visitDate: string;
  timeSlot: string;
  status: 'accepted' | 'pending' | 'checked_in' | 'declined';
}

interface QrPassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  passData: QrPassData | null;
}

export function QrPassModal({ open, onOpenChange, passData }: QrPassModalProps) {
  const [copied, setCopied] = useState(false);

  if (!passData) return null;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    JSON.stringify({
      passCode: passData.passCode,
      gymName: passData.gymName,
      user: passData.userName,
      date: passData.visitDate,
    })
  )}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(passData.passCode);
    setCopied(true);
    toast.success(`Pass Code ${passData.passCode} copied to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full bg-[#161626] border border-[#FF5722]/40 text-white p-6 rounded-2xl shadow-2xl shadow-[#FF5722]/20">
        <DialogTitle className="sr-only">Digital Gym Pass Ticket</DialogTitle>
        <DialogDescription className="sr-only">Scannable QR Pass for {passData.gymName}</DialogDescription>

        {/* Ticket Header */}
        <div className="space-y-4 text-center border-b border-white/10 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5722]/10 border border-[#FF5722]/30 text-xs font-bold text-[#FF5722]">
            <Ticket className="w-3.5 h-3.5" /> DIGITAL WORKOUT TICKET
          </div>
          <h2 className="text-2xl font-extrabold font-syne text-white">{passData.gymName}</h2>
          {passData.gymAddress && (
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#FF5722]" /> {passData.gymAddress}
            </p>
          )}
        </div>

        {/* Scannable QR Code Box */}
        <div className="my-2 p-6 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
          {/* Glowing Ring */}
          <div className="p-3 bg-white rounded-2xl shadow-xl shadow-black/50">
            <Image
              src={qrUrl}
              alt={`QR Code for pass ${passData.passCode}`}
              width={180}
              height={180}
              className="rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Pass Code:</span>
            <span className="font-mono font-extrabold text-sm text-[#FF5722] bg-[#FF5722]/10 px-2.5 py-0.5 rounded border border-[#FF5722]/30">
              {passData.passCode}
            </span>
            <button onClick={handleCopyCode} className="text-gray-400 hover:text-white p-1">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-gray-400 text-center">
            Show this QR Code to the gym receptionist for instant scan & check-in
          </p>
        </div>

        {/* Details List */}
        <div className="space-y-2 text-xs pt-1 border-t border-white/10">
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-gray-400">Visitor Name:</span>
            <span className="font-semibold text-white">{passData.userName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-gray-400">Visit Date:</span>
            <span className="font-semibold text-white flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#FF5722]" /> {passData.visitDate}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-gray-400">Time Slot:</span>
            <span className="font-semibold text-white flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#FF5722]" /> {passData.timeSlot}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-400">Pass Status:</span>
            {passData.status === 'checked_in' ? (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[10px]">
                ✅ CHECKED IN
              </Badge>
            ) : passData.status === 'accepted' ? (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[10px]">
                🟢 READY FOR VISIT
              </Badge>
            ) : (
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40 text-[10px]">
                🟡 PENDING CONFIRMATION
              </Badge>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex gap-3">
          <Button
            onClick={handleCopyCode}
            variant="outline"
            className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs h-10 font-bold"
          >
            <Copy className="w-3.5 h-3.5 mr-1.5 text-[#FF5722]" /> Copy Code
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="flex-1 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold text-xs h-10"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
