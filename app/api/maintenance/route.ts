import { NextRequest, NextResponse } from "next/server";
import maintenanceMode from "@/models/maintenanceMode";
import connectToDatabase from "@/lib/db";

interface RequestBody{
    mode: boolean;
    comment: string;
}
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { mode, comment }: RequestBody = await request.json();
    console.log(mode, comment);

    const existingMode = await maintenanceMode.findOne({});
    if (existingMode) {
      existingMode.mode = mode;
      existingMode.comment = comment;
      await existingMode.save();
    } else {
      const newMode = new maintenanceMode({ mode, comment });
      await newMode.save();
    }
    return NextResponse.json({ message: "success", existingMode }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function GET() {
    try {
        await connectToDatabase();
        const maintenance = await maintenanceMode.findOne({});
        if (!maintenance) {
            return NextResponse.json({ message: "Maintenance mode is not active" }, { status: 404 });
        }
        return NextResponse.json({ message: "Maintenance mode is active", maintenance }, { status: 200 });
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({ message: "Error fetching maintenance mode", error }, { status: 500 });
    }
}