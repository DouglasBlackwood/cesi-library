import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "@prisma/client"
import { DATABASE_URL } from "./config.js"

const url = DATABASE_URL.replace("file:", "")
const adapter = new PrismaBetterSqlite3({ url })

export const prisma = new PrismaClient({ adapter })
