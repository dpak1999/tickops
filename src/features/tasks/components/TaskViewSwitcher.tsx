"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader, PlusIcon } from "lucide-react";
import DottedSeparator from "@/components/dotted";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { useQueryState } from "nuqs";
import { DataFilters } from "./DataFilters";
import { useTaskFilter } from "../hooks/use-task-filter";
import { DataTable } from "./data-table/DataTable";
import { columns } from "./data-table/columns";
import { useGetTasks } from "../api/use-get-tasks";

const TaskViewSwitcher = () => {
  const [{ status, projectId, assigneeId, dueDate }] = useTaskFilter();
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const workspaceId = useWorkspaceId();
  const { open } = useCreateTaskModal();
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    assigneeId,
    dueDate,
    projectId,
    status,
  });

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full border rounded-lg"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>

          <Button
            onClick={open}
            variant="outline"
            size="sm"
            className="w-full lg:w-auto"
          >
            <PlusIcon className="size-4 mr-2" />
            New
          </Button>
        </div>

        <DottedSeparator className="my-4" />
        <DataFilters />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="animate-spin size-5 text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0 ">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban">{JSON.stringify(tasks)}</TabsContent>
            <TabsContent value="calendar">{JSON.stringify(tasks)}</TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};

export default TaskViewSwitcher;
