import React, { createContext, useState } from "react";
import type { MapLayerContextType } from "../../../types";

const MapLayerContext = createContext<MapLayerContextType | undefined>(
  undefined
);

export function MapLayerProvider({ children }: { children: React.ReactNode }) {
  const [geoJsonData, setGeoJsonData] =
    useState<GeoJSON.FeatureCollection | null>(null);

  return (
    <MapLayerContext.Provider value={{ geoJsonData, setGeoJsonData }}>
      {children}
    </MapLayerContext.Provider>
  );
}

export { MapLayerContext };
