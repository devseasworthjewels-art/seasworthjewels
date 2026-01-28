import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG } from "./utils/appConfig.js";

const app = initializeApp(FIREBASE_CONFIG);
export const db = getFirestore(app);
