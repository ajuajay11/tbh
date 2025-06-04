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
      incidentFrom
    } = body;
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No token found" }, { status: 401 });
    }
    const token = authHeader.slice(7); // Remove 'Bearer ' prefix
    console.log(token, "token");
    const userData = await verifyToken(token);
    const userDetail = await User.findById(userData?.userId);
    const userConnection = {
      email: userDetail?.email,
      userId: userDetail?._id,
    };

    const newdarktruth = new UserVibesModel({
      yourStoryTitle,
      chroniclesOfYou,
      replyAllowed,
      emailAllowed,
      comments,
      incidentFrom,
      user: userDetail?._id,
    });
    await newdarktruth.save();
    return NextResponse.json(
      {
        message: "Congragulation you done it",
        ...newdarktruth.toObject(),
        userConnection,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No token found" }, { status: 401 });
    }
    const token = authHeader.slice(7); // Remove 'Bearer ' prefix
    console.log(token, "token");
    const userData = await verifyToken(token);
    if(!userData){
      return NextResponse.json({message:"please login"},{status:401})
    }
    const getUser = await User.findById(userData?.userId);
    const getID = getUser?._id?.toString();
    console.log(getID, "getID");
    const userStories = await UserVibesModel.find({ user: getID });
    console.log("User Story Title:", userStories);
    return NextResponse.json(
      { message: "Congragulation you done it",userStories },
      { status: 200 }
    );
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
