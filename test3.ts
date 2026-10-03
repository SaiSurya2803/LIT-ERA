import { storage } from "./server/storage";

async function test() {
  try {
    const result = await storage.getPublications();
    console.log("Publications fetched successfully, count:", result.length);
  } catch (err) {
    console.error("Error in getPublications:", err);
  }
  process.exit(0);
}

test().catch(console.error);
