export type BookStatus = "to_read" | "reading" | "finished"

export interface User {
  id: string
  name: string
  apiKey: string
  createdAt: Date
}

export interface Book {
  id: string
  userId: string
  title: string
  author: string
  isbn?: string | null
  status: BookStatus
  coverUrl?: string | null
  description?: string | null
  createdAt: Date
}

export interface CreateBookDto {
  title: string
  author: string
  isbn?: string
  status?: BookStatus
  coverUrl?: string
  description?: string
}
