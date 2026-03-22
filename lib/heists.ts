import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  COLLECTIONS,
  CreateHeistInput,
  FirestoreUser,
} from "@/types/firestore";

export async function fetchUsers(excludeUid: string): Promise<FirestoreUser[]> {
  const snapshot = await getDocs(collection(db, COLLECTIONS.USERS));
  const users: FirestoreUser[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data() as FirestoreUser;
    if (data.id !== excludeUid) {
      users.push(data);
    }
  });
  return users;
}

export async function createHeist(input: CreateHeistInput): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.HEISTS), input);
  return docRef.id;
}
