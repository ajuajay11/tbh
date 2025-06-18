import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import UserVibesModel from "@/models/chroniclesSchema";
import { verifyToken } from "@/utils/auth"; // Adjust path as needed
import User from "@/models/users";

interface UserDocument {
  _id: string;
  email: string;
}

interface RequestBody {
   likeCount:number;
  isLiked: boolean;
  createdAt?: Date;
}
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const body: RequestBody = await request.json();
    const { isLiked } = body;
    const { id } = await params; // <-- fixed this line only
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { message: "Please Subscribe to get all convo" },
        { status: 404 }
      );
    }
    const userData = await verifyToken(token);
    if (!userData) {
      return NextResponse.json({ message: "please login" }, { status: 401 });
    }
    const getUser = (await User.findById(
      userData?.userId
    )) as UserDocument | null;
    if (!getUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    console.log(getUser, "getUser");
    const findPost = await UserVibesModel.findById(id);
    if (!findPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    const existingLikeIndex = findPost.UserLikes.findIndex(
      (likeEntry) => likeEntry.user.userId === getUser._id.toString()
    );
    if (existingLikeIndex !== -1) {
      // Update existing like status
      findPost.UserLikes[existingLikeIndex].like = isLiked;
      findPost.UserLikes[existingLikeIndex].createdAt = body.createdAt || new Date();      
    } else {
      // Add new like entry
      findPost.UserLikes.push({
        user: {
          userId: getUser._id,
          name: getUser.email,
        },
        like: isLiked,
        createdAt: body.createdAt || new Date(),
      });
    }
    const likeCount = findPost.UserLikes.filter((e) => e.like === true).length;
    findPost.likeCount = likeCount;
    // ADD THIS LINE - Save the document to persist changes
    await findPost.save({ validateBeforeSave: false });
    return NextResponse.json(
      { message: "Comment Added Succesfully", findPost,likeCount },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
