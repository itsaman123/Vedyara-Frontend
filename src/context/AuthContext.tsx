import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AUTH_EXPIRED_EVENT, TOKEN_KEY } from "../api/http";
import * as userApi from "../api/userApi";

const USER_KEY = "user";

interface AuthContextType {
  user: userApi.User | null;
  isAuthenticated: boolean;
  signIn: (session: { token: string; user: userApi.User }) => void;
  signOut: () => void;
  /** Replace the cached user after a profile or address change */
  setUser: (user: userApi.User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readStoredUser = (): userApi.User | null => {
  try {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUserState] = useState<userApi.User | null>(() =>
    localStorage.getItem(TOKEN_KEY) ? readStoredUser() : null,
  );

  const setUser = useCallback((next: userApi.User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(next));
    setUserState(next);
  }, []);

  const signIn = useCallback(
    (session: { token: string; user: userApi.User }) => {
      localStorage.setItem(TOKEN_KEY, session.token);
      setToken(session.token);
      setUser(session.user);
    },
    [setUser],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUserState(null);
  }, []);

  // Refresh the cached profile once per session
  useEffect(() => {
    if (!token) return;
    userApi
      .getProfile()
      .then(({ user }) => setUser(user))
      .catch(() => {
        /* a 401 signs out via the expired event; other errors keep the cache */
      });
  }, [token, setUser]);

  useEffect(() => {
    window.addEventListener(AUTH_EXPIRED_EVENT, signOut);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, signOut);
  }, [signOut]);

  // Keep tabs in sync when the user signs in or out elsewhere
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== TOKEN_KEY) return;
      setToken(e.newValue);
      setUserState(e.newValue ? readStoredUser() : null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!token, signIn, signOut, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
