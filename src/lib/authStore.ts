import { create } from "zustand";

interface AuthUser { name: string; email: string; }
interface AuthState {
  user: AuthUser | null;
  hydrated: boolean;
  hydrate: () => void;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  signup: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const KEY_USERS = "hydro_users";
const KEY_SESSION = "hydro_session";

function readUsers(): Record<string, { name: string; password: string }> {
  if (typeof localStorage === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY_USERS) || "{}"); } catch { return {}; }
}
function writeUsers(u: Record<string, { name: string; password: string }>) {
  localStorage.setItem(KEY_USERS, JSON.stringify(u));
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  hydrated: false,
  hydrate: () => {
    if (typeof localStorage !== "undefined") localStorage.removeItem(KEY_SESSION);
    set({ user: null, hydrated: true });
  },
  login: (email, password) => {
    const users = readUsers();
    const rec = users[email.toLowerCase()];
    if (!rec) return { ok: false, error: "Account not found" };
    if (rec.password !== password) return { ok: false, error: "Incorrect password" };
    const user = { name: rec.name, email: email.toLowerCase() };
    set({ user });
    return { ok: true };
  },
  signup: (name, email, password) => {
    if (!name || !email || !password) return { ok: false, error: "All fields required" };
    if (password.length < 4) return { ok: false, error: "Password too short" };
    const users = readUsers();
    const key = email.toLowerCase();
    if (users[key]) return { ok: false, error: "Account already exists" };
    users[key] = { name, password };
    writeUsers(users);
    const user = { name, email: key };
    set({ user });
    return { ok: true };
  },
  logout: () => {
    localStorage.removeItem(KEY_SESSION);
    set({ user: null });
  },
}));
