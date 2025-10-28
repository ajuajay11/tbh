import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import UserVibesModel from "@/models/chroniclesSchema";
import { verifyToken } from "@/utils/auth"; // Adjust path as needed
import User from "@/models/users";
import sanitize from "sanitize-html";

interface RequestBody {
  yourStoryTitle: string;
  chroniclesOfYou: string;
  replyAllowed: boolean;
  emailAllowed: boolean;
  comments: boolean;
}
// Inside your PUT handler, after parsing body:

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body: RequestBody = await request.json();
    const {
      yourStoryTitle,
      chroniclesOfYou,
      emailAllowed,
      replyAllowed,
      comments,
    } = body;
    const safeTitle = sanitize(yourStoryTitle, {
      allowedTags: [],
      allowedAttributes: {},
    });
    const safeChronicles = sanitize(chroniclesOfYou, {
      allowedTags: [],
      allowedAttributes: {},
    });
if (!safeTitle.trim()) {
  return NextResponse.json({ message: "Title cannot be empty" }, { status: 400 });
}

if (!safeChronicles.trim()) {
  return NextResponse.json({ message: "Story content cannot be empty" }, { status: 400 });
}
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No token found" }, { status: 401 });
    }
    const token = authHeader.slice(7); // Remove 'Bearer ' prefix
    console.log(token, "token");
    const userData = await verifyToken(token);
    if (!userData) {
      return NextResponse.json({ message: "please login" }, { status: 401 });
    }
    const getUser = await User.findById(userData?.userId);
    const getID = getUser?._id?.toString();
    const existingStory = await UserVibesModel.findById(id);
    if (!existingStory) {
      return NextResponse.json({ message: "Story not found" }, { status: 404 });
    }
    if (existingStory.user?.toString() !== getID) {
      return NextResponse.json(
        { message: "You are not authorized to update this story." },
        { status: 403 }
      );
    }
    const updatedStory = await UserVibesModel.findByIdAndUpdate(
      id,
      {
        yourStoryTitle: safeTitle,
        chroniclesOfYou: safeChronicles,
        emailAllowed,
        replyAllowed,
        comments,
      },
      { new: true }
    );

    return NextResponse.json(
      { message: "Story updated successfully", updatedStory },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    // Await the params since it's now a Promise
    const { id } = await params;
    console.log(request);
    const deleted = await UserVibesModel.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
