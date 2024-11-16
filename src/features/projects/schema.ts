import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  image: z.union([
    z.instanceof(File),
    z
      .string()
      .transform((v) => {
        return v === "" ? undefined : v;
      })
      .optional(),
  ]),
  workspaceId: z.string(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "Minimum 1 character required").optional(),
  image: z.union([
    z.instanceof(File),
    z
      .string()
      .transform((v) => {
        return v === "" ? undefined : v;
      })
      .optional(),
  ]),
});
