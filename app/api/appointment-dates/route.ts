
import { booking_schedules, PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getEncryptedNricFromSession } from '../../../lib/session';

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

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const bookingIdString = searchParams.get('bookingId');

  if (!bookingIdString) {
    return new Response('Booking ID is required', { status: 400 });
  }
  try {

    const encryptedNric = await getEncryptedNricFromSession(request);
    if (encryptedNric instanceof NextResponse) {
      return encryptedNric;
    }
    if (!bookingIdString) {
      return new Response(JSON.stringify({ error: 'Booking Id reqquire' }), { status: 400 });
    }
    const bookingId = BigInt(bookingIdString) as bigint;

    const holidays = await prisma.dateholidays.findMany({
      where: {
        time_work:'1',
      },
      select: {
        date: true,
      },
    });



    const disabledDates = holidays
      .map((holiday) => {
        if (holiday.date) {
          const date = new Date(holiday.date);
          if (!isNaN(date.getTime())) { // Check if date is valid
            return date.toISOString().split('T')[0];
          }
        }
        return null;
      })
      .filter((date) => date !== null);

    console.log('disabledDates after holiday:', disabledDates);

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
        group by appointment_date, time_start_appointment; `;

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

    const schedules = await prisma.booking_schedules.findUnique({
      where: {
        ...(encryptedNric && { nric: encryptedNric }),
        id: bookingId,
      } as any,
    });

    const transDate = schedules?.trans_date;
    if (transDate) {
      const transactionDate = parseDateString(transDate);
      const nextSixDays = getNextSixDays(transactionDate);
      const allDisabledDates = [...disabledDates, ...nextSixDays];
      return NextResponse.json(allDisabledDates);
    }

    return NextResponse.json(disabledDates);

  } catch (error) {
    console.error('Error fetching disabled dates:', error);
    return NextResponse.json({ error: 'Failed to fetch disabled dates' }, { status: 500 });
  }

  function checkTimeSlot(slot: string): boolean {
    return timeSlots.includes(slot);
  };


}

const parseDateString = (dateString: string): Date => {
  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("/").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds);
};

const getNextSixDays = (startDate: Date) => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(startDate);
    nextDate.setDate(startDate.getDate() + i);
    dates.push(nextDate.toISOString().split('T')[0]);
  }
  return dates;
};

