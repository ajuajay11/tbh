import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import User from "@/models/users";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/utils/auth"; // Adjust path as needed

export async function GET(request:NextRequest) {
    try {
        await connectToDatabase();
         const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ message: "No token found" }, { status: 401 });
        }
        const token = authHeader.slice(7); // Remove 'Bearer ' prefix
        console.log(token, "token");
        const userData = await verifyToken(token);
        if(!userData){
        return NextResponse.json({message:"please login"},{status:401})
        }
        const getUser = await User.findById(userData?.userId);
        return NextResponse.json({message:"User Data",getUser}, {status:200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({message:"Server error please try agaian"}, {status:500})

    }
}