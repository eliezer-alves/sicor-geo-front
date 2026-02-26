import { GeoJSON, Circle, useMap } from "react-leaflet";
import type { FeatureCollection, Geometry, Feature } from "geojson";
import type { Layer, PathOptions, LatLngBoundsExpression } from "leaflet";
import { useEffect, useRef, useMemo, useCallback } from "react";

type Props = {
  data: FeatureCollection<Geometry> | undefined;
  selectedId: string | null;
  onFeatureClick: (feature: Feature<Geometry>) => void;
  searchCenter?: [number, number];
  searchRadius?: number;
};

const DEFAULT_STYLE: PathOptions = {
  color: "#2563eb",
  weight: 2,
  opacity: 0.8,
  fillColor: "#3b82f6",
  fillOpacity: 0.25,
};

const HOVER_STYLE: PathOptions = {
  color: "#1d4ed8",
  weight: 3,
  fillOpacity: 0.45,
};

const SELECTED_STYLE: PathOptions = {
  color: "#d97706",
  weight: 3,
  opacity: 1,
  fillColor: "#f59e0b",
  fillOpacity: 0.4,
};

function getFeatureId(feature: Feature<Geometry>): string {
  const p = feature.properties;
  if (!p) return "";
  return String(p.id ?? p.ref_bacen ?? p.cd_empreendimento ?? "");
}

export function GlebasLayer({ data, selectedId, onFeatureClick, searchCenter, searchRadius }: Props) {
  const map = useMap();
  const geoRef = useRef<L.GeoJSON | null>(null);

  // Auto-fit bounds when data changes
  useEffect(() => {
    if (!data || data.features.length === 0) return;

    const L = window.L as typeof import("leaflet");
    const geoJsonLayer = L.geoJSON(data);
    const bounds = geoJsonLayer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds as LatLngBoundsExpression, { padding: [40, 40], maxZoom: 15 });
    }
  }, [data, map]);

  const featureStyle = useCallback(
    (feature: Feature<Geometry> | undefined): PathOptions => {
      if (!feature) return DEFAULT_STYLE;
      const id = getFeatureId(feature);
      if (id && id === selectedId) return SELECTED_STYLE;
      return DEFAULT_STYLE;
    },
    [selectedId],
  );

  const onEachFeature = useCallback(
    (feature: Feature<Geometry>, layer: Layer) => {
      const p = feature.properties;
      if (p) {
        const tip = [
          p.ref_bacen ? `Ref: ${p.ref_bacen}` : null,
          p.nu_ano_emissao ? `Ano: ${p.nu_ano_emissao}` : null,
          p.area_ha ? `Area: ${Number(p.area_ha).toFixed(2)} ha` : null,
        ]
          .filter(Boolean)
          .join(" | ");
        if (tip) layer.bindTooltip(tip, { sticky: true, className: "leaflet-tooltip-custom" });
      }

      const pathLayer = layer as L.Path;
      pathLayer.on({
        mouseover() {
          pathLayer.setStyle(HOVER_STYLE);
        },
        mouseout() {
          const id = getFeatureId(feature);
          pathLayer.setStyle(id && id === selectedId ? SELECTED_STYLE : DEFAULT_STYLE);
        },
        click() {
          onFeatureClick(feature);
        },
      });
    },
    [onFeatureClick, selectedId],
  );

  // Unique key to force re-render when data or selection changes
  const geoKey = useMemo(() => {
    const count = data?.features.length ?? 0;
    return `geo-${count}-${selectedId ?? "none"}`;
  }, [data, selectedId]);

  if (!data || data.features.length === 0) {
    return searchCenter && searchRadius ? (
      <Circle
        center={searchCenter}
        radius={searchRadius}
        pathOptions={{ color: "#2563eb", weight: 1.5, dashArray: "6 4", fillColor: "#3b82f6", fillOpacity: 0.08 }}
      />
    ) : null;
  }

  return (
    <>
      {searchCenter && searchRadius && (
        <Circle
          center={searchCenter}
          radius={searchRadius}
          pathOptions={{ color: "#2563eb", weight: 1.5, dashArray: "6 4", fillColor: "#3b82f6", fillOpacity: 0.08 }}
        />
      )}
      <GeoJSON
        ref={(r: L.GeoJSON | null) => { geoRef.current = r; }}
        key={geoKey}
        data={data}
        style={featureStyle}
        onEachFeature={onEachFeature}
      />
    </>
  );
}
