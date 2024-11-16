import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projecId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.projects)[":projecId"]["$patch"]
>;

export const useUpdateProject = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.projects[":projecId"]["$patch"]({
        form,
        param,
      });
      if (!response.ok) {
        throw new Error("Failed to update project");
      }
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Project updated successfully");
      router.refresh();

      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
    },
    onError: () => {
      toast.error("Failed to update project");
    },
  });

  return mutation;
};
