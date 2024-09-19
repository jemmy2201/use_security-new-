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

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get('session_id');
    if (!session_id) {
        return NextResponse.json({ error: 'Session ID not found' }, { status: 400 });
    }
    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        //console.log('String session id:', session_id);
        //console.log('String session:', session);

        const schedule = await prisma.booking_schedules.findFirst({
            where: { stripe_session_id: session.id },
        });

        if (schedule && session.payment_status == 'paid') {
            const paymentIntentId = session.payment_intent as string;
            const currentDate = formatDateToDDMMYYYY(new Date());
            const updatedSchedule = await prisma.booking_schedules.update({
                where: { id: schedule.id },
                data: {
                    Status_app: '1',
                    Status_draft: '1',
                    stripe_payment_id: paymentIntentId,
                    status_payment: '1',
                    trans_date: currentDate,
                },
            });
            const replacer = (key: string, value: any) => {
                if (typeof value === 'bigint') {
                    return value.toString();
                }
                return value;
            };

            return new Response(JSON.stringify(schedule, replacer), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });

        } else {
            console.log('Payment fail');
            return NextResponse.json({ error: 'Payment fail' }, { status: 500 });
        }

    } catch (error) {
        console.log('error in payment success update', error);
        return NextResponse.json({ error: 'Unable to retrieve session' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }

    function formatDateToDDMMYYYY(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
}
