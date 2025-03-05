export default function OrderConfirmation({ orderData, onContinueShopping }) {
  const { order, message } = orderData;

  return (
    <div className="confirmation-container">
      <div className="confirmation-message">
        <p>{message}</p>
      </div>

      <div className="order-details">
        <h2>Order Details</h2>
        <div className="order-info">
          <p>
            <strong>Order ID:</strong> {order?.id}
          </p>
          <p>
            <strong>Items:</strong> {order?.items}
          </p>
          <p>
            <strong>Subtotal:</strong> ${order?.subtotal?.toFixed(2)}
          </p>
          {/* <p>
            <strong>Tax:</strong> ${order.tax.toFixed(2)}
          </p> */}
          <p>
            <strong>Shipping:</strong> ${0}
          </p>
          <p>
            <strong>Total:</strong> ${order?.total?.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="order-actions">
        <button className="button primary-button" onClick={onContinueShopping}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
