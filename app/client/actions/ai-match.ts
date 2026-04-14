"use server";

import { createClient } from "@/lib/supabase/server";

export async function parseJobAndMatch(rawDescription: string) {
  try {
    const supabase = await createClient();
    
    const apiKey = process.env.FEATHERLESS_API_KEY;
    if (!apiKey) {
      throw new Error("FEATHERLESS_API_KEY is missing from environment. Add it to .env.local and restart your server.");
    }

    const response = await fetch("https://api.featherless.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You are an expert project appraiser. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: `Analyze this job description: "${rawDescription}"
Return ONLY a raw JSON object with these exact fields:
{
  "category": "Design|Development|Marketing|Construction|Repairs|Events|Other",
  "skills": ["skill1", "skill2", "skill3"],
  "urgency": "Low|Medium|High",
  "estimatedBudget": 1000
}`
          }
        ],
        temperature: 0.2,
        max_tokens: 300
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Featherless API Error:", data);
      throw new Error(`Featherless API Error (${response.status}): ${data?.error?.message || "Unknown Error"}`);
    }

    const responseText = data?.choices?.[0]?.message?.content;
    if (!responseText) throw new Error("AI returned no content.");

    let parsedData;
    try {
      let cleanText = responseText.trim();
      if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "");
      }
      parsedData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("JSON Parse Error. Raw Response:", responseText);
      throw new Error("Failed to parse AI response into valid JSON.");
    }

    // Fetch Matching Pros
    const skills = Array.isArray(parsedData.skills) ? parsedData.skills : [];
    const skillFilters = skills.length > 0 
      ? "," + skills.map((s: string) => `bio.ilike.%${s}%`).join(",")
      : "";
      
    const matchQuery = `bio.ilike.%${parsedData.category}%${skillFilters}`;

    const { data: pros, error: matchError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, avatar_url, bio, services, is_premium, experience_years")
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
    return {
      success: false,
      error: error.message
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

export async function getAiCoachTip(context: {
  jobTitle: string;
  jobDescription: string;
  budget: number | null;
  urgency?: string | null;
  category?: string | null;
  question: string;
}) {
  try {
    const apiKey = process.env.FEATHERLESS_API_KEY;
    if (!apiKey) throw new Error("FEATHERLESS_API_KEY missing.");

    const systemPrompt = `You are Guild AI, a professional negotiation coach embedded inside a freelance marketplace.
Your job is to help clients communicate effectively and professionally with service professionals (pros).
You help clients understand why pros charge certain amounts, frame budget constraints politely, suggest professional message wording, and balance scope vs cost.
Always respond in 2-4 short paragraphs. Be warm, direct, and practical. No bullet points.`;

    const userPrompt = `Job context:
- Title: ${context.jobTitle}
- Description: ${context.jobDescription}
- Budget: ${context.budget ? `$${context.budget}` : "Not set"}
- Urgency: ${context.urgency || "Not specified"}
- Category: ${context.category || "Not specified"}

User question: ${context.question}`;

    const response = await fetch("https://api.featherless.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 400
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || "Featherless API error");

    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error("AI returned no content.");

    return { success: true, tip: text.trim() };
  } catch (error: any) {
    console.error("AI Coach Error:", error.message);
    return { success: false, error: error.message };
  }
}
