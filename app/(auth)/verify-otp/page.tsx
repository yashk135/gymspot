'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, ShieldCheck } from 'lucide-react';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const phone = searchParams.get('phone') || '';
  const userName = searchParams.get('name') || '';
  const userType = searchParams.get('type') || 'user'; // 'user' | 'owner'

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const token = otp.join('');
    if (token.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // Create profile if new user with name
    if (data.user && userName) {
      if (userType === 'owner') {
        const country = searchParams.get('country') || 'India';
        const currency = searchParams.get('currency') || 'INR';
        await (supabase.from('gym_owners') as any).upsert({
          id: data.user.id,
          name: userName,
          email: data.user.email || `${phone}@gymspot.phone`,
          phone,
          country,
          currency,
        });
      } else {
        await (supabase.from('users') as any).upsert({
          id: data.user.id,
          name: userName,
          email: data.user.email || `${phone}@gymspot.phone`,
          phone,
        });
      }
    }

    toast.success('Verified successfully!');
    if (userType === 'owner') {
      router.push('/owner/listing/create');
    } else {
      router.push('/');
    }
    router.refresh();
  };

  const handleResend = async () => {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('OTP resent!');
  };

  return (
    <Card className="w-full max-w-md bg-[#161626] border-white/10 text-white z-10">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto p-3 rounded-xl bg-[#FF5722]/10 w-fit">
          <ShieldCheck className="w-6 h-6 text-[#FF5722]" />
        </div>
        <CardTitle className="text-2xl font-syne font-bold">Verify OTP</CardTitle>
        <CardDescription className="text-gray-400">
          Enter the 6-digit code sent to <span className="text-white font-medium">{phone}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* OTP Input */}
        <div className="flex justify-center gap-3" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-bold bg-white/5 border-white/10 text-white focus:border-[#FF5722] focus:ring-[#FF5722]"
            />
          ))}
        </div>

        <Button
          onClick={handleVerify}
          className="w-full h-11 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-semibold"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Continue'}
        </Button>

        <div className="text-center">
          <button
            onClick={handleResend}
            className="text-sm text-gray-400 hover:text-[#FF5722] transition-colors"
          >
            Didn&apos;t receive the code? <span className="font-medium text-[#FF5722]">Resend</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <Card className="w-full max-w-md bg-[#161626] border-white/10 text-white z-10">
        <CardContent className="p-8 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#FF5722]" />
        </CardContent>
      </Card>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}
