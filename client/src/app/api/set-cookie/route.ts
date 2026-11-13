import { API } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body: API.setCookieRequestBody = await request.json();

  const { key, token, token_expiry } = body;

  // Check if any of the required fields are missing
  if (!token || !key || typeof token_expiry !== "number") {
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

  var expirationDate = new Date(token_expiry * 1000);
  // const token_expiry_date = expirationDate.getTime() / 1000;

  const response = NextResponse.json({ success: true }, { status: 201 });

  response.cookies.set({
    name: key,
    value: token,
    httpOnly: false,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    expires: expirationDate,
  });

  return response;
}
