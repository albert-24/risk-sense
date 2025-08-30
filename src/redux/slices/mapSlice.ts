import { createSlice } from "@reduxjs/toolkit";
import { fetchChatbotResponse } from "../thunks/chatThunks";
import type { GeoJSON, GeoJsonProperties, Geometry } from "geojson";

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

      if (aiResponse.geoJson) {
        const sourceId = crypto.randomUUID();
        state.geoJsonDataSources = [
          ...state.geoJsonDataSources,
          {
            id: sourceId,
            layerName: aiResponse.layerName ?? `layer-${sourceId}`,
            sourceData: aiResponse.geoJson,
            visibleToMap: true,
          },
        ];
      }
    });
  },
});

// export const { } = mapSlice.actions;

export default mapSlice.reducer;
