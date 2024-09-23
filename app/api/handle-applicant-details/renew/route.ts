import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { getEncryptedNricFromSession } from "../../../../lib/session";

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
    try {
        console.log('handle-applicant-details, renew');
        const body = await req.json();
        const { bookingId, applicationType, cardId, trRtt, trCsspb, trCctc, trHcta, trXray, trAvso, actionType } = body;
        console.log('actionType:applicationType:cardId', actionType, applicationType, cardId);
        const encryptedNric = await getEncryptedNricFromSession(req);
        if (encryptedNric instanceof NextResponse) {
            return encryptedNric; // Return the redirect response if necessary
          }
        console.log('encrypted nric:', encryptedNric);


        // Validate required fields
        if (!encryptedNric || !applicationType || cardId) {
            return NextResponse.json(
                { error: 'nric / fin, cardId and application type are required' },
                { status: 400 }
            );
        }

        const schedule = await prisma.booking_schedules.findFirst({
            where: {
                ...(encryptedNric && { nric: encryptedNric }),
                app_type: applicationType,
                card_id: cardId,
                id: bookingId,
                AND: [
                    {
                        OR: [
                            { Status_app: '0' },
                            { Status_app: '' },
                            { Status_app: null },
                        ]
                    }
                ],
            },
            orderBy: {
                id: 'desc',
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
                where: { id: schedule.id }, // Using the unique identifier for update
                data: {
                    Status_app: '0',
                    Status_draft: '0',
                    TR_AVSO: trAvso,
                    TR_CCTC: trCctc,
                    TR_CSSPB: trCsspb,
                    TR_HCTA: trHcta,
                    TR_RTT: trRtt,
                    TR_X_RAY: trXray,
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
