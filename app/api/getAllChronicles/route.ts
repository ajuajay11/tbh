import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import UserVibesModel from "@/models/chroniclesSchema";
import { verifyToken } from "@/utils/auth";
import "@/models/users";
import { FilterQuery } from "mongoose";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");
  const id = searchParams.get("id");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  try {
    await connectToDatabase();
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    // Base filters
 
    const baseMatch: FilterQuery<typeof UserVibesModel> = { status: 1 };
    if (country) baseMatch.incidentFrom = country.replace(/^"+|"+$/g, "");
    if (id) baseMatch._id = id;

    // Sorting logic
    let sortObj: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "mostLiked") sortObj = { likeCount: -1 };

    // ========== UNAUTHENTICATED USERS (LIMITED VIEW) ==========
    if (!token) {
      const limitedChronicles = await UserVibesModel.aggregate([
        { $match: baseMatch },
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
          $match: search
            ? {
                $or: [
                  { yourStoryTitle: { $regex: search, $options: "i" } },
                  { "user.username": { $regex: search, $options: "i" } },
                ],
              }
            : {},
        },
        { $sort: sortObj },
        { $skip: skip },
        { $limit: 6 },
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
      ]);

      const total = await UserVibesModel.countDocuments(baseMatch);

      return NextResponse.json(
        {
          message: "Please subscribe to get all conversations",
          limitedChronicles,
          pagination: {
            total,
            page,
            limit: 6,
            totalPages: Math.ceil(total / 6),
          },
        },
        { status: 200 }
      );
    }

    // ========== AUTHENTICATED USERS ==========
    const userData = await verifyToken(token);
    if (!userData) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const userId = userData?.userId;

    const filteredChronicles = await UserVibesModel.aggregate([
      {
        $match: {
          ...baseMatch,
          "reportedBy.user.userId": { $ne: userId },
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
        $match: search
          ? {
              $or: [
                { yourStoryTitle: { $regex: search, $options: "i" } },
                { "user.username": { $regex: search, $options: "i" } },
              ],
            }
          : {},
      },
      { $sort: sortObj },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          yourStoryTitle: 1,
          createdAt: 1,
          status: 1,
          likeCount: 1,
          chroniclesOfYou: 1,
          "user.username": 1,
          "user.firstname": 1,
          "user.lastname": 1,
          "user.profilePicture": 1,
        },
      },
    ]);

    const total = await UserVibesModel.countDocuments({
      ...baseMatch,
      "reportedBy.user.userId": { $ne: userId },
    });

    return NextResponse.json(
      {
        message: "Filtered results",
        data: filteredChronicles,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
