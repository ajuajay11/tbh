import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import User from "@/models/users";
import OtpManager from "@/models/otpManager"
import connectToDatabase from "@/lib/db";
import nodemailer from "nodemailer";

// Define the shape of the expected request body
interface RequestBody {
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body: RequestBody = await request.json();
    const { email} = body;
    // for the existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json(
            { message: "User already exist, Please try to register with a different Email address" },
            { status: 400 }
        );
    }
    await OtpManager.deleteMany({ email });
    const otp = Math.floor(1000 + Math.random() * 900000).toString();
    // ✅ Save OTP to database
    const newOtp = new OtpManager({
      email,
      otp,
      createdAt: new Date(), // optional: for expiration logic
    });

    
    // ✅ Optionally, send OTP via email
    // Setup your email transport (You need to configure this properly in production)
    await newOtp.save();

    const transporter = await nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "chronicleofstrangers@gmail.com",
        pass: "dyes fyxm bamg eidx",
    },
    });
    // Wrap in an async IIFE so we can use await.
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    });
 
    return NextResponse.json(
      { message: "register user successsfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { Message: "Internal server Error" },
      { status: 500 }
    );
  }
}
