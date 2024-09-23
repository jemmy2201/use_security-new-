import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { getEncryptedNricFromSession } from "../../../lib/session";

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { bookingId, mobileno, email, trRtt, trCsspb, trCctc, trHcta, trXray, trAvso } = body;

        const encryptedNric = await getEncryptedNricFromSession(req);
        if (encryptedNric instanceof NextResponse) {
            return encryptedNric; // Return the redirect response if necessary
          }
        if (!encryptedNric || !mobileno) {
            return NextResponse.json(
                { error: 'nric / fin, application type are required' },
                { status: 400 }
            );
        }

        const schedule = await prisma.booking_schedules.findFirst({
            where: {
                ...(encryptedNric && { nric: encryptedNric }),
                id: bookingId,
            },
        });


        const userRecord = await prisma.users.findFirst({
            where: {
                ...(encryptedNric && { nric: encryptedNric }), // Conditionally adds the `nric` filter if `nric` is provided
            },
        });

        if (schedule && userRecord) {

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
                    TR_AVSO: trAvso,
                    TR_CCTC: trCctc,
                    TR_CSSPB: trCsspb,
                    TR_HCTA: trHcta,
                    TR_RTT: trRtt,
                    TR_X_RAY: trXray,
                },
            });

            const updatedUserRecord = await prisma.users.update({
                where: { id: userRecord.id }, // Using the unique identifier for update
                data: {
                    mobileno: mobileno,
                    email: email,
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
