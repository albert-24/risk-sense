import axios from "axios";

const gatesApiAxios = axios.create({
  baseURL: 'http://172.16.0.237:8181',
  timeout: 10000,
});

export type GatesAIResponse = {
    status: String,
    response: {
      id: String,
      parsed: {
        parsed_text: String,
        parsed_block: {
          json: []
        }
      }
    }
}

export async function generateResponse(
  message: string
): Promise<{ text: string; geoJson: GeoJSON.FeatureCollection | undefined; layerName: string | undefined }> {
  try {
    const response = await gatesApiAxios.post<GatesAIResponse>('/mcp/connect/', {
        query: message,
        request: "GIS WebApp"
    });
    console.log("GATES AI response:", response.data);
    
    return {
      text: response.data.response.parsed.parsed_text as string,
      geoJson: {
        type: "FeatureCollection",
        features: response.data.response.parsed.parsed_block.json as GeoJSON.Feature[]
      },
      layerName: response.data.response.id.toString()
    };
  } catch (error) {
    console.error("Error in generateResponse (gatesApiService):", error);
    throw error;
  }
}
