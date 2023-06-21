import axios from "axios";
// baseURL:'http://apimanjacaziano.vaeio.co'
const api = axios.create({
  baseURL: "http://192.168.43.55:7777",
});

export default api;
