import "dotenv/config";
import { supabase } from "../server/db";

async function main() {
  const { data, error } = await supabase.from("publications").select("id, title").limit(5);
  console.log("Error:", error);
  console.log("Data:", data);
  process.exit(0);
}

main();
