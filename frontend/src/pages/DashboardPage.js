import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div
        className={`max-w-7xl mx-auto transition-all duration-700 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Bienvenido, {user.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Cerrar sesión
          </button>
        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl p-5 shadow">
            <p className="text-xs text-gray-500 mb-1">Usuario</p>
            <p className="font-semibold text-gray-800 break-all">
              {user.email}
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow">
            <p className="text-xs text-gray-500 mb-1">Rol</p>
            <p
              className={`font-semibold ${
                user.rol === "admin"
                  ? "text-indigo-600"
                  : "text-gray-800"
              }`}
            >
              {user.rol}
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow">
            <p className="text-xs text-gray-500 mb-1">Estado</p>
            <p className="font-semibold text-green-600">
              Activo ✅
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow">
            <p className="text-xs text-gray-500 mb-1">
              Módulos disponibles
            </p>
            <p className="font-semibold text-gray-800">
              POS, Productos
            </p>
          </div>
        </div>

        {/* ACTION CARDS */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Accesos rápidos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* POS */}
          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-bold mb-2">🧾 POS</h3>
            <p className="text-sm text-gray-500 mb-4">
              Realizar ventas y cobrar clientes
            </p>
            <button
              onClick={() => navigate("/pos")}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Ir al POS
            </button>
          </div>

          {/* Productos */}
          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-bold mb-2">
              📦 Productos
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Alta y gestión de productos
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Ver productos
            </button>
          </div>

          {/* Reportes */}
          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-bold mb-2">
              📊 Reportes de ventas
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Consulta ventas, totales y estadísticas
            </p>
            <button
              onClick={() => navigate("/reports")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Ver reportes
            </button>
          </div>

          {/* ADMIN */}
          {user.rol === "admin" && (
            <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition border border-indigo-200">
              <h3 className="text-lg font-bold mb-2">
                👑 Administración
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Configuración y control del sistema
              </p>
              <button
                onClick={() => navigate("/admin")}
                className="bg-indigo-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-900 transition"
              >
                Panel admin
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}