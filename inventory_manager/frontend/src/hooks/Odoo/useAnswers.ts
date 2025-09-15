import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Answer } from "../../models/models";
import { AnswerService } from "../../services/Odoo/answerService";

export const useAnswers = (questionId?: number) => {
  const queryClient = useQueryClient();

  const answersQuery = useQuery<Answer[]>({
    queryKey: ["answers", questionId],
    queryFn: () => {
      if (!questionId) return Promise.resolve([] as Answer[]);
      return AnswerService.getAll(questionId);
    },
    enabled: !!questionId,
  });

  const addAnswers = useMutation({
    mutationFn: (
      values: { value: string | number }[] | { value: string | number }
    ) => {
      if (!questionId) return Promise.reject(new Error("questionId required"));
      const payload = Array.isArray(values) ? values : [values];
      return AnswerService.add(questionId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["answers", questionId] });
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  const deleteAnswer = useMutation({
    mutationFn: (id: number) => AnswerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["answers", questionId] });
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  return {
    answersQuery,
    addAnswers,
    deleteAnswer,
  };
};
