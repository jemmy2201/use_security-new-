
import { NextApiRequest, NextApiResponse } from 'next';
import { booking_schedules, PrismaClient } from '@prisma/client';
import axios from 'axios';

import cron from 'node-cron';
import { NextResponse, NextRequest } from 'next/server';

let taskStarted = false;
const prisma = new PrismaClient();

export async function GET(request: NextRequest, res: NextResponse) {
  console.log('scheduler starting');
  console.log('process.env.ENABLE_PHOTO_REJECTON_SMS:', process.env.ENABLE_PHOTO_REJECTON_SMS);
  const isEnable = process.env.ENABLE_PHOTO_REJECTON_SMS === 'true';

  if (!taskStarted) {
    taskStarted = true;

    // Schedule a task to run at 08:00 AM every day
    cron.schedule('0 15 * * *', () => {
      console.log('Running the scheduled task at 15:00 AM every day');
      if (isEnable) {
        sendSms();
      } else {
        console.log('sending sms for photo rejection is disabled');
      }
    });
    console.log('Cron job scheduled');
  }

  return new Response(JSON.stringify('scheduler started'), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function sendSms() {

  try {
    const username = process.env.GATEWAY_SMS_USERNAME;
    const password = process.env.GATEWAY_SMS_PASSWOD;
    const senderId = process.env.GATEWAY_SMS_SENDER;
    const apiUrl = process.env.GATEWAY_SMS_URL;

    const apiCredentials = {
      apiusername: username,
      apipassword: password,
    };

    const today = new Date();
    const dateFrom = new Date(today);
    dateFrom.setDate(today.getDate() - 2);
    const schedules = await prisma.booking_schedules.findMany({
      where: {
        Status_app: '4',
        updated_at: {
          gte: dateFrom,
        },
      },
    });

    schedules.map(async (booking) => {
      const encryptedNric = booking.nric;
      const userRecord = await prisma.users.findFirst({
        where: {
          ...(encryptedNric && { nric: encryptedNric }),
        },
      });
      const mobileno = userRecord?.mobileno;
      const smsMessage = `Please upload recent photo to complete your application`;
      console.log('sending sms to mobile, smsMessage:', mobileno, smsMessage);
      if (mobileno) {
        // const response = await axios.get(apiUrl?apiUrl:'', {
        //   params: {
        //     ...apiCredentials,
        //     mobileno: mobileno,
        //     message: smsMessage,
        //     senderid: senderId,
        //     languagetype: '1',
        //   },
        // });
        //console.log('SMS sent successfully data:', response.data);
      }
    });

  } catch (error) {
    console.log('Error in sending sms');
  }
  finally {
    await prisma.$disconnect();
  }

}