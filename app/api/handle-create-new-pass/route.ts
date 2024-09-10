import { PrismaClient } from '@prisma/client';
import { getEncryptedNricFromSession } from '../../../lib/session';
import { booking_schedules } from '@prisma/client';

const prisma = new PrismaClient();

export interface createNewPassApiResponse {
  errorCode?: string;
  errorMessage?: string;
  canCreateSoApplication?: boolean;
  canCreatePiApplication?: boolean;
  canCreateAvsoApplication?: boolean;
  passId?: string;
  recordId: string;
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
  };
};

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
      responseData.canCreateSoApplication = booking_schedules.app_type == '1' ? true : false;
      responseData.canCreateAvsoApplication = booking_schedules.app_type == '2' ? true : false;
      responseData.canCreatePiApplication = booking_schedules.app_type == '3' ? true : false;
      responseData.passId = booking_schedules.passid;
      responseData.recordId = booking_schedules.id.toString();
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
