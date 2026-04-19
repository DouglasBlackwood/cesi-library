import process from "node:process"

// biome-ignore lint/style/noProcessEnv: centralized env access
export const DATABASE_URL = process.env.DATABASE_URL ?? "file:./dev.db"
// biome-ignore lint/style/noProcessEnv: centralized env access
export const PORT = process.env.PORT ? Number(process.env.PORT) : 3000
