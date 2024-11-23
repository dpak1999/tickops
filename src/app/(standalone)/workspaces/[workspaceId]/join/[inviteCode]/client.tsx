"use client";

import PageError from "@/components/PageError";
import PageLoader from "@/components/PageLoader";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import JoinWorkspaceForm from "@/features/workspaces/components/JoinWorkspaceForm";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";

export const WorkspaceJoinClient = () => {
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading } = useGetWorkspaceInfo({
    workspaceId,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!workspace) {
    return <PageError message="Workspace not found" />;
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={workspace!} />
    </div>
  );
};
