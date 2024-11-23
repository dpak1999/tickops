import { Project } from "@/features/projects/types";
import { TaskStatus } from "../../types";
import { cn } from "@/lib/utils";
import MembersAvatar from "@/features/members/components/membersAvatar";
import ProjectAvatar from "@/features/projects/components/projectAvatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

interface EventCardProps {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assignee: any;
  project: Project;
  status: TaskStatus;
  id: string;
}

const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: "border-l-red-500",
  [TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
  [TaskStatus.IN_REVIEW]: "border-l-blue-500",
  [TaskStatus.DONE]: "border-l-emerald-500",
  [TaskStatus.BACKLOG]: "border-l-pink-500",
  [TaskStatus.ON_HOLD]: "border-l-gray-500",
  [TaskStatus.QA]: "border-l-purple-500",
  [TaskStatus.CANCELLED]: "border-l-red-500",
};

const EventCard: React.FC<EventCardProps> = ({
  title,
  assignee,
  project,
  status,
  id,
}) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  return (
    <div className="px-2">
      <div
        onClick={handleClick}
        className={cn(
          "p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer transition hover:opacity-75",
          statusColorMap[status]
        )}
      >
        <p>{title}</p>
        <div className="flex items-center gap-x-1">
          <MembersAvatar name={assignee?.name} />
          <div className="size-1 rounded-full bg-neutral-300"></div>
          <ProjectAvatar name={project?.name} image={project?.imageUrl} />
        </div>
      </div>
    </div>
  );
};

export default EventCard;
