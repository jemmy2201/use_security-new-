import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { getEncryptedNricFromSession } from '../../../lib/session';

const prisma = new PrismaClient();

const copyImagePath = process.env.COPY_IMAGE_PATH;

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
      return encryptedNric;
    }
    if (!image || bookingId === undefined || encryptedNric === undefined) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    // const resizedImageBuffer = await sharp(buffer)
    //   .resize(400, 514)
    //   .toBuffer();
    const uploadsDir = path.join(process.cwd(), 'public', 'userdocs/img_users');
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

      console.log('copyImagePath:', copyImagePath);
      if (copyImagePath) {
        try {
          console.log('copy to app1');
          const uploadsDirApp1 = path.join(copyImagePath);
          const filePathApp1 = path.join(uploadsDirApp1, fileName + '.png');
          fs.writeFileSync(filePathApp1, buffer);
          console.log('copy to app1 done');
        } catch (error) {
          console.log('error in copy image to app1', error);
        }
      }

      await prisma.booking_schedules.update({
        where: { id: schedule.id },
        data: {
          Status_app: '5',
        },
      });

      const userRecord = await prisma.users.findFirst({
        where: {
          ...(encryptedNric && { nric: encryptedNric }),
        },
      });

      if (userRecord) {
        await prisma.users.update({
          where: { id: userRecord.id },
          data: {
            photo: fileName + '.png',
          },
        });
      }

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
