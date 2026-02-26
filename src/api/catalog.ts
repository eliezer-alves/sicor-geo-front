import { http } from "./http";
import type { CatalogItem, FiltersCatalog } from "@/types/search";

async function fetchYears(signal?: AbortSignal): Promise<number[]> {
  const res = await http.get<number[]>("/years/", { signal });
  return res.data;
}

async function fetchItems(endpoint: string, signal?: AbortSignal): Promise<CatalogItem[]> {
  const res = await http.get<CatalogItem[]>(endpoint, { signal });
  return res.data;
}

export async function fetchFiltersCatalog(signal?: AbortSignal): Promise<FiltersCatalog> {
  const [years, programas, subprogramas, fontesRecurso] = await Promise.all([
    fetchYears(signal),
    fetchItems("/programas/", signal),
    fetchItems("/subprogramas/", signal),
    fetchItems("/fontes-recurso/", signal),
  ]);
  return { years, programas, subprogramas, fontesRecurso };
}
