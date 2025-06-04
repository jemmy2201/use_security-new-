import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getEncryptedNricFromSession } from '../../../lib/session';
const validateSession = (cookies: Record<string, string>) => {
    const sessionToken = cookies['session'];
    if (sessionToken) {
        return { isValid: true, sessionToken };
    }
    return { isValid: false };
};

export async function GET(request: NextRequest) {

    const cookies = request.headers.get('cookie') || '';
    const cookieObj = Object.fromEntries(
        cookies.split('; ').map(c => c.split('=').map(decodeURIComponent))
    );
    const sessionInfo = validateSession(cookieObj);
    const encryptedNric = await getEncryptedNricFromSession(request);
    if (encryptedNric instanceof NextResponse) {
      return encryptedNric;
    }
    if (sessionInfo.isValid) {
        return NextResponse.json({ valid: true, token: sessionInfo.sessionToken });
    }

    return NextResponse.json({ valid: false });
}
