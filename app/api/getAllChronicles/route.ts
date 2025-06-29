import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import UserVibesModel from "@/models/chroniclesSchema";
import { verifyToken } from "@/utils/auth";
import { FilterQuery } from "mongoose";
 
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");

  // Get pagination params, with defaults
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;
  try {
    console.log(country,'countrycountry',search,"searchsearchsearch");
    await connectToDatabase();
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
      const limitedChronicles = await UserVibesModel.find().sort({ createdAt: -1 }).limit(6);
      return NextResponse.json(
        { message: "Please subscribe to get all conversations", limitedChronicles },
        { status: 201 }
      );
    }

    const userData = await verifyToken(token);
    if (!userData) {
      return NextResponse.json({ message: "Invalid token" },{ status: 401 });
    }
const query: FilterQuery<typeof UserVibesModel> = {};
    if (country) {
      query.incidentFrom = country.replace(/^"+|"+$/g, '');
    }
    if (search) {
      query.$or = [
        { yourStoryTitle: { $regex: search, $options: "i" } },
      ];
    }
    // Count total documents matching query for pagination meta
    const total = await UserVibesModel.countDocuments(query);
    // Optionally, apply sorting
    let sortObj: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "mostLiked") { sortObj = { likeCount: -1 }}
    // Fetch paginated results
    const filtered = await UserVibesModel.find(query).sort(sortObj).skip(skip).limit(limit);
    return NextResponse.json(
      {
        message: "Filtered results",
        data: filtered,
        pagination: {
          total, page, limit, totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ message: "Internal server error",},{ status: 500 });
  }
}
