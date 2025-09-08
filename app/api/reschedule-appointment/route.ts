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
import { 
  getInvoiceFolderPath, 
  createDirectorySync, 
  writeFileSync, 
  validateAssets, 
  generateInvoiceFileName 
} from '../../../lib/fileUtils';
import { logger, getCurrentEnvironment } from '../../../lib/config';

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
        const { bookingId, appointmentDate, timeSlot } = body;
        const encryptedNric = await getEncryptedNricFromSession(req);
        if (encryptedNric instanceof NextResponse) {
            return encryptedNric; // Return the redirect response if necessary
        }
        console.log(`[RESCHEDULE] Environment: ${getCurrentEnvironment()}`);
        console.log(`[RESCHEDULE] BookingId: ${bookingId}, EncryptedNric: ${encryptedNric}`);
        console.log(`[RESCHEDULE] AppointmentDate: ${appointmentDate}, TimeSlot: ${timeSlot}`);
        
        const [startTime, endTime] = timeSlot.split(" - ");
        if (!bookingId || !appointmentDate) {
            return NextResponse.json(
                { error: 'bookingId, appointment date are required' },
                { status: 400 }
            );
        }

        const schedule = await prisma.booking_schedules.findFirst({
            where: {
                ...(encryptedNric && { nric: encryptedNric }),
                id: bookingId
            },
        });

        console.log(`[RESCHEDULE] Schedule found: ${!!schedule}`);

        if (schedule) {
            console.log(`[RESCHEDULE] Updating schedule ID: ${schedule.id}`);
            console.log(`[RESCHEDULE] Old appointment_date: ${schedule.appointment_date}`);
            console.log(`[RESCHEDULE] New appointment_date: ${appointmentDate}`);
            
            // Convert userRecord BigInt fields to strings
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
                where: { id: schedule.id }, // Using the unique identifier for update
                data: {
                    appointment_date: appointmentDate,
                    time_start_appointment: startTime,
                    time_end_appointment: endTime
                },
            });
            
            console.log(`[RESCHEDULE] Schedule updated successfully`);
            console.log(`[RESCHEDULE] Updated appointment_date: ${updatedSchedule.appointment_date}`);
            
            if (updatedSchedule) {
                updatedSchedule.data_barcode_paynow = '';
                updatedSchedule.QRstring= '';
            }
            const serializeduUpdatedSchedule = serializeBigInt(updatedSchedule);
            
            console.log(`[RESCHEDULE] Starting background task for invoice regeneration`);
            // Regenerate invoice with updated appointment details
            try {
                await backgroundTask(updatedSchedule);
                console.log(`[RESCHEDULE] Background task completed successfully`);
            } catch (invoiceError) {
                console.error(`[RESCHEDULE] Invoice generation failed but appointment was updated:`, invoiceError);
                // Don't fail the request if invoice generation fails
            }
            
            return NextResponse.json(serializeduUpdatedSchedule, { status: 200 });

        } else {
            console.log(`[RESCHEDULE] Schedule not found for bookingId: ${bookingId}`);
            return NextResponse.json({ error: 'Record not found' }, { status: 400 });

        }

    } catch (error) {
        console.error('[RESCHEDULE] Error saving user:', error);
        return NextResponse.json(
            { error: 'Error saving user to the database' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

async function backgroundTask(schedule: booking_schedules) {
  try {
    logger.verbose('RESCHEDULE', `Starting PDF generation for schedule ID: ${schedule.id}`);
    await generatePdfReceipt(schedule);
    logger.verbose('RESCHEDULE', `PDF generation completed for schedule ID: ${schedule.id}`);
  } catch (error) {
    logger.error(`PDF generation failed for schedule ID: ${schedule.id}`, error);
    throw error; // Re-throw to allow caller to handle
  }
}

const generatePdfReceipt = async (schedule: booking_schedules) => {
  try {
    console.log(`[RESCHEDULE] PDF Generation - Starting for schedule: ${schedule.id}`);
    console.log(`[RESCHEDULE] PDF Generation - Environment: ${process.env.NODE_ENV}`);
    console.log(`[RESCHEDULE] PDF Generation - Process CWD: ${process.cwd()}`);
    
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const nric = encryptDecrypt(schedule.nric, 'decrypt');

    const appTypeString =
      appTypeMap[schedule.app_type] +
      '-' +
      cardTypeMap[schedule.card_id ? schedule.card_id : ''];

    const gradeTypeString =
      gradeTypeMap[schedule.grade_id ? schedule.grade_id : ''];
      
    console.log(`[RESCHEDULE] PDF Generation - Fetching user record for NRIC: ${nric ? 'present' : 'missing'}`);
    const userRecord = await prisma.users.findFirst({
      where: {
        ...(schedule.nric && { nric: schedule.nric }),
      },
    });

    console.log(`[RESCHEDULE] PDF Generation - User record found: ${!!userRecord}`);

    // Use A5 landscape dimensions to match user downloadable PDF
    const page = pdfDoc.addPage([595, 420]); // A5 landscape in points

    // Validate and load assets
    const assets = validateAssets();

    console.log(`[RESCHEDULE] PDF Generation - Loading assets`);
    
    let logoImageBytes;
    try {
      logoImageBytes = fs.readFileSync(assets.logo);
      console.log(`[RESCHEDULE] PDF Generation - Logo loaded successfully`);
    } catch (logoError: any) {
      console.error(`[RESCHEDULE] PDF Generation - Failed to load logo:`, logoError);
      throw new Error(`Failed to load logo image: ${logoError.message}`);
    }
    
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

    console.log(`[RESCHEDULE] PDF Generation - Loading font from: ${assets.font}`);
    
    let fontBytes;
    try {
      fontBytes = fs.readFileSync(assets.font);
      console.log(`[RESCHEDULE] PDF Generation - Font loaded successfully`);
    } catch (fontError: any) {
      console.error(`[RESCHEDULE] PDF Generation - Failed to load font:`, fontError);
      throw new Error(`Failed to load font: ${fontError.message}`);
    }
    
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
    };    // Helper functions for formatting
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

    // Use the new file utility functions
    const folderPath = getInvoiceFolderPath();
    const fileName = generateInvoiceFileName(schedule.passid, Number(schedule.id));
    const filePath = path.join(folderPath, fileName);

    console.log(`[RESCHEDULE] PDF Generation - Folder path: ${folderPath}`);
    console.log(`[RESCHEDULE] PDF Generation - File name: ${fileName}`);
    console.log(`[RESCHEDULE] PDF Generation - Full file path: ${filePath}`);

    // Create directory and write file using utility functions
    createDirectorySync(folderPath);
    writeFileSync(filePath, pdfBytes);
    
  } catch (error: any) {
    console.error('[RESCHEDULE] PDF Generation - Error generating PDF:', error);
    throw error; // Re-throw to allow caller to handle
  } finally {
    try {
      await prisma.$disconnect();
      console.log(`[RESCHEDULE] PDF Generation - Database connection closed`);
    } catch (disconnectError: any) {
      console.error(`[RESCHEDULE] PDF Generation - Error closing database connection:`, disconnectError);
    }
  }
};

function formatDateToDDMMYYYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}${month}${day}`;
}
