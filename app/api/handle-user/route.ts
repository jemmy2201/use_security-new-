import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { getEncryptedNricFromSession } from "../../../lib/session";

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { mobileno, email } = body;
        const encryptedNric = await getEncryptedNricFromSession();

        if (!encryptedNric || !mobileno || !email) {
            return NextResponse.json(
                { error: 'nric / fin, mobile, and email are required' },
                { status: 400 }
            );
        }

        const userRecord = await prisma.users.findFirst({
            where: {
                ...(encryptedNric && { nric: encryptedNric }), 
            },
        });

        if (userRecord) {
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

            // If a user record is found, update it
            const updatedUserRecord = await prisma.users.update({
                where: { id: userRecord.id }, // Using the unique identifier for update
                data: {
                    mobileno: mobileno,
                    email: email,
                },
            });

            // Serialize the updatedUserRecord to handle BigInt
            const serializedUserRecord = serializeBigInt(updatedUserRecord);

            console.log('User Record Updated:', serializedUserRecord);
            return NextResponse.json({ message: 'Personal details updated' });
        } else {
            return NextResponse.json({ error: 'Applicant not found' }, { status: 400 });
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
