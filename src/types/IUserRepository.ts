import type { User } from "./index.js"

export interface IUserRepository {
  findByApiKey(hashedKey: string): Promise<User | null>
  create(name: string, hashedKey: string): Promise<User>
}
