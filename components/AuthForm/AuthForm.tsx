"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { signup, getSignupErrorMessage } from "@/lib/signup";
import styles from "./AuthForm.module.css";

type AuthFormProps = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (mode === "login") {
      console.log({ email, password });
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
        {loading ? "Signing up..." : mode === "login" ? "Log In" : "Sign Up"}
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
