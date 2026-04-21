import type { PrismaClient } from "@prisma/client"
import request from "supertest"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { createApp } from "../src/app.js"
import type { IHttpClient } from "../src/types/IHttpClient.js"
import { createTestUser } from "./helpers/auth.js"
import { createTestDb } from "./helpers/db.js"

describe("GET /search", () => {
  let prisma: PrismaClient
  let app: ReturnType<typeof createApp>
  let apiKey: string
  let mockGet: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    prisma = createTestDb()
    mockGet = vi.fn()
    const mockHttpClient = { get: mockGet } as unknown as IHttpClient
    app = createApp(prisma, mockHttpClient)
    const user = await createTestUser(prisma)
    apiKey = user.apiKey
  })

  it("returns 400 when q is missing", async () => {
    const res = await request(app).get("/search").set("x-api-key", apiKey)
    expect(res.status).toBe(400)
  })

  it("returns 400 when q is an empty string", async () => {
    const res = await request(app).get("/search?q=").set("x-api-key", apiKey)
    expect(res.status).toBe(400)
  })

  it("returns mapped results from the upstream API", async () => {
    mockGet.mockResolvedValue({
      docs: [
        {
          title: "The Hobbit",
          author_name: ["J.R.R. Tolkien"],
          isbn: ["9780261102217"],
          cover_i: 12345,
          first_publish_year: 1937,
        },
      ],
      numFound: 1,
    })

    const res = await request(app).get("/search?q=hobbit").set("x-api-key", apiKey)
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0]).toMatchObject({
      title: "The Hobbit",
      authors: ["J.R.R. Tolkien"],
      isbn: "9780261102217",
      coverUrl: "https://covers.openlibrary.org/b/id/12345-M.jpg",
      firstPublishYear: 1937,
    })
  })

  it("returns 502 when the upstream API fails", async () => {
    mockGet.mockRejectedValue(new Error("Service unavailable"))

    const res = await request(app).get("/search?q=hobbit").set("x-api-key", apiKey)
    expect(res.status).toBe(502)
    expect(res.body).toMatchObject({ error: "Upstream error: Service unavailable" })
  })

  it("returns an empty array when the upstream returns no results", async () => {
    mockGet.mockResolvedValue({ docs: [], numFound: 0 })

    const res = await request(app).get("/search?q=xyznothing").set("x-api-key", apiKey)
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
})
