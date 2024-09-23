import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getEncryptedNricFromSession } from '../../../../lib/session';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();



// POST request handler for sending SMS
export async function POST(request: NextRequest) {
    try {
        const { mobile, message } = await request.json();

        const username = process.env.GATEWAY_SMS_USERNAME;
        const password = process.env.GATEWAY_SMS_PASSWOD;
        const senderId = process.env.GATEWAY_SMS_SENDER;
        const otpNumber = Math.floor(1000 + Math.random() * 9000);
        const smsMessage = `Use OTP  ${otpNumber}  to verify your phone number`;
        const apiUrl = `http://gateway.onewaysms.sg:10002/api.aspx?&languagetype=1&apiusername=${username}&apipassword=${password}&mobile=${mobile}&message=${encodeURIComponent(smsMessage)}&senderid=${senderId}`;


        // const response = await fetch(apiUrl, {
        //     method: 'GET',
        // });

        // const result = await response.text();
        // console.log('SMS API Response:', result);

        const encryptedNric = await getEncryptedNricFromSession(request);
        if (encryptedNric instanceof NextResponse) {
            return encryptedNric; // Return the redirect response if necessary
          }
        const activationRecord = await prisma.activation_phones.create({
            data: {
                activation: otpNumber.toString(),
                status: '',
                nric: encryptedNric as string,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'SMS sent successfully',
            response: "OK",
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to send SMS',
            error: error,
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
