import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";

function ProductDetails({ products, reviews, onAddReview, wishlist, onToggleWishlist, onAddToCart }) {
  const [reviewMessage, setReviewMessage] = useState("");
  const { productId } = useParams();
  const product = products.find((item) => item.id === Number(productId));

  if (!product) {
    return (
      <main className="container page-container">
        <section className="empty-products">
          <h1>Product not found</h1>
          <p>This product may no longer be available.</p>
          <Link className="shop-button" to="/">Back to catalog</Link>
        </section>
      </main>
    );
  }

  const savedReviews = Array.isArray(reviews[product.id]) ? reviews[product.id] : [];
  const productReviews = [
    { id: `sample-${product.id}-1`, name: "Maya", rating: product.rating, text: `A lovely everyday pick. The ${product.name.toLowerCase()} feels thoughtfully made and easy to recommend.` },
    { id: `sample-${product.id}-2`, name: "Arjun", rating: product.rating, text: "Great quality for the price, and it arrived just as pictured." },
    ...savedReviews,
  ];
  const averageRating = productReviews.reduce((total, review) => total + review.rating, 0) / productReviews.length;

  function handleReviewSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onAddReview(product.id, {
      id: `review-${window.crypto.randomUUID()}`,
      name: String(formData.get("reviewer")).trim(),
      rating: Number(formData.get("rating")),
      text: String(formData.get("review")).trim(),
      createdAt: new Date().toISOString(),
    });
    event.currentTarget.reset();
    setReviewMessage("Thanks for sharing your review.");
  }

  return (
    <main className="container page-container">
      <Link className="back-link" to="/"><ArrowLeft size={17} /> Back to catalog</Link>
      <article className="product-detail">
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-detail-info">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="detail-rating"><span aria-hidden="true">★</span> {averageRating.toFixed(1)} <span className="rating-copy">{productReviews.length} demo reviews</span></p>
          <p className="detail-price">Rs. {product.price.toLocaleString()}</p>
          <p className={product.inStock === false ? "detail-stock is-unavailable" : "detail-stock"}>
            {product.inStock === false ? "Currently out of stock" : "In stock"}
          </p>
          <p className="detail-description">{product.description}</p>
          <div className="detail-actions">
            <button className="add-button detail-add-button" onClick={() => onAddToCart(product)} disabled={product.inStock === false}>
              <ShoppingCart size={18} aria-hidden="true" /> Add to Bag
            </button>
            <button
              className={wishlist.includes(product.id) ? "detail-wishlist is-saved" : "detail-wishlist"}
              onClick={() => onToggleWishlist(product.id)}
              aria-label={wishlist.includes(product.id) ? "Remove from saved items" : "Save item"}
              aria-pressed={wishlist.includes(product.id)}
            >
              <Heart size={19} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="detail-promise"><span>Thoughtful selection</span><span>Simple, secure browsing</span><span>Easy everyday style</span></div>
        </div>
      </article>
      <section className="reviews-section" aria-labelledby="reviews-title">
        <div className="reviews-heading">
          <div>
            <p className="eyebrow">NOTES FROM SHOPPERS</p>
            <h2 id="reviews-title">Reviews <span>({productReviews.length})</span></h2>
          </div>
          <p className="reviews-average"><span aria-hidden="true">★</span> {averageRating.toFixed(1)} <small>out of 5</small></p>
        </div>
        <div className="reviews-layout">
          <div className="review-list">
            {productReviews.map((review) => (
              <article className="review-item" key={review.id}>
                <div className="review-item-heading">
                  <strong>{review.name}</strong>
                  <span className="review-stars" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, index) => <span key={index} aria-hidden="true">{index < Math.round(review.rating) ? "★" : "☆"}</span>)}
                  </span>
                </div>
                <p>{review.text}</p>
                {review.createdAt && <time dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString()}</time>}
              </article>
            ))}
          </div>
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <h3>Write a review</h3>
            <label>
              Your name
              <input name="reviewer" type="text" required maxLength="60" />
            </label>
            <label>
              Rating
              <select name="rating" defaultValue="5" required>
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
                <option value="2">2 stars</option>
                <option value="1">1 star</option>
              </select>
            </label>
            <label>
              Your review
              <textarea name="review" rows="4" required minLength="8" maxLength="500" />
            </label>
            <button className="checkout-button" type="submit">Submit review</button>
            {reviewMessage && <p className="review-message" role="status">{reviewMessage}</p>}
          </form>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;