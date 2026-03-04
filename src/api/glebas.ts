import { http } from "./http";
import type { SearchQuery } from "@/types/search";
import type { FeatureCollection, Geometry } from "geojson";

/**
 * Search glebas via the Django backend.
 * GET /api/glebas/search?lon=&lat=&raio_m=&years=&programas=&subprogramas=&fontes_recurso=
 * Returns a GeoJSON FeatureCollection.
 */
export async function searchGlebas(
  query: SearchQuery,
  signal?: AbortSignal,
): Promise<FeatureCollection<Geometry>> {
  const { area, filters } = query;

  const params: Record<string, string> = {
    lat: String(area.lat),
    lon: String(area.lon),
    raio_m: String(area.radiusMeters),
  };

  if (filters.years && filters.years.length > 0) {
    params.years = filters.years.join(",");
  }
  if (filters.programas && filters.programas.length > 0) {
    params.programas = filters.programas.join(",");
  }
  if (filters.subprogramas && filters.subprogramas.length > 0) {
    params.subprogramas = filters.subprogramas.join(",");
  }
  if (filters.ufs && filters.ufs.length > 0) {
    params.ufs = filters.ufs.join(",");
  }
  if (filters.fontesRecurso && filters.fontesRecurso.length > 0) {
    params.fontes_recurso = filters.fontesRecurso.join(",");
  }

  const res = await http.get("/glebas/search", { params, signal });
  return res.data as FeatureCollection<Geometry>;
}
