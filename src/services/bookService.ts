import type { IBookRepository } from "../types/IBookRepository.js"
import type { Book, BookStatus, CreateBookDto } from "../types/index.js"

export class BookService {
  constructor(private readonly bookRepository: IBookRepository) {}

  async getBooks(userId: string, status?: BookStatus): Promise<Book[]> {
    return this.bookRepository.findAll(userId, status)
  }

  async createBook(userId: string, data: CreateBookDto): Promise<Book> {
    return this.bookRepository.create(userId, data)
  }

  async deleteBook(userId: string, bookId: string): Promise<void> {
    const book = await this.bookRepository.findOne(bookId)
    if (!book) {
      const err = new Error("Book not found")
      ;(err as Error & { status: number }).status = 404
      throw err
    }
    if (book.userId !== userId) {
      const err = new Error("Forbidden")
      ;(err as Error & { status: number }).status = 403
      throw err
    }
    await this.bookRepository.delete(bookId)
  }
}
