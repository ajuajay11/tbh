import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/users";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
 import { loginSchema } from "@/lib/validationSchemas";


// Define the shape of the expected request body
interface RequestBody {
  email: string;
  password: string;
}
interface TokenUser {
  email: string;
  _id: string;
}

export async function POST(request: NextRequest) {
  console.log('poda kunne')
  try {
    await connectToDatabase();
  console.log('poda kunne')

    const body: RequestBody = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const firstErrorMessage =
        parsed.error.issues[0]?.message || "Invalid input";

      return NextResponse.json({ message: firstErrorMessage }, { status: 400 });
    }
    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }
    const generateToken = (user: TokenUser): string => {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }
      return jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "12d" }
      );
    };

    const token = generateToken(user as TokenUser);
    return NextResponse.json(
      {
        message: "login user successfully",
        user: {
          id: user._id,
          firstname: user.email,
          lastname: user.lastname,
          avatar: user.profilePicture,
          username: user.username,
          email: user.email,
          gender: user.gender,
          age: user.age,
          role: user.role,
          token,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
