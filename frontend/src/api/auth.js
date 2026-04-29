const API_URL = "http://localhost:3000";

const parseJwt = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
};

export const loginRequest = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Credenciales incorrectas");
  }

  const data = await res.json();
  localStorage.setItem("token", data.token);
  return parseJwt(data.token);
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getSession = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return parseJwt(token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};
