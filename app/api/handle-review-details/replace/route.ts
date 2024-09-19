import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { getEncryptedNricFromSession } from "../../../../lib/session";

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
    try {
        console.log('handle-review-details, replace');
        const body = await req.json();
        const { bookindId, actionType, applicationType } = body;
        const encryptedNric = await getEncryptedNricFromSession();
        console.log('actionType:applicationType:encrypted nric', actionType, bookindId, encryptedNric);

        if (!encryptedNric || !bookindId || !applicationType) {
            return NextResponse.json(
                { error: 'nric / fin, bookindId are required' },
                { status: 400 }
            );
        }

        const schedule = await prisma.booking_schedules.findFirst({
            where: {
                ...(encryptedNric && { nric: encryptedNric }),
                app_type: applicationType,
                id: bookindId,
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
            const updatedSchedule = await prisma.booking_schedules.update({
                where: { id: schedule.id },
                data: {
                    declaration_date: currentDate,
                },
            });
            console.log('Schedule updated:', updatedSchedule);
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

function formatDateToDDMMYYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}
