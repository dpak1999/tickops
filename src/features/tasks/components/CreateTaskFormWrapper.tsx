import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { Loader } from "lucide-react";
import { FC } from "react";
import CreateTaskForm from "./CreateTaskForm";

interface CreateTaskFormWrapperProps {
  onCancel: () => void;
}

const CreateTaskFormWrapper: FC<CreateTaskFormWrapperProps> = ({
  onCancel,
}) => {
  const workspaceId = useWorkspaceId();

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const projectOptions = projects?.documents.map((project) => ({
    name: project.name,
    id: project.$id,
    imageUrl: project.imageUrl,
  }));

  const memberOptions = members?.documents.map((member) => ({
    name: member.name,
    id: member.$id,
  }));

  const isLoading = isLoadingProjects || isLoadingMembers;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex justify-center h-full">
          <Loader className="animate-spin size-5 text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <CreateTaskForm
      projectOptions={projectOptions ?? []}
      memberOptions={memberOptions ?? []}
      onCancel={onCancel}
    />
  );
};

export default CreateTaskFormWrapper;
