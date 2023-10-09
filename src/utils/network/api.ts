import axios from "axios";

const api = axios.create({
  baseURL: "http://apimanjacaziano.gestaosistema.com",
});

// TODO: Order sales by date, filter by dare

export default api;
