export function parsePrice(price) {
  if (!price) return 0;
  // If it's already a number, return it
  if (typeof price === "number") return price;
  // If it's a string, parse it
  if (typeof price === "string") {
    const numeric = price.replace(/[^0-9.]/g, "");
    return parseFloat(numeric) || 0;
  }
  return 0;
}

export function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getSortedProducts(products, sortBy) {
  const base = [...products];

  if (sortBy === "price-low-high") {
    return base.sort(
      (a, b) =>
        parsePrice(a.basePrice || a.price) - parsePrice(b.basePrice || b.price)
    );
  }

  if (sortBy === "price-high-low") {
    return base.sort(
      (a, b) =>
        parsePrice(b.basePrice || b.price) - parsePrice(a.basePrice || a.price)
    );
  }

  return base;
}
