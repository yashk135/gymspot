'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Mail, Phone, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  // Email login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone login state
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  // Google OAuth
  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  // Email/Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    toast.success('Logged in successfully!');
    router.push('/');
    router.refresh();
  };

  // Phone OTP
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullPhone = `${countryCode}${phone.replace(/\D/g, '')}`;
    if (!phone || phone.length < 6) {
      toast.error('Please enter a valid phone number');
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
    router.push(`/verify-otp?phone=${encodeURIComponent(fullPhone)}&type=user`);
  };

  return (
    <Card className="w-full max-w-md bg-[#161626] border-white/10 text-white z-10">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-syne font-bold">Welcome Back</CardTitle>
        <CardDescription className="text-gray-400">
          Sign in to discover gyms near you
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Google OAuth */}
        <Button
          variant="outline"
          className="w-full h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 flex items-center gap-3"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </Button>

        <div className="flex items-center gap-3">
          <Separator className="flex-1 bg-white/10" />
          <span className="text-xs text-gray-500 uppercase tracking-wider">or</span>
          <Separator className="flex-1 bg-white/10" />
        </div>

        {/* Tabs: Phone / Email */}
        <Tabs defaultValue="phone" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
            <TabsTrigger value="phone" className="data-[state=active]:bg-[#FF5722] data-[state=active]:text-white text-gray-400 gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Phone
            </TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:bg-[#FF5722] data-[state=active]:text-white text-gray-400 gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Email
            </TabsTrigger>
          </TabsList>

          {/* Phone Tab */}
          <TabsContent value="phone">
            <form onSubmit={handlePhoneLogin} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">Phone Number</Label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-24 h-11 rounded-md bg-white/5 border border-white/10 text-white text-sm px-2 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+81">🇯🇵 +81</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+86">🇨🇳 +86</option>
                  </select>
                  <Input
                    type="tel"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-semibold"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send OTP'}
              </Button>
            </form>
          </TabsContent>

          {/* Email Tab */}
          <TabsContent value="email">
            <form onSubmit={handleEmailLogin} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">Email Address</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-semibold"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Footer Links */}
        <div className="text-center space-y-3 pt-2">
          <p className="text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#FF5722] hover:underline font-medium">
              Sign Up
            </Link>
          </p>
          <p className="text-sm text-gray-500">
            Own a gym?{' '}
            <Link href="/owner/login" className="text-[#FF5722] hover:underline font-medium">
              Gym Owner Login
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
