import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/utils/auth"; // Adjust path as needed
import ChronicleSchema from "@/models/chroniclesSchema.ts";
interface RequestBody {
  likeCount: number;
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
    const { id } = await params;
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "token not found" }, { status: 404 });
    }
    //user available
    const userData = await verifyToken(token);
    if (!userData) {
      return NextResponse.json({ message: "please login" }, { status: 401 });
    }
    const userId = userData?.userId;
    // find post
    const findPost = await ChronicleSchema.findById(id); // find the post
    if (isLiked) {
      // Add userId to UserLikes array if not already present
      if (!findPost.UserLikes.includes(userId)) {
        findPost.UserLikes.push(userId);
        console.log(findPost.UserLikes.length,'findPost.UserLikes.length');
        
        findPost.likeCount =  findPost.UserLikes.length
      }
    } else {
      // Remove userId from UserLikes array
      findPost.UserLikes = findPost.UserLikes.filter(
        (id:string) => id.toString() !== userId.toString()
      );
    }
    // Save the updated document back to the database
    await findPost.save();

    return NextResponse.json({ message: "Success", findPost }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "hei bitch not working" },
      { status: 500 }
    );
  }
}
