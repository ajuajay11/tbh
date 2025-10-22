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
    if (!token) {
      return NextResponse.json(
        {message: "Please login"}, 
        { status: 400 } 
    );
    }
    const userData = await verifyToken(token);
    if (!userData) {
      return NextResponse.json(
        { message: "Invalid token", }, { status: 401 }
      );
    }

    const allChronicles = await UserVibesModel.find({
      user: userData.userId, 
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
