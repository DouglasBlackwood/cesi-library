import type { NextFunction, Request, Response } from "express"
import { hashApiKey } from "../services/userService.js"
import type { IUserRepository } from "../types/IUserRepository.js"

export function createAuthMiddleware(userRepository: IUserRepository) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const rawKey = req.headers["x-api-key"]
    if (!rawKey || typeof rawKey !== "string") {
      res.status(401).json({ error: "Missing API key" })
      return
    }

    const hashed = hashApiKey(rawKey)
    const user = await userRepository.findByApiKey(hashed)
    if (!user) {
      res.status(403).json({ error: "Invalid API key" })
      return
    }

    res.locals.user = user
    next()
  }
}
