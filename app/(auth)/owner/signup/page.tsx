'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, Building2, Globe } from 'lucide-react';

const COUNTRIES = [
  { code: 'IN', name: 'India', currency: 'INR', phone: '+91', flag: '🇮🇳' },
  { code: 'US', name: 'United States', currency: 'USD', phone: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', phone: '+44', flag: '🇬🇧' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED', phone: '+971', flag: '🇦🇪' },
  { code: 'AU', name: 'Australia', currency: 'AUD', phone: '+61', flag: '🇦🇺' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', phone: '+65', flag: '🇸🇬' },
  { code: 'DE', name: 'Germany', currency: 'EUR', phone: '+49', flag: '🇩🇪' },
  { code: 'CA', name: 'Canada', currency: 'CAD', phone: '+1', flag: '🇨🇦' },
  { code: 'JP', name: 'Japan', currency: 'JPY', phone: '+81', flag: '🇯🇵' },
  { code: 'FR', name: 'France', currency: 'EUR', phone: '+33', flag: '🇫🇷' },
];

export default function OwnerSignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'info' | 'credentials'>('info');

  // Owner info
  const [name, setName] = useState('');
  const [gymName, setGymName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);

  // Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');

  const handleCountryChange = (code: string) => {
    const country = COUNTRIES.find((c) => c.code === code);
    if (country) setSelectedCountry(country);
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?type=owner&country=${selectedCountry.name}&currency=${selectedCountry.currency}`,
      },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 'info') {
      if (!name || !gymName) {
        toast.error('Please fill in all fields');
        return;
      }
      setStep('credentials');
      return;
    }

    // Step: credentials
    if (!email || !password) {
      toast.error('Please fill in email and password');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role: 'owner' },
      },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // Create gym owner profile
    if (data.user) {
      await (supabase.from('gym_owners') as any).insert({
        id: data.user.id,
        name,
        email,
        phone: phone ? `${selectedCountry.phone}${phone.replace(/\D/g, '')}` : null,
        country: selectedCountry.name,
        currency: selectedCountry.currency,
      });
    }

    toast.success('Owner account created! Redirecting to listing wizard...');
    router.push('/owner/listing/create');
    router.refresh();
  };

  const handlePhoneSignup = async () => {
    const fullPhone = `${selectedCountry.phone}${phone.replace(/\D/g, '')}`;
    if (!name || !phone || phone.length < 6) {
      toast.error('Please fill in your name and phone number');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    toast.success('OTP sent to your phone!');
    router.push(
      `/verify-otp?phone=${encodeURIComponent(fullPhone)}&name=${encodeURIComponent(name)}&type=owner&country=${encodeURIComponent(selectedCountry.name)}&currency=${encodeURIComponent(selectedCountry.currency)}`
    );
  };

  return (
    <Card className="w-full max-w-md bg-[#161626] border-white/10 text-white z-10">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto p-3 rounded-xl bg-[#FF5722]/10 w-fit">
          <Building2 className="w-6 h-6 text-[#FF5722]" />
        </div>
        <CardTitle className="text-2xl font-syne font-bold">Register Your Gym</CardTitle>
        <CardDescription className="text-gray-400">
          {step === 'info'
            ? 'Tell us about yourself and your gym'
            : 'Set up your login credentials'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {step === 'info' ? (
          <>
            {/* Google OAuth */}
            <Button
              variant="outline"
              className="w-full h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 flex items-center gap-3"
              onClick={handleGoogleSignup}
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign up with Google
            </Button>

            <div className="flex items-center gap-3">
              <Separator className="flex-1 bg-white/10" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">or</span>
              <Separator className="flex-1 bg-white/10" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">Your Full Name</Label>
                <Input type="text" placeholder="Rahul Sharma" value={name} onChange={(e) => setName(e.target.value)} className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">Gym Name</Label>
                <Input type="text" placeholder="Gold's Gym Andheri" value={gymName} onChange={(e) => setGymName(e.target.value)} className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Country & Currency
                </Label>
                <select
                  value={selectedCountry.code}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full h-11 rounded-md bg-white/5 border border-white/10 text-white text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} ({c.currency})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">Phone Number (optional)</Label>
                <div className="flex gap-2">
                  <span className="flex items-center justify-center w-20 h-11 rounded-md bg-white/5 border border-white/10 text-white text-sm">
                    {selectedCountry.flag} {selectedCountry.phone}
                  </span>
                  <Input
                    type="tel"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1 h-11 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-semibold">
                  Continue with Email
                </Button>
                <Button
                  type="button"
                  onClick={handlePhoneSignup}
                  variant="outline"
                  className="flex-1 h-11 bg-white/5 border-white/10 text-white hover:bg-white/10 font-semibold"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Use Phone OTP'}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300">
              <p className="font-medium text-white">{name}</p>
              <p className="text-gray-400">{gymName} · {selectedCountry.flag} {selectedCountry.name} ({selectedCountry.currency})</p>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Email Address</Label>
              <Input type="email" placeholder="owner@gymname.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Create Password</Label>
              <div className="relative">
                <Input type={showPassword ? 'text' : 'password'} placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep('info')} className="flex-1 h-11 bg-white/5 border-white/10 text-white hover:bg-white/10">
                Back
              </Button>
              <Button type="submit" className="flex-1 h-11 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-semibold" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
              </Button>
            </div>
          </form>
        )}

        <div className="text-center space-y-3 pt-2">
          <p className="text-sm text-gray-400">
            Already registered?{' '}
            <Link href="/owner/login" className="text-[#FF5722] hover:underline font-medium">
              Owner Login
            </Link>
          </p>
          <p className="text-sm text-gray-500">
            Looking for gyms?{' '}
            <Link href="/signup" className="text-[#FF5722] hover:underline font-medium">
              User Signup
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
