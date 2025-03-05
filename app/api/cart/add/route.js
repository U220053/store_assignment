// // app/api/cart/add/route.js
// import { NextResponse } from "next/server";
// import storeOperations from "@/lib/store";

// export async function POST(request) {
//   try {
//     const userId = request.headers.get("user-id") || "guest";
//     const { productId, quantity = 1 } = await request.json();

//     if (!productId) {
//       return NextResponse.json(
//         { error: "Product ID is required" },
//         { status: 400 }
//       );
//     }

//     const cart = storeOperations.addToCart(userId, productId, quantity);
//     console.log("cart", cart);
//     return NextResponse.json(cart);
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
// app/api/cart/add/route.js
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

    // Add to cart with detailed logging
    console.log(
      `Adding to cart - User: ${userId}, Product: ${productId}, Quantity: ${quantity}`
    );

    try {
      const cart = storeOperations.addToCart(userId, productId, quantity);
      console.log("Cart after addition:", cart);
      return NextResponse.json(cart);
    } catch (addToCartError) {
      console.error("Add to cart error:", addToCartError);
      return NextResponse.json(
        { error: addToCartError.message || "Failed to add item to cart" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error in add to cart:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
