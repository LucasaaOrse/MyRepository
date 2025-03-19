// url https://api.themoviedb.org/3
// api 0cd75a062e902fdb91f61c9f1e49cb2d

import axios from "axios"

const api = axios.create({
    baseURL: "https://api.themoviedb.org/3"
})

export default api;