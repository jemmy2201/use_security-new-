import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { booking_schedules, PrismaClient } from '@prisma/client';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import encryptDecrypt from '@/utils/encryptDecrypt';
import { NEW, REPLACEMENT, RENEWAL } from '../../../constant/constant';
import { SO_APP, AVSO_APP, PI_APP } from '../../../constant/constant';
import { SO, SSO, SS, SSS, CSO } from '../../../constant/constant';
import fontkit from '@pdf-lib/fontkit';

const prisma = new PrismaClient();

const cardTypeMap: { [key: string]: string } = {
  [SO_APP]: 'Security Officer (SO) / Aviation Security Officer (AVSO)',
  [PI_APP]: 'Private investigator (PI)',
};

const cardTypeCode: { [key: string]: string } = {
  [SO_APP]: 'SO',
  [PI_APP]: 'PI',
};

const appTypeMap: { [key: string]: string } = {
  [NEW]: 'New',
  [REPLACEMENT]: 'Replace',
  [RENEWAL]: 'Renew',
};

const gradeTypeMap: { [key: string]: string } = {
  [SO]: 'SO',
  [SSO]: 'SSO',
  [SS]: 'SS',
  [SSS]: 'SSS',
  [CSO]: 'CSO',
};

function getStripeKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      'STRIPE_SECRET_KEY is not defined in environment variables'
    );
  }
  return key;
}

const stripe = new Stripe(getStripeKey(), {
  apiVersion: '2024-06-20',
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get('session_id');
  if (!session_id) {
    return NextResponse.json(
      { error: 'Session ID not found' },
      { status: 400 }
    );
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    const schedule = await prisma.booking_schedules.findFirst({
      where: { stripe_session_id: session.id },
    });

    if (schedule && session.payment_status == 'paid') {
      const paymentIntentId = session.payment_intent as string;
      const formattedDate = formatDate();
      const receiptNumber =
        formatDateToDDMMYYYY(new Date()) + schedule?.id.toString().slice(-5);
      const updatedSchedule = await prisma.booking_schedules.update({
        where: { id: schedule.id },
        data: {
          Status_app: '1',
          Status_draft: '1',
          stripe_payment_id: paymentIntentId,
          status_payment: '1',
          trans_date: formattedDate,
          receiptNo: receiptNumber,
        },
      });
      const replacer = (key: string, value: any) => {
        if (typeof value === 'bigint') {
          return value.toString();
        }
        return value;
      };
      backgroundTask(updatedSchedule);
      if (updatedSchedule) {
        updatedSchedule.data_barcode_paynow = '';
        updatedSchedule.QRstring = '';
      }
      return new Response(JSON.stringify(updatedSchedule, replacer), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      console.log('Payment fail');
      return NextResponse.json({ error: 'Payment fail' }, { status: 500 });
    }
  } catch (error) {
    console.log('error in payment success update', error);
    return NextResponse.json(
      { error: 'Unable to retrieve session' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }

  function formatDate() {
    const date = new Date();

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
}

async function backgroundTask(schedule: booking_schedules) {
  console.log('Background task generate pdf started');
  generatePdfReceipt(schedule);
  console.log('Background task generate pdf completed');
}

const generatePdfReceipt = async (schedule: booking_schedules) => {
  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const nric = encryptDecrypt(schedule.nric, 'decrypt');

    const appTypeString =
      appTypeMap[schedule.app_type] +
      '-' +
      cardTypeMap[schedule.card_id ? schedule.card_id : ''];

    const gradeTypeString =
      gradeTypeMap[schedule.grade_id ? schedule.grade_id : ''];
    const userRecord = await prisma.users.findFirst({
      where: {
        ...(schedule.nric && { nric: schedule.nric }),
      },
    });

    const page = pdfDoc.addPage([600, 800]);

    // Load the logo image
    const logoImagePath = path.resolve('public/images', 'logo_pdf.png');
    const logoImageBytes = fs.readFileSync(logoImagePath);
    const logoImage = await pdfDoc.embedPng(logoImageBytes);
    const logoDims = logoImage.scale(0.1);

    // Draw the logo on the left side
    page.drawImage(logoImage, {
      x: 50,
      y: page.getHeight() - logoDims.height - 30,
      width: logoDims.width,
      height: logoDims.height,
    });

    const fontPath = path.resolve('public/font', 'Roboto-Regular.ttf');
    const fontBytes = fs.readFileSync(fontPath);
    const customFont = await pdfDoc.embedFont(fontBytes);

    // const addressText = "Union of Security Employees (USE) \n200 Jalan Sultan \n#03-24 Textile Centre \nSingapore 199018";
    const addressText = 'Union of Security Employees (USE)';
    const fontSize = 18;
    const textWidth = customFont.widthOfTextAtSize(addressText, fontSize);

    page.drawText(addressText, {
      x: page.getWidth() - textWidth - 50,
      y: page.getHeight() - 62,
      size: fontSize,
      font: customFont,
      color: rgb(1, 0, 0),
    });

    const tableTop = page.getHeight() - logoDims.height - 30 - 40;

    const tableData = [
      {
        column1: 'Transaction reference no.',
        column2: schedule.stripe_payment_id,
      },
      { column1: 'Receipt no.', column2: schedule.receiptNo },
      { column1: 'Transaction date', column2: schedule.trans_date },
      {
        column1: 'Amount paid (inclusive of GST)',
        column2: schedule.grand_total,
      },
      { column1: 'Type of application', column2: appTypeString },
      { column1: 'Grade', column2: gradeTypeString },
      { column1: 'ID card no.', column2: schedule.passid },
      { column1: 'Pass card date of expiry', column2: schedule.expired_date },
      { column1: 'Full name', column2: userRecord?.name },
      { column1: 'NRIC / FIN no.', column2: nric },
    ];

    const rowHeight = 30;
    const rowGap = 5;
    const columnWidths = [150, 350];
    const totalRows = tableData.length;

    const totalTableHeight = totalRows * (rowHeight + rowGap) - rowGap;
    const tableTopPosition = tableTop;

    page.drawRectangle({
      x: 50,
      y: tableTopPosition - totalTableHeight - 10,
      width: columnWidths[0] + columnWidths[1],
      height: totalTableHeight + 40,
      borderWidth: 1,
      borderColor: rgb(0, 0, 0),
    });

    tableData.forEach((row, index) => {
      const yPosition = tableTopPosition - index * (rowHeight + rowGap);

      page.drawText(row.column1, {
        x: 60,
        y: yPosition - 15,
        size: 11,
        color: rgb(0, 0, 0),
      });

      page.drawText(row.column2 ? row.column2 : '', {
        x: 235,
        y: yPosition - 15,
        size: 11,
        color: rgb(0, 0, 0),
      });
    });

    const pdfBytes = await pdfDoc.save();

    const folderPath = path.join(
      process.cwd(),
      'public',
      'userdocs/img_users/invoice'
    );

    const fileNameBuilder =
      'T_' +
      encryptDecrypt(schedule.nric, 'decrypt') +
      cardTypeCode[schedule.card_id ? schedule.card_id : ''] +
      '_' +
      formatDateToDDMMYYYY(new Date()) +
      schedule?.id.toString().slice(-5);
    const filePath = path.join(folderPath, fileNameBuilder + '.pdf');

    fs.mkdirSync(folderPath, { recursive: true });

    fs.writeFileSync(filePath, pdfBytes);
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    await prisma.$disconnect();
    fs.close;
  }
};

function formatDateToDDMMYYYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${year}${month}${day}`;
}
