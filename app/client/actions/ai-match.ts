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
    
    if (!responseText) throw new Error("AI returned an empty response.");
    
    // Robust JSON extraction
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
       console.error("No JSON found in response:", responseText);
       throw new Error(`AI returned text instead of data: ${responseText.substring(0, 100)}...`);
    }
    
    let parsedData;
    try {
      parsedData = JSON.parse(jsonMatch[0]);
    } catch (e) {
      throw new Error(`Invalid JSON format from AI: ${jsonMatch[0].substring(0, 50)}...`);
    }

    // 2. Fetch Matching Pros
    // Match on: Category OR any of the 3 Skills
    const skills = Array.isArray(parsedData.skills) ? parsedData.skills : [];
    const skillFilters = skills.length > 0 
      ? "," + skills.map((s: string) => `professional_title.ilike.%${s}%,bio.ilike.%${s}%`).join(",")
      : "";
      
    const matchQuery = `professional_title.ilike.%${parsedData.category}%,bio.ilike.%${parsedData.category}%${skillFilters}`;
    
    console.log("Final Match Query:", matchQuery);

    const { data: pros, error: matchError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, avatar_url, professional_title, bio, is_premium, experience_years")
      .eq("role", "pro")
      .or(matchQuery)
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
    console.error("AI Match Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error?.response ? await error.response.text() : "No response body"
    });
    
    let userMessage = error.message;
    if (error.message.includes("API key")) userMessage = "Invalid Gemini API Key. Check your .env.local";
    if (error.message.includes("safety")) userMessage = "Request blocked by AI safety filters. Try rephrasing.";
    
    return {
      success: false,
      error: userMessage
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
