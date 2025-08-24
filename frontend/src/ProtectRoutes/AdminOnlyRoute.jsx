import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminOnlyRoute = ({ children }) => {
  const { role, loading } = useAuth();

  if (loading) return null;

  // ✅ Allow only if role is exactly "admin"
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminOnlyRoute;
