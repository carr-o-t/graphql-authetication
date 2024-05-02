import { API } from "@/types";
import { cookies } from "next/headers";
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

  // If all required fields are present, continue processing
  // TODO: add domain name for careers
  var expirationDate = new Date(token_expiry * 1000);
  // const token_expiry_date = expirationDate.getTime() / 1000;

  cookies().set({
    name: key,
    value: token,
    httpOnly: false,
    path: "/",
    secure: true,
    domain: process.env.NEXT_PUBLIC_URL,
    expires: expirationDate,
  });

  const response = NextResponse.json(
    {
      success: true,
    },
    {
      status: 201,
      headers: {
        "Set-Cookie": `${key}=${token}; path=/; Expires=${expirationDate}; Secure;`,
      },
    }
  );

  return response;
}
