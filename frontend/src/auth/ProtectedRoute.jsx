import { Navigate } from "react-router-dom";
import { useAuth } from "./authStore";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  // 🔥 WAIT until auth is restored
  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
