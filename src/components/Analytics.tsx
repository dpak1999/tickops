import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { AnalyticsCard } from "./AnalyticsCard";
import DottedSeparator from "./dotted";

interface AnalyticsProps {
  data: ProjectAnalyticsResponseType;
}

export const Analytics = ({ data }: AnalyticsProps) => {
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Total tasks"
            value={data.data.taskCount}
            variant={data.data.taskDifference > 0 ? "up" : "down"}
            increaseValue={data.data.taskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Assigned tasks"
            value={data.data.assignedTaskCount}
            variant={data.data.assignedTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.data.assignedTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Completed tasks"
            value={data.data.completedTaskCount}
            variant={data.data.completedTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.data.completedTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Overdue tasks"
            value={data.data.overdueTaskCount}
            variant={data.data.overdueTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.data.overdueTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Incomplete tasks"
            value={data.data.incompleteTaskCount}
            variant={data.data.incompleteTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.data.incompleteTaskDifference}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
