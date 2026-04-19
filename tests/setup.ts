import { execSync } from "node:child_process"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "@prisma/client"

const TEST_DB_URL = "file:./test.db"
process.env.DATABASE_URL = TEST_DB_URL

execSync("npx prisma migrate deploy", {
	env: { ...process.env, DATABASE_URL: TEST_DB_URL },
	stdio: "pipe",
})

const adapter = new PrismaBetterSqlite3({ url: "./test.db" })
export const testPrisma = new PrismaClient({ adapter })

afterEach(async () => {
	await testPrisma.$transaction([
		testPrisma.book.deleteMany(),
		testPrisma.user.deleteMany(),
	])
})

afterAll(async () => {
	await testPrisma.$disconnect()
})
