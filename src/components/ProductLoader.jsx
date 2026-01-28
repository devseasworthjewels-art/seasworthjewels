import { useProductContext } from "../contexts/ProductContext";

/**
 * Component to show loading state while products are being fetched
 * This ensures products are loaded before showing content
 */
export function ProductLoader({ children }) {
  const { loading, error, isInitialized } = useProductContext();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading products: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
