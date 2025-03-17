import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/home"
import Sobre from "./pages/Sobre";

function RouterApp(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/sobre" element={ <Sobre/>}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default RouterApp;