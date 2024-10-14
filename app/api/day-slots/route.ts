
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
  const selectedDateString = searchParams.get('selectedDate');

  if (!selectedDateString) {
    return new Response('Selected Date is required', { status: 400 });
  }
  try {

    console.log('selectedDateString:', selectedDateString);
    const encryptedNric = await getEncryptedNricFromSession(request);
    if (encryptedNric instanceof NextResponse) {
      return encryptedNric;
    }
    if (!selectedDateString) {
      return new Response(JSON.stringify({ error: 'Selected Date reqquire' }), { status: 400 });
    }

    
    console.log('selectedDateString:', selectedDateString);

    const dateSchedules: bookingDate[] = await prisma.$queryRaw`
      select appointment_date as appointmentDate, time_start_appointment as timeStartAppointment, count(*) as totalCount 
      FROM booking_schedules
      where appointment_date = ${selectedDateString}
      group by appointment_date, time_start_appointment; `;

    console.log('dateSchedules', dateSchedules);


    const fullSlotTime = dateSchedules
      .map((dateSchedule) => {
        if (!checkTimeSlot(dateSchedule.timeStartAppointment as string)) {
          return null
        }
        if (dateSchedule.totalCount < 20) {
          return null
        }
        return dateSchedule.timeStartAppointment;
      })
      .filter((timeSlot) => timeSlot !== null);

    const disabledSlots = convertTimeSlots(fullSlotTime);;

    console.log('returning full time slots for day:', selectedDateString, disabledSlots);
  
    return NextResponse.json({ disabledSlots });

  } catch (error) {
    console.error('Error fetching disabled dates:', error);
    return NextResponse.json({ error: 'Failed to fetch disabled dates' }, { status: 500 });
  }

  function checkTimeSlot(slot: string): boolean {
    return timeSlots.includes(slot);
  };

}

const convertTimeSlots = (timeSlots: string[]): string[] => {
  return timeSlots.map((time) => {
    const [hours, minutes] = time.split(':').map(Number); // Split the time string into hours and minutes
    const endHours = (hours + 1) % 24; // Add one hour and handle 24-hour wrap-around

    const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return `${startTime} - ${endTime}`;
  });
};





