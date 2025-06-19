import connextDb from "../../../lib/db";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    await connextDb();
    return NextResponse.json({ message: "connext to mongo" });
  } catch (error) {
    return NextResponse.json(
      { message: "Connection failed", error: (error as Error).message },
      { status: 500 }
    );
  }
}
