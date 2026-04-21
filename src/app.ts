import type { PrismaClient } from "@prisma/client"
import express from "express"
import { HttpClient } from "./lib/httpClient.js"
import { createAuthMiddleware } from "./middleware/auth.js"
import { BookRepository } from "./repositories/bookRepository.js"
import { UserRepository } from "./repositories/userRepository.js"
import { createBooksRouter } from "./routes/books.js"
import { createSearchRouter } from "./routes/search.js"
import { createUsersRouter } from "./routes/users.js"
import { BookService } from "./services/bookService.js"
import { OpenLibraryService } from "./services/openLibraryService.js"
import { UserService } from "./services/userService.js"
import type { IHttpClient } from "./types/IHttpClient.js"

export function createApp(prisma: PrismaClient, httpClient?: IHttpClient) {
  const app = express()
  app.use(express.json())

  const userRepository = new UserRepository(prisma)
  const bookRepository = new BookRepository(prisma)
  const userService = new UserService(userRepository)
  const bookService = new BookService(bookRepository)
  const openLibraryService = new OpenLibraryService(httpClient ?? new HttpClient())

  const auth = createAuthMiddleware(userRepository)

  app.use("/users", createUsersRouter(userService))
  app.use("/books", auth, createBooksRouter(bookService))
  app.use("/search", auth, createSearchRouter(openLibraryService))

  return app
}
