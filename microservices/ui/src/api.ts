export type ApiError = { error?: string; errors?: Array<{ msg: string }> };

export async function apiJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    }
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as unknown) : undefined;

  if (!response.ok) {
    const maybe = (data ?? {}) as ApiError;
    const message =
      maybe?.error ??
      (maybe?.errors?.length ? maybe.errors.map((e) => e.msg).join(', ') : undefined) ??
      `Request failed: ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}
