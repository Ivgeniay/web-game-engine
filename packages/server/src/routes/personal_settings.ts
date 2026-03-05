import type { FastifyInstance } from "fastify";
import { eq, and } from "drizzle-orm";
import { userSettings } from "@proton/shared";
import type { UpsertSettingBody } from "@proton/shared";
import { ProjectDbManager } from "../db/ProjectDbManager.js";

export async function personalSettingsRoutes(
  fastify: FastifyInstance,
): Promise<void> {
  fastify.get<{ Params: { projectId: string } }>(
    "/projects/:projectId/user-settings",
    async (request, reply) => {
      await request.jwtVerify();
      const caller = request.user as { id: number };
      const { projectId } = request.params;

      const projectDb = await ProjectDbManager.get(projectId);

      const result = await projectDb
        .select()
        .from(userSettings)
        .where(eq(userSettings.userId, caller.id));

      return reply.status(200).send(result);
    },
  );

  fastify.put<{ Params: { projectId: string }; Body: UpsertSettingBody }>(
    "/projects/:projectId/user-settings",
    async (request, reply) => {
      await request.jwtVerify();
      const caller = request.user as { id: number };
      const { projectId } = request.params;
      const body = request.body as UpsertSettingBody;
      console.log("PUT user-settings", { projectId, userId: caller.id, body });

      const projectDb = await ProjectDbManager.get(projectId);

      await projectDb
        .insert(userSettings)
        .values({
          userId: caller.id,
          key: body.key,
          value: body.value,
        })
        .onConflictDoUpdate({
          target: [userSettings.userId, userSettings.key],
          set: { value: body.value },
        });

      return reply.status(200).send({ ok: true });
    },
  );

  fastify.get<{ Params: { projectId: string; key: string } }>(
    "/projects/:projectId/user-settings/:key",
    async (request, reply) => {
      await request.jwtVerify();
      const caller = request.user as { id: number };
      const { projectId, key } = request.params;

      const projectDb = await ProjectDbManager.get(projectId);

      const result = await projectDb
        .select()
        .from(userSettings)
        .where(
          and(eq(userSettings.userId, caller.id), eq(userSettings.key, key)),
        );

      if (result.length === 0) {
        return reply.status(404).send({ error: "Setting not found" });
      }

      return reply.status(200).send(result[0]);
    },
  );
}
