import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, users } from '@prisma/client';
import { createSession } from '../../../lib/session';
import bcrypt from 'bcrypt';
import encryptDecrypt from '@/utils/encryptDecrypt';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const redirectUrlToTerms = process.env.NEXT_PUBLIC_URL + '/terms';
    const body = await req.json();
    const { username, password } = body;

    // Perform server-side validation if needed
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    console.log('Username:', username);
    const encryptedUserName = encryptDecrypt(username, 'encrypt');


    if (encryptedUserName) {
      const user = await prisma.users.findFirst({
        where: {
          nric: encryptedUserName,
        },
      });

      if(user && user.password){
        const nodeCompatibleHash = user.password.replace('$2y$', '$2b$');
        const isPasswordValid = await bcrypt.compare(password, nodeCompatibleHash);
        console.log('isPasswordValid:', isPasswordValid);
        if(isPasswordValid){
          await createSession(username, 'dataToken');
          return NextResponse.json({ message: 'Login successful' });
        }
      }

    }



    return NextResponse.json(
      { message: 'invalid username / password' },
      { status: 403 }
    );

  } catch (error) {
    console.error('Error in login route:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
