import type { IHttpClient } from "../types/IHttpClient.js"

export interface OpenLibraryBook {
  title: string
  author_name?: string[]
  isbn?: string[]
  cover_i?: number
  first_publish_year?: number
}

interface OpenLibraryResponse {
  docs: OpenLibraryBook[]
  numFound: number
}

export interface MappedBook {
  title: string
  authors: string[]
  isbn?: string
  coverUrl?: string
  firstPublishYear?: number
}

export function mapSearchResult(raw: unknown): MappedBook[] {
  const response = raw as OpenLibraryResponse
  if (!response || !Array.isArray(response.docs)) return []

  return response.docs.map((doc) => {
    const mapped: MappedBook = {
      title: doc.title ?? "Unknown title",
      authors: doc.author_name ?? [],
    }
    if (doc.isbn && doc.isbn.length > 0) {
      mapped.isbn = doc.isbn[0]
    }
    if (doc.cover_i) {
      mapped.coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
    }
    if (doc.first_publish_year) {
      mapped.firstPublishYear = doc.first_publish_year
    }
    return mapped
  })
}

export class OpenLibraryService {
  constructor(private readonly httpClient: IHttpClient) {}

  async searchBooks(query: string): Promise<MappedBook[]> {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`
    const raw = await this.httpClient.get<unknown>(url)
    return mapSearchResult(raw)
  }
}
