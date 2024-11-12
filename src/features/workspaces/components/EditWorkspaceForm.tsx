"use client";

import { ChangeEvent, FC, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateWorkspaceSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DottedSeparator from "@/components/dotted";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Workspace } from "../types";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { toast } from "sonner";
import { useResetInviteCode } from "../api/use-reset-invite-code";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

const EditWorkspaceForm: FC<EditWorkspaceFormProps> = ({
  onCancel,
  initialValues,
}) => {
  const { mutate, isPending } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();
  const { mutate: resetInviteCode, isPending: isResettingInviteCode } =
    useResetInviteCode();

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete workspace",
    "This action cannot be un-done",
    "destructive"
  );
  const [ResetDialog, confirmReset] = useConfirm(
    "Reset invite link",
    "This will revoke the current invite link",
    "destructive"
  );

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    deleteWorkspace(
      { param: { workspaceId: initialValues.$id } },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
      }
    );
  };

  const handleReset = async () => {
    const ok = await confirmReset();
    if (!ok) return;
    resetInviteCode(
      { param: { workspaceId: initialValues.$id } },
      {
        onSuccess: () => {
          router.refresh();
        },
      }
    );
  };

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: { ...initialValues, image: initialValues.imageUrl ?? "" },
  });

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate(
      { form: finalValues, param: { workspaceId: initialValues.$id } },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(fullInviteLink).then(() => {
      toast.success("Invite link copied");
    });
  };

  const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <ResetDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialValues.$id}`)
            }
          >
            <ArrowLeftIcon className="size-4 mr-1" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            Update workspace {initialValues.name}
          </CardTitle>
        </CardHeader>

        <div className="px-7">
          <DottedSeparator />
        </div>

        <CardContent className="p-7">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Workspace name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter workspace name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  name="image"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <div className="flex flex-col gap-y-2">
                        <div className="flex items-center gap-x-5">
                          {field.value ? (
                            <div className="size-[72px] relative rounded-md overflow-hidden">
                              <Image
                                src={
                                  field.value instanceof File
                                    ? URL.createObjectURL(field.value)
                                    : field.value
                                }
                                alt="workspace image"
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <Avatar className="size-[72px]">
                              <AvatarFallback>
                                <ImageIcon className="size-[36px] text-neutral-400" />
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div className="flex flex-col">
                            <p className="text-sm">Workspace Icon</p>
                            <p className="text-sm text-muted-foreground">
                              JPG, PNG, SVG, JPEG, max 1mb
                            </p>
                            <input
                              type="file"
                              className="hidden"
                              ref={inputRef}
                              disabled={isPending}
                              onChange={handleImageChange}
                              accept=".jpg, .png, .svg, .jpeg"
                            />

                            {field.value ? (
                              <Button
                                type="button"
                                disabled={isPending}
                                variant={"destructive"}
                                className="w-fit mt-2"
                                size={"xs"}
                                onClick={() => {
                                  field.onChange(null);
                                  if (inputRef.current) {
                                    inputRef.current.value = "";
                                  }
                                }}
                              >
                                Remove Image{" "}
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                disabled={isPending}
                                variant={"tertiary"}
                                className="w-fit mt-2"
                                size={"xs"}
                                onClick={() => inputRef.current?.click()}
                              >
                                Upload Image{" "}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
                <DottedSeparator className="py-7" />
              </div>

              <div className="flex items-center justify-center">
                <Button
                  type="button"
                  variant={"secondary"}
                  size={"lg"}
                  onClick={onCancel}
                  className={cn(!onCancel && "invisible")}
                  disabled={
                    isPending || isDeletingWorkspace || isResettingInviteCode
                  }
                >
                  Cancel
                </Button>
                <Button
                  disabled={
                    isPending || isDeletingWorkspace || isResettingInviteCode
                  }
                  type="submit"
                  size={"lg"}
                >
                  Save changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Reset invite */}
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Invite member</h3>
            <p className="text-sm text-muted-foreground">
              Use the invite link to invite user to join your workspace.
            </p>

            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input disabled value={fullInviteLink} />
              </div>
            </div>

            <DottedSeparator className="py-7" />

            <div className="flex">
              <Button
                className="mt-6 ml-auto"
                type="button"
                size={"sm"}
                onClick={handleCopyInviteLink}
              >
                <CopyIcon className="size-5" />
                Copy Invite Link
              </Button>
              <Button
                className="mt-6 w-fit ml-1"
                type="button"
                size={"sm"}
                variant={"destructive"}
                disabled={
                  isPending || isDeletingWorkspace || isResettingInviteCode
                }
                onClick={handleReset}
              >
                Reset Invite Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is irreversible and will remove all
              associated data.
            </p>

            <DottedSeparator className="py-7" />

            <Button
              className="mt-6 w-fit ml-auto"
              type="button"
              size={"sm"}
              variant={"destructive"}
              disabled={
                isPending || isDeletingWorkspace || isResettingInviteCode
              }
              onClick={handleDelete}
            >
              Delete workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditWorkspaceForm;
