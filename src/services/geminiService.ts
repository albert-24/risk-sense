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
Provide a realistic vector data for the specificed location. Do not just create a generic square-like shape for polygons, or a generic straight line for lines.

Also, most of the prompts will focus on sugarcane data and typhoons because you will answer the impact assessment of sugarcane loss based on the forecasted typhoon, and provide actionable insights such as affected areas estimated lost in PHP, and total sugarcane metric tons loss to be used as the amount of import to compensate the loss.
\`\`\`
`;

export async function generateResponse(
  prompt: string
): Promise<{ text: string; geoJson: GeoJSON.FeatureCollection | undefined; layerName: string | undefined }> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
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
