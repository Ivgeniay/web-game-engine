import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import { resolve } from "node:path";
import { defaultServerConfig } from "./config/server_config.js";
import { createAppDb } from "./db/app.js";
import { ProjectDbManager } from "./db/ProjectDbManager.js";
import { authRoutes } from "./routes/auth.js";
import { projectRoutes } from "./routes/projects.js";
import { collaborationRoutes } from "./routes/collaboration.js";
import { personalSettingsRoutes } from "./routes/personal_settings.js";

const app = Fastify({ logger: true });

const start = async () => {
  try {
    const config = defaultServerConfig;
    const db = await createAppDb(config.dbPath);

    const projectsDir = resolve(config.dbPath, "..", "projects");
    ProjectDbManager.init(projectsDir);

    await app.register(fastifyJwt, { secret: config.jwtSecret });
    await app.register(fastifyCors, {
      origin: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    });

    await authRoutes(app, db, config);
    await projectRoutes(app, db, config);
    await collaborationRoutes(app, db);
    await personalSettingsRoutes(app);

    app.get("/health", async () => {
      return { status: "ok" };
    });

    await app.listen({ port: config.port, host: config.host });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
