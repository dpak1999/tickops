import { Button } from "@/components/ui/button";
import { Task } from "../types";
import { PencilIcon } from "lucide-react";
import DottedSeparator from "@/components/dotted";
import OverviewProperty from "./OverviewProperty";
import MembersAvatar from "@/features/members/components/membersAvatar";
import { TaskDate } from "./TaskDate";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";

interface TaskOverviewProps {
  task: Task;
}

const TaskOverview = ({ task }: TaskOverviewProps) => {
  const { open } = useEditTaskModal();

  return (
    <div className="flex flex-col col-span-1 gap-y-4">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button
            onClick={() => open(task.$id)}
            variant={"secondary"}
            size={"sm"}
          >
            <PencilIcon className="size-4 mr-2" />
            Edit
          </Button>
        </div>

        <DottedSeparator className="my-4" />

        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Assignee">
            <MembersAvatar name={task.assignee?.name} className="size-6" />
            <p className="text-sm font-medium">{task.assignee?.name}</p>
          </OverviewProperty>

          <OverviewProperty label="Due Date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>

          <OverviewProperty label="Status">
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};

export default TaskOverview;
