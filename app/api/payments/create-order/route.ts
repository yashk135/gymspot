import { NextRequest, NextResponse } from 'next/server';
import { PRICING_TIERS } from '@/lib/payments';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, billingCycle, currency, ownerEmail, ownerName } = body;

    const tier = PRICING_TIERS[planId as 'pro' | 'featured'] || PRICING_TIERS.pro;
    const isAnnual = billingCycle === 'annual';

    const prices: Record<string, number> = isAnnual ? tier.annualPrice : tier.monthlyPrice;
    const amount = prices[currency] || prices.INR;

    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    return NextResponse.json({
      success: true,
      orderId,
      amount: amount * 100, // in smallest currency unit (paise/cents)
      currency,
      planId,
      planName: tier.name,
      ownerEmail,
      ownerName,
      checkoutUrl: `/owner/dashboard?payment=success&plan=${planId}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create payment order' }, { status: 500 });
  }
}
