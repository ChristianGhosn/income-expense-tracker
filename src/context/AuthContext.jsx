import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import toast from "react-hot-toast";

import { auth } from "../config/firebase";
import { ThreeDots } from "react-loader-spinner";
import Loader from "../components/Loader";

const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  async function signupWithEmail(email, password, displayName) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, { displayName });
      navigate("/");
    } catch (error) {
      toast.error(`Error signing up: ${error.message}`);
    }
  }

  async function loginWithEmail(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
      toast.success("Logged In");
    } catch (error) {
      toast.error(`Error signing in: ${error.message}`);
    }
  }

  async function loginWithGoogle() {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
      toast.success("Logged in");
    } catch (error) {
      toast.error(`Error signing in: ${error.message}`);
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      navigate("/login");
      toast.success("Logged out");
    } catch (error) {
      toast.error(`Error signing out: ${error.message}`);
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loginWithGoogle,
    signupWithEmail,
    loginWithEmail,
    logout,
    loading,
  };
  return (
    <AuthContext.Provider value={value}>
      {loading && <Loader />}

      {!loading && children}
    </AuthContext.Provider>
  );
}
