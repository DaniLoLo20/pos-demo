import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [dark, setDark] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  useEffect(() => {
    setShow(true);
  }, []);

  const emailError =
    touched.email && !email.includes("@") ? "Email inválido" : "";
  const passwordError =
    touched.password && password.length < 6
      ? "Mínimo 6 caracteres"
      : "";

  const hasErrors = emailError || passwordError;

  const handleLogin = async () => {
    setTouched({ email: true, password: true });
    if (hasErrors) return;

    try {
      setLoading(true);
      setError("");
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setError("Credenciales incorrectas ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-500 ${
        dark
          ? "bg-gray-900"
          : "bg-gradient-to-br from-indigo-600 to-blue-500"
      }`}
    >
      <div
        onKeyDown={handleKeyDown}
        className={`
          w-full max-w-sm sm:max-w-md
          rounded-2xl shadow-xl
          p-6 sm:p-8
          transition-all duration-700
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
          ${dark ? "bg-gray-800 text-white" : "bg-white text-gray-800"}
        `}
      >
        {/* Toggle dark mode */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setDark(!dark)}
            className="text-sm underline opacity-80 hover:opacity-100"
          >
            {dark ? "☀️ Modo día" : "🌙 Modo oscuro"}
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Iniciar sesión
        </h1>

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() =>
                setTouched((t) => ({ ...t, email: true }))
              }
              placeholder="correo@ejemplo.com"
              className={`
                w-full px-4 py-2 rounded-lg border
                focus:outline-none focus:ring-2
                ${emailError
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-indigo-500"}
                ${dark
                  ? "bg-gray-700 text-white border-gray-600"
                  : ""}
              `}
            />
            {emailError && (
              <p className="text-xs text-red-500 mt-1">{emailError}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() =>
                setTouched((t) => ({ ...t, password: true }))
              }
              placeholder="********"
              className={`
                w-full px-4 py-2 rounded-lg border
                focus:outline-none focus:ring-2
                ${passwordError
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-indigo-500"}
                ${dark
                  ? "bg-gray-700 text-white border-gray-600"
                  : ""}
              `}
            />
            {passwordError && (
              <p className="text-xs text-red-500 mt-1">{passwordError}</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="
              w-full py-2.5 rounded-lg font-semibold
              bg-indigo-600 text-white
              hover:bg-indigo-700
              active:scale-95
              transition
              disabled:opacity-50
            "
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-xs opacity-70 text-center">
            Presiona <strong>Enter</strong> para continuar
          </p>
        </div>
      </div>
    </div>
  );
}