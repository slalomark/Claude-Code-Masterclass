import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { generateCodename } from "@/lib/generateCodename";

export async function signup(email: string, password: string): Promise<void> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  const codename = generateCodename();

  await updateProfile(user, { displayName: codename });

  const userDoc = { codename, id: user.uid };
  try {
    await setDoc(doc(db, "users", user.uid), userDoc);
  } catch {
    // Retry once on Firestore failure
    await setDoc(doc(db, "users", user.uid), userDoc);
  }
}

export function getSignupErrorMessage(error: unknown): string {
  if (error instanceof Error && "code" in error) {
    const code = (error as { code: string }).code;
    switch (code) {
      case "auth/email-already-in-use":
        return "That email is already registered.";
      case "auth/weak-password":
        return "Password must be at least 6 characters.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
    }
  }

  if (error instanceof Error && error.message === "FIRESTORE_WRITE_FAILED") {
    return "Account created but profile setup failed. Please try logging in.";
  }

  return "Something went wrong. Please try again.";
}
