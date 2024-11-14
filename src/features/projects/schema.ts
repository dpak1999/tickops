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
