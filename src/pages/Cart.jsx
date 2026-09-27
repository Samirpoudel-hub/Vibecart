import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { calculateOrderTotals, normalizeCouponCode, COUPONS } from "../utils/pricing";

function Cart({ cart, appliedCoupon, onApplyCoupon, onRemoveCoupon, onUpdateQuantity, onRemove, onClear }) {
  const [couponInput, setCouponInput] = useState(appliedCoupon ?? "");
  const [couponMessage, setCouponMessage] = useState("");
  const [couponError, setCouponError] = useState(false);
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totals = calculateOrderTotals(cart, appliedCoupon);

  function handleCouponSubmit(event) {
    event.preventDefault();
    const code = normalizeCouponCode(couponInput);

    if (!COUPONS[code]) {
      onRemoveCoupon();
      setCouponError(true);
      setCouponMessage("That code is not valid. Try NOVA10 or WELCOME200.");
      return;
    }

    onApplyCoupon(code);
    setCouponError(false);
    setCouponMessage(`${code} applied. Your discount is Rs. ${calculateOrderTotals(cart, code).discount.toLocaleString()}.`);
  }

  return (
    <main className="container page-container">
      <section className="cart-section">
        <div className="cart-heading">
          <div>
            <p className="eyebrow">YOUR SHOPPING</p>
            <h1 className="page-title">Your bag <span>({itemCount})</span></h1>
          </div>
          {cart.length > 0 && (
            <button className="clear-cart" onClick={onClear}>Clear Cart</button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <ShoppingCart size={45} aria-hidden="true" />
            <h2>Your cart is empty</h2>
            <p>Add some products to get started.</p>
            <Link className="shop-button" to="/">Start Shopping</Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cart.map((item) => (
                <article className="cart-item" key={item.id}>
                  <Link to={`/products/${item.id}`} aria-label={`View ${item.name}`}>
                    <img src={item.image} alt={item.name} />
                  </Link>
                  <div className="cart-item-details">
                    <h2><Link to={`/products/${item.id}`}>{item.name}</Link></h2>
                    <p>Rs. {item.price.toLocaleString()}</p>
                    <div className="quantity-controls" aria-label={`Quantity for ${item.name}`}>
                      <button aria-label="Decrease quantity" onClick={() => onUpdateQuantity(item.id, -1)}>
                        <Minus size={15} />
                      </button>
                      <span>{item.quantity}</span>
                      <button aria-label="Increase quantity" onClick={() => onUpdateQuantity(item.id, 1)}>
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-right">
                    <strong>Rs. {(item.price * item.quantity).toLocaleString()}</strong>
                    <button className="remove-button" aria-label={`Remove ${item.name}`} onClick={() => onRemove(item.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <aside className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span><span>Rs. {totals.subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row"><span>Delivery</span><span>Free</span></div>
              <form className="coupon-form" onSubmit={handleCouponSubmit}>
                <label htmlFor="coupon-code">Coupon code</label>
                <div className="coupon-input-row">
                  <input
                    id="coupon-code"
                    value={couponInput}
                    onChange={(event) => setCouponInput(event.target.value)}
                    placeholder="Enter a code"
                    autoComplete="off"
                  />
                  <button type="submit">Apply</button>
                </div>
                <p className="coupon-hint">Try NOVA10 or WELCOME200</p>
                {couponMessage && <p className={couponError ? "coupon-message is-error" : "coupon-message"} role="status">{couponMessage}</p>}
              </form>
              {appliedCoupon && (
                <div className="summary-row discount-row">
                  <span>{appliedCoupon} discount</span>
                  <span>− Rs. {totals.discount.toLocaleString()} <button className="remove-coupon" type="button" onClick={() => { onRemoveCoupon(); setCouponInput(""); setCouponMessage("Coupon removed."); setCouponError(false); }} aria-label="Remove coupon"><X size={14} /></button></span>
                </div>
              )}
              <div className="summary-total"><span>Total</span><strong>Rs. {totals.total.toLocaleString()}</strong></div>
              <Link className="checkout-button" to="/checkout">Continue to checkout</Link>
              <p className="checkout-note">Demo checkout only. No payment is collected.</p>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

export default Cart;