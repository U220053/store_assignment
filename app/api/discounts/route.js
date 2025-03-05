import { NextResponse } from "next/server";
import storeOperations from "@/lib/store";

export async function GET() {
  try {
    const availableCodes = storeOperations.getAvailableDiscountCodes();
    return NextResponse.json({ discountCodes: availableCodes });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch discount codes" },
      { status: 500 }
    );
  }
}
