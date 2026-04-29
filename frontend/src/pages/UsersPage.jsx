import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/users";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
    rol: "user",
  });

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setForm({ email: "", password: "", rol: "user" });
    setEditingUser(null);
  };

  const handleSubmit = async () => {
    if (!form.email) {
      Swal.fire("Error", "El email es obligatorio", "error");
      return;
    }

    const confirm = await Swal.fire({
      title: editingUser ? "Actualizar usuario" : "Crear usuario",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Guardar",
    });

    if (!confirm.isConfirmed) return;

    if (editingUser) {
      await updateUser(editingUser.id, form);
      Swal.fire("Actualizado ✅", "", "success");
    } else {
      if (!form.password) {
        Swal.fire("Error", "La contraseña es obligatoria", "error");
        return;
      }
      await createUser(form);
      Swal.fire("Creado ✅", "", "success");
    }

    resetForm();
    loadUsers();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      email: user.email,
      password: "",
      rol: user.rol,
    });
  };

  const handleDelete = async (user) => {
    const confirm = await Swal.fire({
      title: "Eliminar usuario",
      text: `¿Estás seguro de eliminar a ${user.email}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
    });

    if (!confirm.isConfirmed) return;

    await deleteUser(user.id);
    Swal.fire("Eliminado ✅", "", "success");
    loadUsers();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* FORMULARIO */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            {editingUser ? "✏️ Editar usuario" : "➕ Crear usuario"}
          </h2>

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full mb-3 p-2 border rounded"
          />

          <input
            type="password"
            placeholder={
              editingUser
                ? "Nueva contraseña (opcional)"
                : "Contraseña"
            }
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full mb-3 p-2 border rounded"
          />

          <select
            value={form.rol}
            onChange={(e) =>
              setForm({ ...form, rol: e.target.value })
            }
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="user">cliente</option>
          </select>

          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-2 rounded font-semibold"
          >
            Guardar
          </button>

          {editingUser && (
            <button
              onClick={resetForm}
              className="w-full bg-gray-300 mt-2 py-2 rounded"
            >
              Cancelar edición
            </button>
          )}
        </div>

        {/* LISTADO */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Usuarios</h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Email</th>
                <th className="p-2">Rol</th>
                <th className="p-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="p-2">{u.email}</td>
                  <td className="p-2 text-center">{u.rol}</td>
                  <td className="p-2 text-right">
                    <button
                      onClick={() => handleEdit(u)}
                      className="text-indigo-600 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
                      className="text-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="p-4 text-center text-gray-500"
                  >
                    No hay usuarios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}