import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";

function ProductCard({ product, isWishlisted, onToggleWishlist, onAddToCart }) {
  return (
    <article className="product-card">
      <div className="product-image">
        <Link className="product-image-link" to={`/products/${product.id}`} aria-label={`View ${product.name} details`}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        {product.inStock === false && <span className="stock-badge">Out of stock</span>}
        <button
          className={isWishlisted ? "wishlist-button is-saved" : "wishlist-button"}
          type="button"
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={isWishlisted}
          onClick={() => onToggleWishlist(product.id)}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
        <span className="product-category">{product.category}</span>
      </div>

      <div className="product-info">
        <div className="product-card-topline">
          <span className="product-category-label">{product.category}</span>
          <span className="product-rating" aria-label={`Rated ${product.rating} out of 5`}>
            <span aria-hidden="true">★</span> {product.rating}
          </span>
        </div>
        <h3>
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-description">{product.description}</p>
        <div className="product-bottom">
          <p className="product-price">Rs. {product.price.toLocaleString()}</p>
          <button className="add-button" onClick={() => onAddToCart(product)} disabled={product.inStock === false}>
            <ShoppingCart size={17} aria-hidden="true" />
            {product.inStock === false ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;