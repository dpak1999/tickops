import { FC } from "react";
import { Task } from "../../types";
import { TaskActions } from "../data-table/TaskActions";
import { MoreHorizontalIcon } from "lucide-react";
import DottedSeparator from "@/components/dotted";
import MembersAvatar from "@/features/members/components/membersAvatar";
import { TaskDate } from "../TaskDate";
import ProjectAvatar from "@/features/projects/components/projectAvatar";

interface KanbanCardProps {
  task: Task;
}

export const KanbanCard: FC<KanbanCardProps> = ({ task }) => {
  return (
    <div className="bg-white p-2.5 rounded shadow-sm scroll-py-3 mb-1.5">
      <div className="flex items-start justify-between gap-x-2">
        <p className="text-sm line-clamp-2">{task.name}</p>
        <TaskActions id={task.$id} projectId={task.projectId}>
          <MoreHorizontalIcon className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
        </TaskActions>
      </div>

      <DottedSeparator />

      <div className="flex items-center gap-x-1.5 my-2">
        <MembersAvatar
          name={task.assignee?.name}
          fallbackClassname="text-[10px]"
        />
        <div className="size-1 rounded-full bg-neutral-300" />
        <TaskDate value={task.dueDate} className="text-xs" />
      </div>

      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar
          name={task.project?.name}
          image={task.project?.imageUrl}
          fallbackClassName="text-[10px]"
        />
        <span className="text-xs font-medium">{task.project?.name}</span>
      </div>
    </div>
  );
};
