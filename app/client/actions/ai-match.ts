"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function parseJobAndMatch(rawDescription: string) {
  try {
    const supabase = await createClient();

    // 1. AI Intent Parsing
    const prompt = `
      You are an expert project appraiser for a high-end service marketplace called Guild.
      Analyze the following job description and extract key metrics.
      
      Job Description: "${rawDescription}"
      
      Strict Requirements:
      Return ONLY a raw JSON object with these keys:
      - category: (String, choose from: Design, Development, Marketing, Construction, Repairs, Events, Other)
      - skills: (Array of exactly 3 specific technical strings)
      - urgency: (String, choose from: Low, Medium, High)
      - estimatedBudget: (Number, in USD)

      JSON:
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean JSON (in case AI adds markdown blocks)
    const jsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedData = JSON.parse(jsonString);

    // 2. Fetch Matching Pros
    // Primary match on category or skills matching professional_title or bio tags
    // We prioritize is_premium and then experience_years
    const { data: pros, error: matchError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, avatar_url, professional_title, bio, is_premium, experience_years")
      .eq("role", "pro")
      .or(`professional_title.ilike.%${parsedData.category}%,bio.ilike.%${parsedData.category}%`)
      .order("is_premium", { ascending: false })
      .order("experience_years", { ascending: false })
      .limit(3);

    if (matchError) throw matchError;

    return {
      success: true,
      appraisal: parsedData,
      matchedPros: pros || []
    };

  } catch (error: any) {
    console.error("AI Match Error:", error);
    return {
      success: false,
      error: error.message || "Failed to parse job description"
    };
  }
}

export async function createAiJobRequest(data: {
  description: string;
  appraisal: any;
  proIds: string[];
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { data: job, error } = await supabase
      .from("job_requests")
      .insert({
        client_id: user.id,
        title: `${data.appraisal.category}: ${data.appraisal.skills[0]}`,
        description: data.description,
        category: data.appraisal.category,
        budget: data.appraisal.estimatedBudget,
        urgency: data.appraisal.urgency,
        ai_tags: data.appraisal.skills,
        status: "pending",
        payment_status: "unfunded"
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, jobId: job.id };

  } catch (error: any) {
    console.error("Create Job Error:", error);
    return { success: false, error: error.message };
  }
}
