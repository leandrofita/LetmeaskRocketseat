import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";

import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { createContext, useState, useEffect } from "react";

import { browserLocalPersistence, GoogleAuthProvider, onAuthStateChanged, setPersistence, signInWithPopup } from "firebase/auth";
import { app, auth } from "./services/firebase";

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;

}

type User = {
  id: string;
  name: string;
  avatar: string;
}

export const AuthContext = createContext({} as AuthContextType);

function App() {

  const provider = new GoogleAuthProvider();

  const [user, setUser] = useState<User>()

  useEffect(()=> {
    onAuthStateChanged(auth, user => {
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
  }, [])

  /* useEffect(()=> {
    onAuthStateChanged(auth, user => {
      if (user) {
        const { displayName, photoURL, uid} = user;

        if (!displayName || !photoURL ) {
          throw new Error('Missing information from Google Account')
        }
      }
    })
  }, []) */

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
    <BrowserRouter>
    <AuthContext.Provider value={{user, signInWithGoogle}}>

      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/rooms/new" element={<NewRoom />}/>
      </Routes>
    </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
