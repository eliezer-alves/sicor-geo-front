import { Link, useLocation } from "react-router-dom";
import { Map, BarChart3, Moon, Sun, Layers } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

const NAV = [
  { label: "Mapa", to: "/map", icon: Map },
  { label: "Relatorios", to: "/reports", icon: BarChart3 },
] as const;

export function Topbar({ theme, onToggleTheme }: Props) {
  const { pathname } = useLocation();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
      {/* Logo + Nav */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          <Layers className="h-5 w-5 text-primary" />
          <span className="text-sm tracking-tight">SICOR</span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV.map(({ label, to, icon: Icon }) => {
            const active = pathname === to || (to === "/map" && pathname === "/");
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Actions */}
      <button
        type="button"
        onClick={onToggleTheme}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Alternar tema"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    </header>
  );
}
