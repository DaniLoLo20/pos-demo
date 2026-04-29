import { getToken } from "./auth";

const API_URL = "http://localhost:3000";

export const getSalesReport = async () => {
  const res = await fetch(`${API_URL}/sales/reports`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Error al obtener reportes");
  return res.json();
};
