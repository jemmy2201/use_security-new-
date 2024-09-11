import { PrismaClient } from '@prisma/client';
import { encryptDecrypt } from '../../utils/encryptDecrypt'

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const bookingIdString = url.searchParams.get('bookingId');
    console.log('get-booking-schedule, bookingIdString:', bookingIdString);
    if(!bookingIdString){
      return new Response(JSON.stringify({ error: 'Booking Id reqquire' }), { status: 400 });
    }

    const bookingId = BigInt(bookingIdString) as bigint;
    const schedules = await prisma.booking_schedules.findUnique({
      where: {
        id: bookingId,
      } as any, // Use this only if you are sure about the type
    });

    console.log('schedules', schedules);
    // Custom replacer function to convert BigInt to string
    const replacer = (key: string, value: any) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    };

    return new Response(JSON.stringify(schedules, replacer), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log('error ', error);
    return new Response(JSON.stringify({ error: 'Error fetching schedules' }), { status: 500 });

  } finally {
    await prisma.$disconnect(); // Ensure connection is closed
  }
}
