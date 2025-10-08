export const usdToInr = (usd) => Math.round(usd * 83);

export const calculateDiscount = (price, discountPercentage) => {
  return Math.round(price * (1 + discountPercentage / 100));
};

export const calculateTotal = (items) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18;
  return { subtotal, tax, total: subtotal + tax };
};