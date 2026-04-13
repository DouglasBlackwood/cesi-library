import { describe, expect, it } from "vitest"
import { generateApiKey, hashApiKey } from "../src/services/userService.js"

describe("generateApiKey", () => {
  it("returns a non-empty string", () => {
    expect(generateApiKey()).toBeTruthy()
    expect(typeof generateApiKey()).toBe("string")
  })

  it("produces different keys on each call", () => {
    const a = generateApiKey()
    const b = generateApiKey()
    expect(a).not.toBe(b)
  })

  it("returns a 64-character hex string (32 bytes)", () => {
    expect(generateApiKey()).toMatch(/^[0-9a-f]{64}$/)
  })
})

describe("hashApiKey", () => {
  it("returns a non-empty string", () => {
    expect(hashApiKey("some-key")).toBeTruthy()
  })

  it("is deterministic — same input yields same hash", () => {
    const key = generateApiKey()
    expect(hashApiKey(key)).toBe(hashApiKey(key))
  })

  it("differs from the plaintext input", () => {
    const key = generateApiKey()
    expect(hashApiKey(key)).not.toBe(key)
  })

  it("returns a 64-character hex string (SHA-256)", () => {
    expect(hashApiKey("test")).toMatch(/^[0-9a-f]{64}$/)
  })

  it("produces different hashes for different keys", () => {
    expect(hashApiKey("key-a")).not.toBe(hashApiKey("key-b"))
  })
})
