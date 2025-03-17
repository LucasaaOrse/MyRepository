import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Filmes from "./pages/Filmes"

import Header from "./components/header/Header"

function RouterApp() {
    
    return(
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/filme/:id" element={<Filmes/>}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default RouterApp;