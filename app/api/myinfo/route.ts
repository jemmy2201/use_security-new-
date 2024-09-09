import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers'
import { decrypt } from '../../../lib/session';
import encryptDecrypt from '@/utils/encryptDecrypt';


const prisma = new PrismaClient();

export async function GET(request: Request) {
  const cookie = cookies().get('session')?.value
  const session = await decrypt(cookie)
  console.log('session user id:', session?.userId);
  const encryptedUserId = encryptDecrypt(session?.userId as string,'encrypt');
  console.log('encrypted nric:', encryptedUserId);

  try {
    const user = await prisma.users.findFirst({
      where: {
        nric: encryptedUserId, 
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
    
    return new Response(JSON.stringify(user, replacer), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.log('error ', error);
    return new Response(JSON.stringify({ error: 'Error fetching user details' }), { status: 500 });

  } finally {
    await prisma.$disconnect(); 
  }
}
