import connectToDatabase from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from "@/utils/auth"; // Adjust path as needed
import User from "@/models/users";
import bcrypt from "bcryptjs";

interface RequestBody {
  newPassword: string;
  oldPassword: string; // password should probably not be updated here without hashing!
}

export async function PATCH(request: NextRequest) {
  try {
    await connectToDatabase();

const body: RequestBody = await request.json();
    const { oldPassword, newPassword } = body;

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No token found" }, { status: 401 });
    }
    const token = authHeader.slice(7); // Remove 'Bearer ' prefix
    const userData = await verifyToken(token);
    if (!userData) {
        console.log(userData,'userDatauserDatauserData');
        
      return NextResponse.json({ message: "Please login" }, { status: 401 });
    }
    console.log(userData,';userDatauserData');
    
    const getUser = await User.findById(userData.userId);
    console.log(getUser,'getUsergetUser');
    
    if (!getUser) {
        console.log(getUser,'getUsergetUsergetUser');
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  if (!getUser.password) {
  return NextResponse.json({ message: "User password not set" }, { status: 500 });
}

const isMatch = await bcrypt.compare(oldPassword, getUser.password);
console.log(isMatch,'isMatchisMatchisMatch');

if (!isMatch) {
  return NextResponse.json({ message: "Old password is incorrect" }, { status: 400 });
}


    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    getUser.password = hashedNewPassword;
    await getUser.save();

    return NextResponse.json({ message: "User updated successfully", user: getUser });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}