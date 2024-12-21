import { list } from '@vercel/blob';
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { blobs } = await list();
    return NextResponse.json(blobs);
  } catch (error) {
    console.error("Error listing images:", error);
    return NextResponse.json(
      { success: false, error: "Failed to list images" },
      { status: 500 }
    );
  }
}