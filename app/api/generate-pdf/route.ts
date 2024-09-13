import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(request: Request) {
    try {

        const { searchParams } = new URL(request.url);
        const bookingId = searchParams.get('bookingId');
        console.log('generate-pdf, bookingId:', bookingId);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Set the HTML content for the PDF
        await page.setContent(`
        <html>
            <body>
            <h1>Payment Rceipt</h1>
            <p>Payment Receipt PDF</p>
            </body>
        </html>
        `);

        // Generate the PDF
        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();

        // Set headers to return the PDF as a download
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="generated.pdf"',
            },
        });
    } catch (error) {
        return new NextResponse('Error generating PDF', { status: 500 });
    }
}
