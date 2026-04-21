import type { Book, BookStatus, CreateBookDto } from "./index.js"

export interface IBookRepository {
  find(bookId: string, userId: string): Promise<Book>
  findAll(userId: string, status?: BookStatus): Promise<Book[]>
  create(userId: string, data: CreateBookDto): Promise<Book>
  findOne(bookId: string): Promise<Book | null>
  delete(bookId: string): Promise<void>
}
