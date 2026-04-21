import type { PrismaClient } from "@prisma/client"
import request from "supertest"
import { beforeEach, describe, expect, it } from "vitest"
import { createApp } from "../src/app.js"
import { createTestUser } from "./helpers/auth.js"
import { createTestDb } from "./helpers/db.js"

describe("GET /books", () => {
  let prisma: PrismaClient
  let app: ReturnType<typeof createApp>
  let apiKey: string

  beforeEach(async () => {
    prisma = createTestDb()
    app = createApp(prisma)
    const user = await createTestUser(prisma)
    apiKey = user.apiKey
  })

  it("returns an empty array when the user has no books", async () => {
    const res = await request(app).get("/books").set("x-api-key", apiKey)
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it("returns books belonging to the authenticated user", async () => {
    await request(app)
      .post("/books")
      .set("x-api-key", apiKey)
      .send({ title: "The Pragmatic Programmer", author: "David Thomas" })

    const res = await request(app).get("/books").set("x-api-key", apiKey)
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0]).toMatchObject({ title: "The Pragmatic Programmer", author: "David Thomas" })
  })

  it("does not return books belonging to another user", async () => {
    const other = await createTestUser(prisma)
    await request(app)
      .post("/books")
      .set("x-api-key", other.apiKey)
      .send({ title: "Other Book", author: "Other Author" })

    const res = await request(app).get("/books").set("x-api-key", apiKey)
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it("filters books by status", async () => {
    await request(app)
      .post("/books")
      .set("x-api-key", apiKey)
      .send({ title: "Book A", author: "Author A", status: "reading" })
    await request(app)
      .post("/books")
      .set("x-api-key", apiKey)
      .send({ title: "Book B", author: "Author B", status: "finished" })

    const res = await request(app).get("/books?status=reading").set("x-api-key", apiKey)
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0]).toMatchObject({ title: "Book A", status: "reading" })
  })

  it("returns 400 for an invalid status filter", async () => {
    const res = await request(app).get("/books?status=invalid").set("x-api-key", apiKey)
    expect(res.status).toBe(400)
  })
})

describe("POST /books", () => {
  let prisma: PrismaClient
  let app: ReturnType<typeof createApp>
  let apiKey: string

  beforeEach(async () => {
    prisma = createTestDb()
    app = createApp(prisma)
    const user = await createTestUser(prisma)
    apiKey = user.apiKey
  })

  it("creates a book and returns 201 with the book object", async () => {
    const res = await request(app)
      .post("/books")
      .set("x-api-key", apiKey)
      .send({ title: "Clean Code", author: "Robert C. Martin" })

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      title: "Clean Code",
      author: "Robert C. Martin",
      status: "to_read",
    })
    expect(typeof res.body.id).toBe("string")
  })

  it("returns 400 when title is missing", async () => {
    const res = await request(app)
      .post("/books")
      .set("x-api-key", apiKey)
      .send({ author: "Author" })
    expect(res.status).toBe(400)
  })

  it("returns 400 when title is an empty string", async () => {
    const res = await request(app)
      .post("/books")
      .set("x-api-key", apiKey)
      .send({ title: "", author: "Author" })
    expect(res.status).toBe(400)
  })

  it("returns 400 when author is missing", async () => {
    const res = await request(app)
      .post("/books")
      .set("x-api-key", apiKey)
      .send({ title: "Title" })
    expect(res.status).toBe(400)
  })

  it("returns 400 when author is an empty string", async () => {
    const res = await request(app)
      .post("/books")
      .set("x-api-key", apiKey)
      .send({ title: "Title", author: "" })
    expect(res.status).toBe(400)
  })

  it("returns 400 when status is invalid", async () => {
    const res = await request(app)
      .post("/books")
      .set("x-api-key", apiKey)
      .send({ title: "Title", author: "Author", status: "invalid" })
    expect(res.status).toBe(400)
  })

  it("creates a book with all optional fields", async () => {
    const res = await request(app)
      .post("/books")
      .set("x-api-key", apiKey)
      .send({
        title: "Dune",
        author: "Frank Herbert",
        isbn: "9780441013593",
        status: "reading",
        coverUrl: "https://example.com/cover.jpg",
        description: "A science fiction epic",
      })

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      title: "Dune",
      author: "Frank Herbert",
      isbn: "9780441013593",
      status: "reading",
      coverUrl: "https://example.com/cover.jpg",
      description: "A science fiction epic",
    })
  })
})

describe("DELETE /books/:id", () => {
  let prisma: PrismaClient
  let app: ReturnType<typeof createApp>
  let apiKey: string

  beforeEach(async () => {
    prisma = createTestDb()
    app = createApp(prisma)
    const user = await createTestUser(prisma)
    apiKey = user.apiKey
  })

  it("deletes a book and returns 204", async () => {
    const createRes = await request(app)
      .post("/books")
      .set("x-api-key", apiKey)
      .send({ title: "Title", author: "Author" })
    const bookId = createRes.body.id

    const res = await request(app).delete(`/books/${bookId}`).set("x-api-key", apiKey)
    expect(res.status).toBe(204)
  })

  it("returns 404 when the book does not exist", async () => {
    const res = await request(app).delete("/books/nonexistent-id").set("x-api-key", apiKey)
    expect(res.status).toBe(404)
  })

  it("returns 403 when the book belongs to another user", async () => {
    const other = await createTestUser(prisma)
    const createRes = await request(app)
      .post("/books")
      .set("x-api-key", other.apiKey)
      .send({ title: "Other's Book", author: "Author" })
    const bookId = createRes.body.id

    const res = await request(app).delete(`/books/${bookId}`).set("x-api-key", apiKey)
    expect(res.status).toBe(403)
  })
})
