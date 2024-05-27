import { fetcher } from "@/lib/fetcher";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL!;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  const { status, statusText, data } = await fetcher({
    method: "GET",
    url: `${API_URL}/users/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (status === 200) {
    return NextResponse.json(
      { user: [data] },
      {
        status,
        statusText,
      },
    );
  }

  return NextResponse.json(data, {
    status,
    statusText,
  });
}
