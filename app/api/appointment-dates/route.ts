// /app/api/disabled-dates/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

// API Handler for GET request to fetch disabled dates
export async function GET() {
  try {
    // Fetch dates from the `dateholiday` table
    const holidays = await prisma.dateholidays.findMany({
      select: {
        date: true, // Select only the date field
      },
    });

    // Safely handle the possibility of null dates or incorrect type
    const disabledDates = holidays
      .map((holiday) => {
        // Check if the date is not null and is a valid Date object
        if (holiday.date) {
          // Assume holiday.date is string or Date
          const date = new Date(holiday.date);
          if (!isNaN(date.getTime())) { // Check if date is valid
            return date.toISOString().split('T')[0];
          }
        }
        return null;
      })
      .filter((date) => date !== null); // Remove null values

    // Return the dates as a JSON response
    return NextResponse.json(disabledDates);
  } catch (error) {
    console.error('Error fetching disabled dates:', error);
    return NextResponse.json({ error: 'Failed to fetch disabled dates' }, { status: 500 });
  }
}
