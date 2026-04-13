# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with hot-reload (tsx watch)
npm test             # Run all tests once
npm run test:watch   # Run tests in watch mode
npm run check        # Lint + format check (biome, no writes)
npm run lint         # Lint only
npm run format       # Auto-format (writes)
npm run build        # Bundle to dist/ (tsup, CJS + .d.ts)
npm run seed         # Seed dev database with sample data
```

Run a single test file: `vitest run tests/unit/apiKey.test.ts`  
Run by test name: `vitest run -t "generateApiKey"`

## Architecture

```
src/app.ts          — createApp(prisma) factory; wires all DI, no .listen()
src/server.ts       — calls createApp, calls .listen()
src/routes/         — route factories: createBooksRouter(bookService), etc.
src/services/       — business logic (UserService, BookService, OpenLibraryService)
src/repositories/   — Prisma data access (UserRepository, BookRepository)
src/middleware/     — createAuthMiddleware(userRepository)
src/lib/            — prisma singleton, HttpClient, isbn validator
src/types/          — shared types + repository interfaces (IUserRepository, IBookRepository, IHttpClient)
```

**Dependency injection**: `createApp` instantiates all repos/services and passes them down. Routes are factories accepting service instances and returning Express routers. Services depend on interfaces, not concrete classes, so tests can inject mocks.

**Auth flow**: `x-api-key` header → SHA-256 hash → `UserRepository.findByApiKey()` → user attached to `res.locals.user`. Applied to `/books` and `/search` routes.

**API keys**: 32-byte random hex (plaintext) at creation, SHA-256 hashed for storage. Plaintext returned once only.

## Database

SQLite via Prisma. No enum support — `BookStatus` is stored as a `String` with default `"to_read"`.

```bash
DATABASE_URL=file:./dev.db   # dev (default)
DATABASE_URL=file:./test.db  # set automatically by tests/setup.ts
```

Migrations live in `prisma/migrations/`. Apply with `npx prisma migrate deploy`.

## Test setup

`tests/setup.ts` runs `prisma migrate deploy` once before all tests against `test.db`, then deletes all rows after each test via `$transaction`. Integration tests use `createApp(testPrisma)` + Supertest — no network needed.

`tests/helpers/auth.ts` exports `createTestUser()` for setting up authenticated requests in integration tests.
