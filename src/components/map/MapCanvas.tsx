import { MapContainer, TileLayer, ZoomControl, ScaleControl, useMapEvents } from "react-leaflet";
import type { Map as LeafletMap, LeafletMouseEvent } from "leaflet";
import { useCallback, useRef, useImperativeHandle, forwardRef } from "react";

const BRAZIL_CENTER: [number, number] = [-15.78, -47.93];
const DEFAULT_ZOOM = 5;

const LIGHT_TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const DARK_TILES = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

type Props = {
  theme: "light" | "dark";
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
  { theme, onMapClick, onMouseMove, children },
  ref,
) {
  const mapRef = useRef<LeafletMap | null>(null);

  useImperativeHandle(ref, () => ({ map: mapRef.current }), []);

  const handleRef = useCallback((map: LeafletMap | null) => {
    mapRef.current = map;
  }, []);

  const tileUrl = theme === "dark" ? DARK_TILES : LIGHT_TILES;
  const attribution =
    theme === "dark"
      ? '&copy; <a href="https://carto.com/">CARTO</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  return (
    <MapContainer
      ref={handleRef}
      center={BRAZIL_CENTER}
      zoom={DEFAULT_ZOOM}
      zoomControl={false}
      className="h-full w-full"
      style={{ background: theme === "dark" ? "#0f172a" : "#f8fafc" }}
    >
      <TileLayer key={tileUrl} url={tileUrl} attribution={attribution} />
      <ZoomControl position="bottomright" />
      <ScaleControl position="bottomleft" metric imperial={false} />
      <EventHandler onMapClick={onMapClick} onMouseMove={onMouseMove} />
      {children}
    </MapContainer>
  );
});
