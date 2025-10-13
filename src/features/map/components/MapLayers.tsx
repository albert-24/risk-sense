import { useAppSelector } from "@/redux/hooks";
import { Layer, Source } from "react-map-gl/mapbox";

export const MapLayers = () => {
  const geoJsonDataSources = useAppSelector(
    (state) => state.map.geoJsonDataSources
  );

  return (
    <>
      {/* Raster Layer */}
      {/* <Source
        id="mapbox-raster"
        type="image"
        url="https://docs.mapbox.com/mapbox-gl-js/assets/radar.gif"
        coordinates={[
          [-80.425, 46.437],
          [-71.516, 46.437],
          [-71.516, 37.936],
          [-80.425, 37.936],
        ]}
      >
        <Layer
          id="mapbox-raster-layer"
          type="raster"
          paint={{
            "raster-fade-duration": 0,
            "raster-emissive-strength": 1,
          }}
        />
      </Source> */}

      {/* Vector Layer */}
      {geoJsonDataSources
        .filter((source) => source.visibleToMap)
        .map(
          (dataSource) =>
            dataSource && (
              <Source
                key={dataSource.id}
                type="geojson"
                cluster={true}
                clusterMinPoints={2}
                clusterRadius={8}
                clusterMaxZoom={15}
                data={dataSource.sourceData}
              >
                {/* <AreaDataLayer dataSource={dataSource} /> */}
                <Layer
                  id={`polygon-fill-${dataSource.id}`}
                  type="fill"
                  paint={{
                    "fill-color": "#3B82F6",
                    "fill-opacity": 0.5,
                  }}
                  filter={[
                    "any",
                    ["==", ["geometry-type"], "Polygon"],
                    ["==", ["geometry-type"], "MultiPolygon"],
                  ]}
                />
                <Layer
                  id={`polygon-outline-${dataSource.id}`}
                  type="line"
                  paint={{
                    "line-color": "#2563EB",
                    "line-width": 2,
                  }}
                  filter={[
                    "any",
                    ["==", ["geometry-type"], "Polygon"],
                    ["==", ["geometry-type"], "MultiPolygon"],
                  ]}
                />

                {/* <LineDataLayer dataSource={dataSource} /> */}
                <Layer
                  source={dataSource.id}
                  id={`line-${dataSource.id}`}
                  type="line"
                  paint={{
                    "line-color": "#DC2626",
                    "line-width": 3,
                  }}
                  filter={[
                    "any",
                    ["==", ["geometry-type"], "LineString"],
                    ["==", ["geometry-type"], "MultiLineString"],
                  ]}
                />

                {/* <PointDataLayer dataSource={dataSource} /> */}
                <Layer
                  id={`point-cluster-${dataSource.id}`}
                  type="circle"
                  paint={{
                    "circle-radius": 16,
                    "circle-color": "#056696",
                    "circle-stroke-width": 2,
                    "circle-stroke-color": "#ffffff",
                  }}
                  filter={["==", "cluster", true]}
                />
                <Layer
                  id={`point-cluster-symbol-${dataSource.id}`}
                  type="symbol"
                  layout={{
                    "text-field": ["get", "point_count_abbreviated"],
                    "text-font": [
                      "Open Sans Semibold",
                      "Arial Unicode MS Bold",
                    ],
                    "text-size": 14,
                  }}
                  paint={{
                    "text-color": "#ffffff",
                  }}
                  filter={["==", "cluster", true]}
                />

                <Layer
                  source={dataSource.id}
                  id={`point-${dataSource.id}`}
                  type="circle"
                  paint={{
                    "circle-radius": 6,
                    "circle-color": "#059669",
                    "circle-stroke-width": 2,
                    "circle-stroke-color": "#ffffff",
                  }}
                  filter={[
                    "all",
                    ["!=", "cluster", true],
                    // [
                    //   "any",
                    //   ["==", ["geometry-type"], "Point"],
                    //   ["==", ["geometry-type"], "MultiPoint"],
                    // ],
                  ]}
                />
              </Source>
            )
        )}
    </>
  );
};

// function AreaDataLayer({ dataSource }: { dataSource: GeoJsonDataSource }) {
//   return (
//     <>
//       <Layer
//         source={dataSource.id}
//         id={`polygon-fill-${dataSource.id}`}
//         type="fill"
//         paint={{
//           "fill-color": "#3B82F6",
//           "fill-opacity": 0.5,
//         }}
//         filter={[
//           "any",
//           ["==", ["geometry-type"], "Polygon"],
//           ["==", ["geometry-type"], "MultiPolygon"],
//         ]}
//       />
//       <Layer
//         source={dataSource.id}
//         id={`polygon-outline-${dataSource.id}`}
//         type="line"
//         paint={{
//           "line-color": "#2563EB",
//           "line-width": 2,
//         }}
//         filter={[
//           "any",
//           ["==", ["geometry-type"], "Polygon"],
//           ["==", ["geometry-type"], "MultiPolygon"],
//         ]}
//       />
//     </>
//   );
// }

// function LineDataLayer({ dataSource }: { dataSource: GeoJsonDataSource }) {
//   return (
//     <Layer
//       source={dataSource.id}
//       id={`line-${dataSource.id}`}
//       type="line"
//       paint={{
//         "line-color": "#DC2626",
//         "line-width": 3,
//       }}
//       filter={[
//         "any",
//         ["==", ["geometry-type"], "LineString"],
//         ["==", ["geometry-type"], "MultiLineString"],
//       ]}
//     />
//   );
// }

// function PointDataLayer({ dataSource }: { dataSource: GeoJsonDataSource }) {
//   return (
//     <Layer
//       source={dataSource.id}
//       id={`point-${dataSource.id}`}
//       type="circle"
//       paint={{
//         "circle-radius": 6,
//         "circle-color": "#059669",
//         "circle-stroke-width": 2,
//         "circle-stroke-color": "#ffffff",
//       }}
//       filter={[
//         "any",
//         ["==", ["geometry-type"], "Point"],
//         ["==", ["geometry-type"], "MultiPoint"],
//       ]}
//     />
//   );
// }
