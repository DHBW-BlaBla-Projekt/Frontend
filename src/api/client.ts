export async function apiRequest<T>(
  baseUrl: string,
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  if (!baseUrl) {
    throw new Error('Die API-URL ist nicht konfiguriert.')
  }

  const headers = new Headers(options.headers)
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `HTTP ${response.status}`)
  }
  if (response.status === 204) {
    return undefined as T
  }
  return response.json() as Promise<T>
}
