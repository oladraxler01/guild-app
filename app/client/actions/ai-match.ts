"use server";

import { createClient } from "@/lib/supabase/server";

export async function parseJobAndMatch(rawDescription: string) {
  try {
    const supabase = await createClient();
    
    // 1. Check API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing from environment. RESTART YOUR SERVER (Ctrl+C then npm run dev).");
    }

    // 2. Direct REST Call to Gemini (Bypassing SDK to avoid 404 naming issues)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `
              You are an expert project appraiser. Analyze this job: "${rawDescription}"
              Return ONLY a raw JSON object:
              {
                "category": "Design|Development|Marketing|Construction|Repairs|Events|Other",
                "skills": ["skill1", "skill2", "skill3"],
                "urgency": "Low|Medium|High",
                "estimatedBudget": 1000
              }
            `
          }]
        }],
        generationConfig: {
          response_mime_type: "application/json"
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
       console.error("Gemini REST Error:", data);
       throw new Error(`Gemini API Error (${response.status}): ${data?.error?.message || "Unknown Error"}`);
    }

    const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) throw new Error("AI returned no content.");
    
    const parsedData = JSON.parse(responseText);

    // 3. Fetch Matching Pros
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
