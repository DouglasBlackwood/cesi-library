import type { PrismaClient } from "@prisma/client"
import type { IBookRepository } from "../types/IBookRepository.js"
import type { Book, BookStatus, CreateBookDto } from "../types/index.js"

export class BookRepository implements IBookRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(userId: string, status?: BookStatus): Promise<Book[]> {
    return this.prisma.book.findMany({
      where: { userId, ...(status ? { status } : {}) },
      orderBy: { createdAt: "desc" },
    }) as Promise<Book[]>
  }

  async create(userId: string, data: CreateBookDto): Promise<Book> {
    return this.prisma.book.create({
      data: { userId, ...data },
    }) as Promise<Book>
  }

  async findOne(bookId: string): Promise<Book | null> {
    return this.prisma.book.findUnique({ where: { id: bookId } }) as Promise<Book | null>
  }

  async delete(bookId: string): Promise<void> {
    await this.prisma.book.delete({ where: { id: bookId } })
  }
}
