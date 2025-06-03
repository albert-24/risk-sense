import { useContext } from "react";
import { MapLayerContext } from "../contexts/MapLayerContext";

export const useMapLayer = () => {
  const context = useContext(MapLayerContext);
  if (context === undefined) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
};
