import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { getEncryptedNricFromSession } from '../../../lib/session';

const prisma = new PrismaClient();

type ImageRequestBody = {
  image: string;
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
    if (!image || !encryptedNric || !bookingId) {
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
        ...(encryptedNric && { nric: encryptedNric }),
        id: bookingId,
        AND: [
          {
            OR: [
              { Status_app: '4' },
              { Status_app: '0' },
              { Status_app: null },
              { Status_app: '' }
            ]
          }
        ],
      },
    });

    if (schedule) {

      schedule.data_barcode_paynow = '';

      const fileName = schedule?.passid + encryptedNric.slice(-4);
      console.log('file name:', fileName);
      const filePath = path.join(uploadsDir, fileName + '.png');
      fs.writeFileSync(filePath, buffer);

      // Respond with a success message and save the additional data if needed
      return NextResponse.json({
        message: 'Image uploaded successfully',
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
