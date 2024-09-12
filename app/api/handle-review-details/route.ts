import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { nric, applicationType } = body;
        console.log('applicationType:', applicationType);
        console.log('encrypted nric:', nric);
        let appType = '';
        if (applicationType === 'SO') {
            appType = '1';  
        }
        if (applicationType === 'PI') {
            appType = '2';  
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
                ...(nric && { nric }),  
                app_type: appType, 
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
            // If a schedule is found, update it
            const currentDate = formatDateToDDMMYYYY(new Date());
            const updatedSchedule = await prisma.booking_schedules.update({
                where: { id: schedule.id }, // Using the unique identifier for update
                data: {
                    Status_app: statusApp,
                    Status_draft: statusApp,
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
