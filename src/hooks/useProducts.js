import { useState, useEffect } from "react";
import {
  getAllProducts,
  getProductsByCategory,
  getProductBySlug,
} from "../services/productService";

/**
 * Hook to fetch all products from Firebase
 * @returns {Object} { products, loading, error }
 */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}

/**
 * Hook to fetch products by category
 * @param {string} category - Category name
 * @returns {Object} { products, loading, error }
 */
export function useProductsByCategory(category) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      if (!category) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getProductsByCategory(category);
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products by category:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category]);

  return { products, loading, error };
}

/**
 * Hook to fetch a single product by slug
 * @param {string} slug - Product slug
 * @returns {Object} { product, loading, error }
 */
export function useProductBySlug(slug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getProductBySlug(slug);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching product by slug:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  return { product, loading, error };
}
