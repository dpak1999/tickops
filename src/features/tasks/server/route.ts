import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTaskSchema } from "../schemas";
import { getMember } from "@/features/members/utils";
import { DATABASE_ID, MEMBER_ID, PROJECT_ID, TASK_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { Task, TaskStatus } from "../types";
import { createAdminClient } from "@/lib/appwrite";
import { Project } from "@/features/projects/types";

const app = new Hono()
  .delete("/:taskId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const database = c.get("databases");
    const { taskId } = c.req.param();

    const task = await database.getDocument<Task>(DATABASE_ID, TASK_ID, taskId);

    const member = await getMember({
      databases: database,
      userId: user.$id,
      workspaceId: task.workspaceId,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await database.deleteDocument(DATABASE_ID, TASK_ID, taskId);

    return c.json({ data: { $id: task.$id } });
  })
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      })
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const database = c.get("databases");
      const user = c.get("user");

      const { workspaceId, projectId, assigneeId, status, search, dueDate } =
        c.req.valid("query");

      const member = await getMember({
        databases: database,
        userId: user.$id,
        workspaceId,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      if (projectId) {
        query.push(Query.equal("projectId", projectId));
      }

      if (assigneeId) {
        query.push(Query.equal("assigneeId", assigneeId));
      }

      if (status) {
        query.push(Query.equal("status", status));
      }

      if (search) {
        query.push(Query.search("name", search));
      }

      if (dueDate) {
        query.push(Query.equal("dueDate", dueDate));
      }

      const tasks = await database.listDocuments<Task>(
        DATABASE_ID,
        TASK_ID,
        query
      );
      const projectIds = tasks.documents.map((task) => task.projectId);
      const assigneeIds = tasks.documents.map((task) => task.assigneeId);

      const projects = await database.listDocuments<Project>(
        DATABASE_ID,
        PROJECT_ID,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
      );

      const members = await database.listDocuments(
        DATABASE_ID,
        MEMBER_ID,
        assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : []
      );

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);
          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );

      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find(
          (p) => p.$id === task.projectId
        );
        const assignee = assignees.find((a) => a.$id === task.assigneeId);
        return {
          ...task,
          project,
          assignee,
        };
      });

      return c.json({
        data: {
          ...tasks,
          documents: populatedTasks,
        },
      });
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      const user = c.get("user");
      const database = c.get("databases");

      const {
        name,
        description,
        dueDate,
        status,
        workspaceId,
        projectId,
        assigneeId,
      } = c.req.valid("json");

      const member = await getMember({
        databases: database,
        userId: user.$id,
        workspaceId,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const highestPositionTask = await database.listDocuments(
        DATABASE_ID,
        TASK_ID,
        [
          Query.equal("status", status),
          Query.equal("workspaceId", workspaceId),
          Query.orderAsc("position"),
          Query.limit(1),
        ]
      );

      const newPosition =
        highestPositionTask.documents.length > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000;

      const task = await database.createDocument(
        DATABASE_ID,
        TASK_ID,
        ID.unique(),
        {
          name,
          status,
          workspaceId,
          projectId,
          assigneeId,
          dueDate,
          position: newPosition,
          description,
        }
      );

      return c.json({ data: task });
    }
  )
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", createTaskSchema.partial()),
    async (c) => {
      const user = c.get("user");
      const database = c.get("databases");

      const { taskId } = c.req.param();

      const { name, description, dueDate, status, projectId, assigneeId } =
        c.req.valid("json");

      const existingTask = await database.getDocument<Task>(
        DATABASE_ID,
        TASK_ID,
        taskId
      );

      const member = await getMember({
        databases: database,
        userId: user.$id,
        workspaceId: existingTask.workspaceId,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const task = await database.updateDocument(DATABASE_ID, TASK_ID, taskId, {
        name,
        status,
        projectId,
        assigneeId,
        dueDate,
        description,
      });

      return c.json({ data: task });
    }
  )
  .get("/:taskId", sessionMiddleware, async (c) => {
    const database = c.get("databases");
    const currentUser = c.get("user");
    const { users } = await createAdminClient();
    const { taskId } = c.req.param();

    const task = await database.getDocument<Task>(DATABASE_ID, TASK_ID, taskId);

    const taskMember = await getMember({
      databases: database,
      userId: currentUser.$id,
      workspaceId: task.workspaceId,
    });

    if (!taskMember) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const project = await database.getDocument<Project>(
      DATABASE_ID,
      PROJECT_ID,
      task.projectId
    );

    const member = await database.getDocument(
      DATABASE_ID,
      MEMBER_ID,
      task.assigneeId
    );

    const user = await users.get(member.userId);

    const assignee = {
      ...member,
      name: user.name,
      email: user.email,
    };

    return c.json({
      data: { ...task, project, assignee },
    });
  })
  .post(
    "/bulk-update",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        tasks: z.array(
          z.object({
            $id: z.string(),
            status: z.nativeEnum(TaskStatus),
            position: z.number().int().positive().min(1000).max(100000000),
          })
        ),
      })
    ),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { tasks } = c.req.valid("json");

      const tasksToUpdate = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASK_ID,
        [
          Query.contains(
            "$id",
            tasks.map((task) => task.$id)
          ),
        ]
      );

      const workspaceIds = new Set(
        tasksToUpdate.documents.map((task) => task.workspaceId)
      );

      if (workspaceIds.size !== 1) {
        return c.json(
          { error: "All tasks must belong to the same workspace" },
          400
        );
      }

      const workspaceId = workspaceIds.values().next().value;

      if (!workspaceId) {
        return c.json({ error: "Workspace not found" }, 400);
      }

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const updatedTasks = await Promise.all(
        tasks.map(async (task) => {
          const { $id, status, position } = task;
          return databases.updateDocument(DATABASE_ID, TASK_ID, $id, {
            status,
            position,
          });
        })
      );

      return c.json({ data: updatedTasks });
    }
  );

export default app;
