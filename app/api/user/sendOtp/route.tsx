import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import User from "@/models/users";
import OtpManager from "@/models/otpManager";
import connectToDatabase from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend('re_P6pzqUVr_Hvo2W89YNSSonJ3c8kM7oJVn');

interface RequestBody {
  email: string;
  type: "register" | "forgot-password";
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { email, type } = body as RequestBody;

    const existingUser = await User.findOne({ email });
    if (type === "register") {
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

    const newOtp = new OtpManager({
      email,
      otp,
      createdAt: new Date(),
    });
    await newOtp.save();

    // ✅ Send email with YOUR custom domain
    const { data, error } = await resend.emails.send({
      from: "ToBeHonest <noreply@tobehonest.club>", // Your verified domain!
      to: email,
      subject: "Your OTP Code - ToBeHonest",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">ToBeHonest</h1>
          </div>
           
          <div style="background: #ffffff; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Your Verification Code</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              ${type === "register" ? "Welcome! Please verify your email address." : "You requested to reset your password."}
            </p>
            
            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
              <div style="color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
                Your OTP Code
              </div>
              <div style="font-size: 42px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #999; font-size: 14px; margin-bottom: 0;">
              This code will expire in <strong>10 minutes</strong>.
            </p>
            <p style="color: #999; font-size: 14px; margin-top: 5px;">
              If you didn't request this code, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2024 ToBeHonest. All rights reserved.</p>
          </div>
        </div>
      `,
      text: `Your OTP code is ${otp}. This code will expire in 10 minutes.`,
    });
    if(data){
      console.log(data);
      
    }
    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { message: "Failed to send OTP email", error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "OTP sent successfully. Please check your email." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}