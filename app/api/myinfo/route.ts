import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const nric = 'REhXRHp1K0tZSC80R0tQdXlmcFd2dz09';

    const user = await prisma.users.findFirst({
      where: {
        nric: nric, 
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
    await prisma.$disconnect(); // Ensure connection is closed
  }
}
