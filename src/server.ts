import { createApp } from "./app.js"
import { PORT } from "./lib/config.js"
import { prisma } from "./lib/prisma.js"

const app = createApp(prisma)

app.listen(PORT, () => {
  // biome-ignore lint/suspicious/noConsole: intentional startup log
  console.log(`Server listening on http://localhost:${PORT}`)
})
