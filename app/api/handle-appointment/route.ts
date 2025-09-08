import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, booking_schedules } from '@prisma/client';
import { getEncryptedNricFromSession } from "../../../lib/session";
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import encryptDecrypt from '@/utils/encryptDecrypt';
import { NEW, REPLACEMENT, RENEWAL } from '../../constant/constant';
import { SO_APP, AVSO_APP, PI_APP } from '../../constant/constant';
import { SO, SSO, SS, SSS, CSO } from '../../constant/constant';
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

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { appointmentDate, timeSlot, bookingId } = body;
        const encryptedNric = await getEncryptedNricFromSession(req);
        if (encryptedNric instanceof NextResponse) {
            return encryptedNric; // Return the redirect response if necessary
        }
        const formattedDate = new Date(appointmentDate).toISOString().split('T')[0];
        const [startTime, endTime] = timeSlot.split(" - ");
        if (!encryptedNric || !appointmentDate) {
            return NextResponse.json(
                { error: 'nric / fin, appointment date are required' },
                { status: 400 }
            );
        }

        const schedule = await prisma.booking_schedules.findFirst({
            where: {
                ...(encryptedNric && { nric: encryptedNric }),
                id: bookingId,
                AND: [
                    {
                        OR: [
                            { Status_app: '0' },
                            { Status_app: '1' },
                            { Status_app: '4' },
                        ]
                    }
                ],
            },
        });

        if (schedule) {

            const serializeBigInt = (obj: any) => {
                const serialized: any = {};
                for (const [key, value] of Object.entries(obj)) {
                    if (typeof value === 'bigint') {
                        serialized[key] = value.toString();
                    } else if (typeof value === 'object' && value !== null) {
                        serialized[key] = serializeBigInt(value);
                    } else {
                        serialized[key] = value;
                    }
                }
                return serialized;
            };
            // If a schedule is found, update it
            const updatedSchedule = await prisma.booking_schedules.update({
                where: { id: schedule.id },
                data: {
                    Status_app: '1',
                    appointment_date: formattedDate,
                    time_start_appointment: startTime,
                    time_end_appointment: endTime
                },
            });
            if (updatedSchedule) {
                updatedSchedule.data_barcode_paynow = '';
                updatedSchedule.QRstring= '';
            }
            const serializeduUpdatedSchedule = serializeBigInt(updatedSchedule);
            
            // Regenerate invoice with appointment details
            backgroundTask(updatedSchedule);
            
            return NextResponse.json(serializeduUpdatedSchedule, { status: 200 });

        } else {
            return NextResponse.json({ error: 'Record not found' }, { status: 400 });
        }

    } catch (error) {
        console.error('Error saving user:', error);
        return NextResponse.json(
            { error: 'Error saving user to the database' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

async function backgroundTask(schedule: booking_schedules) {
  generatePdfReceipt(schedule);
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

    // Use A5 landscape dimensions to match user downloadable PDF
    const page = pdfDoc.addPage([595, 420]); // A5 landscape in points

    // Load the logo image
    const logoImagePath = path.resolve('public/images', 'logo_pdf.png');
    const logoImageBytes = fs.readFileSync(logoImagePath);
    const logoImage = await pdfDoc.embedPng(new Uint8Array(logoImageBytes));
    const logoDims = logoImage.scale(0.08);

    // Header layout matching user downloadable PDF
    const headerY = page.getHeight() - 50;
    
    // Draw logo on left
    page.drawImage(logoImage, {
      x: 80,
      y: headerY - logoDims.height,
      width: logoDims.width,
      height: logoDims.height,
    });

    const fontPath = path.resolve('public/font', 'Roboto-Regular.ttf');
    const fontBytes = fs.readFileSync(fontPath);
    const customFont = await pdfDoc.embedFont(new Uint8Array(fontBytes));

    // Company name under logo
    page.drawText('Union of Security Employees', {
      x: 80,
      y: headerY - logoDims.height - 20,
      size: 12,
      font: customFont,
      color: rgb(0, 0, 0),
    });

    // Title on right
    page.drawText('Transaction Receipt', {
      x: 400,
      y: headerY - 10,
      size: 16,
      font: customFont,
      color: rgb(0, 0, 0),
    });

    // Create table structure matching user downloadable PDF
    const tableStartY = headerY - logoDims.height - 50;
    const rowHeight = 18;
    const cellPadding = 3;
    let currentY = tableStartY;

    // Helper function to draw table cell
    const drawTableCell = (x: number, y: number, width: number, height: number, text: string, isLabel: boolean = false) => {
      // Draw border
      page.drawRectangle({
        x,
        y: y - height,
        width,
        height,
        borderWidth: 1,
        borderColor: rgb(0.8, 0.8, 0.8),
        color: isLabel ? rgb(0.96, 0.96, 0.96) : rgb(1, 1, 1),
      });
      
      // Handle multi-line text with word wrapping for long strings
      const maxWidth = width - (cellPadding * 2);
      const lines = text ? text.split('\n') : [''];
      const wrappedLines: string[] = [];
      
      lines.forEach(line => {
        if (!line) {
          wrappedLines.push('');
          return;
        }
        
        // For very long strings (like Transaction Reference Number), break them into multiple lines
        const maxCharsPerLine = Math.floor(maxWidth / 4.5); // Approximate character width
        if (line.length > maxCharsPerLine) {
          // Break long strings into chunks
          for (let i = 0; i < line.length; i += maxCharsPerLine) {
            wrappedLines.push(line.substring(i, i + maxCharsPerLine));
          }
        } else {
          wrappedLines.push(line);
        }
      });
      
      const lineHeight = 10;
      const totalTextHeight = wrappedLines.length * lineHeight;
      
      // Center the text vertically in the cell
      const startY = y - (height / 2) + (totalTextHeight / 2) - lineHeight + 3;
      
      wrappedLines.forEach((line, index) => {
        page.drawText(line, {
          x: x + cellPadding,
          y: startY - (index * lineHeight),
          size: 9,
          font: customFont,
          color: rgb(0, 0, 0),
        });
      });
    };

    // Helper functions for formatting
    const maskNric = (nric: string) => {
      if (!nric) return '';
      const firstChar = nric.charAt(0);
      const lastFourChars = nric.substring(nric.length - 4);
      const middleLength = nric.length - 5; // First char + last 4 chars = 5 chars revealed
      return `${firstChar}${'X'.repeat(middleLength)}${lastFourChars}`;
    };

    const formatExpiryDate = (dateString: string) => {
      if (!dateString) return '';
      // Parse DD/MM/YYYY format
      const [day, month, year] = dateString.split('/').map(Number);
      if (!day || !month || !year) return dateString;
      
      const date = new Date(year, month - 1, day);
      return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long', 
        year: 'numeric',
      }).format(date);
    };

    // Format appointment date
    const formatAppointmentDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    };

    // Main table data matching user downloadable PDF layout
    const tableRows = [
      { label: 'NRIC/FIN', value: maskNric(nric || ''), span: 4 },
      { label: 'Pass ID Number', value: schedule.passid ? schedule.passid.slice(0, -2) : '', span: 4 },
      { label: 'Full Name', value: userRecord?.name || '', span: 4 },
      { label: 'Card Type', value: cardTypeMap[schedule.card_id || ''] || 'Unknown', span: 4 },
      { label: 'PWM Grade', value: gradeTypeString, span: 4 },
      { label: 'Card Expiry Date', value: formatExpiryDate(schedule.expired_date || ''), span: 4 },
      { label: 'Mobile Number', value: userRecord?.mobileno || '', span: 4 },
    ];

    // Draw main info table
    const tableWidth = 450;
    const cellWidth = tableWidth / 4;
    
    tableRows.forEach((row) => {
      drawTableCell(50, currentY, cellWidth, rowHeight, row.label, true);
      drawTableCell(50 + cellWidth, currentY, cellWidth * 3, rowHeight, row.value || '');
      currentY -= rowHeight;
    });

    // Add spacer
    currentY -= 10;

    // Transaction details in 2x2 grid
    const transactionRowHeight = 25; // Standard height for most rows
    const collectionAddressRowHeight = 35; // Increased height for collection address (3 lines)
    
    const transactionRows = [
      { 
        label1: 'Transaction\nReference Number', 
        value1: schedule.stripe_payment_id || schedule.receiptNo || '',
        label2: 'Collection Date',
        value2: formatAppointmentDate(schedule.appointment_date || ''),
        height: transactionRowHeight
      },
      {
        label1: 'Amount Paid\n(Inclusive of GST)',
        value1: `S$${parseFloat(schedule.grand_total || '0').toFixed(2)}`,
        label2: 'Time Slot',
        value2: schedule.time_start_appointment && schedule.time_end_appointment 
          ? `${schedule.time_start_appointment} - ${schedule.time_end_appointment}` 
          : '',
        height: transactionRowHeight
      },
      {
        label1: '',
        value1: '',
        label2: 'Collection Address',
        value2: '200, Jalan Sultan\n#03-24, Textile Centre\nSingapore 199018',
        height: collectionAddressRowHeight
      }
    ];

    transactionRows.forEach((row) => {
      const rowHeight = row.height || transactionRowHeight;
      
      // Left side
      drawTableCell(50, currentY, cellWidth, rowHeight, row.label1, true);
      drawTableCell(50 + cellWidth, currentY, cellWidth, rowHeight, row.value1);
      
      // Right side  
      drawTableCell(50 + cellWidth * 2, currentY, cellWidth, rowHeight, row.label2, true);
      drawTableCell(50 + cellWidth * 3, currentY, cellWidth, rowHeight, row.value2);
      
      currentY -= rowHeight;
    });

    // Add disclaimer at bottom with proper spacing
    const disclaimerY = 40;
    page.drawText('This is an official receipt issued by Union of Security Employees for the issuance of the PLRD ID card.', {
      x: 50,
      y: disclaimerY,
      size: 8,
      font: customFont,
      color: rgb(0, 0, 0),
    });
    page.drawText('Please note the base transaction fee of $0.36 paid via PAYNOW (inclusive of 9% GST) is absorbed by USE.', {
      x: 50,
      y: disclaimerY - 12,
      size: 8,
      font: customFont,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();

    const folderPath = path.join(
      process.cwd(),
      'public',
      'userdocs/img_users/invoice'
    );

    const fileNameBuilder =
      'T_' +
      (schedule.passid ? schedule.passid : '') +
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
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}${month}${day}`;
}
