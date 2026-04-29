import { getToken } from "./auth";

const API_URL = "http://localhost:3000";

export const createSale = async (sale) => {
  const res = await fetch(`${API_URL}/sales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(sale),
  });

  if (!res.ok) throw new Error("Error en la venta");
  return res.json();
};
