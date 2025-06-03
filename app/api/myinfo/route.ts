import { PrismaClient, users } from '@prisma/client';
import { getEncryptedNricFromSession } from '../../../lib/session';
import { NextRequest, NextResponse } from 'next/server';
import encryptDecrypt from '@/utils/encryptDecrypt';
const prisma = new PrismaClient();

export interface userInfo {
  name?: string;
  nric?: string;
  textNric?: string;
  email?: string;
  mobileno?: string;
}

const mapToUserInfoResponse = (
  source: users
): userInfo => {
  return {
    name: '',
    nric: '',
    textNric: '',
  };
};

export async function GET(request: NextRequest) {

  const encryptedNric = await getEncryptedNricFromSession(request);
  if (encryptedNric instanceof NextResponse) {
    return encryptedNric; // Return the redirect response if necessary
  }
  console.log('encrypted nric:', encryptedNric);

  try {

    if (encryptedNric) {
      const user = await prisma.users.findFirst({
        where: {
          nric: encryptedNric,
        },
      });
      const replacer = (key: string, value: any) => {
        if (typeof value === 'bigint') {
          return value.toString();
        }
        return value;
      };
      if (!user) {
        return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
      }

      const responseData = mapToUserInfoResponse(user);
      responseData.name = user.name;
      responseData.nric = user.nric ? user.nric : '';
      responseData.mobileno = user.mobileno ? user.mobileno : '';
      responseData.email = user.email ? user.email : '';

      const textNric = encryptDecrypt(encryptedNric as string, 'decrypt');

      const firstChar = textNric?.charAt(0);
      const lastFourChars = textNric ? textNric.substring(textNric.length - 4) : '';
      const middleLength = textNric ? textNric.length - 5 : 0; // First char + last 4 chars = 5 chars revealed
      const maskedString = `${firstChar}${'X'.repeat(middleLength)}${lastFourChars}`;
      responseData.textNric = maskedString;

      return new Response(JSON.stringify(responseData, replacer), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    }

  } catch (error) {
    console.log('error ', error);
    return new Response(JSON.stringify({ error: 'Error fetching user details' }), { status: 500 });

  } finally {
    await prisma.$disconnect();
  }
}
