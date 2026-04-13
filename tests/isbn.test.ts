import { describe, expect, it } from "vitest"
import { isValidIsbn } from "../src/lib/isbn.js"

describe("isValidIsbn", () => {
  it("accepts a valid ISBN-13", () => {
    expect(isValidIsbn("9780135957059")).toBe(true)
  })

  it("accepts a valid ISBN-13 with dashes", () => {
    expect(isValidIsbn("978-0-13-595705-9")).toBe(true)
  })

  it("accepts a valid ISBN-10", () => {
    expect(isValidIsbn("0132350882")).toBe(true)
  })

  it("accepts a valid ISBN-10 with X check digit", () => {
    expect(isValidIsbn("080442957X")).toBe(true)
  })

  it("rejects wrong length (12 digits)", () => {
    expect(isValidIsbn("978013595705")).toBe(false)
  })

  it("rejects non-numeric characters in ISBN-13", () => {
    expect(isValidIsbn("978013595705X")).toBe(false)
  })

  it("rejects an empty string", () => {
    expect(isValidIsbn("")).toBe(false)
  })

  it("rejects an ISBN-13 with a bad check digit", () => {
    expect(isValidIsbn("9780135957058")).toBe(false)
  })

  it("rejects an ISBN-10 with a bad check digit", () => {
    expect(isValidIsbn("0132350881")).toBe(false)
  })
})
