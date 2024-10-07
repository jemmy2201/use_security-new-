import { PrismaClient } from '@prisma/client';
import { getEncryptedNricFromSession } from '../../../lib/session';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const encryptedNric = await getEncryptedNricFromSession(request);
    if (encryptedNric instanceof NextResponse) {
      return encryptedNric;
    }

    // const schedules = await prisma.booking_schedules.findMany({
    //   where: {
    //     ...(encryptedNric && { nric: encryptedNric }),
    //     app_type: {
    //       not: '3',
    //     },
    //     AND: [
    //       {
    //         OR: [
    //           { Status_app: '0' },
    //           { Status_app: '1' },
    //           { Status_app: '2' },
    //           { Status_app: '3' },
    //           { Status_app: '4' },
    //           { Status_app: '5' },
    //           { Status_app: '6' },
    //         ]
    //       }
    //     ],
    //   },
    // });

    const schedules = await prisma.booking_schedules.findMany({
      where: {
        ...(encryptedNric && { nric: encryptedNric }),
        app_type: '1',
        card_issue: {
          not: 'N',
        },
        AND: [
          {
            OR: [
              { Status_app: '0' },
              { Status_app: '1' },
              { Status_app: '2' },
              { Status_app: '3' },
              { Status_app: '4' },
              { Status_app: '5' },
              { Status_app: '6' },
            ]
          }
        ],
      },
    });

    schedules.forEach(s => s.data_barcode_paynow = "");
    schedules.forEach(s => s.QRstring = "");

    const renewSchedules = await prisma.booking_schedules.findMany({
      where: {
        ...(encryptedNric && { nric: encryptedNric }),
        card_issue: {
          not: 'N',
        },
        AND: [
          {
            OR: [
              { app_type: '2' },
              { app_type: '3' },
            ]
          }
        ],
      },
    });

    if (renewSchedules) {

      renewSchedules.forEach(s => s.data_barcode_paynow = "");
      renewSchedules.forEach(s => s.QRstring = "");
      const replacer = (key: string, value: any) => {
        if (typeof value === 'bigint') {
          return value.toString();
        }
        return value;
      };
      const allSchedule = [...schedules, ...renewSchedules];
      console.log('allSchedule pass cards: ', allSchedule.length);
      return new Response(JSON.stringify(allSchedule, replacer), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('total pass cards: ', schedules.length);
    const replacer = (key: string, value: any) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    };

    return new Response(JSON.stringify(schedules, replacer), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log('error ', error);
    return new Response(JSON.stringify({ error: 'Error fetching schedules' }), { status: 500 });

  } finally {
    await prisma.$disconnect();
  }
}
