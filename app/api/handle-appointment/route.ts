import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { getEncryptedNricFromSession } from "../../../lib/session";

const prisma = new PrismaClient();

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
