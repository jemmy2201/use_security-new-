import { PrismaClient } from '@prisma/client';
import { encryptDecrypt } from '../../utils/encryptDecrypt'

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    //const nric = url.searchParams.get('nric');
    const id = 101010628;

    // Find records with optional filters
    const schedules = await prisma.booking_schedules.findUnique({
      where: {
        ...(id && { id: id }), 
      },
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
