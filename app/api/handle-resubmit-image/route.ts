import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { getEncryptedNricFromSession } from '../../../lib/session';

const prisma = new PrismaClient();

type ImageRequestBody = {
  image: string;
  nric: string;
  bookingId: number;
};

export async function POST(req: NextRequest) {
  try {
    const { image, bookingId }: ImageRequestBody = await req.json();
    console.log('bookingId:', bookingId);
    const encryptedNric = await getEncryptedNricFromSession(req);
    if (encryptedNric instanceof NextResponse) {
      return encryptedNric; // Return the redirect response if necessary
    }
    // Validate input
    if (!image || bookingId === undefined || encryptedNric === undefined) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    // Save image to the server (if needed)
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Define a path to save the image
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const schedule = await prisma.booking_schedules.findFirst({
      where: {
        id: bookingId,
        Status_app: '4',
        ...(encryptedNric && { nric: encryptedNric }), 
      },
    });


    if (schedule) {
      const fileName = schedule?.passid + encryptedNric?.slice(-4);
      console.log('file name:', fileName);
      const filePath = path.join(uploadsDir, fileName + '.png');
      fs.writeFileSync(filePath, buffer);


      const updatedSchedule = await prisma.booking_schedules.update({
        where: { id: schedule.id }, // Using the unique identifier for update
        data: {
            
        },
    });
      // Respond with a success message and save the additional data if needed
      return NextResponse.json({
        message: 'Resubmit Image uploaded successfully',
        data: {
          fileName,
        },
      }, { status: 200 });
    }

    return NextResponse.json({ error: 'Error handling the upload' }, { status: 500 });
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json({ error: 'Error handling the upload' }, { status: 500 });
  }
}
