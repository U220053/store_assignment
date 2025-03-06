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

    // Allow client to provide cart data as a fallback
    let cart;

    // First try to get the cart from the server
    cart = await storeOperations.getCart(userId);

    // If server cart is empty or invalid but client sent cart data, use that instead
    if ((!cart || !cart.items || cart.items.length === 0) && body.cart) {
      console.log("Using client-provided cart data:", body.cart);
      cart = body.cart;

      // You might want to validate and save this cart on the server
      // This depends on your storeOperations implementation
      try {
        await storeOperations.saveCart(userId, cart);
      } catch (saveError) {
        console.warn("Failed to save client cart to server:", saveError);
        // Continue with checkout using client cart
      }
    }

    console.log("DEBUG: Cart retrieval - User ID:", userId);
    console.log("DEBUG: Raw cart response:", cart);
    console.log("DEBUG: Cart type:", typeof cart);
    console.log("DEBUG: Full cart object:", JSON.stringify(cart, null, 2));
    console.log("DEBUG: Cart items:", cart?.items);
    console.log("DEBUG: Cart items type:", typeof cart?.items);
    console.log(
      "DEBUG: Cart items length:",
      cart?.items ? cart?.items.length : "undefined"
    );
    console.log("DEBUG: Cart total:", cart?.total);

    // More robust cart validation with detailed checks
    if (!cart) {
      console.warn(`Cart not found for user: ${userId}`);
      return NextResponse.json({ error: "Cart not found" }, { status: 400 });
    }

    if (!cart.items) {
      console.warn(`Cart items array missing for user: ${userId}`);
      return NextResponse.json(
        { error: "Cart structure is invalid" },
        { status: 400 }
      );
    }

    if (cart.items.length === 0 || cart.total === 0) {
      console.warn(`Empty cart detected for user: ${userId}`);
      return NextResponse.json(
        { error: "Cannot checkout with an empty cart" },
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
