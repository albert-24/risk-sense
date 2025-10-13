import { Popup } from "react-map-gl/mapbox";
import { titleCase } from "text-case";

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
  const popupHeader = get_popup_header(popupData.feature.properties);
  const popupProperties = Object.fromEntries(
    Object.entries(popupData.feature.properties ?? {}).filter(([key]) =>
      popupHeader
        ? ![popupHeader.key, "latitude", "longitude"].includes(key)
        : true
    )
  );

  return (
    <Popup
      longitude={popupData.longitude}
      latitude={popupData.latitude}
      anchor="top"
      closeButton={false}
      style={{ maxWidth: "480px" }}
    >
      <div className="p-3 rounded-lg text-sm bg-white/70 backdrop-blur-md">
        {popupHeader && (
          <div className="font-bold mb-1">{popupHeader.value}</div>
        )}

        <table className="table-auto">
          {Object.entries(popupProperties ?? {}).map(([key, value]) => (
            // <div key={key} className="grid grid-cols-2 gap-2 wrap-break-word">
            //   <span className="font-medium">{titleCase(key, {})}:</span>
            //   <span>{String(value)}</span>
            // </div>
            <tbody key={key}>
              <tr>
                <td className="font-medium pr-2 align-top">
                  {titleCase(key, {})}:
                </td>
                <td className="break-words">
                  {typeof value === "number"
                    ? new Intl.NumberFormat().format(value)
                    : String(value)}
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </Popup>
  );
};

function get_popup_header(
  featureProperties: any
): { key: string; value: string } | null {
  if (featureProperties["project_title"]) {
    return { key: "project_title", value: featureProperties["project_title"] };
  } else if (featureProperties["title"]) {
    return { key: "title", value: featureProperties["title"] };
  } else if (featureProperties["name"]) {
    return { key: "name", value: featureProperties["name"] };
  }

  return null;
}
