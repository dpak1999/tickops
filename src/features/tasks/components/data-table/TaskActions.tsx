import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLinkIcon, PencilIcon, Trash } from "lucide-react";
import { ReactNode } from "react";
import { useDeleteTask } from "../../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";

interface TaskActionsProps {
  id: string;
  projectId: string;
  children: ReactNode;
}

export const TaskActions = ({ id, projectId, children }: TaskActionsProps) => {
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Task",
    "Are you sure you want to delete this task? This action cannot be undone.",
    "destructive"
  );

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) {
      return;
    }
    deleteTask({ param: { taskId: id } });
  };

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => {}} className="font-medium p-[10px]">
            <ExternalLinkIcon className="size-4 stroke-2 mr-2" />
            Task Details
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => {}} className="font-medium p-[10px]">
            <ExternalLinkIcon className="size-4 stroke-2 mr-2" />
            Open Project
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => {}} className="font-medium p-[10px]">
            <PencilIcon className="size-4 stroke-2 mr-2" />
            Edit Task
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-amber-700 focus:text-amber-700"
          >
            <Trash className="size-4 stroke-2 mr-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
