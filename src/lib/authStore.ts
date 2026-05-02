import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

interface AuthUser { name: string; email: string; id: string; }
interface AuthState {
  user: AuthUser | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

function toUser(session: { user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> } } | null): AuthUser | null {
  if (!session?.user) return null;
  const u = session.user;
  const name = (u.user_metadata?.name as string) || (u.email?.split("@")[0] ?? "User");
  return { id: u.id, email: u.email ?? "", name };
}

let allowAuthSession = false;

export const useAuth = create<AuthState>((set) => {
  // Listen for auth changes (sign in / sign out / token refresh)
  if (typeof window !== "undefined") {
    supabase.auth.onAuthStateChange((event, session) => {
      if (!allowAuthSession && event !== "SIGNED_OUT") return;
      set({ user: toUser(session), hydrated: true });
    });
  }

  return {
    user: null,
    hydrated: false,
    hydrate: async () => {
      allowAuthSession = false;
      if (typeof window !== "undefined") {
        await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
      }
      set({ user: null, hydrated: true });
    },
    login: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) return { ok: false, error: error.message };
      allowAuthSession = true;
      set({ user: toUser(data.session), hydrated: true });
      return { ok: true };
    },
    signup: async (name, email, password) => {
      if (!name || !email || !password) return { ok: false, error: "All fields required" };
      if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters" };
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { name },
        },
      });
      if (error) return { ok: false, error: error.message };
      allowAuthSession = true;
      set({ user: toUser(data.session), hydrated: true });
      return { ok: true };
    },
    logout: async () => {
      allowAuthSession = false;
      await supabase.auth.signOut();
      set({ user: null });
    },
  };
});
