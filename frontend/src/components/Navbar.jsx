import { Link, useNavigate , useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;
const location = useLocation();

if (["/login", "/403", "/pos"].includes(location.pathname)) {
  return null;
}


  return (
    <nav className="bg-indigo-700 text-white px-6 py-3 flex justify-between items-center">
      <div className="flex gap-4 font-semibold">
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/pos" className="hover:underline">POS</Link>
        <Link to="/products" className="hover:underline">Productos</Link>

        {/* ✅ SOLO ADMIN VE ESTO */}
        {user.rol === "admin" && (
          <Link to="/admin" className="hover:underline">
            Admin 👑
          </Link>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
      >
        Cerrar sesión
      </button>
    </nav>
  );
}