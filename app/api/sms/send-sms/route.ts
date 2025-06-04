import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getEncryptedNricFromSession } from '../../../../lib/session';
import { NextRequest } from 'next/server';
import axios from 'axios';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {

    const encryptedNric = await getEncryptedNricFromSession(request);
    if (encryptedNric instanceof NextResponse) {
        return encryptedNric;
    }
    try {
        const triggerSms = process.env.SEND_SMS_ENABLE === 'true';
        const { mobile } = await request.json();
        if (!mobile) {
            return NextResponse.json({ success: false, message: 'Invalid mobile number' }, { status: 400 });
        }

        const validatedPhone = validatePhoneNumber(mobile);
        if (validatedPhone.length !== 10) {
            return NextResponse.json({ success: false, message: 'Invalid mobile number' }, { status: 400 });
        }
        const username = process.env.GATEWAY_SMS_USERNAME;
        const password = process.env.GATEWAY_SMS_PASSWOD;
        const senderId = process.env.GATEWAY_SMS_SENDER;
        const apiUrl = process.env.GATEWAY_SMS_URL;
        const otpNumber = Math.floor(1000 + Math.random() * 9000);
        const smsMessage = `Use OTP ${otpNumber} to verify your phone number`;

        const apiCredentials = { apiusername: username, apipassword: password, };

        if (triggerSms) {
            const response = await axios.get(apiUrl ? apiUrl : '', {
                params: {
                    ...apiCredentials,
                    mobileno: validatedPhone,
                    message: smsMessage,
                    senderid: senderId,
                    languagetype: '1',
                },
            });
            console.log('SMS sent successfully data:', response.data);
        }

        await prisma.activation_phones.create({
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



function validatePhoneNumber(phoneNumber: string): string {
    if (phoneNumber.startsWith('+')) {
        phoneNumber = phoneNumber.slice(1);
    }

    if (phoneNumber.length !== 10 && !phoneNumber.startsWith('65')) {
        phoneNumber = '65' + phoneNumber;
    }

    const digitsOnly = phoneNumber.replace(/\D/g, '');
    return digitsOnly;
}



