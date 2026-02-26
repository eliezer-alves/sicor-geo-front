import { X, ZoomIn, MapPin, Calendar, DollarSign, FileText, Layers } from "lucide-react";
import { formatCurrency, formatArea, formatDate } from "@/lib/format";
import type { Feature, Geometry } from "geojson";

type Props = {
  feature: Feature<Geometry>;
  onClose: () => void;
  onZoomTo: () => void;
};

type DetailRow = {
  label: string;
  value: string | null | undefined;
  icon?: React.ReactNode;
};

function Row({ label, value, icon }: DetailRow) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 py-1.5">
      {icon && <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>}
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="break-words text-sm font-medium text-foreground">{value}</dd>
      </div>
    </div>
  );
}

export function GlebaDetails({ feature, onClose, onZoomTo }: Props) {
  const p = feature.properties ?? {};

  const rows: DetailRow[] = [
    { label: "Ref. BACEN", value: p.ref_bacen, icon: <FileText className="h-3.5 w-3.5" /> },
    { label: "Empreendimento", value: p.cd_empreendimento },
    { label: "Ano Emissao", value: p.nu_ano_emissao ? String(p.nu_ano_emissao) : null, icon: <Calendar className="h-3.5 w-3.5" /> },
    { label: "Area", value: p.area_ha ? formatArea(Number(p.area_ha)) : null, icon: <MapPin className="h-3.5 w-3.5" /> },
    { label: "Programa", value: p.programa_descricao ?? p.cd_programa },
    { label: "Subprograma", value: p.subprograma_descricao ?? p.cd_subprograma },
    { label: "Fonte de Recurso", value: p.fonte_recurso_descricao ?? p.cd_fonte_recurso },
    { label: "Valor Credito", value: p.vl_parc_credito ? formatCurrency(Number(p.vl_parc_credito)) : null, icon: <DollarSign className="h-3.5 w-3.5" /> },
    { label: "Data Emissao", value: formatDate(p.dt_emissao) },
    { label: "Data Vencimento", value: formatDate(p.dt_vencimento) },
    { label: "Atividade", value: p.atividade },
    { label: "Municipio", value: p.municipio },
    { label: "UF", value: p.uf },
  ];

  return (
    <div className="absolute right-3 top-3 z-[1000] w-80 animate-in slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-lg border border-border bg-card px-4 py-2.5 shadow-lg">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-accent" />
          <span className="text-sm font-semibold text-foreground">Detalhes da Gleba</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onZoomTo}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Zoom na gleba"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="max-h-[calc(100vh-10rem)] overflow-y-auto rounded-b-lg border border-t-0 border-border bg-card p-4 shadow-lg">
        <dl className="divide-y divide-border">
          {rows.filter((r) => r.value != null).map((row) => (
            <Row key={row.label} {...row} />
          ))}
        </dl>

        {/* Extra properties */}
        {Object.keys(p).length > 0 && (
          <details className="mt-3">
            <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
              Propriedades adicionais
            </summary>
            <pre className="mt-2 max-h-40 overflow-auto rounded-md bg-muted p-2 text-xs text-foreground">
              {JSON.stringify(p, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
