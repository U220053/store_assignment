// app/order-confirmation/page.js
"use client";

import { useEffect, useState } from "react";
import OrderConfirmation from "@/components/OrderConfirmation";
import { useRouter } from "next/navigation";

export default function OrderConfirmationPage() {
  const [orderData, setOrderData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Get order data from localStorage
    const confirmation = localStorage.getItem("orderConfirmation");

    if (confirmation) {
      try {
        setOrderData(JSON.parse(confirmation));
      } catch (error) {
        console.error("Error parsing order data:", error);
      }
    }
  }, []);

  const continueShopping = () => {
    // Clear the order confirmation data
    localStorage.removeItem("orderConfirmation");
    router.push("/");
  };

  if (!orderData) {
    return (
      <div className="container">
        <h1 className="page-title">Order Confirmation</h1>
        <p>No order information found. Please return to the store.</p>
        <button
          className="button primary-button"
          onClick={() => router.push("/")}
        >
          Return to Store
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Order Confirmation</h1>
      <OrderConfirmation
        orderData={orderData}
        onContinueShopping={continueShopping}
      />
    </div>
  );
}
