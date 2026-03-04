import { useState } from "react";
import { Search, X, ChevronDown, ChevronUp, MapPin, Crosshair } from "lucide-react";
import { cn } from "@/lib/cn";
import { MultiSelect } from "./MultiSelect";
import { UF_OPTIONS } from "@/lib/uf";
import type { FiltersDraft, FiltersCatalog } from "@/types/search";

type Props = {
  draft: FiltersDraft;
  onChange: (draft: FiltersDraft) => void;
  onSubmit: () => void;
  onClear: () => void;
  catalog: FiltersCatalog | undefined;
  catalogLoading: boolean;
  isSearching: boolean;
  pickMode: boolean;
  onTogglePickMode: () => void;
};

export function FiltersPanel({
  draft,
  onChange,
  onSubmit,
  onClear,
  catalog,
  catalogLoading,
  isSearching,
  pickMode,
  onTogglePickMode,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);

  const update = <K extends keyof FiltersDraft>(key: K, value: FiltersDraft[K]) => {
    onChange({ ...draft, [key]: value });
  };

  const canSubmit = draft.lat !== "" && draft.lon !== "" && Number(draft.radiusMeters) > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) onSubmit();
  };

  const yearOptions = (catalog?.years ?? []).map((y) => ({ value: String(y), label: String(y) }));
  const programaOptions = (catalog?.programas ?? []).map((p) => ({ value: p.codigo, label: p.descricao }));
  const subprogramaOptions = (catalog?.subprogramas ?? []).map((s) => ({ value: s.codigo, label: s.descricao }));
  const fonteOptions = (catalog?.fontesRecurso ?? []).map((f) => ({ value: f.codigo, label: f.descricao }));
  const ufOptions = UF_OPTIONS.map((uf) => ({ value: uf, label: uf }));

  return (
    <div className="absolute left-3 top-3 z-[1000] w-80">
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between rounded-t-lg border border-border bg-card px-4 py-2.5 shadow-lg",
          collapsed && "rounded-b-lg",
        )}
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Busca de Glebas</span>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>
      </div>

      {/* Body */}
      {!collapsed && (
        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(100vh-10rem)] space-y-3 overflow-y-auto rounded-b-lg border border-t-0 border-border bg-card p-4 shadow-lg"
        >
          {/* Location */}
          <fieldset className="space-y-2">
            <legend className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> Localização
            </legend>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={draft.lat}
                  onChange={(e) => update("lat", e.target.value)}
                  placeholder="-15.78"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={draft.lon}
                  onChange={(e) => update("lon", e.target.value)}
                  placeholder="-47.93"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={onTogglePickMode}
              className={cn(
                "flex w-full items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                pickMode
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Crosshair className="h-3.5 w-3.5" />
              {pickMode ? "Clique no mapa..." : "Selecionar no mapa"}
            </button>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Raio (metros)</label>
              <input
                type="number"
                min="100"
                max="100000"
                step="100"
                value={draft.radiusMeters}
                onChange={(e) => update("radiusMeters", e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </fieldset>

          {/* Filters */}
          <fieldset className="space-y-2">
            <legend className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Search className="h-3.5 w-3.5" /> Filtros
            </legend>

            <MultiSelect
              label="Ano"
              options={yearOptions}
              selected={draft.years}
              onChange={(v) => update("years", v)}
              placeholder="Todos os anos"
              disabled={catalogLoading}
            />

            <MultiSelect
              label="UF"
              options={ufOptions}
              selected={draft.ufs}
              onChange={(v) => update("ufs", v)}
              placeholder="Todas as UFs"
            />

            <MultiSelect
              label="Programa"
              options={programaOptions}
              selected={draft.programas}
              onChange={(v) => update("programas", v)}
              placeholder="Todos"
              disabled={catalogLoading}
            />

            <MultiSelect
              label="Subprograma"
              options={subprogramaOptions}
              selected={draft.subprogramas}
              onChange={(v) => update("subprogramas", v)}
              placeholder="Todos"
              disabled={catalogLoading}
            />

            <MultiSelect
              label="Fonte de Recurso"
              options={fonteOptions}
              selected={draft.fontesRecurso}
              onChange={(v) => update("fontesRecurso", v)}
              placeholder="Todas"
              disabled={catalogLoading}
            />
          </fieldset>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={!canSubmit || isSearching}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors",
                canSubmit && !isSearching
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "cursor-not-allowed bg-muted text-muted-foreground",
              )}
            >
              {isSearching ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Buscar
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClear}
              className="rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
