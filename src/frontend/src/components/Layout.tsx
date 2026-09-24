import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  Brain,
  FileText,
  Menu,
  Mic,
  ScanFace,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

const navLinks = [
  { to: "/", label: "Home", icon: Brain },
  { to: "/text-detection", label: "Text", icon: FileText },
  { to: "/facial-detection", label: "Facial", icon: ScanFace },
  { to: "/voice-detection", label: "Voice", icon: Mic },
  { to: "/evaluation", label: "Evaluation", icon: BarChart3 },
  { to: "/documentation", label: "Docs", icon: BookOpen },
];

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-teal group-hover:scale-105 transition-transform duration-200">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-bold text-base text-foreground leading-tight tracking-tight">
                  StressDetect
                </span>
                <span className="block text-[11px] text-muted-foreground leading-tight font-medium tracking-wide">
                  ML-Powered Analysis
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentPath === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    data-ocid={"nav.link"}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-teal"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-surface/95 backdrop-blur-sm px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    currentPath === link.to
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="font-display font-semibold text-sm text-foreground">
                  Stress Detection with Machine Learning
                </p>
                <p className="text-xs text-muted-foreground">
                  ML-Powered Logistic Regression Analysis
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 text-sm text-muted-foreground flex-wrap justify-center">
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="hover:text-foreground transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} Built with</span>
              <span className="text-rose-500">♥</span>
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || "stress-detection-system")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
