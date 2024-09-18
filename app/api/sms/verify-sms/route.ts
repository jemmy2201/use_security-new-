import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getEncryptedNricFromSession } from '../../../../lib/session';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { otp } = await request.json();

  if (!otp) {
    return NextResponse.json({ success: false, message: 'OTP is required' }, { status: 400 });
  }

  try {
    const encryptedNric = await getEncryptedNricFromSession();
    console.log('encryptedNric:', encryptedNric);
    const activationRecord = await prisma.activation_phones.findFirst({
      where: {
        status: 'pending',
        nric: encryptedNric as string,
      },
      orderBy: {
        id: 'desc', 
      },
    });
    console.log('activationRecord:', activationRecord);
    if(activationRecord){
      if(activationRecord.activation == otp){
        const updatedSchedule = await prisma.activation_phones.update({
          where: { id: activationRecord.id },
          data: {
              status: 'success'
          },
      });
        return NextResponse.json({ success: true, message: 'OTP verified successfully' }, { status: 200 });
      }else{
        return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });

      }
    }
  } catch (error) {
    console.log('error ', error);
    return new Response(JSON.stringify({ error: 'Error fetching user details' }), { status: 500 });

  } finally {
    await prisma.$disconnect();
  }

}

