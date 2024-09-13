
import { NextResponse } from 'next/server';
import { booking_schedules, PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

const timeSlots: string[] = [
  "09:30",
  "10:30",
  "11:30",
  "12:30",
  "13:30",
  "14:30",
  "15:30",
];

export interface bookingDate {
  appointmentDate: string;
  timeStartAppointment: string;
  totalCount: number;
}

// API Handler for GET request to fetch disabled dates
export async function GET() {
  try {

    const disabledDates: string[] = [];
    console.log('disabledDates', disabledDates);

    const today = new Date();
    const dateFrom = new Date(today);
    dateFrom.setDate(today.getDate() + 6);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    for (let i = 0; i < 7; i++) {
      const formattedDate = dateFrom.toISOString().slice(0, 10);
      console.log('formattedDate:', formattedDate);
      const dateSchedules: bookingDate[] = await prisma.$queryRaw`
        select appointment_date as appointmentDate, time_start_appointment as timeStartAppointment, count(*) as totalCount 
        FROM booking_schedules
        where appointment_date = ${formattedDate}
        group by appointment_date, time_start_appointment; 
    `;
      console.log('dateSchedules', dateSchedules);

      if (dateSchedules.length == 7) {
        const fullSlotDay = dateSchedules
          .map((dateSchedule) => {
            checkTimeSlot
            if (!checkTimeSlot(dateSchedule.timeStartAppointment as string)) {
              return null
            }
            if (dateSchedule.totalCount < 20) {
              return null
            }
            return dateSchedule.appointmentDate;
          })
          .filter((date) => date !== null);
        console.log('fullSlotDay:', fullSlotDay);
        if (fullSlotDay) {
          console.log('add to disable date because slots are full', fullSlotDay);
          disabledDates.push(formattedDate);
        }
        console.log(fullSlotDay);
        dateFrom.setDate(today.getDate() + 1);
      }
    }
    return NextResponse.json(disabledDates);
  } catch (error) {
    console.error('Error fetching disabled dates:', error);
    return NextResponse.json({ error: 'Failed to fetch disabled dates' }, { status: 500 });
  }

  function checkTimeSlot(slot: string): boolean {
    return timeSlots.includes(slot);
  }
}
