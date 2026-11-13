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

  // expire the cookie
  const response = NextResponse.json({ success: true }, { status: 201 });

  response.cookies.set({
    name: key,
    value: "",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });

  return response;
}
