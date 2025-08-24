import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { role, loading } = useAuth();

  if (loading) return null; // optional loading UI

  // ✅ If the user is either user or admin, redirect to home
  if (role === "user" || role === "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
