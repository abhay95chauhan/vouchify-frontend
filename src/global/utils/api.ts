/* eslint-disable @typescript-eslint/no-explicit-any */
interface ApiInterface<T> {
  method: string;
  data?: T;
  jwt?: string;
  responseType?: 'json' | 'blob';
}

class Api {
  async request<T>(url: string, options: ApiInterface<T>) {
    const isBlob = options.responseType === 'blob';

    const fetchOptions: RequestInit = {
      method: options?.method || 'GET',
      headers: {
        // Authorization: `Bearer ${localStorage.getItem('token')}`,
        Cookie: `jwt=${options.jwt}`, // forward the cookie
        ...(isBlob ? {} : { 'Content-Type': 'application/json' }), // ⬅️ IMPORTANT
      },
      ...(options?.data ? { body: JSON.stringify(options.data) } : {}),
      credentials: 'include', // important for cookies
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${url}`,
      fetchOptions
    );

    if (isBlob) {
      if (!res.ok) {
        return { error: await res.text() };
      }
      return res.blob();
    }

    // If request is successful, return JSON
    if (res.ok) {
      return res.json();
    }

    // Special handling for specific status codes
    const handlers: Record<number, () => Promise<any> | any> = {
      401: async () => {
        return { error: await res.json() };
      },
      412: async () => res.json(), // Directly return JSON
    };

    // If the status code is in handlers, use it
    if (handlers[res.status]) {
      return handlers[res.status]();
    }

    // Try to parse JSON error, fallback to plain text if parsing fails
    try {
      const jsonError = await res.json();
      return { error: jsonError };
    } catch {
      return { error: { message: res.statusText } };
    }
  }

  title(title: string) {
    document.title = `Vouchify | ${title}`;
  }
}

export const vouchifyApi = new Api();
