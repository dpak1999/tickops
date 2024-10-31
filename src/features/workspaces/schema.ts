import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((v) => {
        return v === "" ? undefined : v;
      }),
    ])
    .optional(),
});
