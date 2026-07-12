import { FirebaseError } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import firebase_app from "../config";

export default async function resetPassword(email: string) {
  try {
    const auth = getAuth(firebase_app);
    const result = await sendPasswordResetEmail(auth, email);
    return { error: null, result };
  } catch (err) {
    const error = err as FirebaseError;
    return { error, result: null };
  }
}
