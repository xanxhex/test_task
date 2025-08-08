import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://frontend-test-assignment-api.abz.agency/api/v1",
  timeout: 10000,
});