import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type AuthUser = {
  fullName: string;
  email: string | null;
  phoneNumber: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
};

const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function readStoredUser(): AuthUser | null {
  try {
    if (!localStorage.getItem(TOKEN_KEY)) return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);
  const [token, setToken] = useState<string | null>(readStoredToken);

  const login = (newToken: string, u: AuthUser) => {
    try {
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
    } catch {
      // Storage unavailable — keep the session in memory only.
    }
    setToken(newToken);
    setUser(u);
  };

  const logout = () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // ignore
    }
    setToken(null);
    setUser(null);
  };

  // Confirm a stored session with the server; drop it if expired or invalid.
  useEffect(() => {
    const stored = readStoredToken();
    if (!stored) return;
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${stored}` } })
      .then(async (r) => {
        if (r.status === 401) logout();
        else if (r.ok) {
          const data = (await r.json()) as { user: AuthUser };
          setUser(data.user);
        }
      })
      .catch(() => { /* offline — keep the stored session */ });
  }, []);

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export async function postJSON<T = Record<string, unknown>>(url: string, body: unknown, token?: string | null) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as T & { error?: string; message?: string };
  return { ok: response.ok, status: response.status, data };
}
