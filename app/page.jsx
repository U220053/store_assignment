// app/page.js
"use client";

import { useState, useEffect } from "react";
import ProductList from "@/components/ProductList";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [userId] = useState(`user-${Date.now()}`);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Store userId in localStorage for use across the app
    localStorage.setItem("userId", userId);

    // Fetch products when the component mounts
    fetchProducts();
  }, [userId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      // Optionally show a confirmation message
      // alert("Item added to cart!");
      // toast.success("Item added to cart!");
      toast.success("Item added!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="container">
      <ToastContainer />
      <h1 className="page-title">Welcome to our Store</h1>
      <ProductList products={products} addToCart={addToCart} />
    </div>
  );
}
