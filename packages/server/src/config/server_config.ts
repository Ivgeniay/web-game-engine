import "dotenv/config";

export interface ServerConfig {
  port: number;
  host: string;
  jwtSecret: string;
  saltRounds: number;
  dbPath: string;
}

export const defaultServerConfig: ServerConfig = {
  port: process.env["PORT"] ? parseInt(process.env["PORT"]) : 3000,
  host: process.env["HOST"] ?? "0.0.0.0",
  jwtSecret: process.env["JWT_SECRET"] ?? "change_me_in_production",
  saltRounds: process.env["SALT_ROUNDS"]
    ? parseInt(process.env["SALT_ROUNDS"])
    : 10,
  dbPath: process.env["DB_PATH"] ?? "data/app.db",
};
