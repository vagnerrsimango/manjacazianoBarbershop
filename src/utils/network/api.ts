import axios from "axios";

const api = axios.create({
  // baseURL: "http://192.168.18.2:7777",
  baseURL: "http://apimanjacaziano.gestaosistema.com",
});

// TODO: Order sales by date, filter by dare

export default api;
