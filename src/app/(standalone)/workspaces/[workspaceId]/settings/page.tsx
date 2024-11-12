import { getCurrent } from "@/features/auth/actions";
import { getWorkspace } from "@/features/workspaces/actions";
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

  if (!initialValues) {
    redirect(`/workspaces/${params.workspaceId}`);
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={initialValues} />
    </div>
  );
};

export default WorkspaceIdSettingsPage;
