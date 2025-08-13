import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import UserVibesModel from "@/models/chroniclesSchema";
import { verifyToken } from "@/utils/auth";
import User from "@/models/users";

interface RequestBody {
  user: {
    userId?: string;
    name?: string;
  };
  reason: string;
  createdAt?: Date;
}
interface UserDocument {
  _id: string;
  email: string;
}
interface IReportEntry {
  user: {
    userId: string;
    name?: string;
  };
  reason: string;
  createdAt?: Date;
}
export async function POST( request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body: RequestBody = await request.json();
    const { reason } = body;
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return NextResponse.json( { message: "Please Subscribe to get all convo" }, { status: 404 } );
    }
    const userData = await verifyToken(token);
    if (!userData) {
      return NextResponse.json({ message: "please login" }, { status: 401 });
    }
    const getUser = (await User.findById( userData?.userId )) as UserDocument | null;
    if (!getUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const findPost = await UserVibesModel.findById(id);
    if (!findPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Check if already reported
    const userObjectId = getUser?._id.toString();
   const alreadyReported = findPost.reportedBy.find(
  (entry: IReportEntry) => entry.user.userId.toString() === userObjectId
);
    if (alreadyReported) {
      return NextResponse.json( { message: "You already reported this post." }, { status: 400 } );
    }
    // Add report
    findPost.reportedBy.push({
      user: {
        userId: getUser._id,
        name: getUser.email,
      },
      reason,
      createdAt: body.createdAt || new Date(),
    });

    const totalUsers = await User.countDocuments();

    const reportCount = findPost.reportedBy.length;
    if (totalUsers > 0 && reportCount / totalUsers > 0.5) {
      findPost.status = 2; // Mark as reported
    }

    await findPost.save();
    return NextResponse.json(
      { message: "Reported successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
