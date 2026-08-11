import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, getAuthToken, setAuthToken } from "@/api/client";
import { clearToken, loadToken, saveToken } from "@/api/session";
import type { UserProfile } from "@/types/paysuite";

type AuthContextValue = {
  user: UserProfile | null;
  loading: boolean;
  /** True until the stored token has been read and validated on cold start. */
  restoring: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
  }) => Promise<void>;
  setUser: (u: UserProfile | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(true);

  // Cold start: re-attach a stored token and confirm it is still valid by
  // fetching the profile. An invalid token is discarded rather than left to
  // fail every subsequent request.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await loadToken();
      if (token) {
        setAuthToken(token);
        try {
          const profile = await api.profile();
          if (!cancelled) setUser(profile);
        } catch {
          setAuthToken(null);
          await clearToken();
        }
      }
      if (!cancelled) setRestoring(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const profile = await api.login(email, password);
      const token = getAuthToken();
      if (token) await saveToken(token);
      setUser(profile);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      companyName?: string;
    }) => {
      setLoading(true);
      try {
        const profile = await api.register(data);
        const token = getAuthToken();
        if (token) await saveToken(token);
        setUser(profile);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    await api.logout();
    setAuthToken(null);
    await clearToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, restoring, login, register, setUser, logout }),
    [user, loading, restoring, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
