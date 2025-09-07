import { useQuery } from "@tanstack/react-query";
import { Tag } from "../models/models";
import { TagApi } from "../api/tagApi";

export const useTags = (search?: string) => {
  return useQuery<Tag[], Error>({
    queryKey: ["tags", search],
    queryFn: async () => {
      const allTags = await TagApi.getAll();

      if (search) {
        return allTags.filter((tag) =>
          tag.name.toLowerCase().startsWith(search.toLowerCase())
        );
      }
      return allTags;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useTopTags = (limit: number = 20) => {
  return useQuery<Tag[], Error>({
    queryKey: ["tags", "top", limit],
    queryFn: () => TagApi.getTop(limit),
    staleTime: 5 * 60 * 1000,
  });
};
