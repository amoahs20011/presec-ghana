const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export class ApiError extends Error {
  status: number;
  body: any;

  constructor(status: number, message: string, body?: any) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

interface FetchOptions extends RequestInit {
  auth?: boolean;
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { auth, ...init } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers || {}),
  };

  if (auth && typeof window !== 'undefined') {
    const token = localStorage.getItem('presec_token');
    if (token) {
      (headers as any).Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ApiError(
      res.status,
      data?.message || res.statusText,
      data,
    );
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, auth = false) =>
    apiFetch<T>(path, { method: 'GET', auth }),

  post: <T>(path: string, body?: any, auth = false) =>
    apiFetch<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      auth,
    }),

  put: <T>(path: string, body?: any, auth = false) =>
    apiFetch<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      auth,
    }),

  patch: <T>(path: string, body?: any, auth = false) =>
    apiFetch<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      auth,
    }),

  delete: <T>(path: string, auth = false) =>
    apiFetch<T>(path, { method: 'DELETE', auth }),
};

// ---------- AUTH HELPERS ----------
export const auth = {
  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('presec_token', token);
    }
  },
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('presec_token');
  },
  clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('presec_token');
      localStorage.removeItem('presec_user');
    }
  },
  setUser(user: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('presec_user', JSON.stringify(user));
    }
  },
  getUser(): any | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('presec_user');
    return raw ? JSON.parse(raw) : null;
  },
  isLoggedIn(): boolean {
    return !!this.getToken();
  },
};
