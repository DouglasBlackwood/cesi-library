import { createApp } from "./app.js"
import prisma from "./lib/prisma.js"

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000

const app = createApp(prisma)

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
