import { getCurrent } from "@/features/auth/queries";
import JoinWorkspaceForm from "@/features/workspaces/components/JoinWorkspaceForm";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";
import { FC } from "react";

interface WorkspaceJoinPagePageProps {
  params: { workspaceId: string };
}

const WorkspaceJoinPage: FC<WorkspaceJoinPagePageProps> = async ({
  params,
}) => {
  const user = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }

  const workspace = await getWorkspaceInfo(params.workspaceId);

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={workspace!} />
    </div>
  );
};

export default WorkspaceJoinPage;
