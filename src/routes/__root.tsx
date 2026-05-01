import { Outlet, createRootRoute, HeadContent, Scripts, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import appCss from "../styles.css?url";
import { AppHeader } from "@/components/AppHeader";
import { NotificationStack } from "@/components/NotificationStack";
import { SplashScreen } from "@/components/SplashScreen";
import { useHydroEngine } from "@/lib/useHydroEngine";
import { useAuth } from "@/lib/authStore";
import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence } from "framer-motion";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-7xl font-display font-bold text-aqua">404</h1>
        <p className="mt-3 text-muted-foreground">This pipeline doesn't exist.</p>
        <a href="/" className="inline-block mt-6 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">Back to Dashboard</a>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HydroSense — Smart Water Management" },
      { name: "description", content: "Real-time water leakage prevention, equal distribution, and pipeline control system." },
      { name: "theme-color", content: "#0c2340" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  useHydroEngine();
  const [showSplash, setShowSplash] = useState(true);
  const hydrate = useAuth(s => s.hydrate);
  const hydrated = useAuth(s => s.hydrated);
  const user = useAuth(s => s.user);
  const path = useRouterState({ select: r => r.location.pathname });
  const navigate = useNavigate();

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (showSplash || !hydrated) return;
    if (!user && path !== "/auth") navigate({ to: "/auth", search: { mode: "login" } });
  }, [showSplash, hydrated, user, path, navigate]);

  const isAuthRoute = path === "/auth";
  const showShell = !showSplash && (user || isAuthRoute);

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence>{showSplash && <SplashScreen key="splash" />}</AnimatePresence>
      {showShell && !isAuthRoute && <AppHeader />}
      <main className="flex-1">
        {showShell ? <Outlet /> : !showSplash && <div className="min-h-screen" />}
      </main>
      {user && <NotificationStack />}
      <Toaster theme="dark" position="top-right" richColors />
    </div>
  );
}
