import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalyzeResumeRequest {
  resumeText: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText }: AnalyzeResumeRequest = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing resume with AI...");

    const LOVABLE_API_URL = Deno.env.get("LOVABLE_API_URL");

    if (!LOVABLE_API_URL) {
      throw new Error("LOVABLE_API_URL is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert resume analyzer. Analyze resumes and provide:
1. An overall score (0-100)
2. Detailed feedback on strengths
3. Areas for improvement
4. Specific recommendations

Format your response as JSON with this structure:
{
  "score": number (0-100),
  "summary": "brief overall assessment",
  "strengths": ["strength1", "strength2", ...],
  "improvements": ["improvement1", "improvement2", ...],
  "recommendations": ["recommendation1", "recommendation2", ...]
}`
          },
          {
            role: "user",
            content: `Analyze this resume:\n\n${resumeText}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_resume",
              description: "Analyze a resume and provide structured feedback",
              parameters: {
                type: "object",
                properties: {
                  score: { type: "number", minimum: 0, maximum: 100 },
                  summary: { type: "string" },
                  strengths: {
                    type: "array",
                    items: { type: "string" }
                  },
                  improvements: {
                    type: "array",
                    items: { type: "string" }
                  },
                  recommendations: {
                    type: "array",
                    items: { type: "string" }
                  }
                },
                required: ["score", "summary", "strengths", "improvements", "recommendations"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "analyze_resume" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    console.log("AI response received:", JSON.stringify(data));

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ analysis }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in analyze-resume function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to analyze resume" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
