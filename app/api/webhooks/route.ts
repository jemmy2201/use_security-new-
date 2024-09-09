import { NextRequest, NextResponse } from 'next/server';
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

export const POST = async (req: NextRequest) => {
  const sig = req.headers.get('stripe-signature') as string;

  let event;

  try {
    const body = await req.text(); // Get raw body for verification
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error(`Webhook Error: ${err}`);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  // Handle the event type
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Handle successful payment event
      console.log('Payment succeeded');
      break;
    case 'payment_intent.payment_failed':
      // Handle failed payment event
      console.log('Payment failed');
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  return NextResponse.json({ received: true }, { status: 200 });
};
