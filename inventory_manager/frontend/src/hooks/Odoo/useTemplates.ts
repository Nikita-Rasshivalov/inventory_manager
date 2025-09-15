import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TemplateService } from "../../services/Odoo/templateService";

export const useTemplates = () => {
  const queryClient = useQueryClient();

  const createTemplate = useMutation({
    mutationFn: ({ name, userId }: { name: string; userId: number }) =>
      TemplateService.create(name, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
  const updateTemplate = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      TemplateService.update(id, name),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({ queryKey: ["template", vars.id] });
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: (id: number) => TemplateService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  return {
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
};
