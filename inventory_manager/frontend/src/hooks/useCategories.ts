import { useQuery } from "@tanstack/react-query";
import { Category } from "../models/models";
import { CategoryApi } from "../api/categoryApi";

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      const categories = await CategoryApi.getAll();
      return categories;
    },
    staleTime: 5 * 60 * 1000,
  });
};
