import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import OtpManager from "@/models/otpManager"
import connectToDatabase from "@/lib/db";

// Define the shape of the expected request body
interface RequestBody {
  email: string;
  otp:string;
}

// Define the shape of the expected request body
interface RequestBody {
  email: string;
}
// api/user/verifyOtp
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body: RequestBody = await request.json();
    const { email, otp } = body;
    // Find valid OTP (expired ones are already deleted by MongoDB)
    const validOtp = await OtpManager.findOne({ email, otp });
    
    if (!validOtp) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }
    // Delete OTP after successful verification
    await OtpManager.deleteOne({ email, otp });
    return NextResponse.json(
      { message: "OTP verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    
    return NextResponse.json(
      { message: "Internal server Error" },
      { status: 500 }
    );
  }
}