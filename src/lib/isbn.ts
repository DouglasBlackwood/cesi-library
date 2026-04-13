export function isValidIsbn(value: string): boolean {
  if (!value) return false

  const clean = value.replace(/[-\s]/g, "")

  if (clean.length === 13) {
    if (!/^\d{13}$/.test(clean)) return false
    const sum = clean
      .split("")
      .reduce((acc, digit, i) => acc + Number(digit) * (i % 2 === 0 ? 1 : 3), 0)
    return sum % 10 === 0
  }

  if (clean.length === 10) {
    if (!/^\d{9}[\dX]$/.test(clean)) return false
    const sum = clean
      .split("")
      .reduce((acc, char, i) => acc + (char === "X" ? 10 : Number(char)) * (10 - i), 0)
    return sum % 11 === 0
  }

  return false
}
