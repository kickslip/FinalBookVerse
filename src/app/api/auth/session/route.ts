import { validateRequest } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return new NextResponse(JSON.stringify({ user: null, session: null }), {
        status: 200,
      });
    }

    return new NextResponse(JSON.stringify({ user, session }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}