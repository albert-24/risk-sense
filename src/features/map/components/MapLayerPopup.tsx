import { Popup } from "react-map-gl/mapbox";
import { titleCase } from "text-case";

export type MapLayerPopupData = {
  longitude: number;
  latitude: number;
  feature: any;
};

type PopupHeaderProps = { key: string; value: string } | null;

export const MapLayerPopup = ({
  popupData,
}: {
  popupData: MapLayerPopupData;
}) => {
  const popupHeader = getPopupHeader(popupData.feature.properties);
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
        {"cluster" in popupProperties && popupProperties["cluster"] === true ? (
          <span>
            <b>
              {new Intl.NumberFormat().format(
                (popupProperties["point_count"] as number) ?? 0
              )}
            </b>{" "}
            in this location
          </span>
        ) : (
          <DefaultPopupContent
            popupHeader={popupHeader}
            popupProperties={popupProperties}
          />
        )}
      </div>
    </Popup>
  );
};

type DefaultPopupContentProps = {
  popupHeader: PopupHeaderProps;
  popupProperties: Record<string, any>;
};

const DefaultPopupContent = ({
  popupHeader,
  popupProperties,
}: DefaultPopupContentProps) => (
  <>
    {popupHeader && <div className="font-bold mb-1">{popupHeader.value}</div>}

    <table className="table-auto">
      {Object.entries(popupProperties ?? {}).map(([key, value]) => (
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
  </>
);

function getPopupHeader(featureProperties: any): PopupHeaderProps | null {
  if (featureProperties["project_title"]) {
    return { key: "project_title", value: featureProperties["project_title"] };
  } else if (featureProperties["title"]) {
    return { key: "title", value: featureProperties["title"] };
  } else if (featureProperties["name"]) {
    return { key: "name", value: featureProperties["name"] };
  }

  return null;
}
