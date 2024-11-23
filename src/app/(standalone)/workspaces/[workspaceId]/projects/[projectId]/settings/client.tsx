"use client";

import PageError from "@/components/PageError";
import PageLoader from "@/components/PageLoader";
import { useGetProject } from "@/features/projects/api/use-get-project";
import EditProjectForm from "@/features/projects/components/EditProjectForm";
import { useProjectId } from "@/features/projects/hooks/use-project-id";

export const ProjectSettingsClient = () => {
  const projectId = useProjectId();
  const { data: project, isLoading } = useGetProject({ projectId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!project) {
    return <PageError message="Project not found" />;
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={project} />
    </div>
  );
};
