import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  // 1. Get any profile ID
  const { data: profiles } = await supabase.from("profiles").select("id").limit(1);
  const testId = profiles?.[0]?.id;

  if (!testId) {
    return NextResponse.json({ error: "No profiles found in DB" });
  }

  // 2. Try the insert
  const { data, error } = await supabase
    .from("job_requests")
    .insert({
      client_id: testId,
      pro_id: null,
      title: "Debug Job - " + Date.now(),
      description: "Testing if pro_id: null is allowed in job_requests",
      status: "pending",
      payment_status: "pending",
    })
    .select();

  return NextResponse.json({ data, error, testId });
}
