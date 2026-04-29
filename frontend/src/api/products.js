import { getToken } from "./auth";

const API_URL = "http://localhost:3000";

export const getProducts = async (search = "") => {
  const res = await fetch(
    `${API_URL}/products?search=${search}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  if (!res.ok) throw new Error("Error cargando productos");
  return res.json();
};

export const updateProduct = async (id, product) => {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Error al actualizar producto");
  return res.json();
};


export const createProduct = async (product) => {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(product),
  });

  if (!res.ok) throw new Error("Error creando producto");
  return res.json();
  
};