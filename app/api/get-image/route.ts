import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  // Extract the image name from the query string
  const { searchParams } = new URL(req.url);
  const imageName = searchParams.get('imageName');

  // Define the path to the uploads directory
  const filePath = path.join(process.cwd(), 'public', imageName || '');

  console.log('file path:', filePath);
  // Check if the file exists
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
  } catch (err) {
    return NextResponse.json({ message: 'Image not found' }, { status: 404 });
  }

  const contentType = 'image/png'; 

  const fileStream = fs.createReadStream(filePath);
  const headers = new Headers({
    'Content-Type': contentType,
  });

  return new NextResponse(fileStream as any, {
    headers,
  });
}
