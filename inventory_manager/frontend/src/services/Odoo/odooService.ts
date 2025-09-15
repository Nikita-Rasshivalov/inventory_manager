import { OdooApi } from "../../api/Odoo/odooApi";

export const OdooService = {
  generateToken: async () => OdooApi.generateToken(),
  getAggregatedTemplates: async (apiToken: string) =>
    OdooApi.getAggregatedTemplates(apiToken),
};
