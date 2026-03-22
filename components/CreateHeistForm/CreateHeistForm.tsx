"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { serverTimestamp } from "firebase/firestore";
import { useUser } from "@/lib/UserContext";
import { fetchUsers, createHeist } from "@/lib/heists";
import { FirestoreUser, CreateHeistInput } from "@/types/firestore";
import styles from "./CreateHeistForm.module.css";

export default function CreateHeistForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    fetchUsers(user.uid)
      .then(setUsers)
      .catch(() => setError("Failed to load users."))
      .finally(() => setLoading(false));
  }, [user]);

  const isValid =
    title.trim() !== "" && description.trim() !== "" && assignedTo !== "";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !isValid) return;

    setError(null);
    setSubmitting(true);

    const selectedUser = users.find((u) => u.id === assignedTo);
    if (!selectedUser) {
      setError("Selected user not found.");
      setSubmitting(false);
      return;
    }

    const input: CreateHeistInput = {
      title: title.trim(),
      description: description.trim(),
      createdBy: user.uid,
      createdByCodename: user.displayName || "",
      assignedTo: selectedUser.id,
      assignedToCodename: selectedUser.codename,
      deadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
      finalStatus: null,
      createdAt: serverTimestamp(),
    };

    try {
      await createHeist(input);
      router.push("/heists");
    } catch {
      setError("Failed to create heist. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      <label className={styles.label} htmlFor="title">
        Title
      </label>
      <input
        className={styles.input}
        id="title"
        type="text"
        required
        disabled={submitting}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label className={styles.label} htmlFor="description">
        Description
      </label>
      <textarea
        className={styles.textarea}
        id="description"
        required
        disabled={submitting}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label className={styles.label} htmlFor="assignedTo">
        Assigned To
      </label>
      <select
        className={styles.select}
        id="assignedTo"
        required
        disabled={submitting || loading}
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
      >
        <option value="" disabled>
          {loading ? "Loading agents..." : "Select an agent..."}
        </option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.codename}
          </option>
        ))}
      </select>

      <button type="submit" className="btn" disabled={submitting || !isValid}>
        {submitting ? "Creating..." : "Create Heist"}
      </button>
    </form>
  );
}
