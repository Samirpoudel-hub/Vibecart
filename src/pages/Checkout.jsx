import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { calculateOrderTotals } from "../utils/pricing";

function Checkout({ cart, appliedCoupon, onPlaceOrder }) {
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const totals = calculateOrderTotals(cart, appliedCoupon);

  if (cart.length === 0 && !orderPlaced) return <Navigate to="/cart" replace />;

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const customer = Object.fromEntries(formData.entries());
    const order = onPlaceOrder(customer);
    setOrderPlaced(true);
    navigate(`/orders/${order.id}`);
  }

  return (
    <main className="container page-container">
      <Link className="back-link" to="/cart"><ArrowLeft size={17} /> Back to bag</Link>
      <div className="checkout-layout">
        <section className="checkout-form-section">
          <p className="eyebrow">A FEW DETAILS</p>
          <h1 className="page-title">Delivery details</h1>
          <p className="checkout-intro">This demo checkout does not collect payment information.</p>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <label>
              Customer name
              <input name="name" type="text" autoComplete="name" required maxLength={100} />
            </label>
            <label>
              Email address
              <input name="email" type="email" autoComplete="email" required maxLength={160} />
            </label>
            <label>
              Phone number
              <input name="phone" type="tel" autoComplete="tel" pattern="\+?[0-9]{7,15}" title="Enter 7 to 15 digits, with an optional leading +." required />
            </label>
            <label>
              Delivery address
              <textarea name="address" autoComplete="street-address" rows="4" minLength="8" maxLength="300" required />
            </label>
            <button className="checkout-button" type="submit">Place demo order</button>
          </form>
        </section>

        <aside className="cart-summary checkout-summary">
          <h2>Order Summary</h2>
          <div className="checkout-items">
            {cart.map((item) => (
              <div className="checkout-item" key={item.id}>
                <span>{item.name} <small>× {item.quantity}</small></span>
                <strong>Rs. {(item.price * item.quantity).toLocaleString()}</strong>
              </div>
            ))}
          </div>
          <div className="summary-row"><span>Subtotal</span><span>Rs. {totals.subtotal.toLocaleString()}</span></div>
          <div className="summary-row"><span>Delivery</span><span>Free</span></div>
          {appliedCoupon && <div className="summary-row discount-row"><span>{appliedCoupon}</span><span>− Rs. {totals.discount.toLocaleString()}</span></div>}
          <div className="summary-total"><span>Total</span><strong>Rs. {totals.total.toLocaleString()}</strong></div>
          <p className="checkout-note">No payment is processed. Your order is saved as a local demo record.</p>
        </aside>
      </div>
    </main>
  );
}

export default Checkout;