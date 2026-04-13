import { createHash, randomBytes } from "node:crypto"
import type { IUserRepository } from "../types/IUserRepository.js"
import type { User } from "../types/index.js"

export function generateApiKey(): string {
  return randomBytes(32).toString("hex")
}

export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex")
}

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async createUser(name: string): Promise<User & { plainApiKey: string }> {
    const plainKey = generateApiKey()
    const hashed = hashApiKey(plainKey)
    const user = await this.userRepository.create(name, hashed)
    return { ...user, plainApiKey: plainKey }
  }
}
