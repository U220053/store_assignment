// components/Cart.jsx
export default function Cart({ cart, removeFromCart, onCheckout }) {
  if (cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <p>Your cart is empty. Add some products to get started!</p>
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
    <div className="cart-container">
      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.productId} className="cart-item">
            <div className="item-details">
              <h3 className="item-name">{item.productName}</h3>
              <p className="item-price">Price: ${item.price.toFixed(2)}</p>
              <p className="item-quantity">Quantity: {item.quantity}</p>
              <p className="item-subtotal">
                Subtotal: ${item.subtotal.toFixed(2)}
              </p>
            </div>
            <button
              className="button remove-button"
              onClick={() => removeFromCart(item.productId)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3 className="cart-total">Cart Total: ${cart.total.toFixed(2)}</h3>
        <button className="button primary-button" onClick={onCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
