import { SalesforceApi } from "../api/SalesforceApi";
import { SalesforcePayload } from "../models/models";

export const SalesforceService = {
  createAccount: async (payload: SalesforcePayload & { userId: number }) => {
    return await SalesforceApi.createAccount(payload);
  },

  getAccount: async (userId: number) => {
    return await SalesforceApi.getAccount(userId);
  },

  updateAccount: async (payload: SalesforcePayload & { userId: number }) => {
    return await SalesforceApi.updateAccount(payload);
  },
};
