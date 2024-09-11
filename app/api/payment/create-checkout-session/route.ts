import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { nric, applicationType, bookingId } = body;
  console.log('applicationType:', applicationType);
  console.log('encrypted nric:', nric);
  let appType = '';
  if (applicationType === 'SO') {
    appType = '1';
  }
  if (applicationType === 'AVSO') {
    appType = '2';
  }
  if (applicationType === 'PI') {
    appType = '3';
  }
  console.log('appType:', appType);

  // Validate required fields
  if (!nric || !appType) {
    return NextResponse.json(
      { error: 'nric / fin, application type are required' },
      { status: 400 }
    );
  }


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
      payment_intent_data: {
        description: 'Registration Fees',
        metadata: {
          passid: '10005GSO',
          id: '101010628',
        }
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/passcard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    });
    console.log('session id generated at stripe checkout session ', session.id);
    console.log('payment intent generated at stripe checkout session ', session.payment_intent);

    const statusApp = '0';
    console.log('appType:', appType);
    const schedule = await prisma.booking_schedules.findFirst({
      where: {
        ...(nric && { nric }),
        app_type: appType,
      },
    });

    if (schedule) {
      const updatedSchedule = await prisma.booking_schedules.update({
        where: { id: schedule.id },
        data: {
          stripe_session_id: session.id,
        },
      });
    }

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.log('Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
