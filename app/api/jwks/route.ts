import { NextResponse } from 'next/server';
import { booking_schedules, PrismaClient } from '@prisma/client';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import encryptDecrypt from '@/utils/encryptDecrypt';
import { NEW, REPLACEMENT, RENEWAL } from '../../constant/constant';
import { SO_APP, AVSO_APP, PI_APP } from '../../constant/constant';
import { SO, SSO, SS, SSS, CSO } from '../../constant/constant';
import fontkit from '@pdf-lib/fontkit';
import bcrypt from 'bcrypt';


const prisma = new PrismaClient();

const cardTypeMap: { [key: string]: string } = {
  [SO_APP]: 'Security Officer (SO)/Aviation Security Officer (AVSO)',
  [PI_APP]: 'Personal Investigator',
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

const SALT_ROUNDS = 10;

export async function GET() {

  const jwksEnv = process.env.SINGPASS_PUBLIC_JWKS;

  if (!jwksEnv) {
    return NextResponse.json({ error: 'JWKS not found in environment variables' }, { status: 500 });
  }

  let jwks;
  try {
    jwks = JSON.parse(jwksEnv);
  } catch (error) {
    return NextResponse.json({ error: 'Error parsing JWKS from environment variables' }, { status: 500 });
  }

  //generatePdfReceipt();

  return NextResponse.json(jwks);
}


const generatePdfReceipt = async () => {
  try {

    const schedule = await prisma.booking_schedules.findUnique({
      where: {
        id: 101010632
      }
    });
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);



    if (schedule) {
      const appTypeString = appTypeMap[schedule.app_type] + '-' + cardTypeMap[schedule.card_id ? schedule.card_id : ''];

      const gradeTypeString = gradeTypeMap[schedule.grade_id ? schedule.grade_id : ''];
      const userRecord = await prisma.users.findFirst({
        where: {
          ...(schedule.nric && { nric: schedule.nric }),
        },
      });



      const page = pdfDoc.addPage([600, 800]); // Adjusted height for better layout

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
        y: page.getHeight() - 60,
        size: fontSize,
        font: customFont,
        color: rgb(1, 0, 0),
      });

      const tableTop = page.getHeight() - logoDims.height - 30 - 40;

      // Table data
      const tableData = [
        { column1: 'Transaction reference no.', column2: schedule.stripe_payment_id },
        { column1: 'Transaction date', column2: schedule.trans_date },
        { column1: 'Amount paid (inclusive of GST)', column2: schedule.grand_total },
        { column1: 'Type of application', column2: appTypeString },
        { column1: 'Grade', column2: gradeTypeString },
        { column1: 'Pass card no.', column2: schedule.passid },
        { column1: 'Pass card date of expiry', column2: schedule.expired_date },
        { column1: 'Full name', column2: userRecord?.name },
        { column1: 'NRIC / FIN no.', column2: schedule.nric },
      ];

      const rowHeight = 40;
      const rowGap = 10;
      const columnWidths = [300, 300];

      tableData.forEach((row, index) => {
        const yPosition = tableTop - index * (rowHeight + rowGap);
        page.drawText(row.column1, {
          x: 50,
          y: yPosition,
          size: 12,
          color: rgb(0, 0, 0),
        });
        page.drawText(row.column2 ? row.column2 : '', {
          x: 350,
          y: yPosition,
          size: 12,
          color: rgb(0, 0, 0),
        });
      });

      const pdfBytes = await pdfDoc.save();

      const folderPath = path.join(process.cwd(), 'public', 'userdocs/img_users/invoice');
      const filePath = path.join(folderPath, schedule.passid + '.pdf');

      fs.mkdirSync(folderPath, { recursive: true });

      fs.writeFileSync(filePath, pdfBytes);
    }


  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    await prisma.$disconnect();
    fs.close;
  }
};



