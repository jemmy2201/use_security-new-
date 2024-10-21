
import { booking_schedules, PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getEncryptedNricFromSession } from '../../../lib/session';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const encryptedNric = await getEncryptedNricFromSession(request);
  if (encryptedNric instanceof NextResponse) {
    return encryptedNric;
  }

  try {

    const holidays = await prisma.dateholidays.findMany({
      where: {
        time_work: '2',
      },
      select: {
        date: true,
      },
    });
    console.log('halfday slots: ', holidays.map(h => h.date));
    return NextResponse.json(holidays.map(h => h.date));

  } catch (error) {
    console.error('Error fetching halfday dates:', error);
    return NextResponse.json({ error: 'Failed to fetch halfday dates' }, { status: 500 });
  }

}



