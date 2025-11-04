import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import UserVibesModel from "@/models/chroniclesSchema";
import UserModel from "@/models/users"; // Import User model
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  try {
    // 1. Extract parameters
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get("username");
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    // 2. Validate token first (authentication)
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required. Please login." },
        { status: 401 }
      );
    }

    const userData = await verifyToken(token);
    if (!userData) {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 401 }
      );
    }
    const userId = userData.userId;

    // 3. Validate required parameters
    if (!username) {
      return NextResponse.json(
        { message: "Username is required." },
        { status: 400 }
      );
    }

    // 4. Connect to database
    await connectToDatabase();

    // 5. Find user by username first
    const user = await UserModel.findOne({ username }).lean();

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    // 6. Fetch chronicles for this user, EXCLUDING ones reported by the current user
    const allChronicles = await UserVibesModel.find({
      user: user._id,
      // Exclude stories where the current user has reported them
      "reportedBy.user.userId": { $ne: userId },
    })
      .populate("user", "firstname lastname username email avatar") // Populate user details
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean();

    // 7. Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Chronicles fetched successfully.",
        data: allChronicles,
        count: allChronicles.length,
        user: {
          id: user._id,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          profilePicture: user.profilePicture,
        },
      },
      { status: 200 }
    );
  } catch (error) {
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
