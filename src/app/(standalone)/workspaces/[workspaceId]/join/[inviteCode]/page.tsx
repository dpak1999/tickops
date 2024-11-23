import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { WorkspaceJoinClient } from "./client";

const WorkspaceJoinPage = async () => {
  const user = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }

  return <WorkspaceJoinClient />;
};

export default WorkspaceJoinPage;
