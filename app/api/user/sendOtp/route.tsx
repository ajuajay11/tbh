import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import User from "@/models/users";
import OtpManager from "@/models/otpManager"
import connectToDatabase from "@/lib/db";
import nodemailer from "nodemailer";

// Define the shape of the expected request body
interface RequestBody {
  email: string;
  type: "register" | "forgot-password" | null; // restrict to valid types
}


export async function POST(request: NextRequest) {

  try {
    await connectToDatabase();
    const body = await request.json();
    const { email, type } = body as RequestBody;
    // for the existing user
    const existingUser = await User.findOne({ email });
    if (type == "register") {
      if (existingUser) {
        return NextResponse.json(
          {
            message:
              "User already exists. Please register with a different email address.",
          },
          { status: 400 }
        );
      }

    }
    const recentOtp = await OtpManager.findOne({ email });
    if (recentOtp && Date.now() - recentOtp.createdAt.getTime() < 60 * 1000) {
      return NextResponse.json(
        { message: "Please wait 1 minute before requesting another OTP." },
        { status: 429 }
      );
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    // ✅ Save OTP to database
    const newOtp = new OtpManager({
      email,
      otp,
      createdAt: new Date(), // optional: for expiration logic
    });
    await newOtp.save();

    // const transporter = await nodemailer.createTransport({
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
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
      { message: "Otp send Successfully, Please verify Your mail" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { Message: "Internal server Error", error },
      { status: 500 }
    );
  }
}
