// ---------------- CLOUDINARY SETUP ----------------
// cloudinary.config({
//   cloud_name: "dwpwqalo3",
//   api_key: "669877462392543",
//   api_secret: "TViWVG-82qPqTvJDjShqIfshXs0",
// });
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// ---------------- CONFIG ----------------
const MODE = process.argv[2] || "testing"; // testing | all
const IMAGE_BASE_PATH = path.join(__dirname, "images");
const JSON_PATH = path.join(__dirname, "products.json");
const OUTPUT_JSON = path.join(__dirname, "products_with_urls.json");

// ---------------- CLOUDINARY SETUP ----------------
cloudinary.config({
  cloud_name: "dwpwqalo3",
  api_key: "669877462392543",
  api_secret: "TViWVG-82qPqTvJDjShqIfshXs0",
});

// ---------------- HELPERS ----------------
function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

// ✅ Upload with public_id overwrite (DUPLICATE SAFE)
async function uploadToCloudinary(imagePath, publicId) {
  const result = await cloudinary.uploader.upload(imagePath, {
    folder: "seasworth",
    public_id: publicId, // ✅ SAME NAME ALWAYS
    overwrite: true, // ✅ WILL OVERWRITE NOT DUPLICATE
  });
  return result.secure_url;
}

// ✅ Load previous output if exists (SKIP SAFE)
function loadPreviousOutput() {
  if (fs.existsSync(OUTPUT_JSON)) {
    return JSON.parse(fs.readFileSync(OUTPUT_JSON, "utf-8"));
  }
  return [];
}

// ---------------- MAIN LOGIC ----------------
async function main() {
  log(`✅ Script started in MODE: ${MODE.toUpperCase()}`);

  const products = JSON.parse(fs.readFileSync(JSON_PATH, "utf-8"));
  const previousOutput = loadPreviousOutput();

  const previousMap = {};
  for (const p of previousOutput) {
    previousMap[p.productId] = p;
  }

  for (let product of products) {
    const productId = product.productId;
    const productFolder = path.join(IMAGE_BASE_PATH, String(productId));

    if (!fs.existsSync(productFolder)) {
      log(`❌ Folder not found for product ${productId}`);
      continue;
    }

    log(`📦 Processing Product: ${productId}`);

    const uploadedMap = {};

    // ✅ LOAD EXISTING URLs (SKIP DUPLICATES)
    if (previousMap[productId]) {
      const prev = previousMap[productId];

      function preload(field) {
        if (prev[field]) {
          prev[field].split(",").forEach((url) => {
            const index = url.split("_").pop().split(".")[0];
            uploadedMap[index] = url;
          });
        }
      }

      preload("YellowGoldImages");
      preload("RoseGoldImages");
      preload("WhiteGoldImages");

      log(`♻️ Found existing uploads for product ${productId}, will SKIP them`);
    }

    const files = fs.readdirSync(productFolder);

    // ---------- TEST MODE ----------
    const uploadFiles = MODE === "testing" ? [files[0]] : files;

    for (const file of uploadFiles) {
      const fullPath = path.join(productFolder, file);
      const index = file.split("_")[1].split(".")[0];

      if (uploadedMap[index]) {
        log(`⏭️ SKIPPED ${file} (already uploaded)`);
        continue;
      }

      const publicId = `${productId}/${file.replace(".jpg", "")}`;

      log(`⬆️ Uploading ${file} → public_id: ${publicId}`);

      const url = await uploadToCloudinary(fullPath, publicId);
      uploadedMap[index] = url;
    }

    // ---------- COLOR MAPPING ----------
    function mapColorImages(indexList) {
      return indexList
        .split(",")
        .map((i) => uploadedMap[i])
        .filter(Boolean)
        .join(",");
    }

    product.YellowGoldImages = mapColorImages(product.YellowGold);
    product.RoseGoldImages = mapColorImages(product.RoseGold);
    product.WhiteGoldImages = mapColorImages(product.WhiteGold);

    delete product.YellowGold;
    delete product.RoseGold;
    delete product.WhiteGold;

    log(`✅ Product ${productId} mapping completed`);
  }

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(products, null, 2));
  log(`🎉 Final JSON written to ${OUTPUT_JSON}`);
}

main().catch((err) => {
  console.error("❌ SCRIPT FAILED:", err);
});
