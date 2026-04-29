import { getToken } from "./auth";

const API_URL = "http://localhost:3000";

export const getProfile = async () => {
  const token = getToken();

  const res = await fetch(`${API_URL}/auth/perfil`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("No autorizado");

  return res.json();
};
