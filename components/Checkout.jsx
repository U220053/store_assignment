import { useState } from "react";

export default function Checkout({ cart, onCheckout, availableCoupons }) {
  const [discountCode, setDiscountCode] = useState("");
  const [checkoutError, setCheckoutError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCheckoutError(null);
    const result = await onCheckout(discountCode);
    if (result?.error) {
      setCheckoutError(result.error);
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
        <div className="cart-summary">
          {cart.items.map((item) => (
            <div key={item.productId} className="cart-item">
              <span>{item.productName}</span>
              <span>Quantity: {item.quantity}</span>
              <span>${item.subtotal.toFixed(2)}</span>
            </div>
          ))}
          <div className="cart-total">
            <strong>Total: ${cart.total.toFixed(2)}</strong>
          </div>
        </div>

        <div className="discount-section">
          {availableCoupons.length > 0 && (
            <div className="available-coupons">
              <p>Available discount codes:</p>
              <div className="coupon-list">
                {availableCoupons.map((code, index) => (
                  <button
                    key={index}
                    className="coupon-button"
                    onClick={() => setDiscountCode(code)}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="discount-input">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Enter discount code"
            />
          </div>
        </div>

        {checkoutError && <div className="error-message">{checkoutError}</div>}

        <button
          onClick={handleSubmit}
          className="checkout-button"
          disabled={cart.items.length === 0}
        >
          Complete Purchase
        </button>
      </div>
    </div>
  );
}
