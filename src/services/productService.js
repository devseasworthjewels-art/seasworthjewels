import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Fetch all products from Firebase
 * @returns {Promise<Array>} Array of product objects
 */
export async function getAllProducts() {
  try {
    console.log("Attempting to fetch products from Firebase...");
    const productsRef = collection(db, "products");
    const querySnapshot = await getDocs(
      query(productsRef, orderBy("productId", "asc"))
    );

    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log(`Fetched ${products.length} products from Firebase`);

    if (products.length === 0) {
      console.warn("Warning: No products found in the database");
    }

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);

    // Provide more specific error messages
    if (error.code === "permission-denied") {
      throw new Error(
        "Permission denied. Please check Firebase security rules."
      );
    } else if (error.code === "unavailable") {
      throw new Error(
        "Firebase service is unavailable. Please check your internet connection."
      );
    } else {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  }
}

/**
 * Fetch a single product by ID
 * @param {string} productId - Product ID
 * @returns {Promise<Object|null>} Product object or null
 */
export async function getProductById(productId) {
  try {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      return {
        id: productSnap.id,
        ...productSnap.data(),
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

/**
 * Fetch a product by slug
 * @param {string} slug - Product slug
 * @returns {Promise<Object|null>} Product object or null
 */
export async function getProductBySlug(slug) {
  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

/**
 * Fetch products by category
 * @param {string} category - Category name (Rings, Necklaces, Earrings, Bracelets)
 * @returns {Promise<Array>} Array of product objects
 */
export async function getProductsByCategory(category) {
  try {
    const productsRef = collection(db, "products");
    const q = query(
      productsRef,
      where("category", "==", category),
      orderBy("productId", "asc")
    );
    const querySnapshot = await getDocs(q);

    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return products;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

/**
 * Get images for a product based on metal color
 * @param {Object} product - Product object
 * @param {string} metalColor - Metal color (Yellow, Rose, White)
 * @returns {Array} Array of image URLs
 */
export function getProductImages(product, metalColor = "Yellow") {
  if (!product || !product.images) {
    return product?.image ? [product.image] : [];
  }

  const colorMap = {
    Yellow: "yellowGold",
    Rose: "roseGold",
    White: "whiteGold",
  };

  const colorKey = colorMap[metalColor] || "yellowGold";
  const images = product.images[colorKey] || [];

  // Fallback to main image if no images found
  return images.length > 0 ? images : product.image ? [product.image] : [];
}

/**
 * Fetch all categories from Firebase
 * @returns {Promise<Array>} Array of category objects
 */
export async function getAllCategories() {
  try {
    const categoriesRef = collection(db, "categories");
    const querySnapshot = await getDocs(categoriesRef);

    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
