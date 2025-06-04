import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { getEncryptedNricFromSession } from "../../../../lib/session";

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
    try {
        console.log('handle-review-details, new');
        const body = await req.json();
        const { bookingId, actionType, applicationType } = body;
        const encryptedNric = await getEncryptedNricFromSession(req);
        if (encryptedNric instanceof NextResponse) {
            return encryptedNric; // Return the redirect response if necessary
        }

        if (!encryptedNric || !bookingId || !applicationType) {
            return NextResponse.json(
                { error: 'nric / fin, bookingId are required' },
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
                            { Status_app: null },
                            { Status_app: '' }
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

            const currentDate = formatDateToDDMMYYYY(new Date());

            let updatedSchedule;
            if (schedule.app_type == '2') {
                updatedSchedule = await prisma.booking_schedules.update({
                    where: { id: schedule.id },
                    data: {
                        declaration_date: currentDate,
                        appointment_date: '',
                        time_start_appointment: '',
                        time_end_appointment: '',
                        trans_date: '',
                        status_payment: '',
                        stripe_payment_id: null,
                        stripe_session_id: null,
                    },
                });
            } else {
                updatedSchedule = await prisma.booking_schedules.update({
                    where: { id: schedule.id },
                    data: {
                        declaration_date: currentDate,
                    },
                });
            }

            const fileName = schedule?.passid + encryptedNric?.slice(-4) + '.png';
            const userRecord = await prisma.users.findFirst({
                where: {
                    ...(encryptedNric && { nric: encryptedNric }),
                },
            });

            if (userRecord) {
                await prisma.users.update({
                    where: { id: userRecord.id },
                    data: {
                        photo: fileName,
                    },
                });
            }
            if (updatedSchedule) {
                updatedSchedule.data_barcode_paynow = '';
                updatedSchedule.QRstring = '';
            }
            const serializeduUpdatedSchedule = serializeBigInt(updatedSchedule);
            return NextResponse.json(serializeduUpdatedSchedule, { status: 200 });

        } else {
            console.log('handle-review-details, record not found');
            return NextResponse.json({ error: 'Record not found' }, { status: 400 });

        }

    } catch (error) {
        console.error('Error saving review details:', error);
        return NextResponse.json(
            { error: 'Error saving user to the database' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

function formatDateToDDMMYYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
