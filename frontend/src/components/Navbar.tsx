import { Link, useLocation } from "react-router-dom";
import { ChefHat, Heart, Home, Package } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/chef", label: "Chef Dashboard", icon: ChefHat },
  { to: "/report", label: "Report Surplus", icon: Package },
  { to: "/available", label: "Available Food", icon: Heart },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <ChefHat className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            ZeroWaste
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
