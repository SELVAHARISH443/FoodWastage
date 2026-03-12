import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChefHat, Heart, Home, Package, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  // Don't show navbar on login/register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  // Define navigation items
  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/dashboard", label: "Dashboard", icon: ChefHat },
  ];

  // Filter nav items based on user role (simplified)
  const availableNavItems = navItems;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case "admin":
        return "Administrator";
      case "chef":
        return "Chef";
      case "surplus":
        return "Food Surplus Manager";
      case "viewer":
        return "Viewer";
      default:
        return "";
    }
  };

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

        {isAuthenticated && user ? (
          <div className="flex items-center gap-1">
            {availableNavItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${location.pathname === to
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>
        ) : null}

        {isAuthenticated && user ? (
          <div className="flex items-center gap-3 ml-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-muted-foreground">
                {user.name}
              </p>
              <p className="text-xs font-semibold text-foreground">
                {getRoleLabel()}
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
