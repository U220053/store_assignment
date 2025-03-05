// app/api/admin/discount/generate/route.js
import { NextResponse } from "next/server";
import storeOperations from "@/lib/store";

export async function POST() {
  try {
    const result = storeOperations.generateDiscountCode();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
