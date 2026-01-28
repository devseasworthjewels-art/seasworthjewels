// Utility function to generate slug from product name
export function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

export const categories = [
  {
    label: "Rings",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2023/02/Rose-Gold-Bracelet-4.jpg",
  },
  {
    label: "Necklaces",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2023/02/Honey-Comb-Lace-Heart-Earrings-4.jpg",
  },
  {
    label: "Earrings",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2023/02/Sterling-Silver-Dangles-Earrings-1.jpg",
  },
  {
    label: "Bracelets",
    image: "https://tulsiyajewels.com/wp-content/uploads/2025/02/new11.png",
  },
];

const braceletProducts = [
  {
    id: "1729",
    name: "Blush Bloom Rose Gold Diamond Bracelet",
    slug: "blush-bloom-rose-gold-diamond-bracelet",
    price: "₹38,450.00",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/69-325x325.jpg",
    category: "Bracelets",
  },
  {
    id: "1744",
    name: "Celeste Whisper Bezel-Set Diamond Chain Bracelet",
    slug: "celeste-whisper-bezel-set-diamond-chain-bracelet",
    price: "₹42,990.25",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/69-325x325.jpg",
    category: "Bracelets",
  },
  {
    id: "1780",
    name: "Elegant Emerald & Diamond Tennis Bracelet",
    slug: "elegant-emerald-diamond-tennis-bracelet",
    price: "₹55,675.80",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/79-325x325.jpg",
    category: "Bracelets",
  },
  {
    id: "1758",
    name: "Minimal Radiance Diamond Bar Necklace & Bracelet Set",
    slug: "minimal-radiance-diamond-bar-necklace-bracelet-set",
    price: "₹47,320.40",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/21-325x325.jpg",
    category: "Bracelets",
  },
  {
    id: "1770",
    name: "Whispers of Gold – Diamond Bezel-Set Chain Bracelet",
    slug: "whispers-of-gold-diamond-bezel-set-chain-bracelet",
    price: "₹41,885.10",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/62-325x325.jpg",
    category: "Bracelets",
  },
];

const earringProducts = [
  {
    id: "1848",
    name: "Celestia Curve Solitaire Earrings",
    slug: "celestia-curve-solitaire-earrings",
    price: "₹29,750.00",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/108-325x325.jpg",
    category: "Earrings",
  },
  {
    id: "1896",
    name: "Emerald Cascade Drop Earrings",
    slug: "emerald-cascade-drop-earrings",
    price: "₹33,420.35",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/25-325x325.jpg",
    category: "Earrings",
  },
  {
    id: "1908",
    name: "Floral Grace Pendant & Earrings Diamond Set",
    slug: "floral-grace-pendant-earrings-diamond-set",
    price: "₹69,977.50",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/31-325x325.jpg",
    category: "Earrings",
  },
  {
    id: "1875",
    name: "Gilded Frame Emerald-Cut Drop Earrings",
    slug: "gilded-frame-emerald-cut-drop-earrings",
    price: "₹39,980.00",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/52-325x325.jpg",
    category: "Earrings",
  },
  {
    id: "1866",
    name: "Golden Drape Leaf-Drop Earrings",
    slug: "golden-drape-leaf-drop-earrings",
    price: "₹31,640.75",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/06-325x325.jpg",
    category: "Earrings",
  },
  {
    id: "1887",
    name: "Linear Luxe Art Deco Earrings",
    slug: "linear-luxe-art-deco-earrings",
    price: "₹36,215.20",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/130-325x325.jpg",
    category: "Earrings",
  },
  {
    id: "1857",
    name: "Twilight Cascade Dual-Stone Earrings",
    slug: "twilight-cascade-dual-stone-earrings",
    price: "₹34,890.60",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/108-325x325.jpg",
    category: "Earrings",
  },
];

const ringProducts = [
  {
    id: "1532",
    name: "Azure Blossom Color Diamond Ring",
    slug: "azure-blossom-color-diamond-ring",
    price: "₹49,928.55",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/169A5175-325x325.jpg",
    category: "Rings",
  },
  {
    id: "1613",
    name: "Celestial Swirl Diamond Ring",
    slug: "celestial-swirl-diamond-ring",
    price: "₹48,893.86",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/57-325x325.jpg",
    category: "Rings",
  },
  {
    id: "1624",
    name: "Crimson Grace Emerald-Cut Ring",
    slug: "crimson-grace-emerald-cut-ring",
    price: "₹42,774.52",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/94-325x325.jpg",
    category: "Rings",
  },
  {
    id: "1634",
    name: "Ember Kiss Halo Red Diamond Ring",
    slug: "ember-kiss-halo-red-diamond-ring",
    price: "₹45,250.00",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/89-325x325.jpg",
    category: "Rings",
  },
  {
    id: "1696",
    name: "Eternal Harmony Twin Pear Diamond Ring",
    slug: "eternal-harmony-twin-pear-diamond-ring",
    price: "₹51,300.00",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/87-325x325.jpg",
    category: "Rings",
  },
  {
    id: "1718",
    name: "Luxe Brilliance Baguette-Cut Diamond Statement Band",
    slug: "luxe-brilliance-baguette-cut-diamond-statement-band",
    price: "₹55,900.00",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/89-325x325.jpg",
    category: "Rings",
  },
  {
    id: "1643",
    name: "Majestic Brilliance Cushion-Cut Diamond Ring",
    slug: "majestic-brilliance-cushion-cut-diamond-ring",
    price: "₹47,650.00",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/47-325x325.jpg",
    category: "Rings",
  },
  {
    id: "1704",
    name: "Timeless Gleam Bezel-Set Diamond Band",
    slug: "timeless-gleam-bezel-set-diamond-band",
    price: "₹44,200.00",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/53-325x325.jpg",
    category: "Rings",
  },
];

const necklaceProducts = [
  {
    id: "1828",
    name: "Crimson Bloom Diamond Necklace",
    slug: "crimson-bloom-diamond-necklace",
    price: "₹63,253.75",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/119-325x325.jpg",
    category: "Necklaces",
  },
  {
    id: "1801",
    name: "Diamond Butterfly Pendant Necklace in Gold",
    slug: "diamond-butterfly-pendant-necklace-in-gold",
    price: "₹68,384.65",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/25-325x325.jpg",
    category: "Necklaces",
  },
  {
    id: "1908",
    name: "Floral Grace Pendant & Earrings Diamond Set",
    slug: "floral-grace-pendant-earrings-diamond-set",
    price: "₹69,977.50",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/44-325x325.jpg",
    category: "Necklaces",
  },
  {
    id: "1810",
    name: "Luxe Éclat Diamond Set",
    slug: "luxe-eclat-diamond-set",
    price: "₹48,172.13",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/20-325x325.jpg",
    category: "Necklaces",
  },
  {
    id: "1790",
    name: "Rose Gold Leaf Pendant Necklace with Diamond Accents",
    slug: "rose-gold-leaf-pendant-necklace-with-diamond-accents",
    price: "₹52,640.00",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/117-325x325.jpg",
    category: "Necklaces",
  },
  {
    id: "1839",
    name: "Stellar Bloom Round Diamond Necklace Set",
    slug: "stellar-bloom-round-diamond-necklace-set",
    price: "₹57,310.40",
    image:
      "https://tulsiyajewels.com/wp-content/uploads/2025/07/34-325x325.jpg",
    category: "Necklaces",
  },
];

export const productMap = {
  Rings: ringProducts,
  Necklaces: necklaceProducts,
  Bracelets: braceletProducts,
  Earrings: earringProducts,
};

export const allProducts = [
  ...ringProducts,
  ...necklaceProducts,
  ...braceletProducts,
  ...earringProducts,
];
