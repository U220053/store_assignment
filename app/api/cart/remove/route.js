import { NextResponse } from "next/server";
import storeOperations from "@/lib/store";

export async function POST(request) {
  try {
    // Ensure user ID is present
    const userId = request.headers.get("user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "User identification is required" },
        { status: 401 }
      );
    }

    // Parse request body
    const { productId, quantity = 1 } = await request.json();

    // Validate product ID
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Remove from cart with detailed logging
    console.log(
      `Removing from cart - User: ${userId}, Product: ${productId}, Quantity: ${quantity}`
    );

    try {
      const cart = storeOperations.removeFromCart(userId, productId, quantity);
      console.log("Cart after removal:", cart);
      return NextResponse.json(cart);
    } catch (removeFromCartError) {
      console.error("Remove from cart error:", removeFromCartError);
      return NextResponse.json(
        {
          error:
            removeFromCartError.message || "Failed to remove item from cart",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error in remove from cart:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
