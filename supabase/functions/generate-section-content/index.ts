import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    console.log('Edge function called - generate-section-content');
    const { sectionType, sectionTitle, fieldType, context } = await req.json();
    console.log('Request data:', { sectionType, sectionTitle, fieldType });
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a travel content expert that generates engaging, informative content for country travel sections. Generate natural, SEO-friendly content that appeals to travelers.`;

    let userPrompt = '';
    
    if (fieldType === 'description') {
      userPrompt = `Generate a compelling main description (2-3 paragraphs) for the "${sectionTitle}" section of a country travel guide. 
      
Make it informative, engaging, and helpful for travelers. Include practical information where relevant.

Return ONLY the description text, no JSON or additional formatting.`;
    } else if (fieldType === 'subtitle') {
      userPrompt = `Generate a short, catchy subtitle (1 sentence) for the "${sectionTitle}" section of a country travel guide.

Context: ${context.description || 'No description yet'}

Return ONLY the subtitle text, no JSON or additional formatting.`;
    } else if (fieldType === 'highlight') {
      userPrompt = `Generate a short highlight or callout text (1-2 sentences) for the "${sectionTitle}" section that emphasizes the most important takeaway.

Context: ${context.description || 'No description yet'}

Return ONLY the highlight text, no JSON or additional formatting.`;
    } else if (fieldType === 'points') {
      userPrompt = `Generate 5-7 key points or bullet items for the "${sectionTitle}" section of a country travel guide.

Context: ${context.description || 'No description yet'}

Return a JSON array of strings, each string being one key point. Format: ["Point 1", "Point 2", ...]`;
    }

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
    
    let generatedContent = data.choices?.[0]?.message?.content || '';
    
    // For points, try to parse as JSON array
    if (fieldType === 'points') {
      try {
        // Try to extract JSON array from the response
        const jsonMatch = generatedContent.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsedPoints = JSON.parse(jsonMatch[0]);
          generatedContent = parsedPoints;
        } else {
          // Fallback: split by newlines and clean up
          generatedContent = generatedContent
            .split('\n')
            .filter(line => line.trim())
            .map(line => line.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim())
            .filter(line => line.length > 0);
        }
      } catch (e) {
        console.error('Error parsing points:', e);
        // Fallback to simple split
        generatedContent = generatedContent
          .split('\n')
          .filter(line => line.trim())
          .map(line => line.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim())
          .filter(line => line.length > 0);
      }
    }
    
    console.log('Content generated successfully');

    return new Response(JSON.stringify({ success: true, content: generatedContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating section content:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
