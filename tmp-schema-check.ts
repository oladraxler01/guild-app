import { createClient } from "@supabase/supabase-js";

async function checkSchema() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  console.log("Checking profiles table...");
  const { data: profile, error: pError } = await supabase
    .from("profiles")
    .select("is_premium, experience_years")
    .limit(1);
  
  if (pError) console.error("Profiles Schema Error:", pError.message);
  else console.log("Profiles check passed:", profile);

  console.log("Checking job_requests table...");
  const { data: job, error: jError } = await supabase
    .from("job_requests")
    .select("ai_tags")
    .limit(1);

  if (jError) console.error("Jobs Schema Error:", jError.message);
  else console.log("Jobs check passed:", job);
}

checkSchema();
