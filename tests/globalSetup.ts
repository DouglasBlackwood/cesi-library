import { execSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

const TEMPLATE_PATH = path.join(os.tmpdir(), "cesi-library-test-template.db")

function safeRemoveTemplate() {
  for (const suffix of ["", "-journal", "-wal", "-shm"]) {
    try {
      fs.rmSync(TEMPLATE_PATH + suffix, { force: true })
    } catch {
      // best-effort
    }
  }
}

export default async function setup() {
  safeRemoveTemplate()

  execSync("npx prisma migrate deploy", {
    env: { ...process.env, DATABASE_URL: `file:${TEMPLATE_PATH}` },
    stdio: "pipe",
  })

  return async () => {
    safeRemoveTemplate()
  }
}
