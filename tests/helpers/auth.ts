import { createHash, randomBytes } from "node:crypto"
import type { PrismaClient } from "@prisma/client"

export async function createTestUser(
  prisma: PrismaClient
): Promise<{ id: string; name: string; apiKey: string }> {
  const plainKey = randomBytes(32).toString("hex")
  const hashedKey = createHash("sha256").update(plainKey).digest("hex")

  const user = await prisma.user.create({
    data: { name: "Test User", apiKey: hashedKey },
  })

  return { id: user.id, name: user.name, apiKey: plainKey }
}
