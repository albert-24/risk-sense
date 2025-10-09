import { createSlice } from "@reduxjs/toolkit";
import { fetchChatbotResponse } from "../thunks/chatThunks";
import type { GeoJSON, GeoJsonProperties, Geometry } from "geojson";
import { generateRandomID } from "@/lib/utils";

export interface GeoJsonDataSource {
  id: string;
  layerName: string;
  sourceData: string | GeoJSON<Geometry, GeoJsonProperties> | undefined;
  visibleToMap: boolean;
}

interface MapState {
  geoJsonDataSources: GeoJsonDataSource[];
}

const initialState: MapState = {
  geoJsonDataSources: [],
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    toggleLayerVisibility: (state, action) => {
      const layer = state.geoJsonDataSources.find(
        (source) => source.id === action.payload.id
      );
      if (layer) {
        layer.visibleToMap = !layer.visibleToMap;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChatbotResponse.fulfilled, (state, action) => {
      const {aiResponse} = action.payload;

      if (aiResponse.status == "fulfilled" && aiResponse.value.geoJson) {
        // const sourceId = crypto.randomUUID();
        const sourceId = generateRandomID();

        state.geoJsonDataSources = [
          ...state.geoJsonDataSources,
          {
            id: sourceId,
            layerName: aiResponse.value.layerName ?? `layer-${sourceId}`,
            sourceData: aiResponse.value.geoJson,
            visibleToMap: true,
          },
        ];
      }
    });
  },
});

export const mapActions = mapSlice.actions;

export default mapSlice.reducer;
