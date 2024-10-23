import { NextResponse } from 'next/server';

export async function GET() {
  const jwksEnv = process.env.SINGPASS_PUBLIC_JWKS;
  if (!jwksEnv) {
    return NextResponse.json({ error: 'JWKS not found in environment variables' }, { status: 500 });
  }
  let jwks;
  try {
    jwks = JSON.parse(jwksEnv);
  } catch (error) {
    return NextResponse.json({ error: 'Error parsing JWKS from environment variables' }, { status: 500 });
  }
  return NextResponse.json(jwks);
}






