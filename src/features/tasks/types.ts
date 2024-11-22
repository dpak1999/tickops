import { Models } from "node-appwrite";

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  IN_REVIEW = "IN_REVIEW",
  ON_HOLD = "ON_HOLD",
  QA = "QA",
  CANCELLED = "CANCELLED",
}

export type Task = Models.Document & {
  name: string;
  status: TaskStatus;
  position: number;
  projectId: string;
  assigneeId: string;
  workspaceId: string;
  dueDate: string;
};
