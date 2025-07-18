import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import UserVibesModel from "@/models/chroniclesSchema";
import { verifyToken } from "@/utils/auth";
import { FilterQuery } from "mongoose";
import BadWordsNext from "bad-words-next";
import en from "bad-words-next/lib/en";

export async function GET(request: NextRequest) {
  const badwords = new BadWordsNext({ data: en });
  console.log(badwords);

  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");

  // Get pagination params, with defaults
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  try {
    console.log(country, "countrycountry", search, "searchsearchsearch");
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
    
    // Optionally, apply sorting
    let sortObj: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "mostLiked") {
      sortObj = { likeCount: -1 };
    }

    if (!token) {
      // For non-authenticated users: apply same filtering but limit to 6 results
      const limitedChronicles = await UserVibesModel.find(baseQuery)
        .sort(sortObj)
        .limit(6);
        
      // Count total for pagination info (optional)
      const total = await UserVibesModel.countDocuments(baseQuery);
      
      return NextResponse.json(
        {
          message: "Please subscribe to get all conversations",
          limitedChronicles,
          pagination: {
            total,
            page: 1, // Always page 1 for limited results
            limit: 6, // Always limit to 6
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

    // Count total documents matching query for pagination meta
    const total = await UserVibesModel.countDocuments(query);

    // Fetch paginated results
    const filtered = await UserVibesModel.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

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