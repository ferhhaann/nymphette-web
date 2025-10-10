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
    const userPrompt = `Generate comprehensive data for ${countryName} in the ${region} region. Return a JSON object with the following structure:

{
  "name": "Country name",
  "slug": "country-slug",
  "capital": "Capital city",
  "currency": "Currency name and code",
  "climate": "Brief climate description",
  "best_season": "Best time to visit",
  "languages": ["Language 1", "Language 2"],
  "speciality": "What the country is famous for",
  "culture": "Brief cultural overview (2-3 sentences)",
  "hero_image": "/path/to/hero/image.jpg",
  "fallback_image": "https://source.unsplash.com/1920x1080/?${countryName.toLowerCase()},landscape",
  "sections": [
    {
      "title": "Section title",
      "content": "Detailed content (2-3 paragraphs)"
    }
  ],
  "tips": [
    {
      "category": "visa" | "health" | "connectivity" | "transport" | "safety" | "currency",
      "title": "Tip title",
      "description": "Tip description"
    }
  ],
  "attractions": [
    {
      "name": "Attraction name",
      "description": "Attraction description",
      "location": "City/region",
      "image": "https://source.unsplash.com/800x600/?attraction-name"
    }
  ],
  "faqs": [
    {
      "question": "Common question",
      "answer": "Detailed answer"
    }
  ]
}

Include:
- 3-4 content sections (About, Best Time to Visit, Culture & Traditions, Travel Tips)
- 6-8 essential tips across different categories
- 5-6 top attractions with descriptions
- 5-6 FAQs covering common traveler questions

Make the content engaging, informative, and SEO-friendly.`;

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
                  capital: { type: "string" },
                  currency: { type: "string" },
                  climate: { type: "string" },
                  best_season: { type: "string" },
                  languages: { type: "array", items: { type: "string" } },
                  speciality: { type: "string" },
                  culture: { type: "string" },
                  hero_image: { type: "string" },
                  fallback_image: { type: "string" },
                  sections: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        content: { type: "string" }
                      },
                      required: ["title", "content"]
                    }
                  },
                  tips: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        category: { type: "string", enum: ["visa", "health", "connectivity", "transport", "safety", "currency"] },
                        title: { type: "string" },
                        description: { type: "string" }
                      },
                      required: ["category", "title", "description"]
                    }
                  },
                  attractions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        description: { type: "string" },
                        location: { type: "string" },
                        image: { type: "string" }
                      },
                      required: ["name", "description", "location", "image"]
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
                required: ["name", "slug", "capital", "currency", "climate", "best_season", "languages", "speciality", "culture", "sections", "tips", "attractions", "faqs"]
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
