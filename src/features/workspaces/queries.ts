"use server";

import { Query } from "node-appwrite";
import { DATABASE_ID, MEMBER_ID, WORKSPACE_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";

export const getWorkspaces = async () => {
  const { account, databases } = await createSessionClient();
  const user = await account.get();

  const members = await databases.listDocuments(DATABASE_ID, MEMBER_ID, [
    Query.equal("userId", user.$id),
  ]);

  const workspaceIds = members.documents.map((md) => md.workspaceId);

  const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACE_ID, [
    Query.orderDesc("$createdAt"),
    Query.contains("$id", workspaceIds),
  ]);

  return workspaces;
};
