import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import UserVibesModel from "@/models/chroniclesSchema";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/utils/auth"; // Adjust path as needed
import User from "@/models/users";
import { Filter } from "bad-words";
import sanitizeHtml from "sanitize-html";

interface RequestBody {
  yourStoryTitle: string;
  chroniclesOfYou: string;
  replyAllowed: boolean;
  emailAllowed: boolean;
  comments: boolean;
  incidentFrom: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const filter = new Filter();
    console.log(filter.clean("Don't be an ash0le")); //Don't be an ******

    const body: RequestBody = await request.json();
    const {
      yourStoryTitle,
      chroniclesOfYou,
      emailAllowed,
      replyAllowed,
      comments,
      incidentFrom,
    } = body;
    const safeTitle = sanitizeHtml(yourStoryTitle, {
      allowedTags: [],
      allowedAttributes: {},
    });
    const safeChronicles = sanitizeHtml(chroniclesOfYou, {
      allowedTags: [],
      allowedAttributes: {},
    });
   if (!safeTitle.trim()) {
  return NextResponse.json(
    { message: "Title cannot be empty or contain only HTML tags" },
    { status: 400 }
  );
}

  if (!safeChronicles.trim()) {
  return NextResponse.json(
    { message: "Story content cannot be empty or contain only HTML tags" },
    { status: 400 }
  );
}
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
      yourStoryTitle: filter.clean(safeTitle),
      chroniclesOfYou: filter.clean(safeChronicles),
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
          yourStoryTitle: newdarktruth.yourStoryTitle,
          chroniclesOfYou: newdarktruth.chroniclesOfYou,
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
