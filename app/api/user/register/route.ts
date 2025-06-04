import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import User from "@/models/users";
import connectToDatabase from "@/lib/db";

// Define the shape of the expected request body
interface RequestBody {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  gender: string;
  profilePicture?: string;
  age?: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body: RequestBody = await request.json();
    const {
      email,
      password,
      firstname,
      lastname,
      gender,
      profilePicture,
      age} = body;

    // for the existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User alrdy exist " },
        { status: 400 }
      );
    }
    // Create a new user
    const newUser = new User({
      email,
      password,
      firstname,
      lastname,
      gender,
      profilePicture,
      age,
    });

    await newUser.save();
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
