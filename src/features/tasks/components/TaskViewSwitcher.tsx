"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import DottedSeparator from "@/components/dotted";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";

const TaskViewSwitcher = () => {
  const { open } = useCreateTaskModal();

  return (
    <Tabs className="flex-1 w-full border rounded-lg">
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
        <div>Filters</div>
        <DottedSeparator className="my-4" />

        <TabsContent value="table" className="mt-0 ">
          Table
        </TabsContent>
        <TabsContent value="kanban">Kanban</TabsContent>
        <TabsContent value="calendar">Calendar</TabsContent>
      </div>
    </Tabs>
  );
};

export default TaskViewSwitcher;
