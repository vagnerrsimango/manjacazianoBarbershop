import axios from "axios";

const api = axios.create({
  baseURL: "http://apimanjacaziano.gestao.site",
});

export default api;
