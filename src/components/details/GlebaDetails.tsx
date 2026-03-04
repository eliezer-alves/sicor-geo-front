import { X, ZoomIn, MapPin, Calendar, DollarSign, FileText, Layers, Landmark, Percent } from "lucide-react";
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

/** Label-friendly map for known extra/contract fields */
const EXTRA_FIELD_LABELS: Record<string, string> = {
  cd_empreendimento: "Empreendimento",
  vl_area_informada: "Area Informada",
  dt_emissao: "Data Emissao",
  dt_vencimento: "Data Vencimento",
  cd_estado: "Estado (UF)",
  vl_juros: "Juros",
  vl_prestacao_investimento: "Prestacao Investimento",
  vl_parc_credito: "Valor Parcela Credito",
  cd_contrato_stn: "Contrato STN",
};

/** Fields that represent currency values */
const CURRENCY_FIELDS = new Set([
  "vl_prestacao_investimento",
  "vl_parc_credito",
]);

/** Fields that represent dates */
const DATE_FIELDS = new Set(["dt_emissao", "dt_vencimento"]);

/** Fields that represent area in hectares */
const AREA_FIELDS = new Set(["vl_area_informada"]);

/** Fields that represent percentage values */
const PERCENT_FIELDS = new Set(["vl_juros"]);

function formatExtraValue(key: string, value: unknown): string | null {
  if (value == null || value === "" || value === "None") return null;

  if (DATE_FIELDS.has(key)) {
    return formatDate(value);
  }
  if (CURRENCY_FIELDS.has(key)) {
    const num = Number(value);
    return Number.isFinite(num) ? formatCurrency(num) : String(value);
  }
  if (AREA_FIELDS.has(key)) {
    const num = Number(value);
    return Number.isFinite(num) ? formatArea(num) : String(value);
  }
  if (PERCENT_FIELDS.has(key)) {
    const num = Number(value);
    return Number.isFinite(num) ? `${num.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%` : String(value);
  }

  return String(value);
}

function getExtraIcon(key: string): React.ReactNode | undefined {
  if (DATE_FIELDS.has(key)) return <Calendar className="h-3.5 w-3.5" />;
  if (CURRENCY_FIELDS.has(key)) return <DollarSign className="h-3.5 w-3.5" />;
  if (AREA_FIELDS.has(key)) return <MapPin className="h-3.5 w-3.5" />;
  if (PERCENT_FIELDS.has(key)) return <Percent className="h-3.5 w-3.5" />;
  if (key === "cd_contrato_stn") return <FileText className="h-3.5 w-3.5" />;
  if (key === "cd_estado") return <Landmark className="h-3.5 w-3.5" />;
  return undefined;
}

/** Set of top-level property keys that are already shown in the main rows or are internal */
const DISPLAYED_KEYS = new Set([
  "ref_bacen",
  "order_number",
  "year",
  "area_ha",
  "area_m2",
  "programa",
  "subprograma",
  "fonte_recurso",
  "extra",
  // Legacy field names (in case they exist)
  "nu_ano_emissao",
  "cd_empreendimento",
  "programa_descricao",
  "subprograma_descricao",
  "fonte_recurso_descricao",
  "cd_programa",
  "cd_subprograma",
  "cd_fonte_recurso",
  "vl_parc_credito",
  "dt_emissao",
  "dt_vencimento",
  "atividade",
  "municipio",
  "uf",
]);

function humanizeKey(key: string): string {
  return key
    .replace(/^(cd|vl|dt|nu|pc)_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function GlebaDetails({ feature, onClose, onZoomTo }: Props) {
  const p = feature.properties ?? {};
  const extra = (typeof p.extra === "object" && p.extra !== null) ? p.extra as Record<string, unknown> : null;

  // Main rows — supports both backend naming conventions
  const rows: DetailRow[] = [
    { label: "Ref. BACEN", value: p.ref_bacen, icon: <FileText className="h-3.5 w-3.5" /> },
    { label: "Empreendimento", value: extra?.cd_empreendimento ? String(extra.cd_empreendimento) : p.cd_empreendimento },
    {
      label: "Ano Emissao",
      value: p.year ? String(p.year) : p.nu_ano_emissao ? String(p.nu_ano_emissao) : null,
      icon: <Calendar className="h-3.5 w-3.5" />,
    },
    {
      label: "Area",
      value: p.area_ha ? formatArea(Number(p.area_ha)) : null,
      icon: <MapPin className="h-3.5 w-3.5" />,
    },
    { label: "Programa", value: p.programa ?? p.programa_descricao ?? p.cd_programa },
    { label: "Subprograma", value: p.subprograma ?? p.subprograma_descricao ?? p.cd_subprograma },
    { label: "Fonte de Recurso", value: p.fonte_recurso ?? p.fonte_recurso_descricao ?? p.cd_fonte_recurso },
    {
      label: "Valor Credito",
      value: (extra?.vl_parc_credito ?? p.vl_parc_credito) ? formatCurrency(Number(extra?.vl_parc_credito ?? p.vl_parc_credito)) : null,
      icon: <DollarSign className="h-3.5 w-3.5" />,
    },
    { label: "Data Emissao", value: formatDate(extra?.dt_emissao ?? p.dt_emissao) },
    { label: "Data Vencimento", value: formatDate(extra?.dt_vencimento ?? p.dt_vencimento) },
    { label: "Atividade", value: p.atividade },
    { label: "Municipio", value: p.municipio },
    { label: "UF", value: extra?.cd_estado ? String(extra.cd_estado) : p.uf },
  ];

  // Contract / extra rows (excluding fields already shown in main rows)
  const mainExtraKeys = new Set(["cd_empreendimento", "vl_parc_credito", "dt_emissao", "dt_vencimento", "cd_estado"]);
  const extraRows: DetailRow[] = extra
    ? Object.entries(extra)
        .filter(([key]) => !mainExtraKeys.has(key))
        .map(([key, value]) => ({
          label: EXTRA_FIELD_LABELS[key] ?? humanizeKey(key),
          value: formatExtraValue(key, value),
          icon: getExtraIcon(key),
        }))
        .filter((r) => r.value != null)
    : [];

  // Remaining top-level properties not yet shown anywhere
  const remainingEntries = Object.entries(p)
    .filter(([key, value]) => !DISPLAYED_KEYS.has(key) && value != null && value !== "")
    .map(([key, value]) => ({
      label: humanizeKey(key),
      value: typeof value === "object" ? JSON.stringify(value) : String(value),
    }))
    .filter((r) => r.value != null);

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
        {/* Main info */}
        <dl className="divide-y divide-border">
          {rows.filter((r) => r.value != null).map((row) => (
            <Row key={row.label} {...row} />
          ))}
        </dl>

        {/* Contract / financing data from extra */}
        {extraRows.length > 0 && (
          <div className="mt-3 rounded-md border border-border bg-muted/40 p-3">
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Landmark className="h-3.5 w-3.5" />
              Dados do Contrato
            </h4>
            <dl className="divide-y divide-border/50">
              {extraRows.map((row) => (
                <Row key={row.label} {...row} />
              ))}
            </dl>
          </div>
        )}

        {/* Remaining properties not covered above */}
        {remainingEntries.length > 0 && (
          <details className="mt-3">
            <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
              Propriedades adicionais ({remainingEntries.length})
            </summary>
            <dl className="mt-2 divide-y divide-border/50">
              {remainingEntries.map((entry) => (
                <div key={entry.label} className="py-1.5">
                  <dt className="text-xs text-muted-foreground">{entry.label}</dt>
                  <dd className="break-words text-sm font-medium text-foreground">{entry.value}</dd>
                </div>
              ))}
            </dl>
          </details>
        )}
      </div>
    </div>
  );
}
