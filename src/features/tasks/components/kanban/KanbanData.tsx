import { FC, useState } from "react";
import { Task, TaskStatus } from "../../types";
import { DragDropContext } from "@hello-pangea/dnd";
import { KanbanColumnHeader } from "./KanbanColumnHeader";

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.QA,
  TaskStatus.DONE,
  TaskStatus.ON_HOLD,
  TaskStatus.CANCELLED,
];

type TasksState = {
  [key in TaskStatus]: Task[];
};

interface KanbanDataProps {
  data: Task[];
}

export const KanbanData: FC<KanbanDataProps> = ({ data }) => {
  const [tasks, setTasks] = useState<TasksState>(() => {
    const initialTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.QA]: [],
      [TaskStatus.DONE]: [],
      [TaskStatus.ON_HOLD]: [],
      [TaskStatus.CANCELLED]: [],
    };

    data.forEach((task) => {
      initialTasks[task.status].push(task);
    });

    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TaskStatus].sort(
        (a, b) => a.position - b.position
      );
    });

    return initialTasks;
  });

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => (
          <div
            key={board}
            className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]"
          >
            <KanbanColumnHeader board={board} taskCount={tasks[board].length} />
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};
