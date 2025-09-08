import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { getEncryptedNricFromSession } from "../../../lib/session";
import { schedule } from "node-cron";
import { trimEmail } from "../../utils/emailUtils";

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { bookingId, mobileno, email, trRtt, trCsspb, trCctc, trHcta, trXray, trAvso, trNota, trObse, trSsm, pwmGrade } = body;

        const trimmedEmail = trimEmail(email);

        const encryptedNric = await getEncryptedNricFromSession(req);
        if (encryptedNric instanceof NextResponse) {
            return encryptedNric;
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
                ...(encryptedNric && { nric: encryptedNric }),
            },
        });

        if (schedule && userRecord) {

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

            const grade = await prisma.t_grades.findFirst({
                where: {
                    id: schedule.grade_id,
                } as any,
            });


            const updatedInfoRecord = await prisma.so_update_info.findFirst({
                where: {
                    ...(encryptedNric && { NRIC: encryptedNric }),
                    PassID: schedule.passid,
                },
            });

            if (updatedInfoRecord) {
                await prisma.so_update_info.update({
                    where: { id: updatedInfoRecord.id },
                    data: {
                        TR_CCTC: trCctc,
                        TR_CSSPB: trCsspb,
                        TR_HCTA: trHcta,
                        TR_RTT: trRtt,
                        TR_X_RAY: trXray,
                        //TR_NOTA: trNota,                       
                        Grade: grade?.name,
                        New_Grade: pwmGrade,
                        NRIC: encryptedNric,
                        PassID: schedule.passid,
                        Name: userRecord.name,
                        updated_at: new Date(),
                    },
                });
            } else {
                await prisma.so_update_info.create({
                    data: {
                        TR_CCTC: trCctc,
                        TR_CSSPB: trCsspb,
                        TR_HCTA: trHcta,
                        TR_RTT: trRtt,
                        TR_X_RAY: trXray,
                        //TR_NOTA: trNota,
                        Grade: grade?.name,
                        New_Grade: pwmGrade,
                        NRIC: encryptedNric,
                        PassID: schedule.passid,
                        Name: userRecord.name,
                        updated_at: new Date(),
                    },
                });
            }

            await prisma.users.update({
                where: { id: userRecord.id },
                data: {
                    mobileno: mobileno,
                    email: trimmedEmail,
                },
            });

            return NextResponse.json({ message: 'Record updated' }, { status: 200 });

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
