"use client";

import DottedSeparator from "@/components/dotted";
import PageError from "@/components/PageError";
import PageLoader from "@/components/PageLoader";
import { useGetTask } from "@/features/tasks/api/use-get-task";
import TaskBreadcrumb from "@/features/tasks/components/TaskBreadcrumb";
import TaskDescription from "@/features/tasks/components/TaskDescription";
import TaskOverview from "@/features/tasks/components/TaskOverview";
import { useTaskId } from "@/features/tasks/hooks/use-task-id";

const TaskIdClient = () => {
  const taskId = useTaskId();

  const { data: task, isLoading } = useGetTask({ taskId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!task) {
    return <PageError message="Task not found" />;
  }

  return (
    <div className="flex flex-col">
      <TaskBreadcrumb task={task} project={task.project} />
      <DottedSeparator className="my-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={task} />
        <TaskDescription task={task} />
      </div>
    </div>
  );
};

export default TaskIdClient;
