import { getCurrent } from "@/features/auth/queries";
import { getWorkspace } from "@/features/workspaces/queries";
import EditWorkspaceForm from "@/features/workspaces/components/EditWorkspaceForm";
import { redirect } from "next/navigation";
import { FC } from "react";

interface WorkspaceIdSettingsPageProps {
  params: { workspaceId: string };
}

const WorkspaceIdSettingsPage: FC<WorkspaceIdSettingsPageProps> = async ({
  params,
}) => {
  const user = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }

  const initialValues = await getWorkspace(params.workspaceId);

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={initialValues} />
    </div>
  );
};

export default WorkspaceIdSettingsPage;
