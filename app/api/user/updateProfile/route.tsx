import connectToDatabase from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from "@/utils/auth";
import User from "@/models/users";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Parse FormData instead of JSON
    const formData = await request.formData();
    
    // Extract form fields
    const email = formData.get('email') as string;
    const firstname = formData.get('firstname') as string;
    const lastname = formData.get('lastname') as string;
    const gender = formData.get('gender') as string;
    const age = formData.get('age') ? Number(formData.get('age')) : undefined;
    const username = formData.get('username') as string;
    const profilePictureFile = formData.get('profilePicture') as File;

    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No token found" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const userData = await verifyToken(token);
    if (!userData) {
      return NextResponse.json({ message: "Please login" }, { status: 401 });
    }

    const getUser = await User.findById(userData.userId);
    if (!getUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let profilePictureUrl = getUser.profilePicture; // Keep existing if no new image

    // Handle profile picture upload to Imgbb if provided
    if (profilePictureFile && profilePictureFile.size > 0) {
      try {
        // Convert file to base64
        const arrayBuffer = await profilePictureFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString('base64');

        // Prepare Imgbb API request
        const imgbbApiKey = process.env.IMGBB_API_KEY; // Add this to your .env file
        if (!imgbbApiKey) {
          return NextResponse.json({ message: "Image upload service not configured" }, { status: 500 });
        }

        const imgbbFormData = new FormData();
        imgbbFormData.append('key', imgbbApiKey);
        imgbbFormData.append('image', base64Image);
        imgbbFormData.append('name', `profile_${userData.userId}_${Date.now()}`);
        // Optional: Add expiration (in seconds, 60-15552000)
        // imgbbFormData.append('expiration', '604800'); // 7 days

        // Upload to Imgbb
        const imgbbResponse = await fetch('https://api.imgbb.com/1/upload', {
          method: 'POST',
          body: imgbbFormData
        });

        if (!imgbbResponse.ok) {
          const errorText = await imgbbResponse.text();
          console.error('Imgbb upload failed:', errorText);
          return NextResponse.json({ message: "Failed to upload image" }, { status: 500 });
        }

        const imgbbResult = await imgbbResponse.json();
        
        if (imgbbResult.success) {
          profilePictureUrl = imgbbResult.data.url; // Use the direct image URL
        } else {
          console.error('Imgbb upload error:', imgbbResult);
          return NextResponse.json({ message: "Image upload failed" }, { status: 500 });
        }

      } catch (imageError) {
        console.error('Image processing error:', imageError);
        return NextResponse.json({ message: "Error processing image" }, { status: 500 });
      }
    }

    // Update user fields
    getUser.email = email || getUser.email;
    getUser.firstname = firstname || getUser.firstname;
    getUser.lastname = lastname || getUser.lastname;
    getUser.gender = gender || getUser.gender;
    getUser.age = age !== undefined ? age : getUser.age;
    getUser.profilePicture = profilePictureUrl;
    getUser.username = username || getUser.username;

    await getUser.save();

    // Return updated user (exclude sensitive data)
    const { ...userResponse } = getUser.toObject();
    
    return NextResponse.json({ 
      message: "User updated successfully", 
      user: userResponse 
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}