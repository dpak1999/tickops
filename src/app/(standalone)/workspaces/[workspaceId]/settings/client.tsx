"use client";

import PageError from "@/components/PageError";
import PageLoader from "@/components/PageLoader";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import EditWorkspaceForm from "@/features/workspaces/components/EditWorkspaceForm";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";

export const WorkspaceSettingsClient = () => {
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading } = useGetWorkspace({ workspaceId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!workspace) {
    return <PageError message="Workspace not found" />;
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={workspace} />
    </div>
  );
};
