import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import UserVibesModel from "@/models/chroniclesSchema";
import { verifyToken } from "@/utils/auth"; // Adjust path as needed
import User from "@/models/users";

interface RequestBody {
  user: {
    userId?: string;
    name?: string;
  };
  comment: string;
  createdAt?: Date;
}
interface UserDocument {
  _id: string;
  email: string;
}
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;  // <-- fixed this line only
    const body: RequestBody = await request.json();
    const {comment}= body;
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
       return NextResponse.json({ message: "Please Subscribe to get all convo" },{ status: 404 });
    }
    const userData = await verifyToken(token);
        if(!userData){
          return NextResponse.json({message:"please login"},{status:401})
        }
        const getUser = await User.findById(userData?.userId) as UserDocument | null;
        if (!getUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        console.log(getUser,'getUser');
    const findPost = await UserVibesModel.findById(id);
     if (!findPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
      findPost.UserComments.push({
       user: {
        userId: getUser._id,
        name: getUser.email,
      },
      comment,
      createdAt: body.createdAt || new Date(),
    });

    await findPost.save();
    return NextResponse.json({ message: "Comment Added Succesfully" , findPost}, { status: 200 });
   } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
