import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "@prisma/client"

const url = (process.env.DATABASE_URL ?? "file:./dev.db").replace("file:", "")
const adapter = new PrismaBetterSqlite3({ url })

const prisma = new PrismaClient({ adapter })

export default prisma
