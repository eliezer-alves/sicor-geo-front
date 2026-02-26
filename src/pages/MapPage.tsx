import { useState, useCallback, useRef } from "react";
import type { Feature, Geometry } from "geojson";

import { MapCanvas, type MapCanvasRef } from "@/components/map/MapCanvas";
import { GlebasLayer } from "@/components/map/GlebasLayer";
import { CoordsDisplay } from "@/components/map/CoordsDisplay";
import { FiltersPanel } from "@/components/filters/FiltersPanel";
import { GlebaDetails } from "@/components/details/GlebaDetails";
import { SummaryBar } from "@/components/summary/SummaryBar";
import { useCatalog } from "@/hooks/useCatalog";
import { useGlebasSearch } from "@/hooks/useGlebasSearch";
import { EMPTY_DRAFT, draftToQuery } from "@/types/search";
import type { FiltersDraft, SearchQuery } from "@/types/search";

function getFeatureId(f: Feature<Geometry>): string {
  const p = f.properties;
  if (!p) return "";
  return String(p.id ?? p.ref_bacen ?? p.cd_empreendimento ?? "");
}

export function MapPage({ theme }: { theme: "light" | "dark" }) {
  const mapRef = useRef<MapCanvasRef>(null);

  // Filter state
  const [draft, setDraft] = useState<FiltersDraft>({ ...EMPTY_DRAFT });
  const [committed, setCommitted] = useState<SearchQuery | null>(null);

  // UI state
  const [pickMode, setPickMode] = useState(false);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature<Geometry> | null>(null);

  // Data
  const catalog = useCatalog();
  const search = useGlebasSearch(committed);

  // Handlers
  const handleSubmit = useCallback(() => {
    const query = draftToQuery(draft);
    if (query) {
      setCommitted(query);
      setSelectedFeature(null);
    }
  }, [draft]);

  const handleClear = useCallback(() => {
    setDraft({ ...EMPTY_DRAFT });
    setCommitted(null);
    setSelectedFeature(null);
  }, []);

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      if (pickMode) {
        setDraft((prev) => ({ ...prev, lat: lat.toFixed(6), lon: lng.toFixed(6) }));
        setPickMode(false);
      }
    },
    [pickMode],
  );

  const handleMouseMove = useCallback((lat: number, lng: number) => {
    setCursorCoords({ lat, lng });
  }, []);

  const handleFeatureClick = useCallback((feature: Feature<Geometry>) => {
    setSelectedFeature(feature);
  }, []);

  const handleZoomToSelected = useCallback(async () => {
    if (!selectedFeature || !mapRef.current?.map) return;
    const L = await import("leaflet");
    const layer = L.geoJSON(selectedFeature);
    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      mapRef.current.map.fitBounds(bounds, { padding: [80, 80], maxZoom: 17 });
    }
  }, [selectedFeature]);

  const searchCenter: [number, number] | undefined =
    committed ? [committed.area.lat, committed.area.lon] : undefined;
  const searchRadius = committed?.area.radiusMeters;

  const selectedId = selectedFeature ? getFeatureId(selectedFeature) : null;

  return (
    <div className={`relative h-full w-full ${pickMode ? "cursor-crosshair" : ""}`}>
      {/* Map */}
      <MapCanvas
        ref={mapRef}
        theme={theme}
        onMapClick={handleMapClick}
        onMouseMove={handleMouseMove}
      >
        <GlebasLayer
          data={search.data}
          selectedId={selectedId}
          onFeatureClick={handleFeatureClick}
          searchCenter={searchCenter}
          searchRadius={searchRadius}
        />
      </MapCanvas>

      {/* Filters Panel - top left */}
      <FiltersPanel
        draft={draft}
        onChange={setDraft}
        onSubmit={handleSubmit}
        onClear={handleClear}
        catalog={catalog.data}
        catalogLoading={catalog.isLoading}
        isSearching={search.isFetching}
        pickMode={pickMode}
        onTogglePickMode={() => setPickMode(!pickMode)}
      />

      {/* Detail Panel - top right */}
      {selectedFeature && (
        <GlebaDetails
          feature={selectedFeature}
          onClose={() => setSelectedFeature(null)}
          onZoomTo={handleZoomToSelected}
        />
      )}

      {/* Coordinates Display */}
      <CoordsDisplay lat={cursorCoords?.lat ?? null} lng={cursorCoords?.lng ?? null} />

      {/* Summary Bar - bottom center */}
      <SummaryBar data={search.data} isLoading={search.isFetching} />
    </div>
  );
}
