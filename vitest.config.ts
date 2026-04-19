import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    globalSetup: ["tests/globalSetup.ts"],
  },
})
