// File: /app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { IncomingMessage } from 'http';

// Configure formidable
const form = new formidable.IncomingForm();

// Convert NextRequest to IncomingMessage
function toIncomingMessage(req: NextRequest): IncomingMessage {
    return req as unknown as IncomingMessage;
}

export async function POST(req: NextRequest) {
    return new Promise((resolve, reject) => {
        form.parse(toIncomingMessage(req), async (err, fields, files) => {
            if (err) {
                return reject(NextResponse.json({ error: 'Failed to parse form data' }, { status: 400 }));
            }

            // Extract file and other form data
            const file = files.file ? (files.file as formidable.File[])[0] : null; // Check if file exists
            const info = fields.info ? (fields.info as string[]) : []; // Extract info if available

            if (!file) {
                return reject(NextResponse.json({ error: 'No file uploaded' }, { status: 400 }));
            }

            try {
                // Ensure the directory exists
                const uploadDir = path.join(process.cwd(), 'public/uploads');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                // Save file to disk
                const filePath = path.join(uploadDir, file.originalFilename || 'unknown');
                fs.renameSync(file.filepath, filePath);

                // Here you can save the `info` and `filePath` to your database
                // For example: await prisma.data.create({ data: { info: info.join(','), filePath } });

                return resolve(NextResponse.json({ message: 'File and data saved successfully' }));
            } catch (error) {
                return reject(NextResponse.json({ error: 'Failed to save file or data' }, { status: 500 }));
            }
        });
    });
}
