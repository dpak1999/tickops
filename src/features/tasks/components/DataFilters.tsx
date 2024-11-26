import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { FolderIcon, ListChecksIcon, UserIcon } from "lucide-react";
import { FC } from "react";
import { TaskStatus } from "../types";
import { useTaskFilter } from "../hooks/use-task-filter";
import { DatePicker } from "@/components/date-picker";

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}

export const DataFilters: FC<DataFiltersProps> = ({ hideProjectFilter }) => {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading = isLoadingProjects || isLoadingMembers;

  const projectOptions = projects?.documents.map((project) => ({
    label: project.name,
    value: project.$id,
  }));

  const memberOptions = members?.documents.map((member) => ({
    label: member.name,
    value: member.$id,
  }));

  const [{ status, projectId, assigneeId, dueDate }, setFilters] =
    useTaskFilter();

  const onStatusChange = (value: string) => {
    setFilters({ status: value === "all" ? null : (value as TaskStatus) });
  };

  const onAssigneeChange = (value: string) => {
    setFilters({ assigneeId: value === "all" ? null : value });
  };

  const onProjectChange = (value: string) => {
    setFilters({ projectId: value === "all" ? null : value });
  };

  if (isLoading) return null;

  return (
    <div className="flex flex-col gap-2 lg:flex-row">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(v) => {
          onStatusChange(v);
        }}
      >
        <SelectTrigger className="w-full h-8 lg:w-auto">
          <div className="flex items-center pr-2">
            <ListChecksIcon className="size-4 mr-2" />
            <SelectValue placeholder="Status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
          <SelectItem value={TaskStatus.CANCELLED}>Cancelled</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={TaskStatus.QA}>QA</SelectItem>
          <SelectItem value={TaskStatus.ON_HOLD}>On Hold</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={(v) => {
          onAssigneeChange(v);
        }}
      >
        <SelectTrigger className="w-full h-8 lg:w-auto">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="Assignee" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectSeparator />
          {memberOptions?.map((member) => (
            <SelectItem key={member.value} value={member.value}>
              {member.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!hideProjectFilter && (
        <Select
          defaultValue={projectId ?? undefined}
          onValueChange={(v) => {
            onProjectChange(v);
          }}
        >
          <SelectTrigger className="w-full h-8 lg:w-auto">
            <div className="flex items-center pr-2">
              <FolderIcon className="size-4 mr-2" />
              <SelectValue placeholder="Project" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectSeparator />
            {projectOptions?.map((project) => (
              <SelectItem key={project.value} value={project.value}>
                {project.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <DatePicker
        placeholder="Due Date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(v) => {
          setFilters({ dueDate: v ? v.toISOString() : null });
        }}
      />
    </div>
  );
};
