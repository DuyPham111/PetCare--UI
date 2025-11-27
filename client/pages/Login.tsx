import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("customer123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      // Redirect based on role
      const storedUser = localStorage.getItem("petcare_user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        // Route based on role
        if (user.role === "customer") {
          navigate("/dashboard");
        } else if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "veterinarian") {
          navigate("/vet");
        } else if (user.role === "receptionist") {
          navigate("/receptionist");
        } else if (user.role === "pharmacist") {
          navigate("/pharmacist");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 border border-border">
        <div className="mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">
            🐾
          </div>
          <h1 className="text-2xl font-bold text-foreground text-center">
            PetCare Pro
          </h1>
          <p className="text-muted-foreground text-center mt-2">
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white"
            size="lg"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 border-t border-border pt-6">
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:text-primary/80 font-medium">
              Create one
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700 font-semibold mb-3">Demo Accounts:</p>
          <div className="space-y-2 text-xs text-blue-700">
            <div>
              <p className="font-medium">Customer:</p>
              <p>john@example.com / customer123</p>
            </div>
            <div className="border-t border-blue-200 pt-2">
              <p className="font-medium">Admin:</p>
              <p>admin@petcare.com / admin123</p>
            </div>
            <div>
              <p className="font-medium">Veterinarian:</p>
              <p>dr.smith@petcare.com / vet123</p>
            </div>
            <div>
              <p className="font-medium">Receptionist:</p>
              <p>reception@petcare.com / rec123</p>
            </div>
            <div>
              <p className="font-medium">Pharmacist:</p>
              <p>pharmacy@petcare.com / pharm123</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
