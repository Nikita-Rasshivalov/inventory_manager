import { useQuery } from "@tanstack/react-query";
import { Inventory } from "../models/models";
import { SearchApi } from "../api/searchApi";

export const useSearchInventories = (tag?: string) => {
  return useQuery<Inventory[], Error>({
    queryKey: ["search-inventories", tag],
    queryFn: () => {
      if (!tag) return Promise.resolve([]);
      return SearchApi.getByTag(tag);
    },
    enabled: !!tag,
    staleTime: 5 * 60 * 1000,
  });
};
