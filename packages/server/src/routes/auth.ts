import type { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { users, type LoginBody, type RegisterBody } from "@proton/shared";
import type { AppDb } from "../db/app.js";
import type { ServerConfig } from "../config/server_config.js";

export async function authRoutes(
  fastify: FastifyInstance,
  db: AppDb,
  config: ServerConfig,
): Promise<void> {
  fastify.post<{ Body: RegisterBody }>(
    "/auth/register",
    async (request, reply) => {
      const { username, password, email } = request.body;

      const existing = await db
        .select()
        .from(users)
        .where(eq(users.username, username));
      if (existing.length > 0) {
        return reply.status(409).send({ error: "Username already taken" });
      }

      const hashed = await bcrypt.hash(password, config.saltRounds);

      await db.insert(users).values({
        username,
        password: hashed,
        email: email ?? null,
        createdAt: new Date(),
      });

      return reply.status(201).send({ ok: true });
    },
  );

  fastify.post<{ Body: LoginBody }>("/auth/login", async (request, reply) => {
    const { username, password } = request.body;

    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    const user = result[0];

    if (!user) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const token = fastify.jwt.sign({ id: user.id, username: user.username });

    return reply.status(200).send({
      token,
      id: user.id,
      username: user.username,
      email: user.email,
    });
  });
}
