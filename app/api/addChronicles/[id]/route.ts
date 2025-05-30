import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ChroniclesSchema from "@/models/chroniclesSchema";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    // Await the params since it's now a Promise
    const { id } = await params;
    console.log(request);

    const deleted = await ChroniclesSchema.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
