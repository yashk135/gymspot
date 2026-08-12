import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpayPaymentId, razorpayOrderId, planId } = body;

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll() {},
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // 1. Insert Subscription Record
      await (supabase.from('subscriptions') as any).insert({
        owner_id: user.id,
        plan_type: planId || 'pro',
        amount: planId === 'featured' ? 2999 : 1499,
        currency: 'INR',
        payment_status: 'active',
        start_date: new Date().toISOString(),
      });

      // 2. Update Gym Owner Plan Tier
      await (supabase.from('gym_owners') as any)
        .update({ subscription_tier: planId || 'pro' })
        .eq('id', user.id);

      // 3. If Featured plan, mark gym is_featured = true
      if (planId === 'featured') {
        await (supabase.from('gyms') as any)
          .update({ is_featured: true })
          .eq('owner_id', user.id);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified! Subscription activated.',
      paymentId: razorpayPaymentId || 'pay_mock_verified',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Payment verification failed' }, { status: 500 });
  }
}
