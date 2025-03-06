// components/ProductList.jsx
import Image from "next/image";
export default function ProductList({ products, addToCart }) {
  return (
    <div className="product-list">
      {products.length === 0 ? (
        <p className="no-products">No products available.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <h3 className="product-title">{product.name}</h3>
              {/* <Image
                className="product-image"
                src={product.image}
                alt={`Product image of ${product.name}`}
                width={200}
                height={200}
              /> */}
              <img
                src={product.image}
                alt={product.name}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
              <p className="product-description">{product.description}</p>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <button
                className="button primary-button"
                onClick={() => addToCart(product.id)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
