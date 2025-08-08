import { api } from "./client";

export async function getUsers(page = 1, count = 6) {
  const { data } = await api.get("/users", { params: { page, count } });
 
  data.users.sort((a, b) => b.registration_timestamp - a.registration_timestamp);
  return data;}

  export async function createUser(formData, token) {
  const { data } = await api.post("/users", formData, {
    headers: { Token: token, "Content-Type": "multipart/form-data" },
  });
  return data; // { success: true, user_id: ... }
}