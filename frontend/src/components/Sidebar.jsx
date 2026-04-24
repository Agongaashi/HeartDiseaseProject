import { Link } from "react-router-dom";
import { useAuth } from "../auth/authStore";

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>Heart Care</h2>
        <p>Clinical prediction panel</p>
      </div>

      <p className="sidebar-user">{user?.email}</p>

      <nav className="sidebar-nav">
        {user?.role === "doctor" && (
          <>
            <Link to="/doctor" className="sidebar-link">
              Dashboard
            </Link>

            <Link to="/history" className="sidebar-link">
              History
            </Link>
          </>
        )}

        {user?.role === "patient" && (
          <>
            <Link to="/patient" className="sidebar-link">
              My Panel
            </Link>

            <Link to="/history" className="sidebar-link">
              History
            </Link>
          </>
        )}
      </nav>

      <button onClick={logout} className="logout-button">
        Logout
      </button>
    </aside>
  );
}
