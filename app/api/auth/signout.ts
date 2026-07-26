// app/api/auth/signout/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
    }
    
    // Any cleanup logic here
    
    return NextResponse.json({ success: true });
}