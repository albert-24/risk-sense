import axios from "axios";

export const gatesApiAxios = axios.create({
  baseURL: 'http://172.16.0.237:8181',
  timeout: 60000,
});

export type GatesAIResponse = {
    status: string,
    response: {
      id: string,
      parsed: {
        parsed_text: string,
        parsed_blocks: {
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

    console.log("GATES Platform response:", response.data);
    
    return {
      text: response.data.response.parsed.parsed_text as string,
      geoJson: {
        type: "FeatureCollection",
        features: response.data.response.parsed.parsed_blocks.json as GeoJSON.Feature[]
      },
      layerName: response.data.response.id
    };
  } catch (error) {
    console.error("Error in generateResponse (gatesApiService):", error);
    throw error;
  }
}
