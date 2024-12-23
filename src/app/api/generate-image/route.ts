import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    const apiSecret = request.headers.get("X-API-SECRET");

    if (apiSecret !== process.env.API_SECRET) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const url = new URL(process.env.MODAL_API_URL || "");

    url.searchParams.set("prompt", text)

    console.log("Request URL:", url.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-API-Key": process.env.CLIENT_TOKEN_1 || "",
        accept: "image/jpeg",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Response:", errorText);
      throw new Error(`HTTP Error! status: ${response.status}, message: ${errorText}`);
    }

    const imageBuffer = await response.arrayBuffer();

    const fileName = `${crypto.randomUUID()}.jpg`;

    const blob = await put(fileName, imageBuffer, {
      access: "public",
      contentType: "image/jpeg",
    });

    return NextResponse.json({
      success: true,
      imageUrl: blob.url,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to generate image" },
      { status: 500 }
    );
  }
}