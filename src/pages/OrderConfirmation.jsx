import { Link, useParams } from "react-router-dom";
import { Check, PackageCheck } from "lucide-react";

function OrderConfirmation({ orders }) {
  const { orderId } = useParams();
  const order = orders.find((item) => item.id === orderId);

  if (!order) {
    return (
      <main className="container page-container">
        <section className="empty-products">
          <h1>Order not found</h1>
          <p>This order is not saved in this browser.</p>
          <Link className="shop-button" to="/orders">View order history</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="container page-container">
      <section className="confirmation-page">
        <div className="confirmation-heading">
          <span className="confirmation-check"><Check size={25} /></span>
          <p className="eyebrow">DEMO ORDER PLACED</p>
          <h1 className="page-title">Thank you, {order.customer.name.split(" ")[0]}.</h1>
          <p>Your order is saved on this device. No payment was taken.</p>
        </div>
        <div className="confirmation-layout">
          <section className="confirmation-card">
            <div className="confirmation-order-id">
              <div><span>Order ID</span><strong>{order.id}</strong></div>
              <PackageCheck size={23} aria-hidden="true" />
            </div>
            <div className="confirmation-items">
              {order.items.map((item) => (
                <div className="confirmation-item" key={item.id}>
                  <img src={item.image} alt="" />
                  <div><strong>{item.name}</strong><span>Qty {item.quantity}</span></div>
                  <strong>Rs. {(item.price * item.quantity).toLocaleString()}</strong>
                </div>
              ))}
            </div>
            <div className="summary-row"><span>Subtotal</span><span>Rs. {order.subtotal.toLocaleString()}</span></div>
            {order.coupon && <div className="summary-row discount-row"><span>{order.coupon}</span><span>− Rs. {order.discount.toLocaleString()}</span></div>}
            <div className="summary-total"><span>Total</span><strong>Rs. {order.total.toLocaleString()}</strong></div>
          </section>
          <aside className="delivery-card">
            <h2>Delivery details</h2>
            <strong>{order.customer.name}</strong>
            <span>{order.customer.email}</span>
            <span>{order.customer.phone}</span>
            <p>{order.customer.address}</p>
            <small>Placed {new Date(order.placedAt).toLocaleString()}</small>
          </aside>
        </div>
        <div className="confirmation-actions">
          <Link className="shop-button" to="/">Continue shopping</Link>
          <Link className="text-link" to="/orders">View order history</Link>
        </div>
      </section>
    </main>
  );
}

export default OrderConfirmation;