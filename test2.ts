import { db } from "./server/db";
import { publications } from "./shared/schema";

async function test() {
  const result = await db.select().from(publications);
  console.log("Drizzle count:", result.length);
  process.exit(0);
}

test().catch(console.error);
