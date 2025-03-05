// app/cart/page.js
"use client";

import { useState, useEffect } from "react";
import Cart from "@/components/Cart";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get userId from localStorage
    const storedUserId = localStorage.getItem("userId") || `user-${Date.now()}`;
    setUserId(storedUserId);

    if (storedUserId) {
      fetchCart(storedUserId);
    }
  }, []);

  const fetchCart = async (uid) => {
    try {
      setLoading(true);
      const response = await fetch("/api/cart", {
        headers: {
          "user-id": uid,
        },
      });
      const data = await response.json();
      setCart(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch("/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId,
        },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  return (
    <div className="container">
      <h1 className="page-title">Your Shopping Cart</h1>
      <Cart
        cart={cart}
        removeFromCart={removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
