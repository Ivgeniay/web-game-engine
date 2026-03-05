import { int, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: int("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  createdAt: int("created_at", { mode: "timestamp" }).notNull(),
});

export const engineTemplates = sqliteTable("engine_templates", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  data: text("data").notNull(),
});

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  engineTemplateId: int("engine_template_id").notNull(),
  createdBy: int("created_by").notNull(),
  createdAt: int("created_at", { mode: "timestamp" }).notNull(),
});

export const projectMembers = sqliteTable("project_members", {
  projectId: text("project_id").notNull(),
  userId: int("user_id").notNull(),
  joinedAt: int("joined_at", { mode: "timestamp" }).notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type EngineTemplate = typeof engineTemplates.$inferSelect;
export type NewEngineTemplate = typeof engineTemplates.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type ProjectMember = typeof projectMembers.$inferSelect;
export type NewProjectMember = typeof projectMembers.$inferInsert;
