"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@/lib/UserContext";
import { Heist, heistConverter, COLLECTIONS } from "@/types/firestore";

export type HeistFilter = "active" | "assigned" | "expired";

interface UseHeistsResult {
  heists: Heist[];
  loading: boolean;
  error: string | null;
}

export function useHeists(filter: HeistFilter): UseHeistsResult {
  const { user, loading: userLoading } = useUser();
  const [heists, setHeists] = useState<Heist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const needsUser = filter === "active" || filter === "assigned";

  useEffect(() => {
    if (userLoading) return;
    if (needsUser && !user) return;

    const now = Timestamp.now();
    const constraints: QueryConstraint[] = [];

    switch (filter) {
      case "active":
        constraints.push(where("assignedTo", "==", user!.uid));
        constraints.push(where("deadline", ">", now));
        break;
      case "assigned":
        constraints.push(where("createdBy", "==", user!.uid));
        constraints.push(where("deadline", ">", now));
        break;
      case "expired":
        constraints.push(where("deadline", "<=", now));
        break;
    }

    const q = query(
      collection(db, COLLECTIONS.HEISTS).withConverter(heistConverter),
      ...constraints,
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let results = snapshot.docs.map((doc) => doc.data() as Heist);

        if (filter === "expired") {
          results = results.filter((heist) => heist.finalStatus === null);
        }

        setHeists(results);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [filter, user, userLoading, needsUser]);

  if (userLoading) {
    return { heists: [], loading: true, error: null };
  }
  if (needsUser && !user) {
    return { heists: [], loading: false, error: null };
  }

  return { heists, loading, error };
}
