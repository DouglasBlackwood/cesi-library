import { PrismaClient } from "@prisma/client"
import { createHash, randomBytes } from "node:crypto"

const prisma = new PrismaClient()

function generateApiKey(): string {
  return randomBytes(32).toString("hex")
}

function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex")
}

async function main() {
  const aliceKey = generateApiKey()
  const bobKey = generateApiKey()

  const alice = await prisma.user.create({
    data: {
      name: "Alice",
      apiKey: hashApiKey(aliceKey),
      books: {
        create: [
          {
            title: "The Pragmatic Programmer",
            author: "Andrew Hunt & David Thomas",
            isbn: "9780135957059",
            status: "finished",
            description: "A classic for software engineers.",
          },
          {
            title: "Clean Code",
            author: "Robert C. Martin",
            isbn: "9780132350884",
            status: "reading",
          },
          {
            title: "Designing Data-Intensive Applications",
            author: "Martin Kleppmann",
            status: "to_read",
          },
        ],
      },
    },
  })

  const bob = await prisma.user.create({
    data: {
      name: "Bob",
      apiKey: hashApiKey(bobKey),
      books: {
        create: [
          {
            title: "Domain-Driven Design",
            author: "Eric Evans",
            isbn: "9780321125217",
            status: "reading",
          },
          {
            title: "Refactoring",
            author: "Martin Fowler",
            isbn: "9780134757599",
            status: "to_read",
          },
        ],
      },
    },
  })

  console.log("Seed complete!\n")
  console.log(`Alice (id: ${alice.id})`)
  console.log(`  API key: ${aliceKey}\n`)
  console.log(`Bob (id: ${bob.id})`)
  console.log(`  API key: ${bobKey}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
