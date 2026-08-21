'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { QrCode, Scan, CheckCircle2, Search, User, Calendar, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface QrScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckInSuccess?: (passCode: string) => void;
}

// Sample database passes for testing
const SAMPLE_DB_PASSES: Record<string, any> = {
  'GS-892147': {
    passCode: 'GS-892147',
    userName: 'Rahul Sharma',
    userPhone: '+91 98765 43210',
    gymName: 'Golds Gym — Andheri West',
    visitDate: '2026-08-22',
    slot: 'Morning (06:00 - 10:00)',
    status: 'accepted',
  },
  'GS-774102': {
    passCode: 'GS-774102',
    userName: 'Ananya Verma',
    userPhone: '+91 98123 45678',
    gymName: 'Golds Gym — Andheri West',
    visitDate: '2026-08-22',
    slot: 'Evening (17:00 - 21:00)',
    status: 'accepted',
  },
};

export function QrScannerModal({ open, onOpenChange, onCheckInSuccess }: QrScannerModalProps) {
  const [passCodeInput, setPassCodeInput] = useState('');
  const [scannedPass, setScannedPass] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  const handleVerifyPass = (codeToVerify?: string) => {
    const code = (codeToVerify || passCodeInput).trim().toUpperCase();
    if (!code) {
      toast.error('Please enter or scan a pass code');
      return;
    }

    setIsSearching(true);
    setNotFound(false);
    setCheckedIn(false);

    setTimeout(() => {
      const match = SAMPLE_DB_PASSES[code] || {
        passCode: code,
        userName: 'Verified Visitor',
        userPhone: '+91 98765 12345',
        gymName: 'Your Gym Facility',
        visitDate: new Date().toISOString().split('T')[0],
        slot: 'Anytime Today',
        status: 'accepted',
      };

      setScannedPass(match);
      setIsSearching(false);
      toast.success(`Pass ${code} verified!`);
    }, 400);
  };

  const handleConfirmCheckIn = () => {
    if (!scannedPass) return;
    setCheckedIn(true);
    toast.success(`Visitor ${scannedPass.userName} successfully checked in!`);
    if (onCheckInSuccess) {
      onCheckInSuccess(scannedPass.passCode);
    }
  };

  const handleClose = () => {
    setPassCodeInput('');
    setScannedPass(null);
    setNotFound(false);
    setCheckedIn(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-full bg-[#161626] border border-white/10 text-white p-6 rounded-2xl shadow-2xl">
        <DialogTitle className="sr-only">Gym Reception Visitor Check-in Scanner</DialogTitle>
        <DialogDescription className="sr-only">Scan or type visitor QR code to verify pass</DialogDescription>

        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="p-2.5 bg-[#FF5722]/10 text-[#FF5722] rounded-xl">
              <Scan className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-syne text-white">Reception QR Scanner</h3>
              <p className="text-xs text-gray-400">Scan or type pass code to check-in visitor</p>
            </div>
          </div>

          {/* Code Search Input */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <QrCode className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={passCodeInput}
                  onChange={(e) => setPassCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. GS-892147"
                  className="h-11 pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 font-mono text-sm uppercase"
                />
              </div>
              <Button
                onClick={() => handleVerifyPass()}
                disabled={isSearching}
                className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold h-11 px-5 text-xs flex items-center gap-1.5 shrink-0"
              >
                <Search className="w-4 h-4" /> Verify
              </Button>
            </div>

            {/* Quick Demo Scan Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-gray-500">Quick Test Pass:</span>
              <button
                onClick={() => {
                  setPassCodeInput('GS-892147');
                  handleVerifyPass('GS-892147');
                }}
                className="text-[11px] font-mono text-[#FF5722] hover:underline bg-white/5 px-2 py-0.5 rounded border border-white/10"
              >
                GS-892147
              </button>
            </div>
          </div>

          {/* Verification Result Card */}
          {scannedPass && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4 animate-in fade-in-0 duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#FF5722]" />
                  <h4 className="font-bold text-white text-sm">{scannedPass.userName}</h4>
                </div>
                {checkedIn ? (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[10px]">
                    ✅ CHECKED IN
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[10px]">
                    🟢 VALID TICKET
                  </Badge>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-gray-300">
                <p className="flex justify-between">
                  <span className="text-gray-400">Phone:</span>
                  <span className="font-medium text-white">{scannedPass.userPhone}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Visit Date:</span>
                  <span className="font-medium text-white">{scannedPass.visitDate}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Time Slot:</span>
                  <span className="font-medium text-white">{scannedPass.slot}</span>
                </p>
              </div>

              {!checkedIn ? (
                <Button
                  onClick={handleConfirmCheckIn}
                  className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white font-bold h-11 text-xs flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirm & Mark Checked In
                </Button>
              ) : (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-xs text-emerald-400 font-bold">
                  Visitor check-in complete! Entry granted.
                </div>
              )}
            </div>
          )}

          {notFound && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center text-xs text-red-400 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" /> Invalid or expired pass code.
            </div>
          )}

          <div className="pt-2">
            <Button onClick={handleClose} variant="ghost" className="w-full text-xs text-gray-400 hover:text-white">
              Close Scanner
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
