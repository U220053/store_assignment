// app/api/cart/route.js
import { NextResponse } from "next/server";
import storeOperations from "@/lib/store";

export async function GET(request) {
  try {
    const userId = request.headers.get("user-id");
    console.log(`Fetching cart for user: ${userId}`);

    const cart = storeOperations.getCart(userId);
    console.log("Cart retrieved:", JSON.stringify(cart, null, 2));

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Cart retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve cart" },
      { status: 500 }
    );
  }
}
