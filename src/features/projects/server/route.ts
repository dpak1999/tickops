import { BUCKET_ID, DATABASE_ID, PROJECT_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { createProjectSchema, updateProjectSchema } from "../schema";
import { Project } from "../types";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { workspaceId } = c.req.valid("query");

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const projects = await databases.listDocuments(DATABASE_ID, PROJECT_ID, [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ]);

      return c.json({
        data: projects,
      });
    }
  )
  .get(
    "/:projectId",
    sessionMiddleware,
    zValidator("param", z.object({ projectId: z.string() })),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { projectId } = c.req.valid("param");

      const project = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECT_ID,
        projectId
      );

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId: project.workspaceId,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      return c.json({ data: project });
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, image, workspaceId } = c.req.valid("form");

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(BUCKET_ID, ID.unique(), image);
        const arrayBuffer = await storage.getFilePreview(BUCKET_ID, file.$id);
        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECT_ID,
        ID.unique(),
        {
          name,
          imageUrl: uploadedImageUrl,
          workspaceId,
        }
      );

      return c.json({ data: project });
    }
  )
  .patch(
    "/:projectId",
    sessionMiddleware,
    zValidator("form", updateProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { projectId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const existingProject = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECT_ID,
        projectId
      );

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId: existingProject.workspaceId,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(BUCKET_ID, ID.unique(), image);
        const arrayBuffer = await storage.getFilePreview(BUCKET_ID, file.$id);
        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      } else {
        uploadedImageUrl = image;
      }

      const project = await databases.updateDocument(
        DATABASE_ID,
        PROJECT_ID,
        projectId,
        {
          name,
          imageUrl: uploadedImageUrl,
        }
      );

      return c.json({ data: project });
    }
  )
  .delete("/:projectId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { projectId } = c.req.param();

    const existingProject = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECT_ID,
      projectId
    );

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: existingProject.workspaceId,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // TODO: Delete all tasks in the project

    await databases.deleteDocument(DATABASE_ID, PROJECT_ID, projectId);

    return c.json({ data: { $id: projectId } });
  });

export default app;
