import { createSlice } from "@reduxjs/toolkit";
import { fetchChatbotResponse } from "../thunks/chatThunks";
import type { GeoJSON, GeoJsonProperties, Geometry } from "geojson";

interface GeoJsonDataSource {
  id: string;
  sourceData: string | GeoJSON<Geometry, GeoJsonProperties> | undefined;
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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchChatbotResponse.fulfilled, (state, action) => {
      if (action.payload.geoJson) {
        state.geoJsonDataSources = [
          ...state.geoJsonDataSources,
          {
            id: crypto.randomUUID(),
            sourceData: action.payload.geoJson,
          },
        ];
      }
    });
  },
});

// export const { } = mapSlice.actions;

export default mapSlice.reducer;
