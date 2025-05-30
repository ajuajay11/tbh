import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import ChroniclesSchema from "@/models/chroniclesSchema";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/utils/auth"; // Adjust path as needed
import User from "@/models/users";

interface RequestBody {
  yourStoryTitle: String;
  chroniclesOfYou: String;
  replyAllowed: Boolean;
  emailAllowed: Boolean;
  comments: Boolean;
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body: RequestBody = await request.json();
    const {
      yourStoryTitle,
      chroniclesOfYou,
      replyAllowed,
      emailAllowed,
      comments,
    } = body;
 
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No token found" }, { status: 401 });
    }
    const token = authHeader.slice(7); // Remove 'Bearer ' prefix
    console.log(token, "token");
    const userData = await verifyToken(token);
    const userDetail = await User.findById(userData.userId);
    const userConnection = {
      email: userDetail?.email,
      userId: userDetail?._id,
    };

    const newdarktruth = new ChroniclesSchema({
      yourStoryTitle,
      chroniclesOfYou,
      replyAllowed,
      emailAllowed,
      comments,
      userConnection,
    });
    await newdarktruth.save();

    return NextResponse.json(
      {
        message: "Congragulation you done it",
        ...newdarktruth.toObject(), // Spread saved document fields
        ...userConnection,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
