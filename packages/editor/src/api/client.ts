import { useUserStore } from "../store/user_store";

const API_URL = import.meta.env["VITE_API_URL"] as string;

function getHeaders(): Record<string, string> {
  const token = useUserStore.getState().token;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getAuthHeader(): Record<string, string> {
  const token = useUserStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const client = {
  get: (path: string) => fetch(`${API_URL}${path}`, { headers: getHeaders() }),

  post: (path: string, body: unknown) =>
    fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    }),

  put: (path: string, body: unknown) =>
    fetch(`${API_URL}${path}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(body),
    }),

  patch: (path: string, body: unknown) =>
    fetch(`${API_URL}${path}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(body),
    }),

  delete: (path: string) =>
    fetch(`${API_URL}${path}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    }),

  upload: (path: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: getAuthHeader(),
      body: form,
    });
  },

  overwrite: (path: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return fetch(`${API_URL}${path}`, {
      method: "PUT",
      headers: getAuthHeader(),
      body: form,
    });
  },
};
