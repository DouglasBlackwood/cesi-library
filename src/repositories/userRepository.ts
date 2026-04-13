import type { PrismaClient } from "@prisma/client"
import type { IUserRepository } from "../types/IUserRepository.js"
import type { User } from "../types/index.js"

export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByApiKey(hashedKey: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { apiKey: hashedKey } })
  }

  async create(name: string, hashedKey: string): Promise<User> {
    return this.prisma.user.create({ data: { name, apiKey: hashedKey } })
  }
}
