import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { OdooService } from "../../services/Odoo/odooService";

export const useOdoo = (initialToken?: string) => {
  const queryClient = useQueryClient();

  const generateToken = useMutation({
    mutationFn: () => OdooService.generateToken(),
    onSuccess: (data) => {
      queryClient.setQueryData(["odooToken"], data);
    },
  });

  const aggregatedQuery = useQuery({
    queryKey: ["odoo", "aggregated", initialToken],
    queryFn: () => {
      if (!initialToken) return Promise.resolve([]);
      return OdooService.getAggregatedTemplates(initialToken);
    },
    enabled: !!initialToken,
  });

  const getAggregatedWithToken = async (token: string) => {
    const data = await OdooService.getAggregatedTemplates(token);
    queryClient.setQueryData(["odoo", "aggregated", token], data);
    return data;
  };

  return {
    apiToken: generateToken.data?.apiToken || initialToken,
    isLoading: generateToken.isPending,
    generateToken: generateToken.mutate,
    aggregated: aggregatedQuery.data,
    aggregatedLoading: aggregatedQuery.isLoading,
    getAggregatedWithToken,
  };
};
