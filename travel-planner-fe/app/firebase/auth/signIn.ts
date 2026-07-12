import { FirebaseError } from "firebase/app";
import firebase_app from "../config";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default async function signIn(email: string, password: string) {
    try{
        const auth = getAuth(firebase_app);
        const result = await signInWithEmailAndPassword(auth, email, password);
        return {error: null, result};
    } catch (err) {
        const error = err as FirebaseError;
        return {error: error, result: null};
    }
}
