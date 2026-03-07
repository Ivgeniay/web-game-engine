import type { FastifyInstance } from "fastify";
import type { MultipartFile } from "@fastify/multipart";
import { fileService } from "../services/FileService.js";
import { metaService } from "../services/MetaService.js";
import { RoomManager } from "../ws/RoomManager.js";
import { WsEventName } from "@proton/shared";
import type {
  ScanOptions,
  MoveBody,
  RenameBody,
  CreateFileBody,
  CreateDirBody,
} from "@proton/shared";

export async function fileRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get<{
    Params: { projectId: string };
    Querystring: {
      path?: string;
      recursive?: string;
      offset?: string;
      limit?: string;
      excludeExtensions?: string;
      includeExtensions?: string;
      maxDepth?: string;
    };
  }>("/projects/:projectId/assets", async (request, reply) => {
    await request.jwtVerify();

    const { projectId } = request.params;
    const q = request.query;

    const options: ScanOptions = {
      recursive: q.recursive === "true",
      ...(q.offset && { offset: Number(q.offset) }),
      ...(q.limit && { limit: Number(q.limit) }),
      ...(q.maxDepth && { maxDepth: Number(q.maxDepth) }),
      ...(q.excludeExtensions && {
        excludeExtensions: q.excludeExtensions.split(","),
      }),
      ...(q.includeExtensions && {
        includeExtensions: q.includeExtensions.split(","),
      }),
    };

    const result = await fileService.listAssets(
      projectId,
      q.path ?? "",
      options,
    );

    return reply.status(200).send(result);
  });

  fastify.get<{
    Params: { projectId: string };
    Querystring: { path: string };
  }>("/projects/:projectId/assets/meta", async (request, reply) => {
    await request.jwtVerify();

    const { projectId } = request.params;
    const { path } = request.query;

    const meta = await metaService.read(projectId, path);
    if (!meta) return reply.status(404).send({ error: "Meta not found" });

    return reply.status(200).send(meta);
  });

  fastify.post<{
    Params: { projectId: string };
    Body: CreateFileBody;
  }>("/projects/:projectId/assets/file", async (request, reply) => {
    await request.jwtVerify();

    const { projectId } = request.params;
    const { path } = request.body;

    await fileService.createFile(projectId, path);

    RoomManager.broadcast(projectId, {
      type: WsEventName.fsFileCreated,
      path,
    });

    return reply.status(201).send({ path });
  });

  fastify.post<{
    Params: { projectId: string };
    Body: CreateDirBody;
  }>("/projects/:projectId/assets/directory", async (request, reply) => {
    await request.jwtVerify();

    const { projectId } = request.params;
    const { path } = request.body;

    await fileService.createDirectory(projectId, path);

    RoomManager.broadcast(projectId, {
      type: WsEventName.fsDirCreated,
      path,
    });

    return reply.status(201).send({ path });
  });

  fastify.post<{
    Params: { projectId: string };
    Querystring: { path: string };
  }>("/projects/:projectId/assets/upload", async (request, reply) => {
    await request.jwtVerify();

    const { projectId } = request.params;
    const { path } = request.query;

    const data = (await request.file()) as MultipartFile | undefined;
    if (!data) return reply.status(400).send({ error: "No file provided" });

    const finalPath = await fileService.uploadFile(projectId, path, data.file);

    RoomManager.broadcast(projectId, {
      type: WsEventName.fsFileCreated,
      path: finalPath,
    });

    return reply.status(201).send({ path: finalPath });
  });

  fastify.put<{
    Params: { projectId: string };
    Querystring: { path: string };
  }>("/projects/:projectId/assets/upload", async (request, reply) => {
    await request.jwtVerify();

    const { projectId } = request.params;
    const { path } = request.query;

    const data = (await request.file()) as MultipartFile | undefined;
    if (!data) return reply.status(400).send({ error: "No file provided" });

    await fileService.overwriteFile(projectId, path, data.file);

    RoomManager.broadcast(projectId, {
      type: WsEventName.fsFileOverwritten,
      path,
    });

    return reply.status(200).send({ path });
  });

  fastify.get<{
    Params: { projectId: string };
    Querystring: { path: string };
  }>("/projects/:projectId/assets/download", async (request, reply) => {
    await request.jwtVerify();

    const { projectId } = request.params;
    const { path } = request.query;

    const exists = await fileService.exists(projectId, path);
    if (!exists) return reply.status(404).send({ error: "File not found" });

    const stream = fileService.readStream(projectId, path);
    const filename = path.split("/").at(-1) ?? "file";

    return reply
      .header("Content-Disposition", `attachment; filename="${filename}"`)
      .header("Content-Type", "application/octet-stream")
      .send(stream);
  });

  fastify.patch<{
    Params: { projectId: string };
    Body: MoveBody;
  }>("/projects/:projectId/assets/file/move", async (request, reply) => {
    await request.jwtVerify();

    const { projectId } = request.params;
    const { fromPath, toPath } = request.body;

    await fileService.moveFile(projectId, fromPath, toPath);

    RoomManager.broadcast(projectId, {
      type: WsEventName.fsFileMoved,
      fromPath,
      toPath,
    });

    return reply.status(200).send({ fromPath, toPath });
  });

  fastify.patch<{
    Params: { projectId: string };
    Body: MoveBody;
  }>("/projects/:projectId/assets/directory/move", async (request, reply) => {
    await request.jwtVerify();

    const { projectId } = request.params;
    const { fromPath, toPath } = request.body;

    await fileService.moveDirectory(projectId, fromPath, toPath);

    RoomManager.broadcast(projectId, {
      type: WsEventName.fsDirMoved,
      fromPath,
      toPath,
    });

    return reply.status(200).send({ fromPath, toPath });
  });

  fastify.patch<{
    Params: { projectId: string };
    Body: RenameBody;
  }>("/projects/:projectId/assets/file/rename", async (request, reply) => {
    await request.jwtVerify();

    const { projectId } = request.params;
    const { path, newName } = request.body;

    await fileService.renameFile(projectId, path, newName);

    RoomManager.broadcast(projectId, {
      type: WsEventName.fsFileRenamed,
      path,
      newName,
    });

    return reply.status(200).send({ path, newName });
  });

  fastify.patch<{
    Params: { projectId: string };
    Body: RenameBody;
  }>("/projects/:projectId/assets/directory/rename", async (request, reply) => {
    await request.jwtVerify();

    const { projectId } = request.params;
    const { path, newName } = request.body;

    await fileService.renameDirectory(projectId, path, newName);

    RoomManager.broadcast(projectId, {
      type: WsEventName.fsDirRenamed,
      path,
      newName,
    });

    return reply.status(200).send({ path, newName });
  });

  fastify.delete<{
    Params: { projectId: string };
    Querystring: { path: string };
  }>("/projects/:projectId/assets/file", async (request, reply) => {
    await request.jwtVerify();

    const { projectId } = request.params;
    const { path } = request.query;

    await fileService.deleteFile(projectId, path);

    RoomManager.broadcast(projectId, {
      type: WsEventName.fsFileDeleted,
      path,
    });

    return reply.status(200).send({ path });
  });

  fastify.delete<{
    Params: { projectId: string };
    Querystring: { path: string };
  }>("/projects/:projectId/assets/directory", async (request, reply) => {
    await request.jwtVerify();

    const { projectId } = request.params;
    const { path } = request.query;

    await fileService.deleteDirectory(projectId, path);

    RoomManager.broadcast(projectId, {
      type: WsEventName.fsDirDeleted,
      path,
    });

    return reply.status(200).send({ path });
  });
}
