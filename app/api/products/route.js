// app/api/products/route.js
import { NextResponse } from "next/server";
import storeOperations from "@/lib/store";

export async function GET() {
  try {
    const products = storeOperations.getProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
