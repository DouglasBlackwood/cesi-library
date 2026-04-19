# cesi-library

A REST API for managing personal book libraries, built with TypeScript, Express, and SQLite.

[![CI](https://github.com/DouglasBlackwood/cesi-library/actions/workflows/ci.yml/badge.svg)](https://github.com/DouglasBlackwood/cesi-library/actions/workflows/ci.yml)

---

## Installation

```bash
git clone https://github.com/DouglasBlackwood/cesi-library.git
cd cesi-library
npm install          # also runs prisma generate via postinstall
cp .env.example .env
```

## Database setup

Create the development database and apply migrations:

```bash
npx prisma migrate dev
```

Seed with sample users and books (the seed output displays the two test API keys):

```bash
npm run seed
```

## Running the API

```bash
npm run dev
```

The server starts on port **3000** by default.

### Sample requests

```bash
# Create a user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice"}'

# List your books
curl http://localhost:3000/books \
  -H "x-api-key: <your-api-key>"

# Add a book
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -H "x-api-key: <your-api-key>" \
  -d '{"title": "Clean Code", "author": "Robert C. Martin"}'

# Delete a book
curl -X DELETE http://localhost:3000/books/<book-id> \
  -H "x-api-key: <your-api-key>"

# Search Open Library
curl "http://localhost:3000/search?q=clean+code" \
  -H "x-api-key: <your-api-key>"
```

## Linting, formatting & type checking

```bash
npm run check       # biome lint + format check (no writes)
npm run lint        # lint only
npm run format      # auto-fix formatting
npm run typecheck   # TypeScript type check (tsc --noEmit)
```

## Running tests

```bash
npm test           # single run
npm run test:watch # watch mode
```

Tests use a separate `test.db` database. No manual setup required — the setup file
runs `prisma migrate deploy` automatically before each test suite.

## Pre-commit hook

Husky runs the following on every commit:

1. `npm run check` — lint + format check (fails on violations; run `npm run format` to fix)
2. `npm run typecheck` — TypeScript compilation check
3. `npm test` — full test suite

---

## API reference

| Method | Path | Auth | Body | Response |
|--------|------|------|------|----------|
| `POST` | `/users` | — | `{ name: string }` | `201 { id, name, apiKey }` |
| `GET` | `/books` | required | — | `200 Book[]` |
| `POST` | `/books` | required | `{ title, author, isbn?, status?, coverUrl?, description? }` | `201 Book` |
| `DELETE` | `/books/:id` | required | — | `204` |
| `GET` | `/search?q=` | required | — | `200 MappedBook[]` |

Auth is provided via the `x-api-key` header. Missing key → `401`. Invalid key → `403`.

**BookStatus values**: `to_read` | `reading` | `finished`

