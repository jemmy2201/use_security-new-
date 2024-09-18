import { PrismaClient } from '@prisma/client';
import { getEncryptedNricFromSession } from '../../../lib/session';

const prisma = new PrismaClient();

export async function GET(request: Request) {

  const encryptedNric = await getEncryptedNricFromSession();
  console.log('encrypted nric:', encryptedNric);

  try {
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
