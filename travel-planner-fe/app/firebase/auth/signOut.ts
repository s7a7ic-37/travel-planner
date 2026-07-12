import { FirebaseError } from "firebase/app";
import firebase_app from "../config";
import { getAuth, signOut } from "firebase/auth";

export default async function signOutUser() {
  try {
    const auth = getAuth(firebase_app);
    await signOut(auth);
  } catch (err) {
    const error = err as FirebaseError;
    return error;
  }
}
