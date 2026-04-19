import type { PrismaClient } from "@prisma/client"
import request from "supertest"
import { beforeEach, describe, expect, it } from "vitest"
import { createApp } from "../src/app.js"
import { createTestDb } from "./helpers/db.js"

describe("POST /users", () => {
  let prisma: PrismaClient
  let app: ReturnType<typeof createApp>

  beforeEach(() => {
    prisma = createTestDb()
    app = createApp(prisma)
  })

  it("creates a user and returns 201 with id, name, and apiKey", async () => {
    const res = await request(app).post("/users").send({ name: "Charlie" })

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({ name: "Charlie" })
    expect(typeof res.body.id).toBe("string")
    expect(typeof res.body.apiKey).toBe("string")
    expect(res.body.apiKey.length).toBeGreaterThan(0)
  })

  it("returns 400 when name is missing", async () => {
    const res = await request(app).post("/users").send({})
    expect(res.status).toBe(400)
  })

  it("returns 400 when name is an empty string", async () => {
    const res = await request(app).post("/users").send({ name: "" })
    expect(res.status).toBe(400)
  })

  it("does not expose the hashed API key — returned key is plaintext (64 hex chars)", async () => {
    const res = await request(app).post("/users").send({ name: "Diana" })
    expect(res.body.apiKey).toMatch(/^[0-9a-f]{64}$/)
  })
})
