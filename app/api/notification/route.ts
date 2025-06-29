import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
 import notification from "@/models/notifications";
import { verifyToken } from "@/utils/auth";
 
interface RequestBody {
  message: string;
}

export async function POST(request: NextRequest) {
     try {
    await connectToDatabase();
    const body: RequestBody = await request.json();
    const { message } = body;
    if(!message){
        NextResponse.json({message:"no message found , please add message before submitting"},{status:400});
    }
    const notMessage = new notification({
      message,
    });
    await notMessage.save();
    return NextResponse.json({ message: "Congragulation you done it",notMessage }, { status: 200 }
    );
    } catch (error) {
    return NextResponse.json({ message: "Congragulation you done it",error }, { status: 500 })
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
    const notMessage = await notification.find();
     return NextResponse.json(
      { message: "Congragulation you done it",notMessage },
      { status: 200 }
    );
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
