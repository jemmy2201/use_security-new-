// /app/api/scheduler/route.ts (or pages/api/scheduler.ts if using the old structure)

import { NextApiRequest, NextApiResponse } from 'next';
import { booking_schedules, PrismaClient } from '@prisma/client';

import cron from 'node-cron';

let taskStarted = false;
const prisma = new PrismaClient();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!taskStarted) {
    taskStarted = true;

    // Schedule a task to run at 10:00 AM every day
    cron.schedule('0 10 * * *', () => {

      console.log('Running the scheduled task at 10:00 AM every day');



    });

    console.log('Cron job scheduled');
  }

  res.status(200).json({ message: 'Scheduler is running' });
}

export async function sendSms() {

  try {

    const username = process.env.GATEWAY_SMS_USERNAME;
    const password = process.env.GATEWAY_SMS_PASSWOD;
    const senderId = process.env.GATEWAY_SMS_SENDER;

    const schedules = await prisma.booking_schedules.findMany({
      where: {
        Status_app: '4',
      },
    });


    schedules.map((booking) => {
      const encryptedNric = booking.nric;
      const userRecord = await prisma.users.findFirst({
        where: {
          ...(encryptedNric && { nric: encryptedNric }),
        },
      });
      const mobileno = userRecord?.mobileno;
      const smsMessage = `Please upload recent photo to complete your application`;
      const apiUrl = `http://gateway.onewaysms.sg:10002/api.aspx?&languagetype=1&apiusername=${username}&apipassword=${password}&mobile=${mobileno}&message=${encodeURIComponent(smsMessage)}&senderid=${senderId}`;
      console.log('sending sms to mobile, smsMessage:', mobileno, smsMessage);
      // const response = await fetch(apiUrl, {
      //     method: 'GET',
      // });

      // const result = await response.text();
      // console.log('SMS API Response:', result);

    });

  } catch (error) {
    console.log('Error in sending sms');
  }
  finally {
    await prisma.$disconnect();
  }

}

import axios from 'axios';

const sendSMS = async (phoneNumber: string, message: string) => {

  const username = process.env.GATEWAY_SMS_USERNAME;
  const password = process.env.GATEWAY_SMS_PASSWOD;
  const senderId = process.env.GATEWAY_SMS_SENDER;
  const apiUrl = 'http://gateway.onewaysms.sg:10002/api.aspx';
  const apiCredentials = {
    apiusername: username,
    apipassword: password,
  };

  try {
    const response = await axios.get(apiUrl, {
      params: {
        ...apiCredentials,
        mobileno: phoneNumber,     
        message: message,        
        senderid: 'USE',
        languagetype: '1',  
      },
    });
    console.log('SMS sent successfully data:', response.data);
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};
