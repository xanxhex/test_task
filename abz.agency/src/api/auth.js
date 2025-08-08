import { api } from "./client";

export async function getToken() {
  const { data } = await api.get("/token");
  return data.token;
}