import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-700 text-white flex flex-col">
        <div className="p-6 text-2xl font-extrabold border-b border-indigo-600">
          👑 Admin Panel
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            📊 Dashboard
          </button>

          <button
           onClick={() => navigate("/users")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            👥 Usuarios
          </button>

          <button
           onClick={() => navigate("/products")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            ⚙️ Productos
          </button>
        </nav>

        <div className="p-4 border-t border-indigo-600">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 sm:p-10">
        {/* Topbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Panel de Admin 👑
            </h1>
            <p className="text-sm text-gray-500">
              Acceso exclusivo para administradores
            </p>
          </div>

          <div className="text-sm text-gray-600">
            Sesión iniciada como:{" "}
            <span className="font-semibold text-gray-800">
              {user.email}
            </span>
          </div>
        </div>

        {/* Content cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Usuarios</p>
            <p className="text-2xl font-bold text-gray-800">128</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Admins</p>
            <p className="text-2xl font-bold text-gray-800">3</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Estado</p>
            <p className="text-2xl font-bold text-green-600">
              OK ✅
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-10 bg-white rounded-xl shadow p-6">
          <p className="text-gray-700">
            🔒 Solo los usuarios con rol <strong>admin</strong> pueden ver
            esta sección.
          </p>
        </div>
      </main>
    </div>
  );
}