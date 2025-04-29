import React, { useState, createContext, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from "../services/api";

type AuthContextData = {
    user: UserProps,
    isAuthenticated: boolean,
    signIn: (credentials: SignInProps) => Promise<void>, 
    loadingAuth: boolean,
    loading: boolean,
    signOut: () => Promise<void>
}

type UserProps = {
    id: string,
    name: string,
    email: string,
    token: string
}

type AuthProviderProps = {
    children: ReactNode
}

type SignInProps = {
    email: string,
    password: string
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({children}: AuthProviderProps){
    const [user, setUser] = useState<UserProps>({
        id: "",
        name: "",
        email: "",
        token: ""
    })

    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading, setLoading] = useState(true)

    const isAuthenticated = !!user.name

    useEffect(() => {
        async function getUser() {
          const userInfo = await AsyncStorage.getItem('@sujeitoPizzaria')
          let hasUser: UserProps = JSON.parse(userInfo || "{}")
      
          if (Object.keys(hasUser).length > 0) {
            // Configura o token no cabeçalho
            api.defaults.headers.common["Authorization"] = `Bearer ${hasUser.token}`
      
            try {
              // Tenta validar o token com uma requisição segura
              await api.get('/userinfo') // Rota protegida que exige token válido
      
              setUser({
                id: hasUser.id,
                name: hasUser.name,
                email: hasUser.email,
                token: hasUser.token
              })
      
            } catch (err) {
              console.log("Token inválido ou expirado. Fazendo logout automático.")
              await signOut()
            }
          }
      
          setLoading(false)
        }
      
        getUser();
      }, [])
    
    async function signIn({ email, password}: SignInProps) {
        setLoadingAuth(true)

        try {
            
            const response = await api.post('/login', {
                email,
                password
            });
            //console.log(response.data)
            const { id, name, token } = response.data;

            const data = {
                ...response.data
            }

            await AsyncStorage.setItem('@sujeitoPizzaria', JSON.stringify(data))

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            setUser({
                id,
                name,
                email,
                token
            })

            setLoadingAuth(false)

        } catch (error) {
            console.log("Erro ao acessar", error)
            setLoadingAuth(false)
        }
    }

    async function signOut() {
        await AsyncStorage.clear().then(() => {
            setUser({
                id: "",
                name: "",
                email: "",
                token: ""
            })
        } )
    }

    return(
        <AuthContext.Provider value={{ user, isAuthenticated, loading, loadingAuth, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}