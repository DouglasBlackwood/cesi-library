import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "@prisma/client"
import { onTestFinished } from "vitest"

const TEMPLATE_PATH = path.join(os.tmpdir(), "cesi-library-test-template.db")

export function createTestDb(): PrismaClient {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "cesi-library-test-"))
  const dbPath = path.join(tempDir, "test.db")
  fs.copyFileSync(TEMPLATE_PATH, dbPath)

  const adapter = new PrismaBetterSqlite3({ url: dbPath })
  const prisma = new PrismaClient({ adapter })

  onTestFinished(async () => {
    try {
      await prisma.$disconnect()
    } catch {
      // best-effort
    }
    try {
      fs.rmSync(tempDir, { recursive: true, force: true })
    } catch {
      // best-effort
    }
  })

  return prisma
}
