import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_requests")
    .select("*")
    .eq("status", "pending");
  return NextResponse.json({ data, error });
}
