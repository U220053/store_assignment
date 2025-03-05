// // components/Checkout.jsx
// import { useState } from "react";

// export default function Checkout({ cart, onCheckout }) {
//   const [discountCode, setDiscountCode] = useState("");
//   const [error, setError] = useState("");
//   const [processing, setProcessing] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setProcessing(true);

//     try {
//       const result = await onCheckout(discountCode);

//       if (result && result.error) {
//         setError(result.error);
//       }
//     } catch (error) {
//       setError(error.message || "An error occurred during checkout");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   if (cart.items.length === 0) {
//     return (
//       <div className="checkout-empty">
//         <p>Your cart is empty. Add some products before checkout.</p>
//         <button
//           className="button secondary-button"
//           onClick={() => (window.location.href = "/")}
//         >
//           Browse Products
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="checkout-container">
//       <div className="order-summary">
//         <h2 className="summary-title">Order Summary</h2>
//         <div className="summary-items">
//           {cart.items.map((item) => (
//             <div key={item.productId} className="summary-item">
//               <span className="item-name">
//                 {item.productName} x {item.quantity}
//               </span>
//               <span className="item-price">${item.subtotal.toFixed(2)}</span>
//             </div>
//           ))}
//         </div>
//         <div className="summary-total">
//           <span>Total:</span>
//           <span>${cart.total.toFixed(2)}</span>
//         </div>
//       </div>

//       <div className="checkout-form">
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="discount-code">Discount Code (optional)</label>
//             <input
//               type="text"
//               id="discount-code"
//               placeholder="Enter discount code"
//               value={discountCode}
//               onChange={(e) => setDiscountCode(e.target.value)}
//             />
//           </div>

//           {error && <div className="error-message">{error}</div>}

//           <button
//             type="submit"
//             className="button primary-button checkout-button"
//             disabled={processing}
//           >
//             {processing ? "Processing..." : "Complete Order"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";

export default function Checkout({ cart, onCheckout }) {
  const [discountCode, setDiscountCode] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setProcessing(true);

    try {
      // Validate discount code if needed
      const sanitizedDiscountCode = discountCode ? discountCode.trim() : null;

      const result = await onCheckout(sanitizedDiscountCode);

      // More robust error handling
      if (result && result.error) {
        setError(result.error);
        setProcessing(false);
        return;
      }
    } catch (error) {
      // More specific error messaging
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred during checkout";
      setError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="checkout-empty">
        <p>Your cart is empty. Add some products before checkout.</p>
        <button
          className="button secondary-button"
          onClick={() => (window.location.href = "/")}
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="order-summary">
        <h2 className="summary-title">Order Summary</h2>
        <div className="summary-items">
          {cart.items.map((item) => (
            <div key={item.productId} className="summary-item">
              <span className="item-name">
                {item.productName} x {item.quantity}
              </span>
              <span className="item-price">${item.subtotal.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="summary-total">
          <span>Total:</span>
          <span>${cart.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="checkout-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="discount-code">Discount Code (optional)</label>
            <input
              type="text"
              id="discount-code"
              placeholder="Enter discount code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              disabled={processing}
            />
          </div>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="button primary-button checkout-button"
            disabled={processing || cart.items.length === 0}
          >
            {processing ? "Processing..." : "Complete Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
