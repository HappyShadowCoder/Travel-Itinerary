import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Result from "./pages/Result";
import History from "./pages/History";
import Auth from "./pages/Auth";

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
  return user ? children : <Navigate to="/auth" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Protected><Home /></Protected>} />
          <Route path="/result/:id" element={<Protected><Result /></Protected>} />
          <Route path="/history" element={<Protected><History /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
