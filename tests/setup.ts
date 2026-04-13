import { execSync } from "node:child_process"
import { PrismaClient } from "@prisma/client"

process.env.DATABASE_URL = "file:./test.db"

execSync("npx prisma migrate deploy", {
  env: { ...process.env, DATABASE_URL: "file:./test.db" },
  stdio: "pipe",
})

export const testPrisma = new PrismaClient({
  datasources: { db: { url: "file:./test.db" } },
})

afterEach(async () => {
  await testPrisma.$transaction([
    testPrisma.book.deleteMany(),
    testPrisma.user.deleteMany(),
  ])
})

afterAll(async () => {
  await testPrisma.$disconnect()
})
