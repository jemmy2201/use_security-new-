import { PrismaClient } from '@prisma/client';
import { getEncryptedNricFromSession } from '../../../lib/session';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const encryptedNric = await getEncryptedNricFromSession();

    // Find records with optional filters
    const schedules = await prisma.booking_schedules.findMany({
      where: {
        ...(encryptedNric && { nric: encryptedNric }), 
        AND: [
          {
            Status_app: {
              not: null, // Exclude null values
            },
          },
          {
            Status_app: {
              not: '', // Exclude empty strings
            },
          },
        ],
      },
    });
    console.log('total pass cards: ', schedules.length);
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
    await prisma.$disconnect(); 
  }
}
