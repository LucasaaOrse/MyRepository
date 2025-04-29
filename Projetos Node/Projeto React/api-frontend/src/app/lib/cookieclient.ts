import { getCookie } from "cookies-next"

export function getCookieClient(){
    const token = getCookie("session")
    console.log('Token no client-side:', token)
    return token
}