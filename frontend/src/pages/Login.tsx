import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle, user } = useAuth();
  const { toast } = useToast();

  const isGoogleConfigured = true;

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      const email = result.user.email || "";
      const name = result.user.displayName || "";

      const backendResult = await loginWithGoogle(token, email, name);

      if (backendResult.success) {
        toast({
          title: "Login successful",
          description: "Welcome back to ZeroWaste!",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: backendResult.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Firebase Google Login Error:", error);
      toast({
        title: "Google Login Failed",
        description: error.message || "Could not authenticate with Google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      toast({
        title: "Login successful",
        description: "Welcome back to ZeroWaste!",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: result.message + (result.hint ? `\n\n${result.hint}` : ''),
        variant: "destructive",
        duration: 8000,
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
              <LogIn className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Login</h1>
            <p className="text-muted-foreground">
              Sign in to your ZeroWaste account
            </p>
          </div>

          {/* Demo Credentials Info
          <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
            <p className="text-sm font-medium text-primary">Demo login:</p>
            <p className="mt-1 text-sm text-foreground">
              <span className="font-semibold text-primary">admin@foodwastage.com</span> / admin123
            </p>
          </div> */}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              size="lg"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {isGoogleConfigured ? (
            <>
              {/* Or Divider */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex-1 border-t border-muted-foreground/20"></div>
                <span className="text-xs text-muted-foreground font-medium">OR</span>
                <div className="flex-1 border-t border-muted-foreground/20"></div>
              </div>

              {/* Google Sign-In Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full mt-4"
                onClick={handleGoogleLogin}
                disabled={loading}
                size="lg"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>
            </>
          ) : (
            <div className="mt-6 rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-center">
              <p className="text-sm font-medium text-yellow-900 mb-2">Google Sign-In Not Configured</p>
              <p className="text-xs text-yellow-800 mb-3">
                To enable Google authentication, follow the setup guide
              </p>
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.open('/GOOGLE_AUTH_SETUP.md', '_blank');
                }}
                className="text-xs font-semibold text-yellow-900 hover:underline"
              >
                View Setup Guide
              </Link>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 space-y-4">
            <div className="border-t pt-6">
              <p className="text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary font-semibold hover:underline">
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
