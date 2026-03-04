export type SearchArea = {
  lat: number;
  lon: number;
  radiusMeters: number;
};

export type SearchFilters = {
  years?: number[];
  ufs?: string[];
  programas?: string[];
  subprogramas?: string[];
  fontesRecurso?: string[];
};

export type SearchQuery = {
  area: SearchArea;
  filters: SearchFilters;
};

export type CatalogItem = {
  codigo: string;
  descricao: string;
};

export type FiltersCatalog = {
  years: number[];
  programas: CatalogItem[];
  subprogramas: CatalogItem[];
  fontesRecurso: CatalogItem[];
};

export type FiltersDraft = {
  lat: string;
  lon: string;
  radiusMeters: string;
  years: string[];
  ufs: string[];
  programas: string[];
  subprogramas: string[];
  fontesRecurso: string[];
};

export const EMPTY_DRAFT: FiltersDraft = {
  lat: "",
  lon: "",
  radiusMeters: "5000",
  years: [],
  ufs: [],
  programas: [],
  subprogramas: [],
  fontesRecurso: [],
};

export function draftToQuery(d: FiltersDraft): SearchQuery | null {
  const lat = Number(d.lat);
  const lon = Number(d.lon);
  const radiusMeters = Number(d.radiusMeters);

  if (!Number.isFinite(lat) || !Number.isFinite(lon) || !Number.isFinite(radiusMeters) || radiusMeters <= 0) {
    return null;
  }

  return {
    area: { lat, lon, radiusMeters },
    filters: {
      years: d.years.length > 0 ? d.years.map(Number).filter(Number.isFinite) : undefined,
      ufs: d.ufs.length > 0 ? d.ufs : undefined,
      programas: d.programas.length > 0 ? d.programas : undefined,
      subprogramas: d.subprogramas.length > 0 ? d.subprogramas : undefined,
      fontesRecurso: d.fontesRecurso.length > 0 ? d.fontesRecurso : undefined,
    },
  };
}
