const API_BASE = import.meta.env.VITE_API_URL;

export const api = (url, options = {}) => {
  return fetch(`${API_BASE}${url}`, {
    credentials: "include",
    ...options,
  });
};
