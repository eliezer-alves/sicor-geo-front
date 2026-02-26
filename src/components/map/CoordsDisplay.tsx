type Props = {
  lat: number | null;
  lng: number | null;
};

export function CoordsDisplay({ lat, lng }: Props) {
  if (lat == null || lng == null) return null;

  return (
    <div className="pointer-events-none absolute bottom-8 left-2 z-[1000] rounded-md bg-card/90 px-2.5 py-1 text-xs tabular-nums text-muted-foreground shadow-sm backdrop-blur-sm">
      {lat.toFixed(5)}, {lng.toFixed(5)}
    </div>
  );
}
