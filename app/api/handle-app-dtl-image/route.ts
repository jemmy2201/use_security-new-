import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ImageRequestBody = {
  image: string;
  nric: string;
  applicationType: string;
};

export async function POST(req: NextRequest) {
  try {
    const { image, nric, applicationType }: ImageRequestBody = await req.json();
    console.log('applicationType:', applicationType);
    // Validate input
    if (!image || applicationType === undefined || nric === undefined) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    let appType = '';
    if (applicationType == 'SO') {
      appType = '1';
    }
    if (applicationType == 'PI') {
      appType = '2';
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
        ...(nric && { nric }),  // Conditionally adds the `nric` filter if `nric` is provided
        app_type: appType,       // Fixed filter for app_type
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
      const fileName = schedule?.passid + nric.slice(-4);
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
