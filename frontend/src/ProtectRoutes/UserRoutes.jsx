import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserOnlyRoute = ({ children }) => {
  const { role, loading } = useAuth();

  if (loading) return null;

  // ✅ Allow only if role is exactly "user"
  if (role !== "user") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default UserOnlyRoute;
