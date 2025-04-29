import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true // <- isso aqui é importante pra enviar o cookie!
})
