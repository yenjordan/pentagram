"use server";

import { put } from "@vercel/blob";
import crypto from "crypto";

export async function generateImage(text: string) {
  try {
    if (!process.env.MODAL_API_URL || !process.env.CLIENT_TOKEN_1) {
      throw new Error("Missing environment variables");
    }

    // Make request directly to Modal API
    const url = new URL(process.env.MODAL_API_URL);
    url.searchParams.set("prompt", text);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-API-Key": process.env.CLIENT_TOKEN_1,
        accept: "image/jpeg",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Response:", errorText);
      throw new Error(`HTTP Error! status: ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const fileName = `${crypto.randomUUID()}.jpg`;

    const blob = await put(fileName, imageBuffer, {
      access: "public",
      contentType: "image/jpeg",
    });

    return {
      success: true,
      imageUrl: blob.url,
    };
  } catch (error) {
    console.error("Server Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate image"
    };
  }
}