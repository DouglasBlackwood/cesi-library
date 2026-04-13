import { Router } from "express"
import type { BookService } from "../services/bookService.js"
import type { BookStatus } from "../types/index.js"
import type { User } from "../types/index.js"

const VALID_STATUSES: BookStatus[] = ["to_read", "reading", "finished"]

export function createBooksRouter(bookService: BookService): Router {
  const router = Router()

  router.get("/", async (req, res): Promise<void> => {
    const user = res.locals.user as User
    const { status } = req.query

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status as BookStatus)) {
        res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(", ")}` })
        return
      }
    }

    const books = await bookService.getBooks(user.id, status as BookStatus | undefined)
    res.json(books)
  })

  router.post("/", async (req, res): Promise<void> => {
    const user = res.locals.user as User
    const { title, author, isbn, status, coverUrl, description } = req.body

    if (!title || typeof title !== "string" || title.trim() === "") {
      res.status(400).json({ error: "title is required" })
      return
    }
    if (!author || typeof author !== "string" || author.trim() === "") {
      res.status(400).json({ error: "author is required" })
      return
    }
    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(", ")}` })
      return
    }

    const book = await bookService.createBook(user.id, {
      title: title.trim(),
      author: author.trim(),
      isbn,
      status,
      coverUrl,
      description,
    })
    res.status(201).json(book)
  })

  router.delete("/:id", async (req, res): Promise<void> => {
    const user = res.locals.user as User
    try {
      await bookService.deleteBook(user.id, req.params.id)
      res.status(204).send()
    } catch (err) {
      const e = err as Error & { status?: number }
      res.status(e.status ?? 500).json({ error: e.message })
    }
  })

  return router
}
