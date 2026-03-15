"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { signup, getSignupErrorMessage } from "@/lib/signup";
import { login, getLoginErrorMessage } from "@/lib/login";
import styles from "./AuthForm.module.css";

type AuthFormProps = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(null), 3000);
    return () => clearTimeout(timer);
  }, [success]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (mode === "login") {
      setError(null);
      setSuccess(null);
      setLoading(true);
      try {
        await login(email, password);
        setSuccess("Login successful!");
      } catch (err) {
        setError(getLoginErrorMessage(err));
      } finally {
        setLoading(false);
      }
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await signup(email, password);
      router.push("/heists");
    } catch (err) {
      setError(getSignupErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      {success && (
        <p role="status" className={styles.success}>
          {success}
        </p>
      )}

      <label className={styles.label} htmlFor="email">
        Email
      </label>
      <input
        className={styles.input}
        id="email"
        type="email"
        required
        disabled={loading}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className={styles.label} htmlFor="password">
        Password
      </label>
      <div className={styles.passwordWrapper}>
        <input
          className={styles.input}
          id="password"
          type={showPassword ? "text" : "password"}
          required
          disabled={loading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          className={styles.toggle}
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <button type="submit" className="btn" disabled={loading}>
        {loading
          ? mode === "login"
            ? "Logging in..."
            : "Signing up..."
          : mode === "login"
            ? "Log In"
            : "Sign Up"}
      </button>

      <p className={styles.switchLink}>
        {mode === "login" ? (
          <>
            Don&apos;t have an account? <Link href="/signup">Sign up</Link>
          </>
        ) : (
          <>
            Already have an account? <Link href="/login">Log in</Link>
          </>
        )}
      </p>
    </form>
  );
}
