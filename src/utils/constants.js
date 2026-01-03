export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "https://fakestoreapi.com";

if (!import.meta.env.VITE_API_BASE_URL && !import.meta.env.VITE_API_URL) {
  console.warn(
    "Warning: VITE_API_BASE_URL is not set in .env file. Using fallback URL."
  );
}
