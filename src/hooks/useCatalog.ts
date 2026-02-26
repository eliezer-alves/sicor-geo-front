import { useQuery } from "@tanstack/react-query";
import { fetchFiltersCatalog } from "@/api/catalog";

const ONE_DAY = 24 * 60 * 60 * 1000;

export function useCatalog() {
  return useQuery({
    queryKey: ["catalog"],
    queryFn: ({ signal }) => fetchFiltersCatalog(signal),
    staleTime: ONE_DAY,
    gcTime: ONE_DAY,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
