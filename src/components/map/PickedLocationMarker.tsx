import { CircleMarker, Tooltip } from "react-leaflet";

type Props = {
  lat: number;
  lng: number;
};

export function PickedLocationMarker({ lat, lng }: Props) {
  return (
    <CircleMarker
      center={[lat, lng]}
      radius={8}
      pathOptions={{
        color: "#dc2626",
        weight: 2,
        opacity: 1,
        fillColor: "#ef4444",
        fillOpacity: 0.6,
      }}
    >
      <Tooltip direction="top" offset={[0, -10]} permanent>
        {lat.toFixed(6)}, {lng.toFixed(6)}
      </Tooltip>
    </CircleMarker>
  );
}
