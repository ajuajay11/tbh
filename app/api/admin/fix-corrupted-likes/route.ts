// Create: /api/admin/fix-corrupted-likes/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import UserVibesModel from "@/models/chroniclesSchema";

export async function POST() {
  try {
    await connectToDatabase();

    // Find all documents where UserLikes contains objects instead of strings
    const allDocs = await UserVibesModel.find({});
    
    let fixedCount = 0;
    
    for (const doc of allDocs) {
      let needsUpdate = false;
      const cleanedLikes: string[] = [];
      
      for (const like of doc.UserLikes) {
        if (typeof like === "string") {
          // Already correct
          cleanedLikes.push(like);
        } else if (typeof like === "object" && like !== null) {
          // Corrupted - reconstruct the ID
          needsUpdate = true;
          const chars = Object.keys(like)
            .filter(key => !isNaN(Number(key)))
            .sort((a, b) => Number(a) - Number(b))
            .map(key => like[key]);
          
          if (chars.length > 0) {
            const reconstructedId = chars.join("");
            cleanedLikes.push(reconstructedId);
            console.log(`Fixed corrupted like in doc ${doc._id}: ${reconstructedId}`);
          }
        }
      }
      
      if (needsUpdate) {
        await UserVibesModel.findByIdAndUpdate(doc._id, {
          $set: { 
            UserLikes: cleanedLikes,
            likeCount: cleanedLikes.length 
          }
        });
        fixedCount++;
      }
    }

    return NextResponse.json({
      message: `Fixed ${fixedCount} corrupted documents`,
      totalChecked: allDocs.length
    });

  } catch (error) {
    console.error("Cleanup Error:", error);
    return NextResponse.json(
      { message: "Error during cleanup", error: String(error) },
      { status: 500 }
    );
  }
}