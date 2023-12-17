import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

import { auth } from "../config/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  async function login() {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (error) {
      console.error("Error signing in:", error.message);
      // You might want to display an error message to the user.
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error.message);
      // You might want to display an error message to the user.
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = { user, login, logout };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
