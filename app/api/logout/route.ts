// app/api/auth/logout/route.ts

import { NextResponse } from 'next/server';
import { deleteSession } from '../../../lib/session';

export async function POST() {
    try {
        deleteSession();
        return NextResponse.json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
    }
}
