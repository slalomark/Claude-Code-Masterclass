import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function login(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

export function getLoginErrorMessage(error: unknown): string {
  if (error instanceof Error && "code" in error) {
    const code = (error as { code: string }).code;
    switch (code) {
      case "auth/invalid-credential":
        return "Invalid email or password.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
    }
  }

  return "Login failed. Please try again.";
}
