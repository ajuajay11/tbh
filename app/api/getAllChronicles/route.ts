import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import UserVibesModel from "@/models/chroniclesSchema";
import { verifyToken } from "@/utils/auth";
import { FilterQuery } from "mongoose";
// import BadWordsNext from "bad-words-next";
// import en from "bad-words-next/lib/en";
import "@/models/users";

export async function GET(request: NextRequest) {
  // const badwords = new BadWordsNext({ data: en });
  // console.log(badwords);
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");
  const id = searchParams.get("id");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");

  // Get pagination params, with defaults
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  try {
    await connectToDatabase();
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    // Build base query for both authenticated and non-authenticated users
    const baseQuery: FilterQuery<typeof UserVibesModel> = {
      status: 1,
    };

    if (country) {
      baseQuery.incidentFrom = country.replace(/^"+|"+$/g, "");
    }

    if (search) {
      baseQuery.$or = [{ yourStoryTitle: { $regex: search, $options: "i" } }];
    }
    if (id) {
      baseQuery._id = id;
    }
    // Optionally, apply sorting
    let sortObj: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "mostLiked") {
      sortObj = { likeCount: -1 };
    }

    if (!token) {
      const limitedChronicles = await UserVibesModel.find(baseQuery)
        .populate("user", "username firstname lastname")
        .sort(sortObj)
        .limit(6);
      console.log(limitedChronicles, "limitedChronicles");

      const total = await UserVibesModel.countDocuments(baseQuery);

      return NextResponse.json(
        {
          message: "Please subscribe to get all conversations",
          limitedChronicles,
          pagination: {
            total,
            page: 1,
            limit: 6,
            totalPages: Math.ceil(total / 6), // Total pages if they had full access
          },
        },
        { status: 201 }
      );
    }

    const userData = await verifyToken(token);
    if (!userData) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // For authenticated users: add the reportedBy filter and use full pagination
    const query: FilterQuery<typeof UserVibesModel> = {
      ...baseQuery,
      reportedBy: { $ne: userData.id }, // ✅ exclude reported stories
    };

    const total = await UserVibesModel.countDocuments(query);

    const filtered = await UserVibesModel.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate("user", "firstname lastname username")
      .lean();

    return NextResponse.json(
      {
        message: "Filtered results",
        data: filtered,
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
