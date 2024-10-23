import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { getEncryptedNricFromSession } from '../../../../lib/session';

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

  const { bookingId } = body;
  const encryptedNric = await getEncryptedNricFromSession(req);
  if (encryptedNric instanceof NextResponse) {
    return encryptedNric; // Return the redirect response if necessary
  }
  console.log('bookingId:', bookingId);
  console.log('encrypted nric:', encryptedNric);

  // Validate required fields
  if (!encryptedNric || !bookingId) {
    return NextResponse.json(
      { error: 'nric / fin, bookingId are required' },
      { status: 400 }
    );
  }

  try {

    const schedule = await prisma.booking_schedules.findFirst({
      where: {
        ...(encryptedNric && { nric: encryptedNric }),
        id: bookingId,
        AND: [
          {
            OR: [
              { Status_app: '0' },
              { Status_app: null },
              { Status_app: '' },
              { Status_app: '6' }
            ]
          }
        ],
      },
    });

    if (schedule) {
      const transaction_amount_id = await prisma.transaction_amounts.findFirst({
        where: {
          app_type: schedule?.app_type,
          card_type: schedule?.card_id,
        },
      });
      const gst = await prisma.gsts.findFirst({});
      if (transaction_amount_id && gst) {

        const transactionAmount: number = parseFloat(transaction_amount_id.transaction_amount ?? '0');
        const gstAmount = parseFloat(gst.amount_gst ?? '0');

        const grandTotal: number = transactionAmount + gstAmount;
        const total: number = grandTotal * 100;

        const userRecord = await prisma.users.findFirst({
          where: {
            ...(encryptedNric && { nric: encryptedNric }),
          },
        });

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card', 'paynow'],
          line_items: [
            {
              price_data: {
                currency: 'sgd',
                product_data: {
                  name: 'Union of Security Employees (USE)',
                },
                unit_amount: total,
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          payment_intent_data: {
            description: 'Registration Fees',
            metadata: {
              passid: schedule.passid,
              id: schedule.id.toString(),
            }
          },
          customer_email: userRecord?.email ? userRecord?.email : '',
          success_url: `${process.env.NEXT_PUBLIC_URL}/passcard?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
        });
        console.log('session id generated at stripe checkout session ', session.id);
        console.log('payment intent generated at stripe checkout session ', session.payment_intent);

        await prisma.booking_schedules.update({
          where: { id: schedule.id },
          data: {
            gst_id: gst.id.toString(),
            transaction_amount_id: transaction_amount_id?.id.toString(),
            grand_total: grandTotal.toString() + '0',
            stripe_session_id: session.id,
          },
        });
        return NextResponse.json({ sessionId: session.id });

      }
    }
    return NextResponse.json({ error: 'Technical error' }, { status: 500 });
  } catch (err: any) {
    console.log('Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
