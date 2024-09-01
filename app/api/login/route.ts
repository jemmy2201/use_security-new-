import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    //const nric = url.searchParams.get('nric');
    const nric = 'REhXRHp1K0tZSC80R0tQdXlmcFd2dz09';

    // Find records with optional filters
    const schedules = await prisma.booking_schedules.findMany({
      where: {
        ...(nric && { nric: nric }), // Conditionally add the `nric` filter if provided
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
    

    console.log('schedules', schedules.length);
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
