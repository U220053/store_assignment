// app/admin/page.js
"use client";

import { useState, useEffect } from "react";
import AdminPanel from "@/components/AdminPanel";

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setLoading(false);
    }
  };

  const generateDiscountCode = async () => {
    try {
      const response = await fetch("/api/admin/discount/generate", {
        method: "POST",
      });
      const data = await response.json();

      if (data.success) {
        // Refresh stats after generating a code
        fetchStats();
        return data.discountCode;
      }
      return null;
    } catch (error) {
      console.error("Error generating discount code:", error);
      return null;
    }
  };

  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="container">
      <h1 className="page-title">Admin Dashboard</h1>
      <AdminPanel
        stats={stats}
        onGenerateDiscountCode={generateDiscountCode}
        onRefreshStats={fetchStats}
      />
    </div>
  );
}
