import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import fastifyWebSocket from "@fastify/websocket";
import { defaultServerConfig } from "./config/server_config.js";
import { createAppDb } from "./db/app.js";
import { ProjectDbManager } from "./db/ProjectDbManager.js";
import { authRoutes } from "./routes/auth.js";
import { projectRoutes } from "./routes/projects.js";
import { collaborationRoutes } from "./routes/collaboration.js";
import { personalSettingsRoutes } from "./routes/personal_settings.js";
import { wsRoutes } from "./routes/ws.js";
import { FileService } from "./services/FileService.js";
import { MetaService } from "./services/MetaService.js";
import { fileRoutes } from "./routes/files.js";
import { scanAndEnsureMeta } from "./utils/scanAndEnsureMeta.js";

const app = Fastify({ logger: true });

const start = async () => {
  try {
    const config = defaultServerConfig;
    const db = await createAppDb(config.dbPath);

    ProjectDbManager.init(config.projectsPath);
    FileService.init(config.projectsPath);
    MetaService.init(config.projectsPath);

    await app.register(fastifyJwt, { secret: config.jwtSecret });
    await app.register(fastifyCors, {
      origin: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    });
    await app.register(fastifyWebSocket);

    await authRoutes(app, db, config);
    await projectRoutes(app, db, config);
    await collaborationRoutes(app, db);
    await personalSettingsRoutes(app);
    await wsRoutes(app, db);
    await fileRoutes(app);

    app.get("/health", async () => {
      return { status: "ok" };
    });

    await scanAndEnsureMeta(config.projectsPath);
    await app.listen({ port: config.port, host: config.host });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
