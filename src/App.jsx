import "./App.css";
import { Routes, Route } from "react-router-dom";

import { TransactionProvider } from "./context/TransactionContext";
import ProtectedRoute from "./context/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="h-full overflow-hidden">
      <AuthProvider>
        <TransactionProvider>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </TransactionProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
