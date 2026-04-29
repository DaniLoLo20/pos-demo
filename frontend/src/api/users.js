import { getToken } from "./auth";

const API_URL = "http://localhost:3000";

export const getUsers = async () => {
  const res = await fetch(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const createUser = async (user) => {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(user),
  });
  return res.json();
};

export const updateUser = async (id, user) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(user),
  });
  return res.json();
};

export const deleteUser = async (id) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};