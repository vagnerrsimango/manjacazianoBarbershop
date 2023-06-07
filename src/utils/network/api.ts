import axios from "axios";

const api = axios.create({
    baseURL:'http://apimanjacaziano.vaeio.co'
})

export default api;