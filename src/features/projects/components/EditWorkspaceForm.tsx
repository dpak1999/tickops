"use client";

import { ChangeEvent, FC, useRef } from "react";
import { Project } from "../types";
import { useUpdateProject } from "../api/use-update-project";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { updateProjectSchema } from "../schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface EditProjectFormProps {
  onCancel?: () => void;
  initialValues: Project;
}

const EditProjectForm: FC<EditProjectFormProps> = ({
  onCancel,
  initialValues,
}) => {
  const { mutate, isPending } = useUpdateProject();
  // const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
  //   useDeleteWorkspace();

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete project",
    "This action cannot be un-done",
    "destructive"
  );

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    // deleteWorkspace(
    //   { param: { workspaceId: initialValues.$id } },
    //   {
    //     onSuccess: () => {
    //       window.location.href = "/";
    //     },
    //   }
    // );
  };

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: { ...initialValues, image: initialValues.imageUrl ?? "" },
  });

  const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate(
      { form: finalValues, param: { projecId: initialValues.$id } },
      {
        onError: () => {
          form.reset();
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

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={
              onCancel
                ? onCancel
                : () =>
                    router.push(
                      `/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`
                    )
            }
          >
            <ArrowLeftIcon className="size-4 mr-1" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            Update {initialValues.name}
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
                        <FormLabel>Project name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter project name"
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
                            <p className="text-sm">Project Icon</p>
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
                  // disabled={
                  //   isPending || isDeletingWorkspace
                  // }
                >
                  Cancel
                </Button>
                <Button
                  // disabled={
                  //   isPending || isDeletingWorkspace
                  // }
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

      {/* Danger zone */}
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a project is irreversible and will remove all associated
              data.
            </p>

            <DottedSeparator className="py-7" />

            <Button
              className="mt-6 w-fit ml-auto"
              type="button"
              size={"sm"}
              variant={"destructive"}
              // disabled={
              //   isPending || isDeletingWorkspace
              // }
              onClick={handleDelete}
            >
              Delete project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProjectForm;
