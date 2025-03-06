"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Checkout from "@/components/Checkout";

export default function CheckoutPage() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get or create user ID
      const storedUserId = localStorage.getItem("userId");
      const newUserId = storedUserId || `user-${Date.now()}`;

      // Ensure user ID is saved before proceeding
      localStorage.setItem("userId", newUserId);
      setUserId(newUserId);

      console.log("Generated/Retrieved User ID:", newUserId);

      // Only proceed when we have a valid userId
      if (newUserId) {
        fetchCart(newUserId);
        fetchAvailableCoupons();
      }
    }
  }, []);

  const fetchAvailableCoupons = async () => {
    try {
      const response = await fetch("/api/discounts");
      const data = await response.json();
      if (data.discountCodes) {
        setAvailableCoupons(data.discountCodes);
      }
    } catch (error) {
      console.error("Error fetching discount codes:", error);
    }
  };

  const fetchCart = async (uid) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching cart for user ID:", uid);

      const response = await fetch("/api/cart", {
        headers: {
          "user-id": uid,
        },
      });

      console.log("Cart fetch response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Cart fetch error data:", errorData);
        throw new Error(errorData.error || "Failed to fetch cart");
      }

      const data = await response.json();
      console.log("Received cart data:", data);

      // More robust data validation
      const sanitizedCart = {
        items: Array.isArray(data.items) ? data.items : [],
        total: typeof data.total === "number" ? data.total : 0,
      };

      console.log("Sanitized cart:", sanitizedCart);

      setCart(sanitizedCart);
      // Mark cart as successfully loaded
      setIsCartLoaded(true);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const processCheckout = async (discountCode) => {
    // Check if cart has been properly loaded before proceeding
    if (!isCartLoaded) {
      console.error("Cart not fully loaded yet");
      return { error: "Please wait for your cart to load completely" };
    }

    // Additional cart validation before checkout
    if (!cart || !cart.items || cart.items.length === 0) {
      console.error("Attempted checkout with empty cart");
      return { error: "Cannot checkout with an empty cart" };
    }

    try {
      console.log("Processing checkout with user ID:", userId);
      console.log("Current cart state:", cart);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId,
        },
        body: JSON.stringify({
          discountCode: discountCode || null,
          // Include cart data to ensure checkout has the latest cart
          cart: cart,
        }),
      });

      const data = await response.json();
      console.log("checkout data", data);
      if (!response.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      // Store order info in localStorage for the confirmation page
      localStorage.setItem(
        "orderConfirmation",
        JSON.stringify({
          order: data.order,
          message: data.message,
        })
      );

      // Navigate to confirmation page
      router.push("/order-confirmation");
    } catch (error) {
      console.error("Error during checkout:", error);
      return { error: error.message };
    }
  };

  if (loading) {
    return <div className="loading">Loading checkout...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error loading cart: {error}</p>
        <button onClick={() => fetchCart(userId)}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Checkout</h1>
      {availableCoupons.length > 0 && (
        <div className="discount-coupons">
          <h3>Available Discount Coupons:</h3>
          <ul>
            {availableCoupons.map((code, index) => (
              <li key={index}>
                Use code <strong>{code}</strong> for 10% off
              </li>
            ))}
          </ul>
        </div>
      )}
      <Checkout
        cart={cart}
        onCheckout={processCheckout}
        availableCoupons={availableCoupons}
      />
    </div>
  );
}
