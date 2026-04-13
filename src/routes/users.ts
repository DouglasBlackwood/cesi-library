import { Router } from "express"
import type { UserService } from "../services/userService.js"

export function createUsersRouter(userService: UserService): Router {
  const router = Router()

  router.post("/", async (req, res): Promise<void> => {
    const { name } = req.body
    if (!name || typeof name !== "string" || name.trim() === "") {
      res.status(400).json({ error: "name is required" })
      return
    }

    const user = await userService.createUser(name.trim())
    res.status(201).json({ id: user.id, name: user.name, apiKey: user.plainApiKey })
  })

  return router
}
