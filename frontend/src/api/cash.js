import { getToken } from "./auth";

const API_URL = "http://localhost:3000";

export const openCash = async (openingAmount) => {
  const res = await fetch(`${API_URL}/cash/open`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ openingAmount }),
  });
  return res.json();
};

export const closeCash = async (closingAmount) => {
  const res = await fetch(`${API_URL}/cash/close`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ closingAmount }),
  });
  return res.json();
};

export const getCashHistory = async () => {
  const res = await fetch(`${API_URL}/cash`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};