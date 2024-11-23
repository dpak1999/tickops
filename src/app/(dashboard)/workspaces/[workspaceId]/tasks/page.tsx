import { getCurrent } from "@/features/auth/queries";
import TaskViewSwitcher from "@/features/tasks/components/TaskViewSwitcher";
import { redirect } from "next/navigation";

const TaksPage = async () => {
  const user = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col h-full">
      <TaskViewSwitcher />
    </div>
  );
};

export default TaksPage;
