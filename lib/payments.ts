// Payment utilities supporting Razorpay (INR) and Stripe (USD / EUR / GBP / AED)

export interface PaymentOrderParams {
  planId: 'pro' | 'featured';
  billingCycle: 'monthly' | 'annual';
  currency: string; // 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED'
  ownerEmail: string;
  ownerName: string;
}

export const PRICING_TIERS = {
  pro: {
    name: 'Pro Tier',
    monthlyPrice: { INR: 1499, USD: 19, EUR: 18, GBP: 15, AED: 69 },
    annualPrice: { INR: 14390, USD: 182, EUR: 172, GBP: 144, AED: 660 }, // 20% discount
    features: [
      'Unlimited Photos & Video Tour',
      'Publish Active Deal Banners',
      'Priority Search Result Ranking',
      'Detailed Analytics & Inquiry Peak Hours',
      'Instant Email & FCM Push Notifications',
    ],
  },
  featured: {
    name: 'Featured Tier',
    monthlyPrice: { INR: 2999, USD: 39, EUR: 36, GBP: 30, AED: 139 },
    annualPrice: { INR: 28790, USD: 374, EUR: 345, GBP: 288, AED: 1334 }, // 20% discount
    features: [
      'Everything in Pro Tier',
      'Top Home Screen Placement (Featured Badge)',
      '3x Trial Request Conversion Guarantee',
      'Dedicated Account Manager & Listing Optimization',
    ],
  },
};

export async function initiatePayment(params: PaymentOrderParams) {
  try {
    const res = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create payment order');

    if (params.currency === 'INR') {
      // Trigger Razorpay modal
      return triggerRazorpay(data);
    } else {
      // Trigger Stripe Checkout redirect
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    }
  } catch (err: any) {
    throw err;
  }
}

function triggerRazorpay(orderData: any) {
  return new Promise((resolve, reject) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mockkey123',
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'GymSpot Premium',
      description: `Upgrade to ${orderData.planName}`,
      order_id: orderData.orderId,
      prefill: {
        name: orderData.ownerName,
        email: orderData.ownerEmail,
      },
      theme: {
        color: '#FF5722',
      },
      handler: async function (response: any) {
        try {
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              planId: orderData.planId,
            }),
          });
          const verifyData = await verifyRes.json();
          resolve(verifyData);
        } catch (e) {
          reject(e);
        }
      },
    };

    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } else {
      // Fallback verification for demo
      fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpayPaymentId: 'pay_mock123',
          razorpayOrderId: orderData.orderId,
          planId: orderData.planId,
        }),
      }).then((r) => r.json().then(resolve));
    }
  });
}
