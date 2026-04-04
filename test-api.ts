import { createClient } from "@supabase/supabase-js";
import 'dotenv/config'; // requires dotenv to be installed or use process.env mapping

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bnsglxpihmmsvodpzwri.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuc2dseHBpaG1tc3ZvZHB6d3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzOTU4NzIsImV4cCI6MjA4OTk3MTg3Mn0.8MZ19Zx7D4ua9kExR3FJrkBTqzIs2yg0292XTGZkDdo";

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", "98c79907-cdb0-4c71-8869-d13d0db94357");
  console.log("Error:", error);
  console.log("Data:", data);
}

test();
