import Map, {
  // GeolocateControl,
  NavigationControl,
  ScaleControl,
} from "react-map-gl/mapbox";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import type { Feature, FeatureCollection } from "geojson";
import type { MapMouseEvent, MapRef } from "react-map-gl/mapbox";
import { useAppSelector } from "../../../redux/hooks";
import { MapLayers } from "./MapLayers";
import { MapLayerPopup, type MapLayerPopupData } from "./MapLayerPopup";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const MAPBOX_STYLE_URL = import.meta.env.VITE_MAPBOX_STYLE_URL;

export default function MapView() {
  const mapRef = useRef<MapRef | null>(null);

  const geoJsonDataSources = useAppSelector(
    (state) => state.map.geoJsonDataSources
  );

  const interactiveLayerIds = geoJsonDataSources
    .filter((source) => source.visibleToMap)
    .flatMap((source) => [
      `polygon-fill-${source.id}`,
      `polygon-outline-${source.id}`,
      `line-${source.id}`,
      `point-${source.id}`,
    ]);

  const [viewport, setViewport] = useState({
    latitude: 13.5,
    longitude: 118,
    zoom: 5,
  });

  const [popupData, setPopupData] = useState<MapLayerPopupData | null>(null);

  const onMouseEnter = (event: MapMouseEvent) => {
    const feature = event.features?.[0] as Feature;

    if (feature) {
      // Get coordinates based on geometry type
      const coordinates =
        feature.geometry.type === "Point"
          ? feature.geometry.coordinates
          : [event.lngLat.lng, event.lngLat.lat];

      setPopupData({
        longitude: coordinates[0],
        latitude: coordinates[1],
        feature: feature,
      });
    }
  };

  const onMouseLeave = () => {
    setPopupData(null);
  };

  const zoomToLayer = (
    currentMapRef: MapRef,
    geoJsonFeatures: FeatureCollection
  ) => {
    const coordinates: number[][] = [];

    // Calculate bounds from GeoJSON
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

      currentMapRef.fitBounds(bounds, {
        padding: { top: 96, bottom: 96, left: 96 + 16 + 384 + 16, right: 96 },
        duration: 800,
      });
    }
  };

  useEffect(() => {
    if (!mapRef.current || geoJsonDataSources.length === 0) return;

    // Find the most recently added layer
    const latestLayer = geoJsonDataSources[geoJsonDataSources.length - 1];
    if (!latestLayer?.sourceData) return;

    const geoJsonFeatures = latestLayer.sourceData as FeatureCollection;

    // Zoom to the most recently added layer
    zoomToLayer(mapRef.current, geoJsonFeatures);
  }, [geoJsonDataSources.length]);

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

      {popupData && <MapLayerPopup popupData={popupData} />}
      <MapLayers />
    </Map>
  );
}
