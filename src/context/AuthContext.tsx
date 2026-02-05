import React, { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type User = {
  id: string;
  name: string;
  role: "manager" | "employee";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  async function loadProfile(authUserId: string) {
    setAuthError(null);

    console.log("[auth] loadProfile", authUserId);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, role")
      .eq("id", authUserId)
      .single();

    console.log("[auth] profile result", { data, error });

    if (error || !data) {
      console.error("profiles fetch error:", error);
      setUser(null);
      setAuthError("Profile missing. Contact admin.");
      return;
    }

    setUser({
      id: data.id,
      name: data.display_name ?? "User",
      role: data.role,
    });
  }

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      console.log("[auth] initial session", data.session?.user?.id ?? null);

      const sessionUser = data.session?.user;
      if (sessionUser) await loadProfile(sessionUser.id);
      else setUser(null);

      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      const sessionUser = session?.user;
      console.log("[auth] state change", { event, userId: sessionUser?.id ?? null });

      setLoading(true);

      if (!sessionUser) {
        setUser(null);
        setAuthError(null);
        setLoading(false);
        return;
      }

      await loadProfile(sessionUser.id);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setAuthError(null);
    setLoading(true);

    const res = await supabase.auth.signInWithPassword({ email, password });

    if (res.error) {
      setAuthError(res.error.message);
      setLoading(false);
      throw res.error;
    }
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setAuthError(null);
    setLoading(false);
  };

  const value = useMemo(
    () => ({ user, loading, authError, signIn, logout }),
    [user, loading, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};