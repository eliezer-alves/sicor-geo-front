export function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}M`;
  }
  if (value >= 1_000) {
    return `R$ ${(value / 1_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil`;
  }
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatArea(totalHa: number): string {
  if (totalHa >= 1_000) {
    return `${(totalHa / 1_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil ha`;
  }
  return `${totalHa.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} ha`;
}

export function formatDate(value: unknown): string | null {
  if (value == null || value === "" || value === "None") return null;
  const str = String(value);
  const date = new Date(str);
  if (isNaN(date.getTime())) return str;
  return date.toLocaleDateString("pt-BR");
}

export function formatNumber(value: number): string {
  return value.toLocaleString("pt-BR");
}
