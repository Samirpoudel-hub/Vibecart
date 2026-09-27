import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import products from "./data/products";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Catalog from "./pages/Catalog";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderHistory from "./pages/OrderHistory";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import { calculateOrderTotals, normalizeCouponCode, COUPONS } from "./utils/pricing";
import "./App.css";

const CART_STORAGE_KEY = "vibemart-cart";
const WISHLIST_STORAGE_KEY = "vibemart-wishlist";
const ORDERS_STORAGE_KEY = "vibemart-orders";
const REVIEWS_STORAGE_KEY = "vibemart-reviews";

function readStorage(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = readStorage(WISHLIST_STORAGE_KEY, []);
    return Array.isArray(savedWishlist)
      ? [...new Set(savedWishlist.filter((id) => products.some((product) => product.id === id)))]
      : [];
  });
  const [orders, setOrders] = useState(() => {
    const savedOrders = readStorage(ORDERS_STORAGE_KEY, []);
    return Array.isArray(savedOrders) ? savedOrders : [];
  });
  const [reviews, setReviews] = useState(() => {
    const savedReviews = readStorage(REVIEWS_STORAGE_KEY, {});
    return savedReviews && typeof savedReviews === "object" && !Array.isArray(savedReviews)
      ? savedReviews
      : {};
  });
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];

      if (!Array.isArray(parsedCart)) return [];

      return parsedCart.flatMap((savedItem) => {
        const product = products.find((item) => item.id === savedItem.id);
        const quantity = Number(savedItem.quantity);

        if (!product || !Number.isInteger(quantity) || quantity < 1) return [];
        return [{ ...product, quantity }];
      });
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Keep shopping usable when browser storage is unavailable.
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // Keep shopping usable when browser storage is unavailable.
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // Keep shopping usable when browser storage is unavailable.
    }
  }, [orders]);

  useEffect(() => {
    try {
      window.localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    } catch {
      // Keep shopping usable when browser storage is unavailable.
    }
  }, [reviews]);

  function addToCart(product) {
    setCart((previousCart) => {
      const existingProduct = previousCart.find((item) => item.id === product.id);

      if (existingProduct) {
        return previousCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...previousCart, { ...product, quantity: 1 }];
    });
  }

  function updateQuantity(id, amount) {
    const item = cart.find((cartItem) => cartItem.id === id);
    if (item?.quantity === 1 && amount < 0 && cart.length === 1) setAppliedCoupon(null);
    setCart((previousCart) =>
      previousCart
        .map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item)
        .filter((item) => item.quantity > 0),
    );
  }

  function removeFromCart(id) {
    if (cart.length === 1) setAppliedCoupon(null);
    setCart((previousCart) => previousCart.filter((item) => item.id !== id));
  }

  function toggleWishlist(id) {
    setWishlist((previousWishlist) =>
      previousWishlist.includes(id)
        ? previousWishlist.filter((productId) => productId !== id)
        : [...previousWishlist, id],
    );
  }

  function addReview(productId, review) {
    setReviews((previousReviews) => ({
      ...previousReviews,
      [productId]: [...(previousReviews[productId] ?? []), review],
    }));
  }

  function applyCoupon(code) {
    const normalizedCode = normalizeCouponCode(code);
    if (!COUPONS[normalizedCode]) return false;
    setAppliedCoupon(normalizedCode);
    return true;
  }

  function placeOrder(customer) {
    const totals = calculateOrderTotals(cart, appliedCoupon);
    const order = {
      id: `NOVA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      placedAt: new Date().toISOString(),
      customer,
      items: cart.map((item) => ({ ...item })),
      coupon: appliedCoupon,
      ...totals,
    };

    setOrders((previousOrders) => [order, ...previousOrders]);
    setCart([]);
    setAppliedCoupon(null);
    return order;
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar
          cartCount={cartCount}
          wishlistCount={wishlist.length}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Catalog
                products={products}
                searchTerm={searchTerm}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
                onAddToCart={addToCart}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                appliedCoupon={appliedCoupon}
                onApplyCoupon={applyCoupon}
                onRemoveCoupon={() => setAppliedCoupon(null)}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
                onClear={() => { setCart([]); setAppliedCoupon(null); }}
              />
            }
          />
          <Route
            path="/wishlist"
            element={
              <Wishlist
                products={products}
                searchTerm={searchTerm}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
                onAddToCart={addToCart}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <Checkout cart={cart} appliedCoupon={appliedCoupon} onPlaceOrder={placeOrder} />
            }
          />
          <Route path="/orders" element={<OrderHistory orders={orders} />} />
          <Route path="/orders/:orderId" element={<OrderConfirmation orders={orders} />} />
          <Route
            path="/products/:productId"
            element={
              <ProductDetails
                products={products}
                reviews={reviews}
                onAddReview={addReview}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
                onAddToCart={addToCart}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;