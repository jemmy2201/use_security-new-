import { NextRequest, NextResponse } from 'next/server';

// Mock function to validate OTP (you should replace this with actual logic)
const isValidOtp = (otp: string) => {
  // For demonstration, let's assume '1234' is the valid OTP
  return otp === '1234';
};

export async function POST(request: NextRequest) {
  const { otp } = await request.json();

  if (!otp) {
    return NextResponse.json({ success: false, message: 'OTP is required' }, { status: 400 });
  }

  // Check if the OTP is valid
  if (isValidOtp(otp)) {
    return NextResponse.json({ success: true, message: 'OTP verified successfully' }, { status: 200 });
  } else {
    return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 401 });
  }
}

