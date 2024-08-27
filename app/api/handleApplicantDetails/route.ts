import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { nric, applicationType, trRtt, trCsspb, trCctc, trHcta, trXray, trAvso } = body;
        console.log('applicationType:', applicationType);

        let appType = '';
        if (applicationType === 'SO') {
            appType = '1';  // Or use `1` without quotes if a number is expected
        }
        console.log('appType:', appType);

        // Validate required fields
        if (!nric || !appType) {
            return NextResponse.json(
                { error: 'nric / fin, application type are required' },
                { status: 400 }
            );
        }

        const statusApp = '0';
        console.log('appType:', appType);
        const schedule = await prisma.booking_schedules.findFirst({
            where: {
                ...(nric && { nric }),  // Conditionally adds the `nric` filter if `nric` is provided
                app_type: appType,       // Fixed filter for app_type
                Status_app: statusApp,   // Fixed filter for status_app
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
                    app_type: appType,
                    Status_app: statusApp,
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
