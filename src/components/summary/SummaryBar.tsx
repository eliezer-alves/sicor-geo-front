import { MapPin, Ruler, DollarSign, Loader2 } from "lucide-react";
import { formatCurrency, formatArea, formatNumber } from "@/lib/format";
import type { FeatureCollection, Geometry } from "geojson";

type Props = {
  data: FeatureCollection<Geometry> | undefined;
  isLoading: boolean;
};

function computeStats(data: FeatureCollection<Geometry>) {
  let totalArea = 0;
  let totalCredit = 0;

  for (const f of data.features) {
    const p = f.properties;
    if (!p) continue;
    if (p.area_ha) totalArea += Number(p.area_ha) || 0;
    if (p.vl_parc_credito) totalCredit += Number(p.vl_parc_credito) || 0;
  }

  return { count: data.features.length, totalArea, totalCredit };
}

export function SummaryBar({ data, isLoading }: Props) {
  if (!data && !isLoading) return null;

  const stats = data ? computeStats(data) : null;

  return (
    <div className="absolute inset-x-3 bottom-3 z-[1000] flex items-center justify-center gap-6 rounded-lg border border-border bg-card/95 px-5 py-2.5 shadow-lg backdrop-blur-sm">
      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Buscando glebas...
        </div>
      ) : stats ? (
        <>
          <div className="flex items-center gap-1.5 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">{formatNumber(stats.count)}</span>
            <span className="text-muted-foreground">glebas</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5 text-sm">
            <Ruler className="h-4 w-4 text-success" />
            <span className="font-semibold text-foreground">{formatArea(stats.totalArea)}</span>
          </div>
          {stats.totalCredit > 0 && (
            <>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5 text-sm">
                <DollarSign className="h-4 w-4 text-warning" />
                <span className="font-semibold text-foreground">{formatCurrency(stats.totalCredit)}</span>
              </div>
            </>
          )}
        </>
      ) : null}
    </div>
  );
}
