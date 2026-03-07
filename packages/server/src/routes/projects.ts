import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { engineTemplates, projects, projectMembers } from "@proton/shared";
import type { CreateProjectBody } from "@proton/shared";
import type { AppDb } from "../db/app.js";
import type { ServerConfig } from "../config/server_config.js";
import { ProjectDbManager } from "../db/ProjectDbManager.js";

export async function projectRoutes(
  fastify: FastifyInstance,
  db: AppDb,
  config: ServerConfig,
): Promise<void> {
  fastify.get("/engine-templates", async (_request, reply) => {
    const templates = await db.select().from(engineTemplates);
    return reply.status(200).send(templates);
  });

  fastify.get("/projects", async (request, reply) => {
    await request.jwtVerify();
    const user = request.user as { id: number; username: string };

    const result = await db
      .select({
        id: projects.id,
        name: projects.name,
        engineTemplateId: projects.engineTemplateId,
        createdBy: projects.createdBy,
        createdAt: projects.createdAt,
      })
      .from(projects)
      .innerJoin(projectMembers, eq(projects.id, projectMembers.projectId))
      .where(eq(projectMembers.userId, user.id));

    return reply.status(200).send(result);
  });

  fastify.post<{ Body: CreateProjectBody }>(
    "/projects",
    async (request, reply) => {
      await request.jwtVerify();
      const user = request.user as { id: number; username: string };
      const body = request.body as CreateProjectBody;

      const template = await db
        .select()
        .from(engineTemplates)
        .where(eq(engineTemplates.id, body.engineTemplateId));

      if (template.length === 0) {
        return reply.status(400).send({ error: "Invalid engine template" });
      }

      const id = randomUUID();
      const now = new Date();

      //const projectDir = resolve(config.dbPath, "..", "projects", id);
      const projectDir = resolve(config.projectsPath, id);
      await mkdir(resolve(projectDir, "Assets"), { recursive: true });

      await ProjectDbManager.get(id);

      await db.insert(projects).values({
        id,
        name: body.name,
        engineTemplateId: body.engineTemplateId,
        createdBy: user.id,
        createdAt: now,
      });

      await db.insert(projectMembers).values({
        projectId: id,
        userId: user.id,
        joinedAt: now,
      });

      return reply.status(201).send({ id, name: body.name });
    },
  );
}
