import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";


type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
    
}

type User = {
    id: string;
    name: string;
    avatar: string;
}

type AuthContextProviderProps = {
    children: React.ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);
  
export function AuthContextProvider(props: AuthContextProviderProps) {

    const provider = new GoogleAuthProvider();

  const [user, setUser] = useState<User>()

  useEffect(()=> {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user != null) {
        const { displayName, photoURL, uid} = user;

        if (!displayName || !photoURL ) {
          throw new Error('Missing information from Google Account')
        }
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])

  const signInWithGoogle = async () =>  {
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        const { displayName, photoURL, uid} = result.user;

        if (!displayName || !photoURL ) {
          throw new Error('Missing information from Google Account')
        }
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
      
    } catch (error) {
      console.log(error);
    }
  }


    return (

        <AuthContext.Provider value={{user, signInWithGoogle}}>

        </AuthContext.Provider>

    );
}