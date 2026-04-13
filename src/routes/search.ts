import { Router } from "express"
import type { OpenLibraryService } from "../services/openLibraryService.js"

export function createSearchRouter(openLibraryService: OpenLibraryService): Router {
  const router = Router()

  router.get("/", async (req, res): Promise<void> => {
    const { q } = req.query
    if (!q || typeof q !== "string" || q.trim() === "") {
      res.status(400).json({ error: "q query parameter is required" })
      return
    }

    try {
      const results = await openLibraryService.searchBooks(q.trim())
      res.json(results)
    } catch (err) {
      const e = err as Error
      res.status(502).json({ error: `Upstream error: ${e.message}` })
    }
  })

  return router
}
