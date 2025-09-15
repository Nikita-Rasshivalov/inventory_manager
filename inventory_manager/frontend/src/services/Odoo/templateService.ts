import { TemplateApi } from "../../api/Odoo/templateApi";

export const TemplateService = {
  getAll: async () => TemplateApi.getAll(),
  getById: async (id: number) => TemplateApi.getById(id),
  create: async (name: string, userId: number) =>
    TemplateApi.create({ name, userId }),

  update: async (id: number, name: string) => TemplateApi.update(id, { name }),
  delete: async (id: number) => TemplateApi.delete(id),
};
