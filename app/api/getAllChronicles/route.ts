import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import UserVibesModel from "@/models/chroniclesSchema";
import { verifyToken } from "@/utils/auth"; // Adjust path as needed

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split(" ")[1];
        if (!token) {
            const limitedChronicles = await UserVibesModel.find().sort({ createdAt: -1 }).limit(5); // Limit to latest 5
            return NextResponse.json({ message: "PLease Subscribe to get all convo", limitedChronicles },{ status: 404 });
        }
        const userData = await verifyToken(token);
        if (userData) {
            const allChronicles = await UserVibesModel.find();
            return NextResponse.json({ message: "Hurrayyy... Welcome Back", allChronicles }, { status: 200 } );
        } else {
            return NextResponse.json({ message: "Invalid token" },{ status: 401 });
        }
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json(
            { message: "Server error", error },
            { status: 500 }
        );
    }
}
