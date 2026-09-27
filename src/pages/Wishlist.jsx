import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import ProductCard from "../components/productcard";

function Wishlist({ products, searchTerm, wishlist, onToggleWishlist, onAddToCart }) {
  const savedProducts = products.filter((product) => {
    const matchesWishlist = wishlist.includes(product.id);
    const searchableText = `${product.name} ${product.category} ${product.description}`.toLowerCase();
    return matchesWishlist && searchableText.includes(searchTerm.toLowerCase());
  });

  return (
    <main className="container page-container">
      <section className="wishlist-page">
        <div className="cart-heading">
          <div>
            <p className="eyebrow">KEPT CLOSE</p>
            <h1 className="page-title">Your wishlist <span>({wishlist.length})</span></h1>
          </div>
          <Link className="text-link" to="/">Continue shopping <span aria-hidden="true">→</span></Link>
        </div>
        {savedProducts.length === 0 ? (
          <div className="empty-products">
            <Heart size={34} aria-hidden="true" />
            <h3>{wishlist.length ? "No saved items match" : "Your saved list is ready"}</h3>
            <p>{wishlist.length ? "Try another search." : "Tap the heart on a product to keep it close."}</p>
            <Link className="shop-button" to="/">Explore the collection</Link>
          </div>
        ) : (
          <div className="product-grid">
            {savedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Wishlist;