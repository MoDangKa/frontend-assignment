import { fetcher } from "@/lib/fetcher";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL!;

export async function GET(request: NextRequest) {
  const { status, statusText, data } = await fetcher({
    method: "GET",
    url: `${API_URL}/users`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return NextResponse.json(data, {
    status,
    statusText,
  });
}
