import type { PrismaClient } from "@prisma/client"
import request from "supertest"
import { beforeEach, describe, expect, it } from "vitest"
import { createApp } from "../src/app.js"
import { createTestUser } from "./helpers/auth.js"
import { createTestDb } from "./helpers/db.js"

describe("Auth middleware", () => {
  let prisma: PrismaClient
  let app: ReturnType<typeof createApp>

  beforeEach(() => {
    prisma = createTestDb()
    app = createApp(prisma)
  })

  it("returns 401 on a protected route when x-api-key header is missing", async () => {
    const res = await request(app).get("/books")
    expect(res.status).toBe(401)
  })

  it("returns 403 when x-api-key is present but does not match any user", async () => {
    const res = await request(app).get("/books").set("x-api-key", "deadbeef")
    expect(res.status).toBe(403)
  })

  it("allows access with a valid API key", async () => {
    const { apiKey } = await createTestUser(prisma)
    const res = await request(app).get("/books").set("x-api-key", apiKey)
    expect(res.status).toBe(200)
  })

  it("returns 401 on /search without key", async () => {
    const res = await request(app).get("/search?q=test")
    expect(res.status).toBe(401)
  })
})
