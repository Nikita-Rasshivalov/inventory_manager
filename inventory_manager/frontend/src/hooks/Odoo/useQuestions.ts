import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Question } from "../../models/models";
import { QuestionService } from "../../services/Odoo/questionService";

export const useQuestions = (templateId?: number) => {
  const queryClient = useQueryClient();

  const questionsQuery = useQuery<Question[]>({
    queryKey: ["questions", templateId],
    queryFn: () => {
      if (!templateId) return Promise.resolve([] as Question[]);
      return QuestionService.getAll(templateId);
    },
    enabled: !!templateId,
  });

  const addQuestions = useMutation({
    mutationFn: ({
      templateId,
      questions,
    }: {
      templateId: number;
      questions: { text: string; type: string }[];
    }) => {
      return QuestionService.add(templateId, questions);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["questions", variables.templateId],
      });
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  const deleteQuestion = useMutation({
    mutationFn: (id: number) => QuestionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", templateId] });
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  return {
    questionsQuery,
    addQuestions,
    deleteQuestion,
  };
};
