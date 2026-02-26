import { MapContainer, TileLayer, ZoomControl, ScaleControl, useMapEvents } from "react-leaflet";
import type { Map as LeafletMap, LeafletMouseEvent } from "leaflet";
import { useCallback, useRef, useImperativeHandle, forwardRef } from "react";
import type { BasemapId } from "./LayerControl";

const BRAZIL_CENTER: [number, number] = [-15.78, -47.93];
const DEFAULT_ZOOM = 5;

type TileConfig = {
  url: string;
  attribution: string;
  maxZoom: number;
  subdomains?: string;
};

const BASEMAP_TILES: Record<BasemapId, TileConfig> = {
  streets: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Earthstar Geographics',
    maxZoom: 18,
  },
  terrain: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    maxZoom: 17,
  },
  hybrid: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    maxZoom: 18,
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 20,
    subdomains: "abcd",
  },
};

const HYBRID_LABELS_URL = "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}";

type Props = {
  basemap: BasemapId;
  onMapClick?: (lat: number, lng: number) => void;
  onMouseMove?: (lat: number, lng: number) => void;
  children?: React.ReactNode;
};

export type MapCanvasRef = {
  map: LeafletMap | null;
};

function EventHandler({ onMapClick, onMouseMove }: Pick<Props, "onMapClick" | "onMouseMove">) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onMapClick?.(e.latlng.lat, e.latlng.lng);
    },
    mousemove(e: LeafletMouseEvent) {
      onMouseMove?.(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export const MapCanvas = forwardRef<MapCanvasRef, Props>(function MapCanvas(
  { basemap, onMapClick, onMouseMove, children },
  ref,
) {
  const mapRef = useRef<LeafletMap | null>(null);

  useImperativeHandle(ref, () => ({ map: mapRef.current }), []);

  const handleRef = useCallback((map: LeafletMap | null) => {
    mapRef.current = map;
  }, []);

  const tile = BASEMAP_TILES[basemap];
  const isDark = basemap === "dark";

  return (
    <MapContainer
      ref={handleRef}
      center={BRAZIL_CENTER}
      zoom={DEFAULT_ZOOM}
      zoomControl={false}
      className="h-full w-full"
      style={{ background: isDark ? "#0f172a" : "#f8fafc" }}
    >
      <TileLayer
        key={basemap}
        url={tile.url}
        attribution={tile.attribution}
        maxZoom={tile.maxZoom}
        {...(tile.subdomains ? { subdomains: tile.subdomains } : {})}
      />
      {basemap === "hybrid" && (
        <TileLayer
          key="hybrid-labels"
          url={HYBRID_LABELS_URL}
          maxZoom={18}
          opacity={1}
        />
      )}
      <ZoomControl position="bottomright" />
      <ScaleControl position="bottomleft" metric imperial={false} />
      <EventHandler onMapClick={onMapClick} onMouseMove={onMouseMove} />
      {children}
    </MapContainer>
  );
});
