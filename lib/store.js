// lib/store.js
// In-memory store for e-commerce data

// Initial products
const products = [
  {
    id: 1,
    name: "Laptop",
    price: 999.99,
    description: "High-performance laptop",
  },
  {
    id: 2,
    name: "Smartphone",
    price: 499.99,
    description: "Latest smartphone model",
  },
  {
    id: 3,
    name: "Headphones",
    price: 99.99,
    description: "Noise-cancelling headphones",
  },
  {
    id: 4,
    name: "Tablet",
    price: 299.99,
    description: "Portable tablet device",
  },
  {
    id: 5,
    name: "Smartwatch",
    price: 199.99,
    description: "Fitness tracking smartwatch",
  },
];

// Initialize the store
let store = {
  products,
  carts: {}, // userId -> cart items
  orders: [], // completed orders
  discountCodes: [], // available discount codes
  orderCounter: 0, // to track number of orders
  nthOrder: 3, // every 3rd order gets a discount
  discountPercentage: 10, // 10% discount
};

// Helper function to calculate cart total
// export function calculateCartTotal(userId) {
//   if (!store.carts[userId]) {
//     return { items: [], total: 0 };
//   }

//   const items = store.carts[userId].map((item) => {
//     const product = store.products.find((p) => p.id === item.productId);
//     return {
//       ...item,
//       subtotal: item.price * item.quantity,
//     };
//   });

//   const total = items.reduce((sum, item) => sum + item.subtotal, 0);

//   return {
//     items,
//     total,
//   };
// }
// Helper function to calculate cart total
export function calculateCartTotal(userId) {
  console.log(`Calculating cart total for user: ${userId}`);
  console.log("Current store.carts:", JSON.stringify(store.carts, null, 2));

  // If no cart exists for the user, return a clear indication of an empty cart
  if (!store.carts[userId] || store.carts[userId].length === 0) {
    console.warn(`No cart found for user: ${userId}`);
    return {
      items: [],
      total: 0,
    };
  }

  const items = store.carts[userId].map((item) => {
    const product = store.products.find((p) => p.id === item.productId);
    const subtotal = item.price * item.quantity;

    console.log(
      `Cart Item - Product: ${item.productName}, Quantity: ${item.quantity}, Subtotal: ${subtotal}`
    );

    return {
      ...item,
      subtotal,
    };
  });

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  console.log(`Cart Total for user ${userId}: ${total}`);

  return {
    items,
    total,
  };
}
// Helper function to generate discount code
export function generateDiscountCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Store methods
const storeOperations = {
  // Get all products
  getProducts: () => {
    return [...store.products];
  },

  // Get cart for a user
  getCart: (userId) => {
    return calculateCartTotal(userId);
  },

  // Add item to cart
  addToCart: (userId, productId, quantity = 1) => {
    // Find the product
    const product = store.products.find((p) => p.id === productId);

    if (!product) {
      throw new Error("Product not found");
    }

    // Initialize cart if it doesn't exist
    if (!store.carts[userId]) {
      store.carts[userId] = [];
    }

    // Check if product already in cart
    const existingItemIndex = store.carts[userId].findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity if already in cart
      store.carts[userId][existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      store.carts[userId].push({
        productId,
        quantity,
        productName: product.name,
        price: product.price,
      });
    }

    return calculateCartTotal(userId);
  },

  // Remove item from cart
  removeFromCart: (userId, productId) => {
    if (!store.carts[userId]) {
      throw new Error("Cart not found");
    }

    // Filter out the product
    store.carts[userId] = store.carts[userId].filter(
      (item) => item.productId !== productId
    );

    return calculateCartTotal(userId);
  },

  // Process checkout
  checkout: (userId, discountCode) => {
    console.log(`Checkout initiated for user: ${userId}`);
    console.log(`Discount Code: ${discountCode || "None"}`);

    if (!store.carts[userId] || store.carts[userId].length === 0) {
      console.error(`Checkout failed: Empty cart for user ${userId}`);
      throw new Error("Cannot checkout with an empty cart");
    }

    const cart = calculateCartTotal(userId);

    // Apply discount if valid
    let finalAmount = cart.total;
    let discountAmount = 0;
    let usedDiscountCode = null;

    if (discountCode) {
      const discountIndex = store.discountCodes.findIndex(
        (dc) => dc.code === discountCode && !dc.used
      );

      if (discountIndex >= 0) {
        discountAmount = (finalAmount * store.discountPercentage) / 100;
        finalAmount = finalAmount - discountAmount;

        // Mark discount code as used
        store.discountCodes[discountIndex].used = true;
        usedDiscountCode = discountCode;
      } else {
        throw new Error("Invalid or already used discount code");
      }
    }

    // Increment order counter
    store.orderCounter++;

    // Create order record
    const order = {
      id: `ORD-${Date.now()}`,
      userId,
      items: [...store.carts[userId]],
      subtotal: cart.total,
      discountCode: usedDiscountCode,
      discountAmount,
      total: finalAmount,
      timestamp: new Date(),
    };

    // Add to orders history
    store.orders.push(order);

    // Clear cart
    store.carts[userId] = [];

    // Check if this is an nth order to generate a new discount code
    if (store.orderCounter % store.nthOrder === 0) {
      const newDiscountCode = generateDiscountCode();
      store.discountCodes.push({
        code: newDiscountCode,
        used: false,
        orderNumber: store.orderCounter,
        createdAt: new Date(),
      });
    }

    console.log(`Checkout completed for user ${userId}. Order ID: ${order.id}`);

    return {
      success: true,
      order: {
        id: order.id,
        items: order.items.length,
        subtotal: order.subtotal,
        discountAmount: order.discountAmount,
        total: order.total,
        discountApplied: !!usedDiscountCode,
      },
      message: usedDiscountCode
        ? `Order placed successfully with discount code ${usedDiscountCode}`
        : "Order placed successfully",
    };
  },

  // Admin: Generate discount code manually
  generateDiscountCode: () => {
    const newDiscountCode = generateDiscountCode();

    store.discountCodes.push({
      code: newDiscountCode,
      used: false,
      orderNumber: "ADMIN_GENERATED",
      createdAt: new Date(),
    });

    return {
      success: true,
      discountCode: newDiscountCode,
    };
  },

  // Admin: Get store statistics
  getStats: () => {
    const totalItemsSold = store.orders.reduce((sum, order) => {
      return (
        sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0)
      );
    }, 0);

    const totalPurchaseAmount = store.orders.reduce(
      (sum, order) => sum + order.subtotal,
      0
    );

    const totalDiscountAmount = store.orders.reduce(
      (sum, order) => sum + order.discountAmount,
      0
    );

    return {
      totalOrders: store.orders.length,
      totalItemsSold,
      totalPurchaseAmount,
      totalDiscountAmount,
      discountCodes: store.discountCodes,
      orders: store.orders,
    };
  },

  // Get available discount codes
  getAvailableDiscountCodes: () => {
    return store.discountCodes
      .filter((code) => !code.used)
      .map((code) => code.code);
  },
};

export default storeOperations;
