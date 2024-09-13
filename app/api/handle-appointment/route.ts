import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { nric, appointmentDate, timeSlot, applicationType } = body;
        console.log('appointmentDate:nric', appointmentDate, nric);
        console.log('timeSlot:applicationType', timeSlot, applicationType);
        let appType = '';
        if (applicationType === 'SO') {
            appType = '1';  // Or use `1` without quotes if a number is expected
        }
        if (applicationType === 'PI') {
            appType = '2';  // Or use `1` without quotes if a number is expected
        }
        const [startTime, endTime] = timeSlot.split(" - ");
        // Validate required fields
        if (!nric || !appointmentDate) {
            return NextResponse.json(
                { error: 'nric / fin, appointment date are required' },
                { status: 400 }
            );
        }

        const schedule = await prisma.booking_schedules.findFirst({
            where: {
                ...(nric && { nric }),
                app_type: appType,
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
                where: { id: schedule.id },
                data: {
                    Status_app: '2',
                    appointment_date: appointmentDate,
                    time_start_appointment: startTime,
                    time_end_appointment: endTime
                },
            });
            //console.log('Schedule updated:', updatedSchedule);
            const serializeduUpdatedSchedule = serializeBigInt(updatedSchedule);
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
