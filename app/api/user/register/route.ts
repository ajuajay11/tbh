import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import User from "@/models/users";
import connectToDatabase from "@/lib/db";
import bcrypt from "bcryptjs"; // or "bcrypt"
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email().max(100).transform(e => e.trim().toLowerCase()),
  password: z.string().min(6).max(100).transform(p => p.trim()),
  firstname: z.string().min(1).max(50).transform(f => f.trim()),
  lastname: z.string().min(1).max(50).transform(f => f.trim()),
  gender: z.enum(["male", "female", "other"]),
  username: z.string().max(30).optional().transform(u => u?.trim()),
  profilePicture: z.string().url().optional(),
  age: z.number().int().min(1).max(120).optional(),
});

// Define the shape of the expected request body
interface RequestBody {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  gender: string;
  profilePicture?: string;
  age?: number;
  username:string;
}

export async function POST(request: NextRequest) {
  try {
    console.log(connectToDatabase(),'connectToDatabaseconnectToDatabaseconnectToDatabase');
    await connectToDatabase();
    const body: RequestBody = await request.json();
    const {
      email,
      password,
      firstname,
      lastname,
      gender,
      username,
      profilePicture,
      age
    } = body;

    // for the existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exist, Please try to register with a different Email address" },
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
