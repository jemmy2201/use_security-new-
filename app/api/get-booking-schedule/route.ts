import { PrismaClient } from '@prisma/client';
import { encryptDecrypt } from '../../utils/encryptDecrypt'
import { getEncryptedNricFromSession } from '../../../lib/session';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const bookingIdString = url.searchParams.get('bookingId');
  if (!bookingIdString) {
    return new Response('Booking ID is required', { status: 400 });
  }
  try {


    const encryptedNric = await getEncryptedNricFromSession(request);
    if (encryptedNric instanceof NextResponse) {
      return encryptedNric; 
    }
    console.log('get-booking-schedule, bookingIdString:encryptedNric', bookingIdString, encryptedNric);


    const bookingId = BigInt(bookingIdString) as bigint;
    const schedules = await prisma.booking_schedules.findUnique({
      where: {
        ...(encryptedNric && { nric: encryptedNric }),
        id: bookingId,
      } as any,
    });

    console.log('schedules', schedules);
    // Custom replacer function to convert BigInt to string
    const replacer = (key: string, value: any) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    };
    
    if(schedules){
      schedules.data_barcode_paynow= '';
      schedules.QRstring= '';
    }


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
