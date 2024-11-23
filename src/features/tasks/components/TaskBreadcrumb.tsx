import { Project } from "@/features/projects/types";
import { Task } from "../types";
import ProjectAvatar from "@/features/projects/components/projectAvatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import Link from "next/link";
import { ChevronRight, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteTask } from "../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";

interface TaskBreadcrumbProps {
  task: Task;
  project: Project;
}

const TaskBreadcrumb = ({ task, project }: TaskBreadcrumbProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { mutate: deleteTask, isPending } = useDeleteTask();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete task",
    "Are you sure you want to delete this task?",
    "destructive"
  );

  const deleteTaskHandler = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteTask(
      { param: { taskId: task.$id } },
      {
        onSuccess() {
          router.push(`/workspaces/${workspaceId}/tasks`);
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />
      <ProjectAvatar
        name={project.name}
        image={project.imageUrl}
        className="size-6 lg:size-8"
      />
      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground transition hover:opacity-75">
          {project.name}
        </p>
      </Link>

      <ChevronRight className="size-4 lg:size-5 text-muted-foreground" />

      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
      <Button
        onClick={deleteTaskHandler}
        disabled={isPending}
        className="ml-auto"
        size={"sm"}
        variant={"destructive"}
      >
        <TrashIcon className="size-4 lg:mr-1" />
        <span className="hidden lg:block ">Delete task</span>
      </Button>
    </div>
  );
};

export default TaskBreadcrumb;
