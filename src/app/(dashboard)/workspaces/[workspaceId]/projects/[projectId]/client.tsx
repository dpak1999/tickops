"use client";

import PageError from "@/components/PageError";
import PageLoader from "@/components/PageLoader";
import { Button } from "@/components/ui/button";
import { useGetProject } from "@/features/projects/api/use-get-project";
import ProjectAvatar from "@/features/projects/components/projectAvatar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import TaskViewSwitcher from "@/features/tasks/components/TaskViewSwitcher";
import { PencilIcon } from "lucide-react";
import Link from "next/link";

export const ProjectIdClient = () => {
  const projectId = useProjectId();
  const { data: project, isLoading } = useGetProject({ projectId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!project) {
    return <PageError message="Project not found" />;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-medium">{project.name}</p>
        </div>

        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}
            >
              <PencilIcon className="size-4 mr-1" />
              Edit project
            </Link>
          </Button>
        </div>
      </div>

      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};
