/** Field name → message, as the API returns them next to a 400. */
export type ApiFieldErrors = Partial<Record<string, string>>;

/** A failed API call: the API's message, plus per-field messages when it sent any. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly fields: ApiFieldErrors = {}
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Calls one of our own API routes. Every route answers { ok: true, ... } or
 * { ok: false, error, fields? }, so this returns the parsed body or throws an ApiError.
 */
export async function apiRequest<T = Record<string, unknown>>(
  url: string,
  options: { method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'; body?: unknown } = {}
): Promise<T> {
  // FormData (file uploads) goes as multipart, with the browser setting its own boundary.
  const isForm = typeof FormData !== 'undefined' && options.body instanceof FormData;
  let res: Response;
  try {
    res = await fetch(url, {
      method: options.method ?? 'GET',
      headers: isForm ? undefined : { 'Content-Type': 'application/json' },
      credentials: 'include',
      ...(options.body !== undefined && { body: isForm ? (options.body as FormData) : JSON.stringify(options.body) }),
    });
  } catch {
    throw new ApiError('We could not reach the server. Please check your connection and try again.', 0);
  }

  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.ok) {
    throw new ApiError(json?.error || 'Something went wrong. Please try again.', res.status, json?.fields);
  }
  return json as T;
}
