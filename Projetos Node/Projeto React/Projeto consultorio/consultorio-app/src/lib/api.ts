import axios from "axios";

const api = axios.create({
  baseURL: 'http://192.168.95.127:3000',
  withCredentials: true
})

export default api

