import { LayersIcon } from "lucide-react";
import React from "react";

type MapLayerButtonProps = {
  active?: boolean;
  onClick?: () => void;
};

const MapLayerButton: React.FC<MapLayerButtonProps> = ({
  active = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "8px 16px",
        borderRadius: "4px",
        border: active ? "2px solid #0078D4" : "1px solid #ccc",
        background: active ? "#E6F0FA" : "#fff",
        color: active ? "#0078D4" : "#333",
        cursor: "pointer",
        fontWeight: active ? "bold" : "normal",
        transition: "all 0.2s",
      }}
      aria-pressed={active}
    >
      <LayersIcon />
    </button>
  );
};

export default MapLayerButton;
