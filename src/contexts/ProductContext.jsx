import { createContext, useContext, useState, useEffect } from "react";
import {
  getAllProducts,
  getAllCategories,
  getProductBySlug as getProductBySlugAPI,
} from "../services/productService";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Fetch all products and categories once when component mounts
  useEffect(() => {
    // Only fetch if not already initialized
    if (isInitialized) return;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        console.log(
          `Fetching data... (Attempt ${retryCount + 1}/${MAX_RETRIES + 1})`
        );

        // Fetch products and categories in parallel
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getAllCategories()
        ]);

        if (!productsData || productsData.length === 0) {
          throw new Error("No products found in database");
        }

        // Defined sort order (lowercase for comparison)
        const sortOrder = ["rings", "necklaces", "earrings", "bracelets"];

        // Sort categories
        categoriesData.sort((a, b) => {
          const labelA = (a.label || "").toLowerCase().trim();
          const labelB = (b.label || "").toLowerCase().trim();

          const indexA = sortOrder.indexOf(labelA);
          const indexB = sortOrder.indexOf(labelB);

          // If both are in the list, sort by index
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          // If only A is in the list, it comes first
          if (indexA !== -1) return -1;
          // If only B is in the list, it comes first
          if (indexB !== -1) return 1;
          // Otherwise sort alphabetically
          return labelA.localeCompare(labelB);
        });

        console.log(`Successfully fetched ${productsData.length} products`);
        console.log(`Successfully fetched ${categoriesData.length} categories`);
        console.log("Sorted Categories:", categoriesData.map(c => c.label));

        setProducts(productsData);
        setCategories(categoriesData);
        setIsInitialized(true);
        setRetryCount(0); // Reset retry count on success
      } catch (err) {
        console.error("Error fetching data:", err);

        // Retry logic
        if (retryCount < MAX_RETRIES) {
          console.log(
            `Retrying in 2 seconds... (${retryCount + 1}/${MAX_RETRIES})`
          );
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
          }, 2000);
        } else {
          setError(
            err.message || "Failed to load data. Please refresh the page."
          );
          console.error("Max retries reached. Failed to fetch data.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isInitialized, retryCount]);

  // Get products by category
  const getProductsByCategory = (category) => {
    if (!category) return products;
    return products.filter((product) =>
      product.category?.toLowerCase() === category.toLowerCase()
    );
  };

  // Get product by ID
  const getProductById = (id) => {
    return products.find(
      (product) => product.id === id || product.productId === Number(id)
    );
  };

  // Get product by slug
  const getProductBySlug = (slug) => {
    return products.find((product) => product.slug === slug);
  };

  // Fetch product by slug (from cache or API)
  const fetchProductBySlug = async (slug) => {
    // First check if product exists in cache
    const cachedProduct = products.find((product) => product.slug === slug);
    if (cachedProduct) {
      return cachedProduct;
    }

    // If not in cache and we're still loading, wait a bit
    if (loading && !isInitialized) {
      return null;
    }

    // Fetch from API
    try {
      const product = await getProductBySlugAPI(slug);
      if (product) {
        // Add to products cache if not already there
        setProducts((prev) => {
          const exists = prev.find((p) => p.slug === slug);
          if (!exists) {
            return [...prev, product];
          }
          return prev;
        });
      }
      return product;
    } catch (err) {
      console.error("Error fetching product by slug:", err);
      return null;
    }
  };



  // Create product map by category
  const getProductMap = () => {
    const map = {};
    products.forEach((product) => {
      if (!map[product.category]) {
        map[product.category] = [];
      }
      map[product.category].push(product);
    });
    return map;
  };

  const value = {
    products,
    loading,
    error,
    isInitialized,
    getProductsByCategory,
    getProductById,
    getProductBySlug,
    fetchProductBySlug,
    categories, // Expose fetched categories
    getProductMap,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProductContext() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within ProductProvider");
  }
  return context;
}
