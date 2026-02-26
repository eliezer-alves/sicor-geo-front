import { useState } from "react";
import { Layers, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type BasemapId = "streets" | "satellite" | "terrain" | "hybrid" | "dark";

type BasemapOption = {
  id: BasemapId;
  label: string;
  preview: string;
};

const BASEMAPS: BasemapOption[] = [
  { id: "streets", label: "Mapa", preview: "bg-emerald-200" },
  { id: "satellite", label: "Satelite", preview: "bg-gray-700" },
  { id: "terrain", label: "Terreno", preview: "bg-amber-200" },
  { id: "hybrid", label: "Hibrido", preview: "bg-gray-600" },
  { id: "dark", label: "Escuro", preview: "bg-slate-800" },
];

type Props = {
  active: BasemapId;
  onChange: (id: BasemapId) => void;
};

export function LayerControl({ active, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const current = BASEMAPS.find((b) => b.id === active) ?? BASEMAPS[0];

  return (
    <div className="absolute right-3 bottom-24 z-[1000]">
      {/* Toggle button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-lg transition-colors hover:bg-muted"
          title="Camadas do mapa"
        >
          <Layers className="h-4 w-4 text-primary" />
          {current.label}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      )}

      {/* Expanded panel */}
      {open && (
        <div className="w-44 rounded-lg border border-border bg-card shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <div className="flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Camadas</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Fechar
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5 p-2">
            {BASEMAPS.map((bm) => (
              <button
                key={bm.id}
                type="button"
                onClick={() => {
                  onChange(bm.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-md p-1.5 transition-all",
                  active === bm.id
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:bg-muted",
                )}
              >
                <div
                  className={cn(
                    "h-10 w-full rounded border border-border",
                    bm.preview,
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium leading-tight",
                    active === bm.id ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {bm.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
