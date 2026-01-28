import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";

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

async function analyzeProducts() {
  try {
    console.log("Fetching products from Firestore...");
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);

    console.log(`Found ${snapshot.docs.length} products`);

    const products = [];
    const schemaVariations = new Map();

    snapshot.forEach((doc) => {
      const data = doc.data();
      const product = {
        id: doc.id,
        ...data,
      };

      products.push(product);

      // Get all keys from this product
      const keys = Object.keys(data).sort();
      const schemaKey = keys.join(",");

      if (!schemaVariations.has(schemaKey)) {
        schemaVariations.set(schemaKey, {
          count: 0,
          example: product,
          keys: keys,
        });
      }

      const variation = schemaVariations.get(schemaKey);
      variation.count++;
    });

    console.log("\n=== SCHEMA ANALYSIS ===\n");
    console.log(`Total Products: ${products.length}`);
    console.log(`Schema Variations: ${schemaVariations.size}\n`);

    let variationIndex = 1;
    schemaVariations.forEach((variation, schemaKey) => {
      console.log(
        `\n--- Variation ${variationIndex} (${variation.count} products) ---`
      );
      console.log("Fields:", variation.keys.join(", "));
      console.log("Example Product ID:", variation.example.id);
      console.log("Example Product Name:", variation.example.name || "N/A");
      console.log("Sample data structure:");
      console.log(JSON.stringify(variation.example, null, 2));
      variationIndex++;
    });

    // Save detailed analysis to file
    const analysis = {
      totalProducts: products.length,
      schemaVariations: schemaVariations.size,
      variations: Array.from(schemaVariations.entries()).map(
        ([schemaKey, variation], index) => ({
          variationNumber: index + 1,
          productCount: variation.count,
          fields: variation.keys,
          exampleProduct: variation.example,
        })
      ),
      allProducts: products,
    };

    fs.writeFileSync(
      "scripts/productSchemaAnalysis.json",
      JSON.stringify(analysis, null, 2)
    );

    console.log(
      "\n\n=== Analysis saved to scripts/productSchemaAnalysis.json ==="
    );

    process.exit(0);
  } catch (error) {
    console.error("Error analyzing products:", error);
    process.exit(1);
  }
}

analyzeProducts();
