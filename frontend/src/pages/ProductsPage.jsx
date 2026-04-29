import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getProducts,
  createProduct,
  updateProduct,
} from "../api/products";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [originalForm, setOriginalForm] = useState(null);

  const [form, setForm] = useState({
    id: null,
    name: "",
    sku: "",
    purchasePrice: "",
    salePrice: "",
    stock: "",
  });

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* 🔴 DETECTAR CAMBIOS NO GUARDADOS */
  const hasUnsavedChanges =
    isEditing &&
    originalForm &&
    JSON.stringify(form) !== JSON.stringify(originalForm);

  /* 🔴 ALERTA AL RECARGAR / SALIR DEL NAVEGADOR */
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!hasUnsavedChanges) return;
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = async () => {
    if (hasUnsavedChanges) {
      const res = await Swal.fire({
        title: "¿Salir del modo edición?",
        text: "Se perderán los cambios no guardados",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Salir",
      });

      if (!res.isConfirmed) return;
    }

    setForm({
      id: null,
      name: "",
      sku: "",
      purchasePrice: "",
      salePrice: "",
      stock: "",
    });
    setIsEditing(false);
    setOriginalForm(null);
  };

  /* ✅ GUARDAR / ACTUALIZAR */
  const handleSubmit = async () => {
    const confirmText = form.id
      ? "¿Guardar cambios del producto?"
      : "¿Registrar nuevo producto?";

    const res = await Swal.fire({
      title: confirmText,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Guardar",
    });

    if (!res.isConfirmed) return;

    const payload = {
      name: form.name,
      sku: form.sku,
      purchasePrice: Number(form.purchasePrice),
      salePrice: Number(form.salePrice),
      stock: Number(form.stock),
    };

    if (form.id) {
      await updateProduct(form.id, payload);
      Swal.fire("Actualizado ✅", "Producto actualizado", "success");
    } else {
      await createProduct(payload);
      Swal.fire("Creado ✅", "Producto registrado", "success");
    }

    resetForm();
    loadProducts();
  };

  /* ✏️ EDITAR */
  const handleEdit = async (product) => {
    const res = await Swal.fire({
      title: "¿Editar producto?",
      text: `Vas a editar "${product.name}"`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, editar",
    });

    if (!res.isConfirmed) return;

    const snapshot = {
      id: product.id,
      name: product.name,
      sku: product.sku,
      purchasePrice: product.purchasePrice,
      salePrice: product.salePrice,
      stock: product.stock,
    };

    setForm(snapshot);
    setOriginalForm(snapshot);
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORM */}
        <div
          className={`rounded-2xl shadow p-6 transition-all
            ${
              isEditing
                ? "bg-blue-50 border-2 border-blue-500"
                : "bg-white"
            }
          `}
        >
          <h2 className="text-2xl font-bold mb-2">
            {isEditing ? "✏️ Modo edición" : "➕ Alta de producto"}
          </h2>

          {isEditing && (
            <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-lg text-sm font-semibold">
              ⚠️ Estás editando un producto. Los cambios no se guardan
              automáticamente.
            </div>
          )}

          {hasUnsavedChanges && (
            <div className="mb-2 text-sm text-red-600 font-semibold">
              ● Cambios pendientes de guardar
            </div>
          )}

          <div className="space-y-4">
            {["name", "sku", "purchasePrice", "salePrice", "stock"].map(
              (field) => (
                <input
                  key={field}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  type={field.includes("Price") || field === "stock" ? "number" : "text"}
                  placeholder={field}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              )
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              {isEditing ? "Guardar cambios" : "Guardar producto"}
            </button>

            {isEditing && (
              <button
                onClick={resetForm}
                className="w-full bg-gray-300 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancelar edición
              </button>
            )}
          </div>
        </div>

        {/* LIST */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6">
            Listado de productos 📋
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Nombre</th>
                <th className="p-3">SKU</th>
                <th className="p-3 text-right">Venta</th>
                <th className="p-3 text-right">Stock</th>
                <th className="p-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.sku}</td>
                  <td className="p-3 text-right">${p.salePrice}</td>
                  <td className="p-3 text-right">{p.stock}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-indigo-600 font-semibold hover:underline"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
