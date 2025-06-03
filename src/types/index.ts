export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  geoJson?: GeoJSON.FeatureCollection;
}

export interface ChatContextType {
  messages: Message[];
  addMessage: (
    content: string,
    role: Message["role"],
    geoJson?: GeoJSON.FeatureCollection
  ) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export interface MapLayerContextType {
  geoJsonData: GeoJSON.FeatureCollection | null;
  setGeoJsonData: (data: GeoJSON.FeatureCollection | null) => void;
}
