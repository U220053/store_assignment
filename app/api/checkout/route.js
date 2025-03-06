// app/api/checkout/route.js

import { NextResponse } from "next/server";
import storeOperations from "@/lib/store";

export async function POST(request) {
  try {
    // Validate user ID
    const userId = request.headers.get("user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "User identification is required" },
        { status: 401 }
      );
    }

    // Fetch current cart to validate with more detailed logging
    const cart = await storeOperations.getCart(userId);
    console.log("DEBUG: Full cart object:", JSON.stringify(cart, null, 2));
    console.log("DEBUG: Cart items:", cart.items);
    console.log(
      "DEBUG: Cart items length:",
      cart.items ? cart.items.length : "undefined"
    );
    console.log("DEBUG: Cart total:", cart.total);

    // More robust cart validation
    if (!cart || !cart.items || cart.items.length === 0 || cart.total === 0) {
      console.warn(`Checkout attempted with empty cart for user: ${userId}`);
      return NextResponse.json(
        { error: "Cannot checkout with an empty cart" },
        { status: 400 }
      );
    }

    // Parse request body with error handling
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Validate discount code (optional)
    const discountCode = body.discountCode ? body.discountCode.trim() : null;

    // Log checkout attempt with more details
    console.log(
      `Checkout Details - User: ${userId}, Items: ${
        cart.items.length
      }, Total: $${cart.total}, Discount Code: ${discountCode || "None"}`
    );

    // Perform checkout with error handling
    let result;
    try {
      result = await storeOperations.checkout(userId, discountCode);
    } catch (checkoutError) {
      console.error("Checkout failed:", checkoutError);
      return NextResponse.json(
        {
          error: checkoutError.message || "Checkout processing failed",
          details: checkoutError.details || null,
        },
        { status: 500 }
      );
    }

    // Validate checkout result
    if (!result || !result.order) {
      return NextResponse.json(
        { error: "Checkout did not produce a valid order" },
        { status: 500 }
      );
    }

    // Log successful checkout
    console.log(`Checkout successful - Order ID: ${result.order.id}`);

    // Return successful response
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    // Catch any unexpected errors
    console.error("Unexpected error during checkout:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during checkout" },
      { status: 500 }
    );
  }
}

// Optional: Add error handling for unsupported HTTP methods
export function GET() {
  return NextResponse.json(
    { error: "Checkout only supports POST requests" },
    { status: 405 }
  );
}
