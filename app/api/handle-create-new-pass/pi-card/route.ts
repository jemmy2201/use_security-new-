import { PrismaClient } from '@prisma/client';
import { getEncryptedNricFromSession } from '../../../../lib/session';
import { booking_schedules } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export interface createNewPassApiResponse {
  errorCode?: string;
  errorMessage?: string;
  canCreateSoApplication?: boolean;
  canCreatePiApplication?: boolean;
  canCreateAvsoApplication?: boolean;
  passId?: string;
  recordId: string;
  cardId: string;
  grandTotal: string;
}

const mapToCreateNewPassApiResponse = (
  source: booking_schedules
): createNewPassApiResponse => {
  return {
    errorCode: '',
    errorMessage: '',
    canCreateSoApplication: false,
    canCreatePiApplication: false,
    canCreateAvsoApplication: false,
    passId: '',
    recordId: '',
    cardId: '',
    grandTotal: '',
  };
};

export async function GET(request: NextRequest) {
  const encryptedNric = await getEncryptedNricFromSession(request);
  if (encryptedNric instanceof NextResponse) {
    return encryptedNric;
  }
  try {
    const passList = await prisma.booking_schedules.findFirst({
      where: {
        ...(encryptedNric && { nric: encryptedNric }),
        card_id: '3',
        card_issue: {
          not: 'N',
        },
      },
    });
    console.log('passList', passList);
    if (!passList) {
      return new Response(JSON.stringify({ error: 'No record found' }), { status: 404 });
    }

    const schedules = await prisma.booking_schedules.findMany({
      where: {
        ...(encryptedNric && { nric: encryptedNric }),
        app_type: '1',
        card_id: '3',
        card_issue: {
          not: 'N',
        },
        AND: [
          {
            OR: [
              { Status_app: null },
              { Status_app: '' }
            ]
          }
        ],
      },
    });

    console.log('total pass cards: ', schedules.length);

    if (schedules.length == 0) {
      const booking_schedules = schedules[0];
      const responseData = mapToCreateNewPassApiResponse(booking_schedules);
      responseData.errorCode = '10000';
      responseData.errorMessage = 'Pass card application restriction'
      return new Response(JSON.stringify(responseData), { status: 200 });
    }

    if (schedules.length == 1) {
      const booking_schedules = schedules[0];

      const responseData = mapToCreateNewPassApiResponse(booking_schedules);
      responseData.canCreatePiApplication = true;
      responseData.passId = booking_schedules.passid;
      responseData.recordId = booking_schedules.id.toString();
      const transaction_amount_id = await prisma.transaction_amounts.findFirst({
        where: {
          app_type: booking_schedules?.app_type,
          card_type: booking_schedules?.card_id,
        },
      });
      const gst = await prisma.gsts.findFirst({});
      if (transaction_amount_id && gst) {

        const transactionAmount: number = parseFloat(transaction_amount_id.transaction_amount ?? '0');
        const gstAmount = parseFloat(gst.amount_gst ?? '0');

        const grandTotal: number = transactionAmount + gstAmount;
        responseData.grandTotal = grandTotal.toFixed(2);
      }
      responseData.cardId = booking_schedules.card_id ? booking_schedules.card_id : '';
      return new Response(JSON.stringify(responseData), { status: 200 });
    }

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
