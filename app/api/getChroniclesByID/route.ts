import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import UserVibesModel from "@/models/chroniclesSchema";
import UserModel from "@/models/users";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get("username");
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    // 🧩 1. Auth check
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required. Please login." },
        { status: 401 }
      );
    }

    const userData = await verifyToken(token);
    if (!userData) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    const userId = userData.userId;
    if (!username) {
      return NextResponse.json(
        { success: false, message: "Username is required." },
        { status: 400 }
      );
    }

    // 🧩 2. Connect to DB (cached)
    await connectToDatabase();

    // 🧩 3. Get the user by username
    const user = await UserModel.findOne({ username })
      .select("_id username firstname lastname profilePicture")
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // 🧩 4. Fetch chronicles (excluding reported ones)
  const allChronicles = await UserVibesModel.aggregate([
  {
    $match: {
      user: user._id,
      "reportedBy.user.userId": { $ne: userId },
      status: 1,
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "user",
    },
  },
  { $unwind: "$user" },
  {
    $project: {
      yourStoryTitle: 1,
      createdAt: 1,
      status: 1,
      likeCount: 1,
      "user.username": 1,
      "user.firstname": 1,
      "user.lastname": 1,
      "user.profilePicture": 1,
    },
  },
  { $sort: { createdAt: -1 } },
  { $limit: 20 },
]);


    // 🧩 5. Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Chronicles fetched successfully.",
        count: allChronicles.length,
        user: {
          id: user._id,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          profilePicture: user.profilePicture,
        },
        data: allChronicles,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching chronicles:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch chronicles.",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
