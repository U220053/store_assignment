// // components/AdminPanel.jsx
// import { useState } from "react";

// export default function AdminPanel({
//   stats,
//   onGenerateDiscountCode,
//   onRefreshStats,
// }) {
//   const [generatedCode, setGeneratedCode] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleGenerateDiscountCode = async () => {
//     setLoading(true);
//     try {
//       const code = await onGenerateDiscountCode();
//       if (code) {
//         setGeneratedCode(code);
//       }
//     } catch (error) {
//       console.error("Error generating discount code:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!stats) {
//     return <div>Loading admin statistics...</div>;
//   }

//   return (
//     <div className="admin-panel">
//       <section className="store-statistics">
//         <h2>Store Statistics</h2>
//         <div className="stats-grid">
//           <div className="stat-card">
//             <h3>Total Orders</h3>
//             <p>{stats.totalOrders}</p>
//           </div>
//           <div className="stat-card">
//             <h3>Total Items Sold</h3>
//             <p>{stats.totalItemsSold}</p>
//           </div>
//           <div className="stat-card">
//             <h3>Total Sales</h3>
//             <p>${stats.totalPurchaseAmount.toFixed(2)}</p>
//           </div>
//           <div className="stat-card">
//             <h3>Total Discounts</h3>
//             <p>${stats.totalDiscountAmount.toFixed(2)}</p>
//           </div>
//         </div>
//       </section>

//       <section className="discount-code-generator">
//         <h2>Discount Code Management</h2>
//         <button
//           onClick={handleGenerateDiscountCode}
//           className="button primary-button"
//           disabled={loading}
//         >
//           {loading ? "Generating..." : "Generate New Discount Code"}
//         </button>

//         {generatedCode && (
//           <div className="generated-code-display">
//             <p>
//               New Discount Code: <strong>{generatedCode}</strong>
//             </p>
//           </div>
//         )}
//       </section>

//       <section className="discount-codes-list">
//         <h2>Existing Discount Codes</h2>
//         {stats.discountCodes.length === 0 ? (
//           <p>No discount codes have been generated yet.</p>
//         ) : (
//           <table className="discount-codes-table">
//             <thead>
//               <tr>
//                 <th>Code</th>
//                 <th>Order Number</th>
//                 <th>Created At</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {stats.discountCodes.map((code, index) => (
//                 <tr key={index}>
//                   <td>{code.code}</td>
//                   <td>{code.orderNumber}</td>
//                   <td>{new Date(code.createdAt).toLocaleString()}</td>
//                   <td>{code.used ? "Used" : "Available"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </section>

//       <section className="recent-orders">
//         <h2>Recent Orders</h2>
//         {stats.orders.length === 0 ? (
//           <p>No orders have been placed yet.</p>
//         ) : (
//           <table className="recent-orders-table">
//             <thead>
//               <tr>
//                 <th>Order ID</th>
//                 <th>User ID</th>
//                 <th>Total Amount</th>
//                 <th>Discount Amount</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {stats.orders.slice(0, 10).map((order) => (
//                 <tr key={order.id}>
//                   <td>{order.id}</td>
//                   <td>{order.userId}</td>
//                   <td>${order.total.toFixed(2)}</td>
//                   <td>${order.discountAmount.toFixed(2)}</td>
//                   <td>{new Date(order.timestamp).toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </section>

//       <div className="admin-actions">
//         <button onClick={onRefreshStats} className="button secondary-button">
//           Refresh Statistics
//         </button>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";

export default function AdminPanel({
  stats,
  onGenerateDiscountCode,
  onRefreshStats,
}) {
  const [generatedCode, setGeneratedCode] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateDiscountCode = async () => {
    setLoading(true);
    try {
      const code = await onGenerateDiscountCode();
      if (code) {
        setGeneratedCode(code);
      }
    } catch (error) {
      console.error("Error generating discount code:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!stats) {
    return <div className="admin-panel">Loading admin statistics...</div>;
  }

  return (
    <div className="admin-panel">
      <section className="store-statistics">
        <h2>Store Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p>{stats.totalOrders}</p>
          </div>
          <div className="stat-card">
            <h3>Total Items Sold</h3>
            <p>{stats.totalItemsSold}</p>
          </div>
          <div className="stat-card">
            <h3>Total Sales</h3>
            <p>${stats.totalPurchaseAmount.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h3>Total Discounts</h3>
            <p>${stats.totalDiscountAmount.toFixed(2)}</p>
          </div>
        </div>
      </section>

      <section className="discount-code-generator">
        <h2>Discount Code Management</h2>
        <button
          onClick={handleGenerateDiscountCode}
          className="button primary-button"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate New Discount Code"}
        </button>

        {generatedCode && (
          <div className="generated-code-display">
            <p>
              New Discount Code: <strong>{generatedCode}</strong>
            </p>
          </div>
        )}
      </section>

      <section className="discount-codes-list">
        <h2>Existing Discount Codes</h2>
        {stats.discountCodes.length === 0 ? (
          <p>No discount codes have been generated yet.</p>
        ) : (
          <table className="discount-codes-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Order Number</th>
                <th>Created At</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.discountCodes.map((code, index) => (
                <tr key={index}>
                  <td>{code.code}</td>
                  <td>{code.orderNumber + 1}</td>
                  <td>{new Date(code.createdAt).toLocaleString()}</td>
                  <td>{code.used ? "Used" : "Available"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="recent-orders">
        <h2>Recent Orders</h2>
        {stats.orders.length === 0 ? (
          <p>No orders have been placed yet.</p>
        ) : (
          <table className="recent-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User ID</th>
                <th>Total Amount</th>
                <th>Discount Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.orders.slice(0, 10).map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.userId}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>${order.discountAmount.toFixed(2)}</td>
                  <td>{new Date(order.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <div className="admin-actions">
        <button onClick={onRefreshStats} className="button secondary-button">
          Refresh Statistics
        </button>
      </div>
    </div>
  );
}
