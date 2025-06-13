import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import UserVibesModel from "@/models/chroniclesSchema";
import { verifyToken } from "@/utils/auth"; // Adjust path as needed

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    console.log(token,'token');
    if (!token || 'undefined') {
      const limitedChronicles = await UserVibesModel.find().sort({ createdAt: -1 }).limit(5);
      return NextResponse.json(
        {message: "Please subscribe to get all conversations",limitedChronicles}, 
        { status: 201 } 
    );
    }

    const userData = await verifyToken(token);
    if (!userData) {
      return NextResponse.json(
        { message: "Invalid token", }, { status: 401 }
      );
    }

    // Filter by user to avoid returning other users' data
    const allChronicles = await UserVibesModel.find({
      userId: userData.userId,
    });
    return NextResponse.json(
      {
        message: "Welcome back!",
        allChronicles,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
