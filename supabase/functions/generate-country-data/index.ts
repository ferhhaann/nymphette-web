import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    console.log('Edge function called - generate-country-data');
    const { countryName, region } = await req.json();
    console.log('Request data:', { countryName, region });
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a travel content expert that generates comprehensive country data for a travel website. Generate detailed, accurate, and engaging content.`;

    console.log('Preparing AI request...');
    const userPrompt = `Generate comprehensive travel data for ${countryName} in the ${region} region. 

IMPORTANT: Generate content that will populate a country database entry. Do NOT include image URLs or paths (images will be uploaded manually).

Return a JSON object matching this structure:

{
  "name": "${countryName}",
  "slug": "country-slug (lowercase, hyphenated)",
  "region": "${region}",
  "capital": "Capital city name",
  "currency": "Currency name and code (e.g., Japanese Yen - JPY)",
  "climate": "Climate description (1-2 sentences)",
  "best_season": "Best time to visit (e.g., March to May, September to November)",
  "languages": ["Language 1", "Language 2"],
  "speciality": "What the country is famous for (1-2 sentences)",
  "culture": "Cultural overview (2-3 sentences)",
  "description": "General country description for SEO (2-3 sentences)",
  "overview_description": "Detailed overview section content (3-4 paragraphs)",
  "about_content": "About the country - detailed content (3-4 paragraphs)",
  "best_time_content": "Best time to visit - detailed seasonal information (2-3 paragraphs)",
  "travel_tips": "General travel tips and advice (2-3 paragraphs)",
  "sections": [
    { "section_name": "overview", "title": "Overview", "content": { "text": "..." } },
    { "section_name": "culture", "title": "Culture & Traditions", "content": { "text": "..." } },
    { "section_name": "food", "title": "Food & Cuisine", "content": { "text": "..." } }
  ],
  "tips": [
    { "icon": "Passport", "title": "Visa Requirements", "note": "..." },
    { "icon": "Heart", "title": "Health & Safety", "note": "..." },
    { "icon": "Wifi", "title": "Connectivity", "note": "..." }
  ],
  "attractions": [
    { "name": "Attraction name", "description": "...", "type": "attraction" }
  ],
  "faqs": [
    { "question": "Common question?", "answer": "Detailed answer" }
  ]
}

Make the content:
- Engaging and informative
- SEO-friendly with natural keyword usage
- Factually accurate
- Well-structured with proper paragraphs`;

    console.log('Calling Lovable AI Gateway...');
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_country_data",
              description: "Generate comprehensive country data for a travel website",
              parameters: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  slug: { type: "string" },
                  region: { type: "string" },
                  capital: { type: "string" },
                  currency: { type: "string" },
                  climate: { type: "string" },
                  best_season: { type: "string" },
                  languages: { type: "array", items: { type: "string" } },
                  speciality: { type: "string" },
                  culture: { type: "string" },
                  description: { type: "string" },
                  overview_description: { type: "string" },
                  about_content: { type: "string" },
                  best_time_content: { type: "string" },
                  travel_tips: { type: "string" },
                  sections: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        section_name: { type: "string" },
                        title: { type: "string" },
                        content: { type: "object" }
                      },
                      required: ["section_name", "title", "content"]
                    }
                  },
                  tips: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        icon: { type: "string" },
                        title: { type: "string" },
                        note: { type: "string" }
                      },
                      required: ["icon", "title", "note"]
                    }
                  },
                  attractions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        description: { type: "string" },
                        type: { type: "string" }
                      },
                      required: ["name", "description", "type"]
                    }
                  },
                  faqs: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        question: { type: "string" },
                        answer: { type: "string" }
                      },
                      required: ["question", "answer"]
                    }
                  }
                },
                required: ["name", "slug", "region", "capital", "currency", "climate", "best_season", "languages", "speciality", "culture", "description", "sections", "tips", "attractions", "faqs"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_country_data" } }
      }),
    });

    console.log('AI Gateway response status:', response.status);

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    console.log('AI Gateway response received');
    
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      console.error("No tool call in response:", JSON.stringify(data));
      throw new Error("No tool call in response");
    }

    const countryData = JSON.parse(toolCall.function.arguments);
    console.log('Country data generated successfully');

    return new Response(JSON.stringify({ success: true, data: countryData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating country data:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
