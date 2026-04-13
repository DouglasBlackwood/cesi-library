import type { IHttpClient } from "../types/IHttpClient.js"

export class HttpClient implements IHttpClient {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return response.json() as Promise<T>
  }
}
