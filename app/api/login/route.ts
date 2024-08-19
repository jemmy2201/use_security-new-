import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    //const nric = url.searchParams.get('nric');
    const nric = 'VHBPYi91dDdMSS83VXJEZVllcElWUT09';

    // Find records with optional filters
    const schedules = await prisma.booking_schedules.findMany({
      where: {
        ...(nric && { nric: nric }), // This conditionally adds the `name` filter if `name` is provided
      },
    });


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
