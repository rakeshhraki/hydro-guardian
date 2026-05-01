import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Mail, Lock, User as UserIcon, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/authStore";

import { toast } from "sonner";

type Search = { mode?: "login" | "signup" };

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    mode: s.mode === "signup" ? "signup" : "login",
  }),
  head: () => ({ meta: [{ title: "HydroSense — Sign In" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { mode = "login" } = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const login = useAuth(s => s.login);
  const signup = useAuth(s => s.signup);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = isSignup ? signup(name, email, password) : login(email, password);
    setLoading(false);
    if (!result.ok) { toast.error(result.error || "Something went wrong"); return; }
    toast.success(isSignup ? "Account created" : "Welcome back");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid place-items-center px-4 py-8 relative overflow-hidden">
      <OceanBackground />

      {/* expanding rings overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-aqua/30"
            style={{ left: "50%", top: "50%", x: "-50%", y: "-50%" }}
            initial={{ width: 100, height: 100, opacity: 0.4 }}
            animate={{ width: 700, height: 700, opacity: 0 }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 1.3, ease: "easeOut" }}
          />
        ))}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 w-full max-w-md panel p-6 sm:p-8 backdrop-blur-xl bg-background/40"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center glow-aqua mb-3">
            <Droplets className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {isSignup ? "Join the HydroSense control network" : "Sign in to monitor your network"}
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-lg bg-muted/40 mb-5 text-sm">
          <button
            type="button"
            onClick={() => navigate({ to: "/auth", search: { mode: "login" } })}
            className={`py-2 rounded-md font-medium transition ${!isSignup ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >Login</button>
          <button
            type="button"
            onClick={() => navigate({ to: "/auth", search: { mode: "signup" } })}
            className={`py-2 rounded-md font-medium transition ${isSignup ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >Sign Up</button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <AnimatePresence mode="wait">
            {isSignup && (
              <motion.div
                key="name"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <Field icon={<UserIcon className="h-4 w-4" />} placeholder="Full name" value={name} onChange={setName} />
              </motion.div>
            )}
          </AnimatePresence>

          <Field icon={<Mail className="h-4 w-4" />} type="email" placeholder="Email address" value={email} onChange={setEmail} />
          <PasswordField value={password} onChange={setPassword} />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 h-11 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
          >
            {isSignup ? "Create account" : "Sign in"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-muted-foreground">
          {isSignup ? "Already have an account? " : "New to HydroSense? "}
          <button
            onClick={() => navigate({ to: "/auth", search: { mode: isSignup ? "login" : "signup" } })}
            className="text-aqua font-medium hover:underline"
          >
            {isSignup ? "Sign in" : "Create one"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Field({ icon, type = "text", placeholder, value, onChange }: {
  icon: React.ReactNode; type?: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 h-11 px-3 rounded-lg bg-muted/40 border border-border focus-within:border-aqua/60 transition">
      <span className="text-muted-foreground">{icon}</span>
      <input
        type={type}
        required
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
      />
    </label>
  );
}

function PasswordField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <label className="flex items-center gap-2 h-11 px-3 rounded-lg bg-muted/40 border border-border focus-within:border-aqua/60 transition">
      <span className="text-muted-foreground"><Lock className="h-4 w-4" /></span>
      <input
        type={show ? "text" : "password"}
        required
        placeholder="Password"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="text-muted-foreground hover:text-aqua transition p-1 -mr-1"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </label>
  );
}
