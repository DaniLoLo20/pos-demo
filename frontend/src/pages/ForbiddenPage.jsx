import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ForbiddenPage() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 to-indigo-900">
      <div
        className={`
          w-full max-w-md
          bg-white/90 backdrop-blur
          rounded-2xl shadow-2xl
          p-8 text-center
          transition-all duration-700
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
        `}
      >
        {/* Icon */}
        <div className="text-6xl mb-4">🚫</div>

        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          403
        </h1>

        <p className="text-lg font-semibold text-gray-700 mb-2">
          Acceso denegado
        </p>

        <p className="text-sm text-gray-500 mb-6">
          No tienes permisos para ver esta página.  
          Si crees que es un error, contacta al administrador.
        </p>

        <Link
          to="/"
          className="
            inline-block
            bg-indigo-600 text-white
            px-6 py-2.5
            rounded-lg font-semibold
            hover:bg-indigo-700
            transition
            active:scale-95
          "
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
