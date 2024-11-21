import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { TaskStatus } from "../types";

export const useTaskFilter = () => {
  return useQueryStates({
    status: parseAsStringEnum(Object.values(TaskStatus)),
    projectId: parseAsString,
    assigneeId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString,
  });
};
