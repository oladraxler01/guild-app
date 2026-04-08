"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

export async function parseJobAndMatch(rawDescription: string) {
  try {
    const supabase = await createClient();
    
    // 1. Check API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing from environment. You MUST restart your terminal (npm run dev) after adding it to .env.local.");
    }

    // 2. AI Intent Parsing with Fallbacks
    const genAI = new GoogleGenerativeAI(apiKey);
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

    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro"];
    let responseText = "";
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying Gemini model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        responseText = result.response.text();
        if (responseText) break;
      } catch (e: any) {
        lastError = e;
        console.warn(`Model ${modelName} failed:`, e.message);
        continue;
      }
    }

    if (!responseText) {
       throw new Error(lastError?.message || "All AI models failed to respond.");
    }
    
    // Robust JSON extraction
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
       throw new Error(`AI returned text instead of data. Check your description.`);
    }
    
    let parsedData;
    try {
      parsedData = JSON.parse(jsonMatch[0]);
    } catch (e) {
      throw new Error(`AI returned invalid JSON formatting.`);
    }

    // 3. Fetch Matching Pros
    // Match on: Category OR any of the 3 Skills
    const skills = Array.isArray(parsedData.skills) ? parsedData.skills : [];
    const skillFilters = skills.length > 0 
      ? "," + skills.map((s: string) => `professional_title.ilike.%${s}%,bio.ilike.%${s}%`).join(",")
      : "";
      
    const matchQuery = `professional_title.ilike.%${parsedData.category}%,bio.ilike.%${parsedData.category}%${skillFilters}`;

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
    console.error("AI Match Final Error:", error.message);
    
    let userMessage = error.message;
    if (error.message.includes("API key")) userMessage = "Invalid Gemini API Key. Check your .env.local and RESTART your server.";
    if (error.message.includes("safety")) userMessage = "Request blocked by AI safety filters. Try rephrasing.";
    if (error.message.includes("404")) userMessage = "AI Model not found in your region. Contact support or try Pro.";
    
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
