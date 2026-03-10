import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, Leaf, User } from "lucide-react";
import { AuthContext } from "../context/authContext";

function Auth() {
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setDisplayName] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {

      const endpoint = isLogin
        ? "http://localhost:7000/api/v1/users/login"
        : "http://localhost:7000/api/v1/users/register";

      const body = isLogin
        ? { email, password }
        : { email, password, fullName };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Request failed");
      }

      const data = await res.json();

      // Login response contains tokens
      if (isLogin) {

        const {
          data: { user, accessToken, refreshToken },
        } = data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        setIsLoggedIn(true);
        
        navigate("/setup");
        window.location.reload();

      } else {

        // After signup switch to login
        setIsLogin(true);
        setEmail("");
        setPassword("");
        setDisplayName("");

        alert("Account created successfully. Please login.");

      }

    } catch (err) {

      setError(err.message);

    } finally {

      setSubmitting(false);

    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background grid-pattern">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-4"
      >

        <div className="rounded-xl border border-border bg-card/80 backdrop-blur-md p-8 glow-border">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">

            <div className="h-10 w-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-primary" />
            </div>

            <h1 className="text-2xl font-bold text-foreground">
              AgriSense
            </h1>

          </div>

          <p className="text-center text-muted-foreground text-sm mb-6">

            {isLogin ? "Sign in to your dashboard" : "Create your account"}

          </p>

          {error && (
            <p className="text-red-500 text-center text-sm mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Display Name (Signup Only) */}
            {!isLogin && (
              <div className="relative">

                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <input
                  type="text"
                  placeholder="Display name"
                  value={fullName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                />

              </div>
            )}

            {/* Email */}
            <div className="relative">

              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
              />

            </div>

            {/* Password */}
            <div className="relative">

              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
              />

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >

              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}

              {isLogin ? "Sign In" : "Create Account"}

            </button>

          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-muted-foreground mt-5">

            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            {" "}

            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline font-medium cursor-pointer"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </span>

          </p>

        </div>
      </motion.div>
    </div>
  );
}

export default Auth;