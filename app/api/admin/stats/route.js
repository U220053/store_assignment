// app/api/admin/stats/route.js
import { NextResponse } from "next/server";
import storeOperations from "@/lib/store";

export async function GET() {
  try {
    const stats = storeOperations.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
