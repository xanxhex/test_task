import { api } from "./client";

export async function getPositions() {
  const { data } = await api.get("/positions");
  return data; }