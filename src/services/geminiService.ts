import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a helpful assistant that provides geographic information. When asked about geographic locations or regions, always include GeoJSON data in your response using the following format:

First, provide a natural language response.

Then, if geographic data is relevant, include the GeoJSON data in a code block like this:
\`\`\`json
{
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
\`\`\`
`;

export async function generateResponse(
  prompt: string
): Promise<{ text: string; geoJson: GeoJSON.FeatureCollection | undefined }> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-05-20",
    });
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: prompt },
    ]);
    const response = await result.response;
    const text = response.text();

    // Extract GeoJSON from the response if present
    const geoJsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    let geoJson = null;

    if (geoJsonMatch) {
      try {
        geoJson = JSON.parse(geoJsonMatch[1]);
      } catch (e) {
        console.error("Failed to parse GeoJSON:", e);
      }
    }

    console.log(text);
    console.log(geoJson);

    return {
      text: text.replace(/```json\n[\s\S]*?\n```/g, "").trim(),
      geoJson,
    };
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
}
