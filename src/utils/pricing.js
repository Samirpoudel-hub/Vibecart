export const COUPONS = {
  NOVA10: { type: "percent", value: 10 },
  WELCOME200: { type: "fixed", value: 200 },
};

export function normalizeCouponCode(code) {
  return String(code ?? "").trim().toUpperCase();
}

export function getCouponDiscount(subtotal, code) {
  const normalizedCode = normalizeCouponCode(code);
  const coupon = COUPONS[normalizedCode];

  if (!coupon || subtotal <= 0) return 0;

  const discount = coupon.type === "percent"
    ? Math.round(subtotal * coupon.value / 100)
    : coupon.value;

  return Math.min(subtotal, discount);
}

export function calculateOrderTotals(cart, couponCode) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = getCouponDiscount(subtotal, couponCode);

  return { subtotal, discount, total: subtotal - discount };
}