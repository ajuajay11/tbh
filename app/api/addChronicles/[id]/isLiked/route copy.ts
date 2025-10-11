import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
// import UserVibesModel from "@/models/chroniclesSchema";
import { verifyToken } from "@/utils/auth"; // Adjust path as needed
// import User from "@/models/users";

 
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
    const { id } = await params;
    console.log(isLiked, id,'authorization');
    
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { message: "Please login" },
        { status: 404 }
      );
    }
    const userData = await verifyToken(token);
    if (!userData) {
      return NextResponse.json({ message: "please login" }, { status: 401 });
    }
     
    return NextResponse.json(
      { message: "like Added Succesfully"  },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
