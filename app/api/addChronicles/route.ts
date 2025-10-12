import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import UserVibesModel from "@/models/chroniclesSchema";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/utils/auth"; // Adjust path as needed
import User from "@/models/users";

interface RequestBody {
  yourStoryTitle: string;
  chroniclesOfYou: string;
  replyAllowed: boolean;
  emailAllowed: boolean;
  comments: boolean;
  incidentFrom:string
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body: RequestBody = await request.json();
    const {
      yourStoryTitle,
      chroniclesOfYou,
      emailAllowed,
      replyAllowed,
      comments,
      incidentFrom,
    } = body;

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No token found" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const userData = await verifyToken(token);
    if (!userData?.userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const userDetail = await User.findById(userData.userId);
    if (!userDetail) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newdarktruth = new UserVibesModel({
      yourStoryTitle,
      chroniclesOfYou,
      replyAllowed,
      emailAllowed,
      comments,
      incidentFrom,
      user: userDetail._id,
    });

    await newdarktruth.save();

    return NextResponse.json(
      {
        message: "Congragulation you done it",
        story: {
          _id: newdarktruth._id,
          yourStoryTitle,
          chroniclesOfYou,
          replyAllowed,
          emailAllowed,
          comments,
          incidentFrom,
          createdAt: newdarktruth.createdAt,
          user: {
            userId: userDetail._id,
            email: userDetail.email,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
