import { FC, ReactNode } from "react";
import { TaskStatus } from "../../types";
import { snakeCaseToTitleCase } from "@/lib/utils";
import {
  CircleCheckIcon,
  CircleDotDashed,
  CircleDotIcon,
  CircleIcon,
  CircleXIcon,
  MessageCircleWarning,
  PlusIcon,
} from "lucide-react";
import { CircleDashedIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateTaskModal } from "../../hooks/use-create-task-modal";

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

const statusIconMap: Record<TaskStatus, ReactNode> = {
  [TaskStatus.TODO]: <CircleIcon className="size-[18px] text-red-400" />,
  [TaskStatus.IN_PROGRESS]: (
    <CircleDotDashed className="size-[18px] text-yellow-400" />
  ),
  [TaskStatus.IN_REVIEW]: (
    <CircleDotIcon className="size-[18px] text-blue-400" />
  ),
  [TaskStatus.DONE]: (
    <CircleCheckIcon className="size-[18px] text-emerald-400" />
  ),

  [TaskStatus.BACKLOG]: (
    <CircleDashedIcon className="size-[18px] text-pink-300" />
  ),
  [TaskStatus.ON_HOLD]: (
    <MessageCircleWarning className="size-[18px] text-gray-400" />
  ),
  [TaskStatus.QA]: <CircleDotIcon className="size-[18px] text-purple-400" />,
  [TaskStatus.CANCELLED]: <CircleXIcon className="size-[18px] text-red-700" />,
};

export const KanbanColumnHeader: FC<KanbanColumnHeaderProps> = ({
  board,
  taskCount,
}) => {
  const icon = statusIconMap[board];
  const { open } = useCreateTaskModal();

  return (
    <div className="px-2 py-1.5 flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
        <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium">
          {taskCount}
        </div>
      </div>

      <Button variant="ghost" size="icon" className="size-5" onClick={open}>
        <PlusIcon className="size-4 text-neutral-500" />
      </Button>
    </div>
  );
};
