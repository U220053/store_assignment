// // app/checkout/page.js
// "use client";

// import { useState, useEffect } from "react";
// import Checkout from "@/components/Checkout";
// import { useRouter } from "next/navigation";

// export default function CheckoutPage() {
//   const [cart, setCart] = useState({ items: [], total: 0 });
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     // Get userId from localStorage
//     const storedUserId = localStorage.getItem("userId") || `user-${Date.now()}`;
//     setUserId(storedUserId);

//     if (storedUserId) {
//       fetchCart(storedUserId);
//     }
//   }, []);

//   const fetchCart = async (uid) => {
//     try {
//       setLoading(true);
//       const response = await fetch("/api/cart", {
//         headers: {
//           "user-id": uid,
//         },
//       });
//       const data = await response.json();
//       setCart(data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching cart:", error);
//       setLoading(false);
//     }
//   };

//   const processCheckout = async (discountCode) => {
//     try {
//       const response = await fetch("/api/checkout", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "user-id": userId,
//         },
//         body: JSON.stringify({ discountCode: discountCode.trim() || null }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Checkout failed");
//       }

//       // Store order info in localStorage for the confirmation page
//       localStorage.setItem(
//         "orderConfirmation",
//         JSON.stringify({
//           order: data.order,
//           message: data.message,
//         })
//       );

//       // Navigate to confirmation page
//       router.push("/order-confirmation");
//     } catch (error) {
//       console.error("Error during checkout:", error);
//       return { error: error.message };
//     }
//   };

//   if (loading) {
//     return <div className="loading">Loading checkout...</div>;
//   }

//   return (
//     <div className="container">
//       <h1 className="page-title">Checkout</h1>
//       <Checkout cart={cart} onCheckout={processCheckout} />
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Checkout from "@/components/Checkout";

export default function CheckoutPage() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId =
        localStorage.getItem("userId") || `user-${Date.now()}`;
      localStorage.setItem("userId", storedUserId);
      setUserId(storedUserId);

      console.log("Generated/Retrieved User ID:", storedUserId);

      if (storedUserId) {
        fetchCart(storedUserId);
      }
    }
  }, []);

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
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const processCheckout = async (discountCode) => {
    // Additional cart validation before checkout
    if (!cart || !cart.items || cart.items.length === 0) {
      console.error("Attempted checkout with empty cart");
      return { error: "Cannot checkout with an empty cart" };
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId,
        },
        body: JSON.stringify({
          discountCode: discountCode || null,
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
      <Checkout cart={cart} onCheckout={processCheckout} />
    </div>
  );
}
