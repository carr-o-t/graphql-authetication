import { API } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body: Pick<API.setCookieRequestBody, "key"> = await request.json();

  const { key } = body;

  // Check if any of the required fields are missing
  if (!key) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing or invalid request body fields",
      },
      {
        status: 400, // Bad Request
      }
    );
  }

  // If all required fields are present, continue processing
  // cookies().delete(key)

  return NextResponse.json(
    {
      success: true,
    },
    {
      status: 201,
      headers: {
        "Set-Cookie": `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; Max-Age=0; Secure; HttpOnly`,
      },
    }
  );
}
