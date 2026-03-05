import type { FastifyInstance } from "fastify";
import { eq, and, or } from "drizzle-orm";
import { users, projects, projectMembers } from "@proton/shared";
import type {
  AddMemberBody,
  RemoveMemberBody,
  ProjectMemberView,
} from "@proton/shared";
import type { AppDb } from "../db/app.js";

export async function collaborationRoutes(
  fastify: FastifyInstance,
  db: AppDb,
): Promise<void> {
  fastify.get<{ Params: { projectId: string } }>(
    "/projects/:projectId/members",
    async (request, reply) => {
      await request.jwtVerify();
      const caller = request.user as { id: number };
      const { projectId } = request.params;

      const isMember = await db
        .select()
        .from(projectMembers)
        .where(
          and(
            eq(projectMembers.projectId, projectId),
            eq(projectMembers.userId, caller.id),
          ),
        );

      if (isMember.length === 0) {
        return reply.status(403).send({ error: "Access denied" });
      }

      const members = await db
        .select({
          userId: users.id,
          username: users.username,
          email: users.email,
          joinedAt: projectMembers.joinedAt,
        })
        .from(projectMembers)
        .innerJoin(users, eq(projectMembers.userId, users.id))
        .where(eq(projectMembers.projectId, projectId));

      return reply.status(200).send(members satisfies ProjectMemberView[]);
    },
  );

  fastify.post<{ Body: AddMemberBody }>(
    "/projects/members/add",
    async (request, reply) => {
      await request.jwtVerify();
      const caller = request.user as { id: number };
      const body = request.body as AddMemberBody;

      const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, body.projectId));

      if (project.length === 0) {
        return reply.status(404).send({ error: "Project not found" });
      }

      if (project[0]!.createdBy !== caller.id) {
        return reply
          .status(403)
          .send({ error: "Only project owner can add members" });
      }

      const target = await db
        .select()
        .from(users)
        .where(
          or(
            eq(users.username, body.usernameOrEmail),
            eq(users.email, body.usernameOrEmail),
          ),
        );

      if (target.length === 0) {
        return reply.status(404).send({ error: "User not found" });
      }

      const targetUser = target[0]!;

      const alreadyMember = await db
        .select()
        .from(projectMembers)
        .where(
          and(
            eq(projectMembers.projectId, body.projectId),
            eq(projectMembers.userId, targetUser.id),
          ),
        );

      if (alreadyMember.length > 0) {
        return reply.status(409).send({ error: "User is already a member" });
      }

      await db.insert(projectMembers).values({
        projectId: body.projectId,
        userId: targetUser.id,
        joinedAt: new Date(),
      });

      return reply.status(201).send({
        userId: targetUser.id,
        username: targetUser.username,
        email: targetUser.email,
        joinedAt: new Date(),
      } satisfies ProjectMemberView);
    },
  );

  fastify.post<{ Body: RemoveMemberBody }>(
    "/projects/members/remove",
    async (request, reply) => {
      await request.jwtVerify();
      const caller = request.user as { id: number };
      const body = request.body as RemoveMemberBody;

      const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, body.projectId));

      if (project.length === 0) {
        return reply.status(404).send({ error: "Project not found" });
      }

      if (project[0]!.createdBy !== caller.id) {
        return reply
          .status(403)
          .send({ error: "Only project owner can remove members" });
      }

      if (body.userId === caller.id) {
        return reply
          .status(400)
          .send({ error: "Cannot remove yourself from project" });
      }

      await db
        .delete(projectMembers)
        .where(
          and(
            eq(projectMembers.projectId, body.projectId),
            eq(projectMembers.userId, body.userId),
          ),
        );

      return reply.status(200).send({ ok: true });
    },
  );
}
