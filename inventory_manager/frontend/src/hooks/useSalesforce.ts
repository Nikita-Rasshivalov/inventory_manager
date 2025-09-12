import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SalesforcePayload } from "../models/models";
import { SalesforceService } from "../services/SalesforceService";

export const useSalesforce = (
  userId: number,
  salesforceAccountId?: string,
  salesforceContactId?: string
) => {
  const queryClient = useQueryClient();

  const shouldFetch = Boolean(
    userId && salesforceAccountId && salesforceContactId
  );

  const accountQuery = useQuery({
    queryKey: ["salesforce", userId],
    queryFn: () => SalesforceService.getAccount(userId),
    enabled: shouldFetch,
  });

  const createMutation = useMutation({
    mutationFn: (values: SalesforcePayload & { userId: number }) =>
      SalesforceService.createAccount(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salesforce", userId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: SalesforcePayload & { userId: number }) =>
      SalesforceService.updateAccount(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salesforce", userId] });
    },
  });

  return { accountQuery, createMutation, updateMutation };
};
