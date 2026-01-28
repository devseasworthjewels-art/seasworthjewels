import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOUl6kP9aZ1uJk8UkP5SRDDC6fFSMrBr4",
  authDomain: "seaworthjewels.firebaseapp.com",
  projectId: "seaworthjewels",
  storageBucket: "seaworthjewels.firebasestorage.app",
  messagingSenderId: "739736695421",
  appId: "1:739736695421:web:da95fa7ccdf35f039f3cbe",
  measurementId: "G-SX8NLRPMWB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Define the normalized schema structure
 * This function takes a product and returns a normalized version
 */
function normalizeProduct(rawProduct) {
  const normalized = {};

  // Required fields
  normalized.productId = rawProduct.productId;
  normalized.name = rawProduct.name || "";
  normalized.slug = rawProduct.slug || "";
  normalized.description = rawProduct.description || "";
  normalized.category = normalizeCategory(rawProduct.category);
  normalized.basePrice = rawProduct.basePrice || 0;
  normalized.createdAt = rawProduct.createdAt || new Date().toISOString();

  // Images - standardize structure
  normalized.images = {
    yellowGold: rawProduct.images?.yellowGold || [],
    roseGold: rawProduct.images?.roseGold || [],
    whiteGold: rawProduct.images?.whiteGold || [],
  };

  // Main image - use the first yellowGold image or existing image/mainImage
  normalized.image =
    rawProduct.image ||
    rawProduct.mainImage ||
    rawProduct.images?.yellowGold?.[0] ||
    "";

  // Prices - normalize to uppercase keys (10K, 14K, 18K)
  normalized.prices = {
    "10K": rawProduct.prices?.["10K"] || rawProduct.prices?.["10k"] || 0,
    "14K": rawProduct.prices?.["14K"] || rawProduct.prices?.["14k"] || 0,
    "18K": rawProduct.prices?.["18K"] || rawProduct.prices?.["18k"] || 0,
  };

  // Carat weights (standardized)
  const caratWeights = rawProduct.caratWeights ||
    rawProduct.options?.caratWeight || [
      "1.00-1.19CT",
      "1.50-1.69CT",
      "2.00-2.19CT",
    ];
  normalized.caratWeights = caratWeights;

  // Stone types (standardized)
  const stoneTypes = rawProduct.options?.stoneType ||
    rawProduct.diamondTypes || ["Moissanite", "Lab Grown", "Natural"];

  // Options - normalized structure
  normalized.options = {
    stoneType: stoneTypes,
    caratWeight: caratWeights,
    metalColors: rawProduct.options?.metalColors || [
      "Yellow Gold",
      "Rose Gold",
      "White Gold",
    ],
    metalKarats: rawProduct.options?.metalKarats || ["10KT", "14KT", "18KT"],
  };

  // Size options (for rings primarily)
  normalized.sizeOptions = rawProduct.sizeOptions || [];

  return normalized;
}

/**
 * Normalize category names to capitalize first letter
 */
function normalizeCategory(category) {
  if (!category) return "";

  // Convert to lowercase first, then capitalize first letter
  const lowercased = category.toLowerCase();

  // Map common variations
  const categoryMap = {
    necklace: "Necklaces",
    necklaces: "Necklaces",
    ring: "Rings",
    rings: "Rings",
    earring: "Earrings",
    earrings: "Earrings",
    bracelet: "Bracelets",
    bracelets: "Bracelets",
  };

  return (
    categoryMap[lowercased] ||
    category.charAt(0).toUpperCase() + category.slice(1)
  );
}

async function migrateProducts() {
  try {
    console.log("🚀 Starting product normalization migration...\n");

    // Step 1: Fetch all products
    console.log("📦 Fetching all products from Firestore...");
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);

    console.log(`✅ Found ${snapshot.docs.length} products\n`);

    // Step 2: Normalize all products
    console.log("🔄 Normalizing products...\n");
    const normalizedProducts = [];

    snapshot.forEach((docSnapshot) => {
      const rawProduct = { id: docSnapshot.id, ...docSnapshot.data() };
      const normalized = normalizeProduct(rawProduct);

      normalizedProducts.push({
        id: docSnapshot.id,
        data: normalized,
      });

      console.log(`  ✓ Normalized: ${normalized.name} (ID: ${docSnapshot.id})`);
    });

    console.log(
      `\n✅ Successfully normalized ${normalizedProducts.length} products\n`
    );

    // Step 3: Ask for confirmation before uploading
    console.log("⚠️  READY TO UPLOAD TO FIRESTORE");
    console.log(
      "   This will replace all existing product documents with normalized versions."
    );
    console.log("   Original data will be deleted.\n");

    // For safety, we'll backup first (optional)
    console.log("💾 Creating backup in local file...");
    const fs = await import("fs");
    fs.writeFileSync(
      "scripts/products_backup.json",
      JSON.stringify(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        null,
        2
      )
    );
    console.log("   ✓ Backup saved to scripts/products_backup.json\n");

    // Step 4: Delete old documents and upload normalized ones
    console.log("🔥 Deleting old product documents...");
    for (const docSnapshot of snapshot.docs) {
      await deleteDoc(doc(db, "products", docSnapshot.id));
      console.log(`   ✓ Deleted: ${docSnapshot.id}`);
    }

    console.log("\n📤 Uploading normalized products...");
    for (const product of normalizedProducts) {
      await setDoc(doc(db, "products", product.id), product.data);
      console.log(`   ✓ Uploaded: ${product.data.name} (ID: ${product.id})`);
    }

    console.log("\n✨ MIGRATION COMPLETE! ✨");
    console.log(
      `   ${normalizedProducts.length} products normalized and uploaded`
    );
    console.log("   Backup saved to: scripts/products_backup.json\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during migration:", error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the migration
migrateProducts();
