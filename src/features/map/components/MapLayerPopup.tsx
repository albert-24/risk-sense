import { Popup } from "react-map-gl/mapbox";

export type MapLayerPopupData = {
  longitude: number;
  latitude: number;
  feature: any;
};

export const MapLayerPopup = ({
  popupData,
}: {
  popupData: MapLayerPopupData;
}) => {
  return (
    <Popup
      longitude={popupData.longitude}
      latitude={popupData.latitude}
      anchor="top"
      closeButton={false}
    >
      <div className="p-2 text-sm">
        <div className="font-bold mb-1">{popupData.feature.geometry.type}</div>
        {Object.entries(popupData.feature.properties ?? {}).map(
          ([key, value]) => (
            <div key={key} className="grid grid-cols-2 gap-2 wrap-break-word">
              <span className="font-medium">{key}:</span>
              <span>{String(value)}</span>
            </div>
          )
        )}
      </div>
    </Popup>
  );
};
