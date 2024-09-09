import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { decrypt } from '../../../lib/session';
import { cookies } from 'next/headers'
import { SessionPayload } from '../../../lib/session';

interface MyInfoData {
    mobile: { value: string };
    email: { value: string };
}

async function fetchMyInfoData(accessToken: string): Promise<MyInfoData> {
    try {
        const response = await fetch('http://localhost:5156/myinfo/v3/person', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ${accessToken}',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch MyInfo data');
        }

        // Ensure response is properly typed
        const data = (await response.json()) as MyInfoData;

        // Optional: Add runtime validation here if needed
        return data;
    } catch (error) {
        console.error('Error fetching MyInfo data:', error);
        throw error;
    }
}

export async function GET(request: Request) {
    const cookie = cookies().get('session')?.value;

    if (!cookie) {
      console.error('No session cookie found');
      return;  // Handle the case where there is no cookie
    }
  
    const session: SessionPayload | undefined = await decrypt(cookie);
  
    if (!session) {
      console.error('Failed to decrypt session');
      return;  
    }

    const accessToken = session.userToken;

    if (!accessToken) {
        return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    }

    console.log('accessToken: ', accessToken);

    try {
        const myInfoData = await fetchMyInfoData(accessToken);

        return NextResponse.json({
            mobile: myInfoData.mobile.value,
            email: myInfoData.email.value,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to retrieve MyInfo data' }, { status: 500 });
    }
}
