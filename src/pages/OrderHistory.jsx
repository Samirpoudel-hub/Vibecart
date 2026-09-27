import { Link } from "react-router-dom";
import { PackageCheck } from "lucide-react";

function OrderHistory({ orders }) {
  return (
    <main className="container page-container">
      <section className="orders-page">
        <div className="cart-heading">
          <div>
            <p className="eyebrow">YOUR VIBEMART</p>
            <h1 className="page-title">Order history <span>({orders.length})</span></h1>
          </div>
          <Link className="text-link" to="/">Continue shopping <span aria-hidden="true">→</span></Link>
        </div>
        {orders.length === 0 ? (
          <div className="empty-products">
            <PackageCheck size={34} aria-hidden="true" />
            <h3>No orders yet</h3>
            <p>Your demo orders will appear here after checkout.</p>
            <Link className="shop-button" to="/">Explore the collection</Link>
          </div>
        ) : (
          <div className="order-history-list">
            {orders.map((order) => (
              <Link className="order-history-item" to={`/orders/${order.id}`} key={order.id}>
                <span className="order-history-icon"><PackageCheck size={19} /></span>
                <span className="order-history-info">
                  <strong>{order.id}</strong>
                  <small>{new Date(order.placedAt).toLocaleString()} · {order.items.length} {order.items.length === 1 ? "product" : "products"}</small>
                </span>
                <strong className="order-history-total">Rs. {order.total.toLocaleString()}</strong>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default OrderHistory;