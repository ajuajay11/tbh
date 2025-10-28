import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import User from "@/models/users";
import connectToDatabase from "@/lib/db";
import bcrypt from "bcryptjs"; // or "bcrypt"
import { registerSchema } from "@/lib/validationSchemas";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const firstErrorMessage =
        parsed.error.issues[0]?.message || "Invalid input";

      return NextResponse.json({ message: firstErrorMessage }, { status: 400 });
    }
    const {
      email,
      password,
      firstname,
      lastname,
      gender,
      username,
      profilePicture,
      age,
    } = parsed.data;

    // for the existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          message:
            "User already exist, Please try to register with a different Email address",
        },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    let finalUsername = username?.trim();
    if (!finalUsername) {
      // base name (lowercase + remove spaces)
      const base = `${firstname}${lastname}`.replace(/\s+/g, "").toLowerCase();
      let randomNum = Math.floor(1000 + Math.random() * 9000); // random 4-digit number
      finalUsername = `${base}${randomNum}`;

      // ensure uniqueness
      let exists = await User.findOne({ username: finalUsername });
      while (exists) {
        randomNum = Math.floor(1000 + Math.random() * 9000);
        finalUsername = `${base}${randomNum}`;
        exists = await User.findOne({ username: finalUsername });
      }
    }
    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      firstname,
      lastname,
      gender,
      username: finalUsername,
      profilePicture,
      age,
    });
    await newUser.save();
    return NextResponse.json(
      { message: "register user successsfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
