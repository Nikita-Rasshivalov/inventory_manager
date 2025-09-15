import axiosInstance from "../../services/axiosInstance";

export class OdooApi {
  static async generateToken(): Promise<{ apiToken: string }> {
    const res = await axiosInstance.post<{ apiToken: string }>(
      "/odoo/generate-token"
    );
    return res.data;
  }

  static async getAggregatedTemplates(apiToken: string): Promise<any> {
    const res = await axiosInstance.get("/odoo/templates/aggregated", {
      headers: { "x-api-token": apiToken },
    });
    return res.data;
  }
}
