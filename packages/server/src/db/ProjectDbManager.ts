import { resolve } from "node:path";
import { createProjectDb, type ProjectDb } from "./project.js";

class ProjectDbManagerClass {
  private pool: Map<string, ProjectDb> = new Map();
  private projectsDir: string = "";

  init(projectsDir: string): void {
    this.projectsDir = projectsDir;
  }

  async get(projectId: string): Promise<ProjectDb> {
    const existing = this.pool.get(projectId);
    if (existing) return existing;

    const projectDir = resolve(this.projectsDir, projectId);
    const db = await createProjectDb(projectDir);
    this.pool.set(projectId, db);
    return db;
  }

  close(projectId: string): void {
    this.pool.delete(projectId);
  }

  closeAll(): void {
    this.pool.clear();
  }
}

export const ProjectDbManager = new ProjectDbManagerClass();
