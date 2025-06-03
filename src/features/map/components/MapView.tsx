import Map, { Layer, Popup, Source, useMap } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";
import type { Feature } from "geojson";
import type { MapMouseEvent } from "react-map-gl/mapbox";
import { useMapLayer } from "../hooks/useMapLayer";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
export default function MapView() {
  const { map } = useMap();

  const { geoJsonData } = useMapLayer();

  const [viewport, setViewport] = useState({
    latitude: 13.5,
    longitude: 122,
    zoom: 4.5,
  });

  const [hoverInfo, setHoverInfo] = useState<{
    longitude: number;
    latitude: number;
    feature: Feature;
  } | null>(null);

  const onMouseEnter = (event: MapMouseEvent) => {
    const feature = event.features?.[0] as Feature;
    if (feature) {
      // Get coordinates based on geometry type
      const coordinates =
        feature.geometry.type === "Point"
          ? feature.geometry.coordinates
          : [event.lngLat.lng, event.lngLat.lat];

      setHoverInfo({
        longitude: coordinates[0],
        latitude: coordinates[1],
        feature: feature,
      });
    }
  };

  const onMouseLeave = () => {
    setHoverInfo(null);
  };

  return (
    <Map
      {...viewport}
      mapboxAccessToken={MAPBOX_TOKEN}
      onMove={(evt) => setViewport(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/light-v11"
      interactiveLayerIds={["point", "polygon-fill", "line"]}
      style={{ width: "100vw", height: "100vh" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Raster Layer Example */}
      {/* <Source
          id="radar-raster"
          type="raster"
          tiles={[
            // Replace with your raster tile URL
            "https://your-raster-tiles-url/{z}/{x}/{y}.png",
          ]}
          tileSize={256}
        >
          <Layer
            id="radar-layer"
            type="raster"
            paint={{
              "raster-opacity": 0.7,
              "raster-fade-duration": 0,
            }}
          />
        </Source> */}

      {hoverInfo && (
        <Popup
          longitude={hoverInfo.longitude}
          latitude={hoverInfo.latitude}
          anchor="top"
          closeButton={false}
        >
          <div className="p-2 text-sm">
            <div className="font-bold mb-1">
              {hoverInfo.feature.geometry.type}
            </div>
            {Object.entries(hoverInfo.feature.properties ?? {}).map(
              ([key, value]) => (
                <div key={key} className="grid grid-cols-2 gap-2">
                  <span className="font-medium">{key}:</span>
                  <span>{String(value)}</span>
                </div>
              )
            )}
          </div>
        </Popup>
      )}

      {geoJsonData && (
        <Source type="geojson" data={geoJsonData}>
          {/* Polygon and MultiPolygon */}
          <Layer
            id="polygon-fill"
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
            id="polygon-outline"
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

          {/* LineString and MultiLineString */}
          <Layer
            id="line"
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

          {/* Point and MultiPoint */}
          <Layer
            id="point"
            type="circle"
            paint={{
              "circle-radius": 6,
              "circle-color": "#059669",
              "circle-stroke-width": 2,
              "circle-stroke-color": "#ffffff",
            }}
            filter={[
              "any",
              ["==", ["geometry-type"], "Point"],
              ["==", ["geometry-type"], "MultiPoint"],
            ]}
          />
        </Source>
      )}
    </Map>
  );
}
