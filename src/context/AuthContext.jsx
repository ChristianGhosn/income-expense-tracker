import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import toast from "react-hot-toast";

import { auth } from "../config/firebase";
import { ThreeDots } from "react-loader-spinner";

const googleProvider = new GoogleAuthProvider();

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
      toast.success("Logged in");
    } catch (error) {
      toast.error("Error signing in");
      console.log(error.message);
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      navigate("/login");
      toast.success("Logged out");
    } catch (error) {
      toast.error("Error signing out");
      console.log(error.message);
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = { user, login, logout, loading };
  return (
    <AuthContext.Provider value={value}>
      {loading && (
        <div className="h-screen w-full flex justify-center items-center">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#8F659A"
            ariaLabel="three-dots-loading"
            visible={loading}
          />
        </div>
      )}

      {!loading && children}
    </AuthContext.Provider>
  );
}
