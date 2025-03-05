// components/Header.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [cartItems, setCartItems] = useState(0);

  useEffect(() => {
    // Fetch cart data to show number of items in header
    const fetchCartCount = async () => {
      try {
        const userId = localStorage.getItem("userId") || "guest";
        const response = await fetch("/api/cart", {
          headers: {
            "user-id": userId,
          },
        });
        const data = await response.json();
        setCartItems(data.items.length);
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchCartCount();

    // Set up a refresh interval
    const intervalId = setInterval(fetchCartCount, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <Link href="/">E-Commerce Store</Link>
        </div>
        <nav className="nav">
          <ul className="nav-list">
            <li className={pathname === "/" ? "active" : ""}>
              <Link href="/">Products</Link>
            </li>
            <li className={pathname === "/cart" ? "active" : ""}>
              <Link href="/cart">Cart ({cartItems})</Link>
            </li>
            <li className={pathname === "/admin" ? "active" : ""}>
              <Link href="/admin">Admin</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
