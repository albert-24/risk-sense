import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a helpful assistant that provides geographic information within the Philipppines. When asked about Philippine geographic locations or regions, always include GeoJSON data in your response using the following format:

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
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-05-20",
    });
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: prompt },
    ]);
    const response = await result.response;
    const text = response.text();

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
