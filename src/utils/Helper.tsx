import api from "./network/api";

export async function getUserByToken(token: string | object) {
  const response = await api.get("/me", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  return response.data.user;
}
