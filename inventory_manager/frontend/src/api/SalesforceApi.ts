import axiosInstance from "../services/axiosInstance";
import { SalesforcePayload } from "../models/models";

interface SalesforceResponse {
  account: any;
  contact: any;
}

export const SalesforceApi = {
  createAccount: async (
    payload: SalesforcePayload & { userId: number }
  ): Promise<SalesforceResponse> => {
    const res = await axiosInstance.post<SalesforceResponse>(
      "/salesforce/create-account",
      payload
    );
    return res.data;
  },

  getAccount: async (userId: number): Promise<SalesforceResponse> => {
    const res = await axiosInstance.get<SalesforceResponse>(
      `/salesforce/account/${userId}`
    );
    return res.data;
  },

  updateAccount: async (
    payload: SalesforcePayload & { userId: number }
  ): Promise<SalesforceResponse> => {
    const res = await axiosInstance.put<SalesforceResponse>(
      "/salesforce/account",
      payload
    );
    return res.data;
  },
};
