 import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../lib/db";
import User from "../../../../../models/users";
import { verifyToken } from "../../../../../utils/auth";
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function PATCH(req) {
  try {
    const formData = await req.formData();
    console.log(formData,'formData=-=-=-=-='); 
    
    const file = formData.get('file');
    if (!file) {
        return Response.json({ error: "No file uploaded" }, { status: 400 });
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    const filename = `${Date.now()}_${file.name}`;
    const filepath = join(process.cwd(), 'public', 'uploads', filename);
    // Save the file
    await writeFile(filepath, bytes);
    
    return Response.json({ 
        success: true,
        imageUrl: `/uploads/${filename}`
      });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
