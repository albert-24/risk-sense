import Map, {
  // GeolocateControl,
  Layer,
  NavigationControl,
  Popup,
  ScaleControl,
  Source,
} from "react-map-gl/mapbox";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import type { Feature, FeatureCollection } from "geojson";
import type { MapMouseEvent, MapRef } from "react-map-gl/mapbox";
import { useAppSelector } from "../../../redux/hooks";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const MAPBOX_STYLE_URL = import.meta.env.VITE_MAPBOX_STYLE_URL;

export default function MapView() {
  const geoJsonDataSources = useAppSelector(
    (state) => state.map.geoJsonDataSources
  );

  const [viewport, setViewport] = useState({
    latitude: 13.5,
    longitude: 118,
    zoom: 5,
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

  const mapRef = useRef<MapRef | null>(null);

  // Zoom to newly added layer
  useEffect(() => {
    if (!mapRef.current || geoJsonDataSources.length === 0) return;

    // Find the most recently added layer
    const latestLayer = geoJsonDataSources[geoJsonDataSources.length - 1];
    if (!latestLayer?.sourceData) return;

    // Calculate bounds from GeoJSON
    const geoJsonFeatures = latestLayer.sourceData as FeatureCollection;

    const coordinates: number[][] = [];
    geoJsonFeatures.features?.forEach((feature: Feature) => {
      if (feature.geometry.type === "Point") {
        coordinates.push(feature.geometry.coordinates);
      } else if (feature.geometry.type === "Polygon") {
        feature.geometry.coordinates.forEach((ring: number[][]) => {
          ring.forEach((coord) => coordinates.push(coord));
        });
      } else if (feature.geometry.type === "LineString") {
        feature.geometry.coordinates.forEach((coord: number[]) =>
          coordinates.push(coord)
        );
      }
    });

    if (coordinates.length > 0) {
      const bounds = coordinates.reduce(
        (b, coord) => b.extend(coord as [number, number]),
        new mapboxgl.LngLatBounds(
          coordinates[0] as [number, number],
          coordinates[0] as [number, number]
        )
      );
      mapRef.current.fitBounds(bounds, {
        padding: { top: 96, bottom: 96, left: 96 + 16 + 384 + 16, right: 96 },
        duration: 800,
      });
    }
  }, [geoJsonDataSources.length]);

  const interactiveLayerIds = geoJsonDataSources
    .filter((source) => source.visibleToMap)
    .flatMap((source) => [
      `polygon-fill-${source.id}`,
      `polygon-outline-${source.id}`,
      `line-${source.id}`,
      `point-${source.id}`,
    ]);

  return (
    <Map
      {...viewport}
      ref={mapRef}
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle={MAPBOX_STYLE_URL}
      minZoom={4}
      maxZoom={18}
      projection={"mercator"}
      onMove={(evt) => setViewport(evt.viewState)}
      interactiveLayerIds={interactiveLayerIds}
      style={{ width: "100vw", height: "100vh" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      logoPosition="bottom-right"
    >
      <NavigationControl position="top-right" />
      {/* <GeolocateControl position="top-right" /> */}
      <ScaleControl position="bottom-right" />
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
                <div
                  key={key}
                  className="grid grid-cols-2 gap-2 wrap-break-word"
                >
                  <span className="font-medium">{key}:</span>
                  <span>{String(value)}</span>
                </div>
              )
            )}
          </div>
        </Popup>
      )}

      <>
        {geoJsonDataSources
          .filter((source) => source.visibleToMap)
          .map(
            (dataSource) =>
              dataSource && (
                <Source
                  key={dataSource.id}
                  type="geojson"
                  data={dataSource.sourceData}
                >
                  {/* Polygon and MultiPolygon */}
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

                  {/* LineString and MultiLineString */}
                  <Layer
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

                  {/* Point and MultiPoint */}
                  <Layer
                    id={`point-${dataSource.id}`}
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
              )
          )}
      </>
    </Map>
  );
}
