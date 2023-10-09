import axios from "axios";
// baseURL:'http://apimanjacaziano.vaeio.co'
const api = axios.create({
  baseURL: "http://apimanjacaziano.gestaosistema.com",
});

export default api;
