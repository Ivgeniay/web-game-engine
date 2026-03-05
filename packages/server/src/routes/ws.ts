import type { FastifyInstance } from "fastify";
import { eq, and } from "drizzle-orm";
import { projectMembers, users } from "@proton/shared";
import type { AppDb } from "../db/app.js";
import { RoomManager } from "../ws/RoomMamager.js";

export async function wsRoutes(
  fastify: FastifyInstance,
  db: AppDb,
): Promise<void> {
  fastify.get<{
    Params: { projectId: string };
    Querystring: { token: string };
  }>(
    "/projects/:projectId/ws",
    { websocket: true },
    async (socket, request) => {
      const { projectId } = request.params;
      const { token } = request.query;

      let caller: { id: number; username: string };

      try {
        caller = fastify.jwt.verify<{ id: number; username: string }>(token);
      } catch {
        socket.close(1008, "Unauthorized");
        return;
      }

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
        socket.close(1008, "Access denied");
        return;
      }

      const member = {
        ws: socket,
        userId: caller.id,
        username: caller.username,
      };
      RoomManager.join(projectId, member);
      RoomManager.broadcast(
        projectId,
        { type: "user.joined", userId: caller.id, username: caller.username },
        member,
      );

      socket.on("close", () => {
        console.log(
          `user ${caller.username} disconnected from project ${projectId}`,
        );
        RoomManager.leave(projectId, member);
        RoomManager.broadcast(projectId, {
          type: "user.left",
          userId: caller.id,
          username: caller.username,
        });
      });
    },
  );
}
