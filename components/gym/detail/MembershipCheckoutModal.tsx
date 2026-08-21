'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Sparkles, Check, Lock, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PlanData {
  id: string;
  plan_name: string;
  duration_days: number;
  price: number;
  currency: string;
  features?: string[];
  is_best_value?: boolean;
}

interface MembershipCheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gymName: string;
  plans: PlanData[];
}

export function MembershipCheckoutModal({
  open,
  onOpenChange,
  gymName,
  plans,
}: MembershipCheckoutModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || 'p1');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<any>(null);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0] || {
    id: 'p1',
    plan_name: 'Monthly Membership',
    duration_days: 30,
    price: 3500,
    currency: 'INR',
    features: ['Full Gym Access', 'Locker Room', 'Steam Access'],
  };

  const basePrice = selectedPlan.price;
  const discountAmount = (basePrice * discount) / 100;
  const finalPrice = Math.max(0, basePrice - discountAmount);
  const currencySymbol = selectedPlan.currency === 'INR' ? '₹' : '$';

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'GYM10') {
      setDiscount(10);
      toast.success('Promo Code GYM10 Applied! 10% Discount!');
    } else if (promoCode.trim().toUpperCase() === 'VIP20') {
      setDiscount(20);
      toast.success('Promo Code VIP20 Applied! 20% Discount!');
    } else {
      toast.error('Invalid promo code. Try "GYM10" or "VIP20"');
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const receipt = {
        receiptId: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
        gymName,
        planName: selectedPlan.plan_name,
        amount: finalPrice,
        currency: selectedPlan.currency,
        date: new Date().toISOString().split('T')[0],
      };
      setSuccessReceipt(receipt);
      toast.success(`Membership for ${gymName} purchased successfully!`);
    }, 1200);
  };

  const handleClose = () => {
    setSuccessReceipt(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg w-full bg-[#161626] border border-[#FF5722]/40 text-white p-6 rounded-2xl shadow-2xl">
        <DialogTitle className="sr-only">Buy Gym Membership</DialogTitle>
        <DialogDescription className="sr-only">Checkout membership for {gymName}</DialogDescription>

        {successReceipt ? (
          <div className="py-8 text-center space-y-5 animate-in fade-in-0 duration-300">
            <div className="mx-auto p-4 bg-emerald-500/10 text-emerald-400 rounded-full w-fit">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-1">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-xs font-bold">
                PAYMENT SUCCESSFUL
              </Badge>
              <h3 className="text-2xl font-bold font-syne text-white">Membership Activated!</h3>
              <p className="text-xs text-gray-300">Receipt ID: <span className="font-mono text-[#FF5722] font-bold">{successReceipt.receiptId}</span></p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left text-xs space-y-2">
              <p className="flex justify-between"><span className="text-gray-400">Gym Facility:</span> <span className="font-bold text-white">{gymName}</span></p>
              <p className="flex justify-between"><span className="text-gray-400">Plan:</span> <span className="font-bold text-white">{successReceipt.planName}</span></p>
              <p className="flex justify-between"><span className="text-gray-400">Total Paid:</span> <span className="font-bold text-[#FF5722]">{currencySymbol}{successReceipt.amount.toLocaleString()}</span></p>
              <p className="flex justify-between"><span className="text-gray-400">Activation Date:</span> <span className="font-bold text-white">{successReceipt.date}</span></p>
            </div>

            <Button onClick={handleClose} className="w-full bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold h-11">
              Done & View In Profile
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <Badge className="bg-[#FF5722] text-white font-bold text-[10px] uppercase">
                  <Lock className="w-3 h-3 mr-1" /> 256-Bit SSL Secure Payment
                </Badge>
                <h3 className="text-xl font-bold font-syne text-white mt-1">Buy Membership</h3>
                <p className="text-xs text-gray-400">{gymName}</p>
              </div>
            </div>

            {/* Plan Selector */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-300 font-semibold">Select Membership Plan *</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {plans.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      selectedPlanId === p.id
                        ? 'bg-[#FF5722]/20 border-[#FF5722] text-white shadow-md shadow-[#FF5722]/20'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-sm text-white font-syne">{p.plan_name}</p>
                      <p className="text-[11px] text-gray-400">{p.duration_days} Days Access</p>
                    </div>
                    <span className="font-extrabold text-sm text-[#FF5722]">
                      {currencySymbol}{p.price.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <Input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Promo Code (e.g. GYM10)"
                className="h-10 bg-white/5 border-white/10 text-white uppercase text-xs placeholder:text-gray-500 font-mono"
              />
              <Button type="submit" variant="outline" className="h-10 border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs px-4">
                Apply
              </Button>
            </form>

            {/* Pricing Summary */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Base Price:</span>
                <span>{currencySymbol}{basePrice.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Promo Discount ({discount}%):</span>
                  <span>-{currencySymbol}{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>Platform Processing Fee:</span>
                <span className="text-emerald-400 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 text-base font-extrabold text-white">
                <span>Total Amount:</span>
                <span className="text-[#FF5722]">{currencySymbol}{finalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handlePayment}
              disabled={loading}
              className="w-full h-12 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold text-sm shadow-lg shadow-[#FF5722]/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" /> Pay {currencySymbol}{finalPrice.toLocaleString()} & Activate
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
