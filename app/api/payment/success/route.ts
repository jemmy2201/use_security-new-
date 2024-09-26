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

function getStripeKey(): string {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
        throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
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
        return NextResponse.json({ error: 'Session ID not found' }, { status: 400 });
    }
    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);

        const schedule = await prisma.booking_schedules.findFirst({
            where: { stripe_session_id: session.id },
        });

        if (schedule && session.payment_status == 'paid') {
            const paymentIntentId = session.payment_intent as string;
            const currentDate = formatDateToDDMMYYYY(new Date());
            const updatedSchedule = await prisma.booking_schedules.update({
                where: { id: schedule.id },
                data: {
                    Status_app: '1',
                    Status_draft: '1',
                    stripe_payment_id: paymentIntentId,
                    status_payment: '1',
                    trans_date: currentDate,
                },
            });
            const replacer = (key: string, value: any) => {
                if (typeof value === 'bigint') {
                    return value.toString();
                }
                return value;
            };
            console.log('generating pdf:', schedule.id);
            generatePdfReceipt(schedule);
            console.log('pdf generated:', schedule.id);
            return new Response(JSON.stringify(schedule, replacer), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });

        } else {
            console.log('Payment fail');
            return NextResponse.json({ error: 'Payment fail' }, { status: 500 });
        }

    } catch (error) {
        console.log('error in payment success update', error);
        return NextResponse.json({ error: 'Unable to retrieve session' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }

    function formatDateToDDMMYYYY(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
}

const generatePdfReceipt = async (schedule: booking_schedules) => {
    try {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        pdfDoc.registerFontkit(fontkit);


        const nric = encryptDecrypt(schedule.nric, 'decrypt');

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
        const logoDims = logoImage.scale(0.25);
      
        // Draw the logo on the left side
        page.drawImage(logoImage, {
          x: 50,
          y: page.getHeight() - logoDims.height - 30, // Adjust Y position for the top
          width: logoDims.width,
          height: logoDims.height,
        });
      
        // Load the custom font for the address
        const fontPath = path.resolve('public/font', 'Roboto-Regular.ttf'); 
        const fontBytes = fs.readFileSync(fontPath);
        const customFont = await pdfDoc.embedFont(fontBytes);
      
        // Address text
        const addressText = "Union of Security Employees (USE) \n200 Jalan Sultan \n#03-24 Textile Centre \nSingapore 199018";
        const fontSize = 12;
        const textWidth = customFont.widthOfTextAtSize(addressText, fontSize);
      
        // Draw the address text on the right side
        page.drawText(addressText, {
          x: page.getWidth() - textWidth - 50, // Adjust x position for the right side
          y: page.getHeight() - 30, // Adjust y position near the top
          size: fontSize,
          font: customFont,
          color: rgb(0, 0, 0), // Black text color
        });
      
        // Calculate the vertical position for the table
        const tableTop = page.getHeight() - logoDims.height - 30 - 40; // Below the logo and address
      
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
            { column1: 'NRIC / FIN no.', column2: nric },
        ];
      
        // Draw the table
        const columnWidths = [300, 300];
        tableData.forEach((row, index) => {
          const yPosition = tableTop - index * 20; // Calculate Y position for each row
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

        const folderPath = path.join(process.cwd(), 'public', 'receipts');
        const filePath = path.join(folderPath, schedule.passid + '.pdf');

        fs.mkdirSync(folderPath, { recursive: true });

        fs.writeFileSync(filePath, pdfBytes);

    } catch (error) {
        console.error('Error generating PDF:', error);
    } finally {
        await prisma.$disconnect();
        fs.close;
    }
};




