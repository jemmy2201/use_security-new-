import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { getEncryptedNricFromSession } from "../../../../lib/session";
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const copyImagePath = process.env.COPY_IMAGE_PATH;

export async function POST(req: NextRequest) {
    try {
        console.log('handle-applicant-details, new');
        const body = await req.json();
        const { image, bookingId, applicationType, cardId, trRtt, trCsspb, trCctc, trHcta, trXray, trAvso, trNota, trSsm, trObse, actionType, } = body;
        console.log('actionType:applicationType:cardId', actionType, applicationType, cardId);
        const encryptedNric = await getEncryptedNricFromSession(req);
        if (encryptedNric instanceof NextResponse) {
            return encryptedNric; // Return the redirect response if necessary
        }
        console.log('encrypted nric:', encryptedNric);

        if (!encryptedNric || !applicationType || !cardId) {
            return NextResponse.json(
                { error: 'nric / fin, cardId and application type are required' },
                { status: 400 }
            );
        }

        if (actionType == 'Replace') {

            const schedule = await prisma.booking_schedules.findFirst({
                where: {
                    ...(encryptedNric && { nric: encryptedNric }),
                    card_id: cardId,
                    id: bookingId,
                },
                orderBy: {
                    id: 'desc',
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
                const updatedSchedule = await prisma.booking_schedules.update({
                    where: { id: schedule.id },
                    data: {
                        app_type: '2',
                        Status_app: '0',
                        Status_draft: '0',
                        TR_AVSO: trAvso,
                        TR_CCTC: trCctc,
                        TR_CSSPB: trCsspb,
                        TR_HCTA: trHcta,
                        TR_RTT: trRtt,
                        TR_X_RAY: trXray,
                        TR_NOTA: trNota,
                        TR_OBSE: trObse,
                        TR_SSM: trSsm
                    },
                });
                console.log('Replace Schedule updated:', updatedSchedule);

                if (image) {
                    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
                    const buffer = Buffer.from(base64Data, 'base64');

                    // Define a path to save the image
                    const uploadsDir = path.join(process.cwd(), 'public', 'userdocs/img_users');
                    if (!fs.existsSync(uploadsDir)) {
                        fs.mkdirSync(uploadsDir, { recursive: true });
                    }
                    const fileName = schedule?.passid + encryptedNric.slice(-4);
                    console.log('file name:', fileName);
                    const filePath = path.join(uploadsDir, fileName + '.png');
                    fs.writeFileSync(filePath, buffer);
                }

                if (updatedSchedule) {
                    updatedSchedule.data_barcode_paynow = '';
                    updatedSchedule.QRstring= '';

                }
                const serializeduUpdatedSchedule = serializeBigInt(updatedSchedule);
                return NextResponse.json(serializeduUpdatedSchedule, { status: 200 });

            } else {
                return NextResponse.json({ error: 'Record not found' }, { status: 400 });
            }

        } else {
            const schedule = await prisma.booking_schedules.findFirst({
                where: {
                    ...(encryptedNric && { nric: encryptedNric }),
                    card_id: cardId,
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
                    where: { id: schedule.id },
                    data: {
                        Status_app: '0',
                        Status_draft: '0',
                        TR_AVSO: trAvso,
                        TR_CCTC: trCctc,
                        TR_CSSPB: trCsspb,
                        TR_HCTA: trHcta,
                        TR_RTT: trRtt,
                        TR_X_RAY: trXray,
                        TR_NOTA: trNota,
                        TR_OBSE: trObse,
                        TR_SSM: trSsm
                    },
                });
                console.log('Schedule updated:', updatedSchedule);

                if (image) {
                    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
                    const buffer = Buffer.from(base64Data, 'base64');

                    // Define a path to save the image
                    
                    const uploadsDir = path.join(process.cwd(), 'public', 'userdocs/img_users');
                    
                    if (!fs.existsSync(uploadsDir)) {
                        fs.mkdirSync(uploadsDir, { recursive: true });
                    }
                    const fileName = schedule?.passid + encryptedNric.slice(-4);
                    console.log('file name:', fileName);
                    const filePath = path.join(uploadsDir, fileName + '.png');
                    fs.writeFileSync(filePath, buffer);

                    console.log('copyImagePath:', copyImagePath);
                    if (copyImagePath) {
                      try {
                        console.log('copy to app1');
                        const uploadsDirApp1 = path.join(copyImagePath);
                        const filePathApp1 = path.join(uploadsDirApp1, fileName + '.png');
                        fs.writeFileSync(filePathApp1, buffer);
                        console.log('copy to app1 done');
                      } catch (error) {
                        console.log('error in copy image to app1', error);
                      }
                    }
                }

                if (updatedSchedule) {
                    updatedSchedule.data_barcode_paynow = '';
                    updatedSchedule.QRstring= '';
                }
                const serializeduUpdatedSchedule = serializeBigInt(updatedSchedule);
                return NextResponse.json(serializeduUpdatedSchedule, { status: 200 });

            } else {
                return NextResponse.json({ error: 'Record not found' }, { status: 400 });
            }
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
