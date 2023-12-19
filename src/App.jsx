import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { TransactionProvider } from "./context/TransactionContext";
import ProtectedRoute from "./context/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <div className="h-full overflow-hidden">
      <AuthProvider>
        <Toaster />
        <TransactionProvider>
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </TransactionProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
