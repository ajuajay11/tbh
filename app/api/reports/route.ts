import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import UserVibesModel from "@/models/chroniclesSchema";
  
export async function GET() {
  try {
    await connectToDatabase();

    // Find all posts with at least one report
    const reportedPosts = await UserVibesModel.find({
      "reportedBy.0": { $exists: true },
    })
      .select("yourStoryTitle reportedBy status")
      .sort({ createdAt: -1 });
    return NextResponse.json(
      { message: "Fetched reported posts", data: reportedPosts },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Invalid response, network error" },
      { status: 500 }
    );
  }
}