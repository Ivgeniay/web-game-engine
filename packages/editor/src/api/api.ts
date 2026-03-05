import { useUserStore } from "../store/user_store";

const API_URL = import.meta.env.VITE_API_URL as string;

function getHeaders(): HeadersInit {
  const token = useUserStore.getState().token;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  get: (path: string) =>
    fetch(`${API_URL}${path}`, {
      method: "GET",
      headers: getHeaders(),
    }),

  post: (path: string, body: unknown) =>
    fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    }),

  delete: (path: string) =>
    fetch(`${API_URL}${path}`, {
      method: "DELETE",
      headers: getHeaders(),
    }),

  put: (path: string, body: unknown) =>
    fetch(`${API_URL}${path}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(body),
    }),
};
