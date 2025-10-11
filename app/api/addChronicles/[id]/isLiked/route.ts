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
// find id
//  find post


 
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const body: RequestBody = await request.json();
    const { isLiked } = body;
    const { id } = await params; // <-- fixed this line only
    console.log(isLiked, id);
    
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
   const userId = userData.userId.toString();
 
    const findPost = await UserVibesModel.findById(id);
    if (!findPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
// Like/Unlike logic
    const hasLiked = findPost.UserLikes.includes(userId);
    console.log(hasLiked,'userId');
    
    if (isLiked && !hasLiked) {
      // User wants to LIKE and hasn't liked yet
      findPost.UserLikes.push(userId);
      console.log("✅ Added like");
    } else if (!isLiked && hasLiked) {
      // User wants to UNLIKE and has already liked
      findPost.UserLikes = findPost.UserLikes.filter(
        (id: string) => id !== userId
      );
      console.log("✅ Removed like");
    } else {
      // No change needed
      console.log("⚠️ No change - already in desired state");
    }
    findPost.likeCount = findPost.UserLikes.length;
    await findPost.save();
    return NextResponse.json(
      { message: "Like updated successfully",
        likeCount: findPost.likeCount,
        userLikes: findPost.UserLikes,  
        hasCurrentUserLiked: findPost.UserLikes.includes(userId)},
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
