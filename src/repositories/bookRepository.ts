import { Prisma, type PrismaClient } from "@prisma/client"
import type { IBookRepository } from "../types/IBookRepository.js"
import { type Book, BookNotFound, type BookStatus, type CreateBookDto } from "../types/index.js"

export class BookRepository implements IBookRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async find(bookId: string, userId: string): Promise<Book> {
    try {
      return (await this.prisma.book.findFirstOrThrow({ where: { id: bookId, userId } })) as Book
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
        throw new BookNotFound()
      }
      throw err
    }
  }

  async findAll(userId: string, status?: BookStatus): Promise<Book[]> {
    return (await this.prisma.book.findMany({
      where: { userId, ...(status ? { status } : {}) },
      orderBy: { createdAt: "desc" },
    })) as Book[]
  }

  async create(userId: string, data: CreateBookDto): Promise<Book> {
    return (await this.prisma.book.create({
      data: { userId, ...data },
    })) as Book
  }

  async findOne(bookId: string): Promise<Book | null> {
    return (await this.prisma.book.findUnique({ where: { id: bookId } })) as Book | null
  }

  async delete(bookId: string): Promise<void> {
    await this.prisma.book.delete({ where: { id: bookId } })
  }
}
