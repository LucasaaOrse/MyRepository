import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";

const api = axios.create({
    baseURL: "https://pizzaria-backend-production-bccd.up.railway.app"
})

api.interceptors.response.use(
    response => response,
    async error => {
        if(error.response && error.response.status === 401) {
            await AsyncStorage.clear();

            Alert.alert("Sessão expirada", "Faça Login novamente")
        }
        return Promise.reject(error)
    }
    
)

export { api }