import { useQuery } from "@tanstack/react-query";
import { searchGlebas } from "@/api/glebas";
import type { SearchQuery } from "@/types/search";

export function useGlebasSearch(query: SearchQuery | null) {
  return useQuery({
    queryKey: query ? ["glebas.search", query] : ["glebas.search.disabled"],
    enabled: query != null,
    queryFn: ({ signal }) => searchGlebas(query!, signal),
    staleTime: 20_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
