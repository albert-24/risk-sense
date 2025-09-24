import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = `You are a helpful assistant that provides geographic information within the Philippines. When asked about Philippine geographic locations or regions, always include GeoJSON data in your response using the following format:

First, provide a natural language response.

Then, if Philippine geographic data is relevant, include the GeoJSON data in a code block like this:
\`\`\`json
{
    "layerName": "Descriptive Layer Name",
    "geojson": {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[...]]
                },
                "properties": {}
            }
        ]
    }
}
Do not include any comments inside the GeoJson.
\`\`\`
`;

export async function generateResponse(
    prompt: string
): Promise<{ text: string; geoJson: GeoJSON.FeatureCollection | undefined; layerName: string | undefined }> {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
        });

        const text = completion.choices[0]?.message?.content ?? "";

        // Extract GeoJSON and layerName from the response if present
        const geoJsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        let geoJson: GeoJSON.FeatureCollection | undefined = undefined;
        let layerName: string | undefined = undefined;

        if (geoJsonMatch) {
            try {
                const parsed = JSON.parse(geoJsonMatch[1]);
                geoJson = parsed.geojson;
                layerName = parsed.layerName;
            } catch (e) {
                console.error("Failed to parse GeoJSON:", e);
            }
        }

        return {
            text: text.replace(/```json\n[\s\S]*?\n```/g, "").trim(),
            geoJson,
            layerName,
        };
    } catch (error) {
        console.error("Error generating response:", error);
        throw error;
    }
}
