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
    const body = await response.text()
    let message = body
    try {
      const parsed = JSON.parse(body) as { error?: unknown; message?: unknown }
      if (typeof parsed.error === 'string') message = parsed.error
      else if (typeof parsed.message === 'string') message = parsed.message
    } catch {
      // Keep plain-text backend responses unchanged.
    }
    throw new Error(message || `HTTP ${response.status}`)
  }
  if (response.status === 204) {
    return undefined as T
  }
  return response.json() as Promise<T>
}
