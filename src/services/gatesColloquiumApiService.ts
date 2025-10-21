import axios from "axios";

export const gatesApiAxios = axios.create({
  baseURL: 'http://172.16.0.237:8006',
  timeout: 120000,
});

export type GatesColloquiumAIResponse = {
    summary: string,
    response_id: string | null,
    rows: {
        project_title: string,
        description: string | null,
        type_of_agency: string | null,
        agency: string | null,
        status: string,
        region: string,
        province: string,
        municipality: string,
        latitude: number,
        longitude: number,
        amount: number,
        currency: string
    }[]
}

export async function generateResponse(
  message: string
): Promise<{ text: string; geoJson: GeoJSON.FeatureCollection | undefined; layerName: string | undefined }> {
  try {
    const response = await gatesApiAxios.post<GatesColloquiumAIResponse>('/chat/', {
        user_query: message,
    });

    console.log("GATES Platform response:", response.data);
    
    return {
      text: response.data.summary,
      geoJson: {
        type: "FeatureCollection",
        features: response.data.rows.map((row, index) => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [row.longitude, row.latitude] },
            properties: {
                // id: index,
                ...Object.fromEntries(
                    Object.entries(row).filter(([key]) => !key.includes("_id"))
                )
            }
        }))
      },
      layerName: message
    };
  } catch (error) {
    console.error("Error in generateResponse (gatesColloquiumApiService):", error);
    throw error;
  }
}
