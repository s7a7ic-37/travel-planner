"use client";
import React, { ReactNode } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import firebase_app from "..//firebase/config";
import { User as FirebaseUser } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

interface AuthContextInterface {
  user: FirebaseUser | null;
  name: string | null;
}

export const AuthContext = React.createContext({} as AuthContextInterface);

export const useAuthContext = () => React.useContext(AuthContext);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = React.useState<FirebaseUser | null>(null);
  const [name, setName] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!firebase_app.options.apiKey) {
      return;
    }
    const auth = getAuth(firebase_app);
    const updateName = async (uid: string) => {
      if (!uid) return setName(null);
      const db = getFirestore(firebase_app);
      const docRef = doc(db, "users", uid);
      const currentData = await getDoc(docRef);
      const data = currentData.data();
      if (data === undefined) return setName(null);
      setName(data.name);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        updateName(user.uid).catch(() => setName(null));
      } else {
        setUser(null);
        setName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, name }}>
      {children}
    </AuthContext.Provider>
  );
};
