import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, Bell, SettingsIcon, LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const categories = [
  { name: "Home", path: "/" },
  { name: "World", path: "/category/world" },
  { name: "Tech", path: "/category/tech" },
  { name: "Sports", path: "/category/sports" },
  { name: "Business", path: "/category/business" },
  { name: "Politics", path: "/category/politics" },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut, isAdmin } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error("Error signing out");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container flex items-center justify-between h-14">
        <Link to="/" className="text-xl font-bold tracking-tight text-foreground">
          WorldPulse
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.path}
              to={cat.path}
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                location.pathname === cat.path
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Link
            to="/search"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search className="h-5 w-5" />
          </Link>
          <a
            href="#subscribe"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            title="Notify Me"
          >
            <Bell className="h-5 w-5" />
          </a>
          {isAdmin && (
            <Link
              to="/admin"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Admin Panel"
            >
              <SettingsIcon className="h-5 w-5" />
            </Link>
          )}
          {user ? (
            <button
              onClick={handleSignOut}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          ) : (
            <Link
              to="/login"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Sign In"
            >
              <LogIn className="h-5 w-5" />
            </Link>
          )}
          <button
            className="p-2 md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container py-3 flex flex-col gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.path}
                to={cat.path}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium py-1.5 ${
                  location.pathname === cat.path
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {cat.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium py-1.5 text-muted-foreground hover:text-foreground"
              >
                Admin
              </Link>
            )}
            {user ? (
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileOpen(false);
                }}
                className="text-sm font-medium py-1.5 text-left text-muted-foreground hover:text-foreground"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium py-1.5 text-muted-foreground hover:text-foreground"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
