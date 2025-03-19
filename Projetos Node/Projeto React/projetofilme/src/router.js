import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Filmes from "./pages/Filmes"
import Favoritos from "./pages/Favoritos"

import Erro from "./pages/Erro/Erro"

import Header from "./components/header/Header"

function RouterApp() {
    
    return(
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/filmes/:id" element={<Filmes/>}></Route>
                <Route path="/favoritos" element={ <Favoritos/>}/>
                <Route path="*" element={ <Erro/> }/>
            </Routes>
        </BrowserRouter>
    )
}

export default RouterApp;