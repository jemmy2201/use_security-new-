import { NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripeKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
  }
  return key;
}

const stripe = new Stripe(getStripeKey(), {
  apiVersion: '2024-06-20', 
});

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paynow'],
      line_items: [
        {
          price_data: {
            currency: 'sgd',
            product_data: {
              name: 'Union of Security Employees (USE)',
            },
            unit_amount: 2250, 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/passcard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
